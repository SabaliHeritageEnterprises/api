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
exports.TradesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const price_feed_service_1 = require("../market/price-feed.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const notifications_service_1 = require("../notifications/notifications.service");
let TradesService = class TradesService {
    constructor(prisma, feed, activity, notifications) {
        this.prisma = prisma;
        this.feed = feed;
        this.activity = activity;
        this.notifications = notifications;
    }
    async placeOrder(userId, dto) {
        const pair = await this.prisma.marketPair.findUnique({ where: { symbol: dto.symbol.toUpperCase() } });
        if (!pair || pair.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Market pair unavailable');
        const lastPrice = await this.feed.getLastPrice(pair.symbol);
        if (lastPrice == null)
            throw new common_1.BadRequestException('No live price available');
        if (dto.type !== client_1.OrderType.MARKET && !dto.price) {
            throw new common_1.BadRequestException('Limit orders require a price');
        }
        const isMarket = dto.type === client_1.OrderType.MARKET;
        const fillPrice = isMarket ? lastPrice : dto.price;
        const notional = new client_1.Prisma.Decimal(fillPrice).mul(dto.quantity);
        if (dto.side === client_1.OrderSide.BUY) {
            const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { paperBalance: true } });
            if (!user || new client_1.Prisma.Decimal(user.paperBalance).lt(notional)) {
                throw new common_1.BadRequestException('Insufficient paper balance');
            }
        }
        if (isMarket) {
            return this.fillMarketOrder(userId, pair.id, pair.symbol, dto, lastPrice, notional);
        }
        const trade = await this.prisma.trade.create({
            data: {
                userId,
                pairId: pair.id,
                side: dto.side,
                type: dto.type,
                status: client_1.OrderStatus.OPEN,
                price: new client_1.Prisma.Decimal(dto.price),
                quantity: new client_1.Prisma.Decimal(dto.quantity),
                notional,
                stopPrice: dto.stopPrice ? new client_1.Prisma.Decimal(dto.stopPrice) : null,
                takeProfit: dto.takeProfit ? new client_1.Prisma.Decimal(dto.takeProfit) : null,
                stopLoss: dto.stopLoss ? new client_1.Prisma.Decimal(dto.stopLoss) : null,
            },
        });
        await this.activity.record(userId, 'ORDER_PLACED', {}, { symbol: pair.symbol, type: dto.type });
        return trade;
    }
    async fillMarketOrder(userId, pairId, symbol, dto, price, notional) {
        return this.prisma.$transaction(async (tx) => {
            const trade = await tx.trade.create({
                data: {
                    userId,
                    pairId,
                    side: dto.side,
                    type: client_1.OrderType.MARKET,
                    status: client_1.OrderStatus.FILLED,
                    price: new client_1.Prisma.Decimal(price),
                    filledPrice: new client_1.Prisma.Decimal(price),
                    quantity: new client_1.Prisma.Decimal(dto.quantity),
                    filledQty: new client_1.Prisma.Decimal(dto.quantity),
                    notional,
                    takeProfit: dto.takeProfit ? new client_1.Prisma.Decimal(dto.takeProfit) : null,
                    stopLoss: dto.stopLoss ? new client_1.Prisma.Decimal(dto.stopLoss) : null,
                    filledAt: new Date(),
                },
            });
            const delta = dto.side === client_1.OrderSide.BUY ? notional.neg() : notional;
            await tx.user.update({
                where: { id: userId },
                data: { paperBalance: { increment: delta } },
            });
            await tx.position.create({
                data: {
                    userId,
                    pairId,
                    side: dto.side,
                    status: 'OPEN',
                    entryPrice: new client_1.Prisma.Decimal(price),
                    quantity: new client_1.Prisma.Decimal(dto.quantity),
                },
            });
            return trade;
        });
    }
    async cancelOrder(userId, tradeId) {
        const trade = await this.prisma.trade.findUnique({ where: { id: tradeId } });
        if (!trade)
            throw new common_1.NotFoundException('Order not found');
        if (trade.userId !== userId)
            throw new common_1.ForbiddenException('Not your order');
        if (trade.status !== client_1.OrderStatus.OPEN)
            throw new common_1.BadRequestException('Order is not open');
        return this.prisma.trade.update({
            where: { id: tradeId },
            data: { status: client_1.OrderStatus.CANCELLED },
        });
    }
    async closePosition(userId, positionId) {
        const position = await this.prisma.position.findUnique({
            where: { id: positionId },
            include: { pair: true },
        });
        if (!position)
            throw new common_1.NotFoundException('Position not found');
        if (position.userId !== userId)
            throw new common_1.ForbiddenException('Not your position');
        if (position.status !== 'OPEN')
            throw new common_1.BadRequestException('Position already closed');
        const exit = (await this.feed.getLastPrice(position.pair.symbol)) ?? Number(position.entryPrice);
        const dir = position.side === client_1.OrderSide.BUY ? 1 : -1;
        const pnl = new client_1.Prisma.Decimal(exit)
            .minus(position.entryPrice)
            .mul(position.quantity)
            .mul(dir);
        const proceeds = new client_1.Prisma.Decimal(exit).mul(position.quantity).mul(dir === 1 ? 1 : -1);
        await this.prisma.$transaction([
            this.prisma.position.update({
                where: { id: positionId },
                data: { status: 'CLOSED', exitPrice: new client_1.Prisma.Decimal(exit), realizedPnl: pnl, closedAt: new Date() },
            }),
            this.prisma.user.update({
                where: { id: userId },
                data: { paperBalance: { increment: proceeds } },
            }),
        ]);
        return { message: 'Position closed', realizedPnl: Number(pnl), exitPrice: exit };
    }
    listOrders(userId, status) {
        return this.prisma.trade.findMany({
            where: { userId, ...(status ? { status } : {}) },
            include: { pair: { select: { symbol: true, displayName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    listPositions(userId, status = 'OPEN') {
        return this.prisma.position.findMany({
            where: { userId, status },
            include: { pair: { select: { symbol: true, displayName: true, lastPrice: true } } },
            orderBy: { openedAt: 'desc' },
            take: 100,
        });
    }
};
exports.TradesService = TradesService;
exports.TradesService = TradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        price_feed_service_1.PriceFeedService,
        activity_log_service_1.ActivityLogService,
        notifications_service_1.NotificationsService])
], TradesService);
//# sourceMappingURL=trades.service.js.map