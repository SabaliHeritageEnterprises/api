"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../../mail/mail.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const login_event_service_1 = require("../activity-log/login-event.service");
const tokens_service_1 = require("./tokens.service");
const two_factor_service_1 = require("./two-factor.service");
const TOKEN_EMAIL_VERIFY = 'EMAIL_VERIFY';
const TOKEN_PASSWORD_RESET = 'PASSWORD_RESET';
let AuthService = class AuthService {
    constructor(prisma, mail, tokens, twoFactor, activity, loginEvents) {
        this.prisma = prisma;
        this.mail = mail;
        this.tokens = tokens;
        this.twoFactor = twoFactor;
        this.activity = activity;
        this.loginEvents = loginEvents;
    }
    async register(dto, ctx) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email is already registered');
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                displayName: dto.displayName,
                settings: { create: {} },
            },
        });
        await this.issueEmailVerification(user.id, user.email);
        await this.activity.record(user.id, 'REGISTER', ctx);
        await this.loginEvents.record({
            status: client_1.LoginStatus.REGISTER,
            email: user.email,
            username: user.displayName,
            userId: user.id,
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
        });
        return { id: user.id, email: user.email, message: 'Account created. Check your email to verify.' };
    }
    async issueEmailVerification(userId, email) {
        const raw = this.tokens.generateOpaqueToken();
        await this.prisma.token.create({
            data: {
                userId,
                type: TOKEN_EMAIL_VERIFY,
                tokenHash: this.tokens.hashOpaque(raw),
                expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
            },
        });
        await this.mail.sendVerificationEmail(email, raw);
    }
    async verifyEmail(rawToken) {
        const record = await this.prisma.token.findUnique({
            where: { tokenHash: this.tokens.hashOpaque(rawToken) },
        });
        if (!record || record.type !== TOKEN_EMAIL_VERIFY || record.usedAt || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired verification link');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: record.userId },
                data: { emailVerified: true, emailVerifiedAt: new Date(), status: 'ACTIVE' },
            }),
            this.prisma.token.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
        ]);
        return { message: 'Email verified. You can now log in.' };
    }
    async login(dto, ctx) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            await argon2.hash('decoy');
            await this.loginEvents.record({
                status: client_1.LoginStatus.FAILED, email: dto.email,
                ipAddress: ctx.ipAddress, userAgent: ctx.userAgent,
                metadata: { reason: 'unknown_email' },
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await argon2.verify(user.passwordHash, dto.password).catch(() => false);
        if (!valid) {
            await this.activity.record(user.id, 'LOGIN_FAILED', ctx);
            await this.recordLoginEvent(client_1.LoginStatus.FAILED, user, ctx, { reason: 'bad_password' });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
            await this.recordLoginEvent(client_1.LoginStatus.FAILED, user, ctx, { reason: 'suspended' });
            throw new common_1.UnauthorizedException('Account is suspended. Contact support.');
        }
        if (!user.emailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in.');
        }
        if (user.twoFactorEnabled) {
            if (!dto.totp) {
                return { accessToken: '', refreshToken: '', twoFactorRequired: true };
            }
            const ok = this.twoFactor.verify(dto.totp, user.twoFactorSecret ?? '');
            if (!ok) {
                await this.activity.record(user.id, 'LOGIN_2FA_FAILED', ctx);
                await this.recordLoginEvent(client_1.LoginStatus.TWO_FACTOR_FAIL, user, ctx);
                throw new common_1.UnauthorizedException('Invalid 2FA code');
            }
        }
        const tokens = await this.createSession(user.id, user.email, user.role, ctx);
        await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        await this.activity.record(user.id, 'LOGIN', ctx);
        await this.recordLoginEvent(client_1.LoginStatus.LOGIN, user, ctx);
        return tokens;
    }
    recordLoginEvent(status, user, ctx, metadata) {
        return this.loginEvents.record({
            status,
            email: user.email,
            username: user.displayName,
            userId: user.id,
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
            metadata,
        });
    }
    async createSession(userId, email, role, ctx) {
        const refreshToken = this.tokens.generateRefreshToken();
        const session = await this.prisma.session.create({
            data: {
                userId,
                refreshHash: await this.tokens.hashRefreshToken(refreshToken),
                userAgent: ctx.userAgent,
                ipAddress: ctx.ipAddress,
                expiresAt: this.tokens.refreshExpiry(),
            },
        });
        const accessToken = await this.tokens.signAccessToken({ sub: userId, email, role, sid: session.id });
        return { accessToken, refreshToken };
    }
    async refresh(rawRefresh, ctx) {
        if (!rawRefresh)
            throw new common_1.UnauthorizedException('Missing refresh token');
        const candidates = await this.prisma.session.findMany({
            where: { isRevoked: false, expiresAt: { gt: new Date() } },
            include: { user: { select: { email: true, role: true, status: true } } },
            orderBy: { lastSeenAt: 'desc' },
            take: 200,
        });
        let matched = null;
        for (const s of candidates) {
            if (await this.tokens.verifyRefreshToken(rawRefresh, s.refreshHash)) {
                matched = s;
                break;
            }
        }
        if (!matched)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        if (matched.user.status === 'SUSPENDED' || matched.user.status === 'BANNED') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        const newRefresh = this.tokens.generateRefreshToken();
        await this.prisma.session.update({
            where: { id: matched.id },
            data: {
                refreshHash: await this.tokens.hashRefreshToken(newRefresh),
                lastSeenAt: new Date(),
                expiresAt: this.tokens.refreshExpiry(),
                ipAddress: ctx.ipAddress ?? matched.ipAddress,
                userAgent: ctx.userAgent ?? matched.userAgent,
            },
        });
        const accessToken = await this.tokens.signAccessToken({
            sub: matched.userId,
            email: matched.user.email,
            role: matched.user.role,
            sid: matched.id,
        });
        return { accessToken, refreshToken: newRefresh };
    }
    async logout(sessionId) {
        await this.prisma.session.updateMany({
            where: { id: sessionId },
            data: { isRevoked: true },
        });
        return { message: 'Logged out' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) {
            const raw = this.tokens.generateOpaqueToken();
            await this.prisma.token.create({
                data: {
                    userId: user.id,
                    type: TOKEN_PASSWORD_RESET,
                    tokenHash: this.tokens.hashOpaque(raw),
                    expiresAt: new Date(Date.now() + 3600 * 1000),
                },
            });
            await this.mail.sendPasswordResetEmail(email, raw);
        }
        return { message: 'If that email exists, a reset link has been sent.' };
    }
    async resetPassword(dto, ctx) {
        const record = await this.prisma.token.findUnique({
            where: { tokenHash: this.tokens.hashOpaque(dto.token) },
        });
        if (!record || record.type !== TOKEN_PASSWORD_RESET || record.usedAt || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset link');
        }
        const passwordHash = await argon2.hash(dto.password);
        await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
            this.prisma.token.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
            this.prisma.session.updateMany({ where: { userId: record.userId }, data: { isRevoked: true } }),
        ]);
        await this.activity.record(record.userId, 'PASSWORD_RESET', ctx);
        return { message: 'Password updated. Please log in again.' };
    }
    async init2fa(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.twoFactorEnabled)
            throw new common_1.BadRequestException('2FA already enabled');
        const secret = this.twoFactor.generateSecret();
        await this.prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
        const { otpauthUrl, qrDataUrl } = await this.twoFactor.buildQrCode(user.email, secret);
        return { otpauthUrl, qrDataUrl };
    }
    async confirm2fa(userId, totp, ctx) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorSecret)
            throw new common_1.BadRequestException('Start 2FA setup first');
        if (!this.twoFactor.verify(totp, user.twoFactorSecret)) {
            throw new common_1.BadRequestException('Invalid code');
        }
        const { codes, hashes } = this.twoFactor.generateRecoveryCodes();
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true, twoFactorRecovery: hashes },
        });
        await this.activity.record(userId, '2FA_ENABLED', ctx);
        return { message: '2FA enabled', recoveryCodes: codes };
    }
    async disable2fa(userId, totp, ctx) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorEnabled || !user.twoFactorSecret)
            throw new common_1.BadRequestException('2FA not enabled');
        if (!this.twoFactor.verify(totp, user.twoFactorSecret))
            throw new common_1.BadRequestException('Invalid code');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorRecovery: [] },
        });
        await this.activity.record(userId, '2FA_DISABLED', ctx);
        return { message: '2FA disabled' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        tokens_service_1.TokensService,
        two_factor_service_1.TwoFactorService,
        activity_log_service_1.ActivityLogService,
        login_event_service_1.LoginEventService])
], AuthService);
//# sourceMappingURL=auth.service.js.map