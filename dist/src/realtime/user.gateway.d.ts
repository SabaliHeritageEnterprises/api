import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwt;
    private readonly config;
    server: Server;
    private readonly logger;
    private online;
    constructor(jwt: JwtService, config: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    private broadcastPresence;
    getOnlineUserIds(): string[];
    isOnline(userId: string): boolean;
    emitToUser(userId: string, event: string, payload: unknown): void;
    emitToAdmins(event: string, payload: unknown): void;
    emitToAll(event: string, payload: unknown): void;
}
