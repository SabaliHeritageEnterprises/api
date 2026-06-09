export declare class RegisterDto {
    email: string;
    password: string;
    displayName?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    totp?: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class Enable2faDto {
    totp: string;
}
export declare class Disable2faDto {
    totp: string;
}
