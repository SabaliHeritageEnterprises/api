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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MarketService = class MarketService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        return this.prisma.marketPair.findMany({
            where: {
                status: 'ACTIVE',
                ...(params.type ? { type: params.type } : {}),
                ...(params.trending ? { isTrending: true } : {}),
                ...(params.search
                    ? {
                        OR: [
                            { symbol: { contains: params.search, mode: 'insensitive' } },
                            { displayName: { contains: params.search, mode: 'insensitive' } },
                            { base: { contains: params.search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            orderBy: [{ isTrending: 'desc' }, { sortOrder: 'asc' }],
        });
    }
    async topMovers(limit = 5) {
        const pairs = await this.prisma.marketPair.findMany({ where: { status: 'ACTIVE' } });
        const sorted = [...pairs].sort((a, b) => Number(b.change24h) - Number(a.change24h));
        return {
            gainers: sorted.slice(0, limit),
            losers: sorted.slice(-limit).reverse(),
        };
    }
    async getBySymbol(symbol) {
        const pair = await this.prisma.marketPair.findUnique({ where: { symbol: symbol.toUpperCase() } });
        if (!pair)
            throw new common_1.NotFoundException(`Unknown market pair: ${symbol}`);
        return pair;
    }
    async getCandles(symbol, interval, count = 200) {
        const pair = await this.getBySymbol(symbol);
        const stepSec = this.intervalSeconds(interval);
        const now = Math.floor(Date.now() / 1000);
        const start = now - stepSec * count;
        const candles = [];
        let price = Number(pair.lastPrice) * 0.96;
        const vol = Number(pair.lastPrice) * 0.004 + 0.0001;
        for (let i = 0; i < count; i++) {
            const time = start + i * stepSec;
            const seed = this.hashSeed(`${pair.symbol}:${interval}:${i}`);
            const drift = (Math.sin(i / 9) + Math.cos(i / 17)) * vol;
            const noise = (seed - 0.5) * vol * 2;
            const open = price;
            const close = Math.max(open + drift + noise, 0.00001);
            const high = Math.max(open, close) + Math.abs(noise) * 0.6;
            const low = Math.min(open, close) - Math.abs(noise) * 0.6;
            const volume = Number(pair.volume24h) / count || seed * 1000;
            candles.push({ time, open, high, low, close, volume });
            price = close;
        }
        return candles;
    }
    hashSeed(s) {
        let h = 2166136261;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return ((h >>> 0) % 1000) / 1000;
    }
    intervalSeconds(interval) {
        const map = {
            '1m': 60,
            '5m': 300,
            '15m': 900,
            '1h': 3600,
            '4h': 14400,
            '1d': 86400,
        };
        return map[interval] ?? 3600;
    }
};
exports.MarketService = MarketService;
exports.MarketService = MarketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketService);
//# sourceMappingURL=market.service.js.map