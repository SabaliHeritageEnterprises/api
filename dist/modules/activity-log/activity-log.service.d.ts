import { PrismaService } from '../../prisma/prisma.service';
export interface RequestContext {
    ipAddress?: string;
    userAgent?: string;
}
export declare class ActivityLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(userId: string, action: string, ctx?: RequestContext, metadata?: Record<string, unknown>): Promise<void>;
    listForUser(userId: string, take?: number): Promise<{
        userId: string;
        id: string;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
    }[]>;
}
