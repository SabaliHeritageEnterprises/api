import { OrderStatus } from '@prisma/client';
import { TradesService } from './trades.service';
import { PlaceOrderDto } from './dto/trades.dto';
export declare class TradesController {
    private readonly trades;
    constructor(trades: TradesService);
    place(userId: string, dto: PlaceOrderDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.OrderType;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        quantity: import("@prisma/client/runtime/library").Decimal;
        price: import("@prisma/client/runtime/library").Decimal;
        stopPrice: import("@prisma/client/runtime/library").Decimal | null;
        takeProfit: import("@prisma/client/runtime/library").Decimal | null;
        stopLoss: import("@prisma/client/runtime/library").Decimal | null;
        filledPrice: import("@prisma/client/runtime/library").Decimal | null;
        filledQty: import("@prisma/client/runtime/library").Decimal;
        notional: import("@prisma/client/runtime/library").Decimal;
        filledAt: Date | null;
    }>;
    orders(userId: string, status?: OrderStatus): import(".prisma/client").Prisma.PrismaPromise<({
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
        quantity: import("@prisma/client/runtime/library").Decimal;
        price: import("@prisma/client/runtime/library").Decimal;
        stopPrice: import("@prisma/client/runtime/library").Decimal | null;
        takeProfit: import("@prisma/client/runtime/library").Decimal | null;
        stopLoss: import("@prisma/client/runtime/library").Decimal | null;
        filledPrice: import("@prisma/client/runtime/library").Decimal | null;
        filledQty: import("@prisma/client/runtime/library").Decimal;
        notional: import("@prisma/client/runtime/library").Decimal;
        filledAt: Date | null;
    })[]>;
    cancel(userId: string, id: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.OrderType;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        quantity: import("@prisma/client/runtime/library").Decimal;
        price: import("@prisma/client/runtime/library").Decimal;
        stopPrice: import("@prisma/client/runtime/library").Decimal | null;
        takeProfit: import("@prisma/client/runtime/library").Decimal | null;
        stopLoss: import("@prisma/client/runtime/library").Decimal | null;
        filledPrice: import("@prisma/client/runtime/library").Decimal | null;
        filledQty: import("@prisma/client/runtime/library").Decimal;
        notional: import("@prisma/client/runtime/library").Decimal;
        filledAt: Date | null;
    }>;
    positions(userId: string, status?: 'OPEN' | 'CLOSED'): import(".prisma/client").Prisma.PrismaPromise<({
        pair: {
            symbol: string;
            displayName: string;
            lastPrice: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.PositionStatus;
        pairId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        entryPrice: import("@prisma/client/runtime/library").Decimal;
        quantity: import("@prisma/client/runtime/library").Decimal;
        exitPrice: import("@prisma/client/runtime/library").Decimal | null;
        realizedPnl: import("@prisma/client/runtime/library").Decimal;
        openedAt: Date;
        closedAt: Date | null;
    })[]>;
    close(userId: string, id: string): Promise<{
        message: string;
        realizedPnl: number;
        exitPrice: number;
    }>;
}
