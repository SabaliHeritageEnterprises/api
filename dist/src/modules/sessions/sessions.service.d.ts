import { PrismaService } from '../../prisma/prisma.service';
export declare class SessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listDevices(userId: string, currentSessionId: string): Promise<{
        current: boolean;
        id: string;
        ipAddress: string;
        userAgent: string;
        createdAt: Date;
        deviceLabel: string;
        lastSeenAt: Date;
    }[]>;
    revoke(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    revokeOthers(userId: string, currentSessionId: string): Promise<{
        message: string;
    }>;
}
