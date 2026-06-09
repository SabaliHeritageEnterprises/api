"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PriceFeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceFeedService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_module_1 = require("../../redis/redis.module");
const market_gateway_1 = require("./market.gateway");
let PriceFeedService = PriceFeedService_1 = class PriceFeedService {
    constructor(prisma, gateway, redis) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.redis = redis;
        this.logger = new common_1.Logger(PriceFeedService_1.name);
        this.state = new Map();
        this.dirty = new Set();
    }
    async onModuleInit() {
        const pairs = await this.prisma.marketPair.findMany({ where: { status: 'ACTIVE' } });
        const now = Date.now();
        for (const p of pairs) {
            const price = Number(p.lastPrice);
            this.state.set(p.symbol, {
                symbol: p.symbol,
                price,
                change24h: Number(p.change24h),
                high24h: price * 1.02,
                low24h: price * 0.98,
                volume24h: Number(p.volume24h) || price * 1000,
                ts: now,
                open24h: price / (1 + Number(p.change24h) / 100 || 1),
            });
        }
        this.logger.log(`Price feed initialised for ${this.state.size} pairs`);
    }
    async tick() {
        if (this.state.size === 0)
            return;
        const snapshot = [];
        for (const [symbol, s] of this.state) {
            const volPct = symbol.endsWith('USDT') ? 0.0009 : 0.0003;
            const drift = (Math.random() - 0.5) * 2 * volPct;
            const newPrice = Math.max(s.price * (1 + drift), 0.000001);
            s.price = newPrice;
            s.high24h = Math.max(s.high24h, newPrice);
            s.low24h = Math.min(s.low24h, newPrice);
            s.change24h = ((newPrice - s.open24h) / s.open24h) * 100;
            s.volume24h += Math.abs(drift) * newPrice * 1000;
            s.ts = Date.now();
            const ticker = {
                symbol: s.symbol,
                price: s.price,
                change24h: s.change24h,
                high24h: s.high24h,
                low24h: s.low24h,
                volume24h: s.volume24h,
                ts: s.ts,
            };
            snapshot.push(ticker);
            this.gateway.emitTicker(ticker);
            this.dirty.add(symbol);
            void this.redis.set(`ticker:${symbol}`, JSON.stringify(ticker), 'EX', 30);
        }
        this.gateway.emitSnapshot(snapshot);
    }
    async flush() {
        if (this.dirty.size === 0)
            return;
        const updates = [...this.dirty].map((symbol) => {
            const s = this.state.get(symbol);
            return this.prisma.marketPair.update({
                where: { symbol },
                data: {
                    lastPrice: s.price,
                    change24h: s.change24h,
                    high24h: s.high24h,
                    low24h: s.low24h,
                    volume24h: s.volume24h,
                },
            });
        });
        this.dirty.clear();
        try {
            await this.prisma.$transaction(updates);
        }
        catch (e) {
            this.logger.warn(`Snapshot flush failed: ${e.message}`);
        }
    }
    async getLastPrice(symbol) {
        const cached = await this.redis.get(`ticker:${symbol}`);
        if (cached)
            return JSON.parse(cached).price;
        return this.state.get(symbol)?.price ?? null;
    }
};
exports.PriceFeedService = PriceFeedService;
__decorate([
    (0, schedule_1.Interval)(2000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceFeedService.prototype, "tick", null);
__decorate([
    (0, schedule_1.Interval)(15000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceFeedService.prototype, "flush", null);
exports.PriceFeedService = PriceFeedService = PriceFeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        market_gateway_1.MarketGateway,
        ioredis_1.default])
], PriceFeedService);
//# sourceMappingURL=price-feed.service.js.map