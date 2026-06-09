import { Prisma, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PriceFeedService } from '../market/price-feed.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PlaceOrderDto } from './dto/trades.dto';
export declare class TradesService {
    private readonly prisma;
    private readonly feed;
    private readonly activity;
    private readonly notifications;
    constructor(prisma: PrismaService, feed: PriceFeedService, activity: ActivityLogService, notifications: NotificationsService);
    placeOrder(userId: string, dto: PlaceOrderDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.OrderType;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        quantity: Prisma.Decimal;
        price: Prisma.Decimal;
        stopPrice: Prisma.Decimal | null;
        takeProfit: Prisma.Decimal | null;
        stopLoss: Prisma.Decimal | null;
        filledPrice: Prisma.Decimal | null;
        filledQty: Prisma.Decimal;
        notional: Prisma.Decimal;
        filledAt: Date | null;
    }>;
    private fillMarketOrder;
    cancelOrder(userId: string, tradeId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.OrderType;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        quantity: Prisma.Decimal;
        price: Prisma.Decimal;
        stopPrice: Prisma.Decimal | null;
        takeProfit: Prisma.Decimal | null;
        stopLoss: Prisma.Decimal | null;
        filledPrice: Prisma.Decimal | null;
        filledQty: Prisma.Decimal;
        notional: Prisma.Decimal;
        filledAt: Date | null;
    }>;
    closePosition(userId: string, positionId: string): Promise<{
        message: string;
        realizedPnl: number;
        exitPrice: number;
    }>;
    listOrders(userId: string, status?: OrderStatus): Prisma.PrismaPromise<({
        pair: {
            symbol: string;
            displayName: string;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.OrderType;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        quantity: Prisma.Decimal;
        price: Prisma.Decimal;
        stopPrice: Prisma.Decimal | null;
        takeProfit: Prisma.Decimal | null;
        stopLoss: Prisma.Decimal | null;
        filledPrice: Prisma.Decimal | null;
        filledQty: Prisma.Decimal;
        notional: Prisma.Decimal;
        filledAt: Date | null;
    })[]>;
    listPositions(userId: string, status?: 'OPEN' | 'CLOSED'): Prisma.PrismaPromise<({
        pair: {
            symbol: string;
            displayName: string;
            lastPrice: Prisma.Decimal;
        };
    } & {
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.PositionStatus;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        entryPrice: Prisma.Decimal;
        quantity: Prisma.Decimal;
        exitPrice: Prisma.Decimal | null;
        realizedPnl: Prisma.Decimal;
        openedAt: Date;
        closedAt: Date | null;
    })[]>;
}
