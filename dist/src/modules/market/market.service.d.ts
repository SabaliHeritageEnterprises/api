import { PrismaService } from '../../prisma/prisma.service';
import { MarketType } from '@prisma/client';
export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
export declare class MarketService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(params: {
        type?: MarketType;
        search?: string;
        trending?: boolean;
    }): Promise<{
        symbol: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MarketStatus;
        displayName: string;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MarketType;
        base: string;
        quote: string;
        lastPrice: import("@prisma/client/runtime/library").Decimal;
        change24h: import("@prisma/client/runtime/library").Decimal;
        high24h: import("@prisma/client/runtime/library").Decimal;
        low24h: import("@prisma/client/runtime/library").Decimal;
        volume24h: import("@prisma/client/runtime/library").Decimal;
        marketCap: import("@prisma/client/runtime/library").Decimal;
        pricePrecision: number;
        qtyPrecision: number;
        isTrending: boolean;
        sortOrder: number;
    }[]>;
    topMovers(limit?: number): Promise<{
        gainers: {
            symbol: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.MarketStatus;
            displayName: string;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.MarketType;
            base: string;
            quote: string;
            lastPrice: import("@prisma/client/runtime/library").Decimal;
            change24h: import("@prisma/client/runtime/library").Decimal;
            high24h: import("@prisma/client/runtime/library").Decimal;
            low24h: import("@prisma/client/runtime/library").Decimal;
            volume24h: import("@prisma/client/runtime/library").Decimal;
            marketCap: import("@prisma/client/runtime/library").Decimal;
            pricePrecision: number;
            qtyPrecision: number;
            isTrending: boolean;
            sortOrder: number;
        }[];
        losers: {
            symbol: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.MarketStatus;
            displayName: string;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.MarketType;
            base: string;
            quote: string;
            lastPrice: import("@prisma/client/runtime/library").Decimal;
            change24h: import("@prisma/client/runtime/library").Decimal;
            high24h: import("@prisma/client/runtime/library").Decimal;
            low24h: import("@prisma/client/runtime/library").Decimal;
            volume24h: import("@prisma/client/runtime/library").Decimal;
            marketCap: import("@prisma/client/runtime/library").Decimal;
            pricePrecision: number;
            qtyPrecision: number;
            isTrending: boolean;
            sortOrder: number;
        }[];
    }>;
    getBySymbol(symbol: string): Promise<{
        symbol: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MarketStatus;
        displayName: string;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MarketType;
        base: string;
        quote: string;
        lastPrice: import("@prisma/client/runtime/library").Decimal;
        change24h: import("@prisma/client/runtime/library").Decimal;
        high24h: import("@prisma/client/runtime/library").Decimal;
        low24h: import("@prisma/client/runtime/library").Decimal;
        volume24h: import("@prisma/client/runtime/library").Decimal;
        marketCap: import("@prisma/client/runtime/library").Decimal;
        pricePrecision: number;
        qtyPrecision: number;
        isTrending: boolean;
        sortOrder: number;
    }>;
    getCandles(symbol: string, interval: string, count?: number): Promise<Candle[]>;
    private hashSeed;
    private intervalSeconds;
}
