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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const user_gateway_1 = require("../../realtime/user.gateway");
const SAFE_USER_SELECT = {
    id: true, email: true, displayName: true, role: true, status: true,
    emailVerified: true, twoFactorEnabled: true, paperBalance: true,
    lastLoginAt: true, createdAt: true,
};
let AdminService = class AdminService {
    constructor(prisma, notifications, gateway) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.gateway = gateway;
    }
    audit(actorId, action, targetType, targetId, metadata) {
        return this.prisma.adminLog.create({ data: { actorId, action, targetType, targetId, metadata } });
    }
    assertCanManage(_actor, _targetRole, _grantingRole) {
    }
    pushUpdate(userId, reason) {
        this.gateway.emitToUser(userId, 'account:update', { reason, at: new Date().toISOString() });
    }
    async analytics() {
        const since24h = new Date(Date.now() - 24 * 3600 * 1000);
        const [totalUsers, activeUsers, suspended, newUsers24h, totalTrades, trades24h, openOrders, pairs] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: 'ACTIVE' } }),
            this.prisma.user.count({ where: { status: 'SUSPENDED' } }),
            this.prisma.user.count({ where: { createdAt: { gte: since24h } } }),
            this.prisma.trade.count(),
            this.prisma.trade.count({ where: { createdAt: { gte: since24h } } }),
            this.prisma.trade.count({ where: { status: 'OPEN' } }),
            this.prisma.marketPair.count({ where: { status: 'ACTIVE' } }),
        ]);
        return {
            users: { total: totalUsers, active: activeUsers, suspended, new24h: newUsers24h },
            trades: { total: totalTrades, last24h: trades24h, openOrders },
            markets: { activePairs: pairs },
        };
    }
    listUsers(search, take = 50, skip = 0) {
        return this.prisma.user.findMany({
            where: search
                ? { OR: [{ email: { contains: search, mode: 'insensitive' } }, { displayName: { contains: search, mode: 'insensitive' } }] }
                : {},
            select: { ...SAFE_USER_SELECT },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        });
    }
    async getUserDashboard(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { ...SAFE_USER_SELECT, settings: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const [positions, recentTrades, activity, deviceCount] = await Promise.all([
            this.prisma.position.findMany({
                where: { userId, status: 'OPEN' },
                include: { pair: { select: { symbol: true, displayName: true, lastPrice: true } } },
            }),
            this.prisma.trade.findMany({
                where: { userId },
                include: { pair: { select: { symbol: true, displayName: true } } },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
            this.prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 25 }),
            this.prisma.session.count({ where: { userId, isRevoked: false, expiresAt: { gt: new Date() } } }),
        ]);
        let holdingsValue = 0;
        let unrealizedPnl = 0;
        const enrichedPositions = positions.map((p) => {
            const last = Number(p.pair.lastPrice);
            const dir = p.side === 'BUY' ? 1 : -1;
            const pnl = (last - Number(p.entryPrice)) * Number(p.quantity) * dir;
            holdingsValue += last * Number(p.quantity);
            unrealizedPnl += pnl;
            return { ...p, markPrice: last, unrealizedPnl: pnl };
        });
        const cash = Number(user.paperBalance);
        return {
            user,
            portfolio: { cashBalance: cash, holdingsValue, equity: cash + holdingsValue, unrealizedPnl },
            positions: enrichedPositions,
            recentTrades,
            activity,
            activeDevices: deviceCount,
        };
    }
    getUserActivity(userId, take = 100) {
        return this.prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take });
    }
    async createUser(actor, dto) {
        this.assertCanManage(actor, dto.role ?? client_1.Role.USER, dto.role);
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email is already registered');
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: await argon2.hash(dto.password),
                displayName: dto.displayName,
                role: dto.role ?? client_1.Role.USER,
                status: dto.status ?? client_1.UserStatus.ACTIVE,
                emailVerified: true,
                emailVerifiedAt: new Date(),
                settings: { create: {} },
            },
            select: SAFE_USER_SELECT,
        });
        await this.audit(actor.id, 'USER_CREATED', 'USER', user.id, { email: user.email, role: user.role });
        return user;
    }
    async updateUser(actor, userId, dto) {
        const target = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        this.assertCanManage(actor, target.role, dto.role);
        const data = {};
        if (dto.displayName !== undefined)
            data.displayName = dto.displayName;
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.role !== undefined)
            data.role = dto.role;
        if (dto.emailVerified !== undefined) {
            data.emailVerified = dto.emailVerified;
            data.emailVerifiedAt = dto.emailVerified ? new Date() : null;
        }
        if (dto.paperBalance !== undefined)
            data.paperBalance = new client_1.Prisma.Decimal(dto.paperBalance);
        const updated = await this.prisma.user.update({ where: { id: userId }, data, select: SAFE_USER_SELECT });
        if (dto.status === 'SUSPENDED' || dto.status === 'BANNED') {
            await this.prisma.session.updateMany({ where: { userId }, data: { isRevoked: true } });
        }
        await this.audit(actor.id, 'USER_UPDATED', 'USER', userId, dto);
        this.pushUpdate(userId, 'profile');
        return updated;
    }
    async updateUserSettings(actor, userId, dto) {
        const target = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        this.assertCanManage(actor, target.role);
        const settings = await this.prisma.userSettings.upsert({
            where: { userId },
            update: dto,
            create: { userId, ...dto },
        });
        await this.audit(actor.id, 'USER_SETTINGS_UPDATED', 'USER', userId, dto);
        this.pushUpdate(userId, 'settings');
        return settings;
    }
    async resetUserPassword(actor, userId, dto) {
        const target = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        this.assertCanManage(actor, target.role);
        await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await argon2.hash(dto.newPassword) } }),
            this.prisma.session.updateMany({ where: { userId }, data: { isRevoked: true } }),
        ]);
        await this.audit(actor.id, 'USER_PASSWORD_RESET', 'USER', userId);
        if (dto.notifyUser) {
            await this.notifications.create(userId, client_1.NotificationType.SECURITY, 'Your password was reset', 'An administrator reset your password. You have been signed out of all devices. Please log in with your new password.');
        }
        this.gateway.emitToUser(userId, 'account:update', { reason: 'password', at: new Date().toISOString() });
        return { message: 'Password reset. User has been signed out of all devices.' };
    }
    async deleteUser(actor, userId) {
        if (userId === actor.id)
            throw new common_1.BadRequestException('You cannot delete your own account');
        const target = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        this.assertCanManage(actor, target.role);
        await this.prisma.user.delete({ where: { id: userId } });
        await this.audit(actor.id, 'USER_DELETED', 'USER', userId, { email: target.email });
        this.gateway.emitToUser(userId, 'account:deleted', { at: new Date().toISOString() });
        return { message: 'User account deleted' };
    }
    async notifyUser(actor, userId, dto) {
        const target = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        await this.notifications.create(userId, dto.type ?? client_1.NotificationType.ADMIN, dto.title, dto.body);
        await this.audit(actor.id, 'NOTIFICATION_SENT', 'USER', userId, { title: dto.title });
        return { sent: 1 };
    }
    async broadcast(actor, dto) {
        const users = await this.prisma.user.findMany({ where: { status: 'ACTIVE' }, select: { id: true } });
        await Promise.all(users.map((u) => this.notifications.create(u.id, client_1.NotificationType.ADMIN, dto.title, dto.body)));
        await this.audit(actor.id, 'NOTIFICATION_BROADCAST', undefined, undefined, { recipients: users.length });
        return { sent: users.length };
    }
    async createPair(actorId, dto) {
        const pair = await this.prisma.marketPair.create({
            data: {
                symbol: dto.symbol.toUpperCase(),
                base: dto.base.toUpperCase(),
                quote: dto.quote.toUpperCase(),
                displayName: dto.displayName,
                type: dto.type,
                lastPrice: new client_1.Prisma.Decimal(dto.lastPrice ?? 0),
                pricePrecision: dto.pricePrecision ?? 2,
                qtyPrecision: dto.qtyPrecision ?? 6,
            },
        });
        await this.audit(actorId, 'PAIR_CREATED', 'MARKET_PAIR', pair.id, { symbol: pair.symbol });
        return pair;
    }
    async updatePair(actorId, id, dto) {
        const pair = await this.prisma.marketPair.update({ where: { id }, data: dto });
        await this.audit(actorId, 'PAIR_UPDATED', 'MARKET_PAIR', id, dto);
        return pair;
    }
    adminLogs(take = 150) {
        return this.prisma.adminLog.findMany({
            include: { actor: { select: { email: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            take,
        });
    }
    activityLogs(take = 150) {
        return this.prisma.activityLog.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' },
            take,
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        user_gateway_1.UserGateway])
], AdminService);
//# sourceMappingURL=admin.service.js.map