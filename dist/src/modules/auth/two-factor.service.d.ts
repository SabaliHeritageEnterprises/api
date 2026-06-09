import { ConfigService } from '@nestjs/config';
export declare class TwoFactorService {
    private readonly config;
    constructor(config: ConfigService);
    generateSecret(): string;
    buildQrCode(email: string, secret: string): Promise<{
        otpauthUrl: string;
        qrDataUrl: string;
    }>;
    verify(token: string, secret: string): boolean;
    generateRecoveryCodes(count?: number): {
        codes: string[];
        hashes: string[];
    };
    hashCode(code: string): string;
}
