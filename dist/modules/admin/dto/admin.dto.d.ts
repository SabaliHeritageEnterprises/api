import { MarketStatus, MarketType, UserStatus, Role, NotificationType } from '@prisma/client';
export declare class AdminCreateUserDto {
    email: string;
    password: string;
    displayName?: string;
    role?: Role;
    status?: UserStatus;
}
export declare class AdminUpdateUserDto {
    displayName?: string;
    status?: UserStatus;
    role?: Role;
    paperBalance?: number;
    emailVerified?: boolean;
}
export declare class AdminUpdateSettingsDto {
    theme?: string;
    language?: string;
    defaultQuoteCurrency?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    tradeConfirmations?: boolean;
}
export declare class AdminResetPasswordDto {
    newPassword: string;
    notifyUser?: boolean;
}
export declare class SendUserNotificationDto {
    title: string;
    body: string;
    type?: NotificationType;
}
export declare class UpdateUserStatusDto {
    status: UserStatus;
}
export declare class UpdateUserRoleDto {
    role: Role;
}
export declare class CreatePairDto {
    symbol: string;
    base: string;
    quote: string;
    displayName: string;
    type: MarketType;
    lastPrice?: number;
    pricePrecision?: number;
    qtyPrecision?: number;
}
export declare class UpdatePairDto {
    status?: MarketStatus;
    isTrending?: boolean;
    sortOrder?: number;
    displayName?: string;
}
export declare class BroadcastNotificationDto {
    title: string;
    body: string;
}
