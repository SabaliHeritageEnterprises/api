import { SessionsService } from './sessions.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
export declare class SessionsController {
    private readonly sessions;
    constructor(sessions: SessionsService);
    list(user: AuthUser): Promise<{
        current: boolean;
        id: string;
        ipAddress: string;
        userAgent: string;
        createdAt: Date;
        deviceLabel: string;
        lastSeenAt: Date;
    }[]>;
    revokeOthers(user: AuthUser): Promise<{
        message: string;
    }>;
    revoke(userId: string, id: string): Promise<{
        message: string;
    }>;
}
