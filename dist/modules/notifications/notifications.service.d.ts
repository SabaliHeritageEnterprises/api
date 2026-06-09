import { NotificationType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserGateway } from '../../realtime/user.gateway';
export declare class NotificationsService {
    private readonly prisma;
    private readonly gateway;
    constructor(prisma: PrismaService, gateway: UserGateway);
    create(userId: string, type: NotificationType, title: string, body: string, metadata?: object): Promise<{
        userId: string;
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        body: string;
        isRead: boolean;
    }>;
    list(userId: string, unreadOnly?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        userId: string;
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        body: string;
        isRead: boolean;
    }[]>;
    unreadCount(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    markRead(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    markAllRead(userId: string): Promise<{
        ok: boolean;
    }>;
}
