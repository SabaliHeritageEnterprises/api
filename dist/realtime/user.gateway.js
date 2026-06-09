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
var UserGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let UserGateway = UserGateway_1 = class UserGateway {
    constructor(jwt, config) {
        this.jwt = jwt;
        this.config = config;
        this.logger = new common_1.Logger(UserGateway_1.name);
        this.online = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token)
                throw new Error('missing token');
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.config.get('jwt.accessSecret'),
            });
            client.data.userId = payload.sub;
            client.data.role = payload.role;
            client.join(`user:${payload.sub}`);
            client.join(`role:${payload.role}`);
            const next = (this.online.get(payload.sub) ?? 0) + 1;
            this.online.set(payload.sub, next);
            if (next === 1)
                this.broadcastPresence(payload.sub, true);
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const userId = client.data?.userId;
        if (!userId)
            return;
        const next = (this.online.get(userId) ?? 1) - 1;
        if (next <= 0) {
            this.online.delete(userId);
            this.broadcastPresence(userId, false);
        }
        else {
            this.online.set(userId, next);
        }
    }
    broadcastPresence(userId, isOnline) {
        this.emitToAdmins('admin:presence', { userId, online: isOnline, at: new Date().toISOString() });
    }
    getOnlineUserIds() {
        return [...this.online.keys()];
    }
    isOnline(userId) {
        return this.online.has(userId);
    }
    emitToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
    emitToAdmins(event, payload) {
        this.server.to('role:ADMIN').to('role:SUPER_ADMIN').emit(event, payload);
    }
    emitToAll(event, payload) {
        this.server.emit(event, payload);
    }
};
exports.UserGateway = UserGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], UserGateway.prototype, "server", void 0);
exports.UserGateway = UserGateway = UserGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true, credentials: true }, namespace: '/user' }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], UserGateway);
//# sourceMappingURL=user.gateway.js.map