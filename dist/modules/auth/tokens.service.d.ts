import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './strategies/jwt.strategy';
export declare class TokensService {
    private readonly jwt;
    private readonly config;
    constructor(jwt: JwtService, config: ConfigService);
    signAccessToken(payload: JwtPayload): Promise<string>;
    generateRefreshToken(): string;
    hashRefreshToken(token: string): Promise<string>;
    verifyRefreshToken(token: string, hash: string): Promise<boolean>;
    refreshExpiry(): Date;
    hashOpaque(token: string): string;
    generateOpaqueToken(): string;
}
