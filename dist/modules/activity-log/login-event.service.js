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
var LoginEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginEventService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_gateway_1 = require("../../realtime/user.gateway");
let LoginEventService = LoginEventService_1 = class LoginEventService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.logger = new common_1.Logger(LoginEventService_1.name);
    }
    async record(input) {
        try {
            const event = await this.prisma.loginEvent.create({
                data: {
                    status: input.status,
                    email: input.email,
                    username: input.username ?? null,
                    userId: input.userId ?? null,
                    ipAddress: input.ipAddress,
                    userAgent: input.userAgent,
                    metadata: input.metadata,
                },
            });
            this.gateway.emitToAdmins('admin:login-event', {
                ...event,
                online: input.userId ? this.gateway.isOnline(input.userId) : false,
            });
        }
        catch (e) {
            this.logger.warn(`Failed to record login event: ${e.message}`);
        }
    }
    list(limit = 100) {
        return this.prisma.loginEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    countSince(since) {
        return this.prisma.loginEvent.count({ where: { createdAt: { gt: since } } });
    }
};
exports.LoginEventService = LoginEventService;
exports.LoginEventService = LoginEventService = LoginEventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_gateway_1.UserGateway])
], LoginEventService);
//# sourceMappingURL=login-event.service.js.map