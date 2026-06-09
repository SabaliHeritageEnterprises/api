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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SessionsService = class SessionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listDevices(userId, currentSessionId) {
        const sessions = await this.prisma.session.findMany({
            where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
            orderBy: { lastSeenAt: 'desc' },
            select: {
                id: true,
                userAgent: true,
                ipAddress: true,
                deviceLabel: true,
                createdAt: true,
                lastSeenAt: true,
            },
        });
        return sessions.map((s) => ({ ...s, current: s.id === currentSessionId }));
    }
    async revoke(userId, sessionId) {
        const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
        if (!session || session.userId !== userId) {
            throw new common_1.ForbiddenException('Session not found');
        }
        await this.prisma.session.update({ where: { id: sessionId }, data: { isRevoked: true } });
        return { message: 'Device signed out' };
    }
    async revokeOthers(userId, currentSessionId) {
        await this.prisma.session.updateMany({
            where: { userId, id: { not: currentSessionId }, isRevoked: false },
            data: { isRevoked: true },
        });
        return { message: 'All other devices signed out' };
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map