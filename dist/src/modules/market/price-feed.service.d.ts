import { OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../prisma/prisma.service';
import { MarketGateway } from './market.gateway';
export declare class PriceFeedService implements OnModuleInit {
    private readonly prisma;
    private readonly gateway;
    private readonly redis;
    private readonly logger;
    private state;
    private dirty;
    constructor(prisma: PrismaService, gateway: MarketGateway, redis: Redis);
    onModuleInit(): Promise<void>;
    tick(): Promise<void>;
    flush(): Promise<void>;
    getLastPrice(symbol: string): Promise<number | null>;
}
