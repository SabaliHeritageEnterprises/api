import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    list(userId: string, unread?: string): import(".prisma/client").Prisma.PrismaPromise<{
        userId: string;
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        body: string;
        isRead: boolean;
    }[]>;
    unread(userId: string): Promise<{
        count: number;
    }>;
    read(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    readAll(userId: string): Promise<{
        ok: boolean;
    }>;
}
