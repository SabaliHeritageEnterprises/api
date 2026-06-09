import { LoginStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserGateway } from '../../realtime/user.gateway';
export interface LoginEventInput {
    status: LoginStatus;
    email: string;
    username?: string | null;
    userId?: string | null;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
}
export declare class LoginEventService {
    private readonly prisma;
    private readonly gateway;
    private readonly logger;
    constructor(prisma: PrismaService, gateway: UserGateway);
    record(input: LoginEventInput): Promise<void>;
    list(limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        userId: string | null;
        id: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        email: string;
        username: string | null;
        status: import(".prisma/client").$Enums.LoginStatus;
    }[]>;
    countSince(since: Date): import(".prisma/client").Prisma.PrismaPromise<number>;
}
