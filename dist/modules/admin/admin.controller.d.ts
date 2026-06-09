import { AdminService } from './admin.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { CreatePairDto, UpdatePairDto, BroadcastNotificationDto, AdminCreateUserDto, AdminUpdateUserDto, AdminUpdateSettingsDto, AdminResetPasswordDto, SendUserNotificationDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
    private actor;
    analytics(): Promise<{
        users: {
            total: number;
            active: number;
            suspended: number;
            new24h: number;
        };
        trades: {
            total: number;
            last24h: number;
            openOrders: number;
        };
        markets: {
            activePairs: number;
        };
    }>;
    users(search?: string, take?: string, skip?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.Role;
        displayName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        paperBalance: import("@prisma/client/runtime/library").Decimal;
        lastLoginAt: Date;
    }[]>;
    userDashboard(id: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            status: import(".prisma/client").$Enums.UserStatus;
            role: import(".prisma/client").$Enums.Role;
            displayName: string;
            emailVerified: boolean;
            twoFactorEnabled: boolean;
            paperBalance: import("@prisma/client/runtime/library").Decimal;
            lastLoginAt: Date;
            settings: {
                userId: string;
                id: string;
                updatedAt: Date;
                theme: string;
                language: string;
                defaultQuoteCurrency: string;
                emailNotifications: boolean;
                pushNotifications: boolean;
                tradeConfirmations: boolean;
            };
        };
        portfolio: {
            cashBalance: number;
            holdingsValue: number;
            equity: number;
            unrealizedPnl: number;
        };
        positions: {
            markPrice: number;
            unrealizedPnl: number;
            pair: {
                symbol: string;
                displayName: string;
                lastPrice: import("@prisma/client/runtime/library").Decimal;
            };
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
        }[];
        recentTrades: ({
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
        })[];
        activity: {
            userId: string;
            id: string;
            action: string;
            ipAddress: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
        }[];
        activeDevices: number;
    }>;
    userActivity(id: string): import(".prisma/client").Prisma.PrismaPromise<{
        userId: string;
        id: string;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }[]>;
    createUser(user: AuthUser, dto: AdminCreateUserDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.Role;
        displayName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        paperBalance: import("@prisma/client/runtime/library").Decimal;
        lastLoginAt: Date;
    }>;
    updateUser(user: AuthUser, id: string, dto: AdminUpdateUserDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.Role;
        displayName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        paperBalance: import("@prisma/client/runtime/library").Decimal;
        lastLoginAt: Date;
    }>;
    updateUserSettings(user: AuthUser, id: string, dto: AdminUpdateSettingsDto): Promise<{
        userId: string;
        id: string;
        updatedAt: Date;
        theme: string;
        language: string;
        defaultQuoteCurrency: string;
        emailNotifications: boolean;
        pushNotifications: boolean;
        tradeConfirmations: boolean;
    }>;
    resetPassword(user: AuthUser, id: string, dto: AdminResetPasswordDto): Promise<{
        message: string;
    }>;
    notifyUser(user: AuthUser, id: string, dto: SendUserNotificationDto): Promise<{
        sent: number;
    }>;
    deleteUser(user: AuthUser, id: string): Promise<{
        message: string;
    }>;
    createPair(actorId: string, dto: CreatePairDto): Promise<{
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
    updatePair(actorId: string, id: string, dto: UpdatePairDto): Promise<{
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
    broadcast(user: AuthUser, dto: BroadcastNotificationDto): Promise<{
        sent: number;
    }>;
    adminLogs(): import(".prisma/client").Prisma.PrismaPromise<({
        actor: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        action: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        targetType: string | null;
        targetId: string | null;
        actorId: string;
    })[]>;
    activityLogs(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
        };
    } & {
        userId: string;
        id: string;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    })[]>;
}
