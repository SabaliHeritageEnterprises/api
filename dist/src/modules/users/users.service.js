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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const PUBLIC_USER_SELECT = {
    id: true,
    email: true,
    displayName: true,
    role: true,
    status: true,
    emailVerified: true,
    twoFactorEnabled: true,
    paperBalance: true,
    lastLoginAt: true,
    createdAt: true,
};
let UsersService = class UsersService {
    constructor(prisma, activity) {
        this.prisma = prisma;
        this.activity = activity;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { ...PUBLIC_USER_SELECT, settings: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { displayName: dto.displayName },
            select: PUBLIC_USER_SELECT,
        });
    }
    async updateSettings(userId, dto) {
        return this.prisma.userSettings.upsert({
            where: { userId },
            update: dto,
            create: { userId, ...dto },
        });
    }
    async changePassword(userId, dto, ctx) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const ok = await argon2.verify(user.passwordHash, dto.currentPassword).catch(() => false);
        if (!ok)
            throw new common_1.BadRequestException('Current password is incorrect');
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: await argon2.hash(dto.newPassword) },
        });
        await this.prisma.session.updateMany({ where: { userId }, data: { isRevoked: true } });
        await this.activity.record(userId, 'PASSWORD_CHANGE', ctx);
        return { message: 'Password changed. Please log in again on other devices.' };
    }
    async getPortfolio(userId) {
        const [user, positions, openOrders] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId }, select: { paperBalance: true } }),
            this.prisma.position.findMany({
                where: { userId, status: 'OPEN' },
                include: { pair: { select: { symbol: true, displayName: true, lastPrice: true } } },
            }),
            this.prisma.trade.count({ where: { userId, status: 'OPEN' } }),
        ]);
        let unrealizedPnl = 0;
        let holdingsValue = 0;
        const enriched = positions.map((p) => {
            const last = Number(p.pair.lastPrice);
            const entry = Number(p.entryPrice);
            const qty = Number(p.quantity);
            const dir = p.side === 'BUY' ? 1 : -1;
            const pnl = (last - entry) * qty * dir;
            unrealizedPnl += pnl;
            holdingsValue += last * qty;
            return { ...p, markPrice: last, unrealizedPnl: pnl };
        });
        const cash = Number(user?.paperBalance ?? 0);
        return {
            cashBalance: cash,
            holdingsValue,
            equity: cash + holdingsValue,
            unrealizedPnl,
            openOrders,
            positions: enriched,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], UsersService);
//# sourceMappingURL=users.service.js.map