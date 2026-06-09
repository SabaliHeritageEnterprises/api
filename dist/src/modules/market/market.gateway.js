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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MarketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let MarketGateway = MarketGateway_1 = class MarketGateway {
    constructor() {
        this.logger = new common_1.Logger(MarketGateway_1.name);
    }
    handleConnection(client) {
        this.logger.debug(`Client connected: ${client.id}`);
    }
    onSubscribe(symbols, client) {
        (symbols ?? []).forEach((s) => client.join(`sym:${s.toUpperCase()}`));
        return { ok: true, subscribed: symbols };
    }
    onUnsubscribe(symbols, client) {
        (symbols ?? []).forEach((s) => client.leave(`sym:${s.toUpperCase()}`));
        return { ok: true };
    }
    emitTicker(ticker) {
        this.server.to(`sym:${ticker.symbol}`).emit('ticker', ticker);
    }
    emitSnapshot(tickers) {
        this.server.emit('tickers', tickers);
    }
};
exports.MarketGateway = MarketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MarketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MarketGateway.prototype, "onSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MarketGateway.prototype, "onUnsubscribe", null);
exports.MarketGateway = MarketGateway = MarketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: true, credentials: true },
        namespace: '/market',
    })
], MarketGateway);
//# sourceMappingURL=market.gateway.js.map