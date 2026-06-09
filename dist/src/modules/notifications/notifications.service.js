"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_gateway_1 = require("../../realtime/user.gateway");
let NotificationsService = class NotificationsService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async create(userId, type, title, body, metadata) {
        const notification = await this.prisma.notification.create({
            data: { userId, type, title, body, metadata },
        });
        this.gateway.emitToUser(userId, 'notification', notification);
        return notification;
    }
    list(userId, unreadOnly = false) {
        return this.prisma.notification.findMany({
            where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    unreadCount(userId) {
        return this.prisma.notification.count({ where: { userId, isRead: false } });
    }
    async markRead(userId, id) {
        await this.prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
        return { ok: true };
    }
    async markAllRead(userId) {
        await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
        return { ok: true };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_gateway_1.UserGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map