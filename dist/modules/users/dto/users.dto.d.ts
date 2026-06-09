export declare class UpdateProfileDto {
    displayName?: string;
}
export declare class UpdateSettingsDto {
    theme?: string;
    language?: string;
    defaultQuoteCurrency?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    tradeConfirmations?: boolean;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
