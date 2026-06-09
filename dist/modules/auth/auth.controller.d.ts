import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, Enable2faDto, Disable2faDto } from './dto/auth.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto, req: Request): Promise<{
        id: string;
        email: string;
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        twoFactorRequired: boolean;
        accessToken?: undefined;
    } | {
        accessToken: string;
        twoFactorRequired?: undefined;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(user: AuthUser, res: Response): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, req: Request): Promise<{
        message: string;
    }>;
    init2fa(user: AuthUser): Promise<{
        otpauthUrl: string;
        qrDataUrl: string;
    }>;
    enable2fa(dto: Enable2faDto, user: AuthUser, req: Request): Promise<{
        message: string;
        recoveryCodes: string[];
    }>;
    disable2fa(dto: Disable2faDto, user: AuthUser, req: Request): Promise<{
        message: string;
    }>;
    me(user: AuthUser): AuthUser;
}
