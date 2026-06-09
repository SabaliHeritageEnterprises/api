import { PrismaService } from '../../prisma/prisma.service';
export declare class WatchlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listFavorites(userId: string): Promise<{
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
    toggleFavorite(userId: string, symbol: string): Promise<{
        favorited: boolean;
    }>;
    listWatchlists(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        items: ({
            pair: {
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
            };
        } & {
            id: string;
            pairId: string;
            watchlistId: string;
            addedAt: Date;
        })[];
    } & {
        name: string;
        userId: string;
        id: string;
        createdAt: Date;
        isDefault: boolean;
        layout: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    createWatchlist(userId: string, name: string): import(".prisma/client").Prisma.Prisma__WatchlistClient<{
        name: string;
        userId: string;
        id: string;
        createdAt: Date;
        isDefault: boolean;
        layout: import("@prisma/client/runtime/library").JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    saveLayout(userId: string, watchlistId: string, layout: object): Promise<{
        name: string;
        userId: string;
        id: string;
        createdAt: Date;
        isDefault: boolean;
        layout: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    addItem(userId: string, watchlistId: string, symbol: string): Promise<{
        id: string;
        pairId: string;
        watchlistId: string;
        addedAt: Date;
    }>;
    removeItem(userId: string, watchlistId: string, pairId: string): Promise<{
        ok: boolean;
    }>;
}
