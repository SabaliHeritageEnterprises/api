import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { ActivityLogService, RequestContext } from '../activity-log/activity-log.service';
import { LoginEventService } from '../activity-log/login-event.service';
import { TokensService } from './tokens.service';
import { TwoFactorService } from './two-factor.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly mail;
    private readonly tokens;
    private readonly twoFactor;
    private readonly activity;
    private readonly loginEvents;
    constructor(prisma: PrismaService, mail: MailService, tokens: TokensService, twoFactor: TwoFactorService, activity: ActivityLogService, loginEvents: LoginEventService);
    register(dto: RegisterDto, ctx: RequestContext): Promise<{
        id: string;
        email: string;
        message: string;
    }>;
    private issueEmailVerification;
    verifyEmail(rawToken: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, ctx: RequestContext): Promise<AuthTokens & {
        twoFactorRequired?: boolean;
    }>;
    private recordLoginEvent;
    private createSession;
    refresh(rawRefresh: string, ctx: RequestContext): Promise<AuthTokens>;
    logout(sessionId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, ctx: RequestContext): Promise<{
        message: string;
    }>;
    init2fa(userId: string): Promise<{
        otpauthUrl: string;
        qrDataUrl: string;
    }>;
    confirm2fa(userId: string, totp: string, ctx: RequestContext): Promise<{
        message: string;
        recoveryCodes: string[];
    }>;
    disable2fa(userId: string, totp: string, ctx: RequestContext): Promise<{
        message: string;
    }>;
}
