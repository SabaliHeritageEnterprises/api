import { Request } from 'express';
import { UsersService } from './users.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { UpdateProfileDto, UpdateSettingsDto, ChangePasswordDto } from './dto/users.dto';
export declare class UsersController {
    private readonly users;
    private readonly activity;
    constructor(users: UsersService, activity: ActivityLogService);
    profile(userId: string): Promise<{
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
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
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
    updateSettings(userId: string, dto: UpdateSettingsDto): Promise<{
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
    changePassword(userId: string, dto: ChangePasswordDto, req: Request): Promise<{
        message: string;
    }>;
    portfolio(userId: string): Promise<{
        cashBalance: number;
        holdingsValue: number;
        equity: number;
        unrealizedPnl: number;
        openOrders: number;
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
    }>;
    activityLog(userId: string): Promise<{
        userId: string;
        id: string;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }[]>;
}
