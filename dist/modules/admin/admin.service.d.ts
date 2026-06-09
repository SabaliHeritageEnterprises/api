import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserGateway } from '../../realtime/user.gateway';
import { CreatePairDto, UpdatePairDto, BroadcastNotificationDto, AdminCreateUserDto, AdminUpdateUserDto, AdminUpdateSettingsDto, AdminResetPasswordDto, SendUserNotificationDto } from './dto/admin.dto';
export interface Actor {
    id: string;
    role: Role;
}
export declare class AdminService {
    private readonly prisma;
    private readonly notifications;
    private readonly gateway;
    constructor(prisma: PrismaService, notifications: NotificationsService, gateway: UserGateway);
    private audit;
    private assertCanManage;
    private pushUpdate;
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
    listUsers(search?: string, take?: number, skip?: number): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.Role;
        displayName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        paperBalance: Prisma.Decimal;
        lastLoginAt: Date;
    }[]>;
    getUserDashboard(userId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            status: import(".prisma/client").$Enums.UserStatus;
            role: import(".prisma/client").$Enums.Role;
            displayName: string;
            emailVerified: boolean;
            twoFactorEnabled: boolean;
            paperBalance: Prisma.Decimal;
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
                lastPrice: Prisma.Decimal;
            };
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
            quantity: Prisma.Decimal;
            price: Prisma.Decimal;
            stopPrice: Prisma.Decimal | null;
            takeProfit: Prisma.Decimal | null;
            stopLoss: Prisma.Decimal | null;
            filledPrice: Prisma.Decimal | null;
            filledQty: Prisma.Decimal;
            notional: Prisma.Decimal;
            filledAt: Date | null;
        })[];
        activity: {
            userId: string;
            id: string;
            action: string;
            ipAddress: string | null;
            userAgent: string | null;
            metadata: Prisma.JsonValue | null;
            createdAt: Date;
        }[];
        activeDevices: number;
    }>;
    getUserActivity(userId: string, take?: number): Prisma.PrismaPromise<{
        userId: string;
        id: string;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
    }[]>;
    createUser(actor: Actor, dto: AdminCreateUserDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.Role;
        displayName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        paperBalance: Prisma.Decimal;
        lastLoginAt: Date;
    }>;
    updateUser(actor: Actor, userId: string, dto: AdminUpdateUserDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.Role;
        displayName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        paperBalance: Prisma.Decimal;
        lastLoginAt: Date;
    }>;
    updateUserSettings(actor: Actor, userId: string, dto: AdminUpdateSettingsDto): Promise<{
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
    resetUserPassword(actor: Actor, userId: string, dto: AdminResetPasswordDto): Promise<{
        message: string;
    }>;
    deleteUser(actor: Actor, userId: string): Promise<{
        message: string;
    }>;
    notifyUser(actor: Actor, userId: string, dto: SendUserNotificationDto): Promise<{
        sent: number;
    }>;
    broadcast(actor: Actor, dto: BroadcastNotificationDto): Promise<{
        sent: number;
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
        lastPrice: Prisma.Decimal;
        change24h: Prisma.Decimal;
        high24h: Prisma.Decimal;
        low24h: Prisma.Decimal;
        volume24h: Prisma.Decimal;
        marketCap: Prisma.Decimal;
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
        lastPrice: Prisma.Decimal;
        change24h: Prisma.Decimal;
        high24h: Prisma.Decimal;
        low24h: Prisma.Decimal;
        volume24h: Prisma.Decimal;
        marketCap: Prisma.Decimal;
        pricePrecision: number;
        qtyPrecision: number;
        isTrending: boolean;
        sortOrder: number;
    }>;
    adminLogs(take?: number): Prisma.PrismaPromise<({
        actor: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        action: string;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        targetType: string | null;
        targetId: string | null;
        actorId: string;
    })[]>;
    activityLogs(take?: number): Prisma.PrismaPromise<({
        user: {
            email: string;
        };
    } & {
        userId: string;
        id: string;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
    })[]>;
}
