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
exports.WatchlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WatchlistService = class WatchlistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listFavorites(userId) {
        const favs = await this.prisma.favorite.findMany({
            where: { userId },
            include: { pair: true },
            orderBy: { createdAt: 'desc' },
        });
        return favs.map((f) => f.pair);
    }
    async toggleFavorite(userId, symbol) {
        const pair = await this.prisma.marketPair.findUnique({ where: { symbol: symbol.toUpperCase() } });
        if (!pair)
            throw new common_1.NotFoundException('Pair not found');
        const existing = await this.prisma.favorite.findUnique({
            where: { userId_pairId: { userId, pairId: pair.id } },
        });
        if (existing) {
            await this.prisma.favorite.delete({ where: { id: existing.id } });
            return { favorited: false };
        }
        await this.prisma.favorite.create({ data: { userId, pairId: pair.id } });
        return { favorited: true };
    }
    listWatchlists(userId) {
        return this.prisma.watchlist.findMany({
            where: { userId },
            include: { items: { include: { pair: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    createWatchlist(userId, name) {
        return this.prisma.watchlist.create({ data: { userId, name } });
    }
    async saveLayout(userId, watchlistId, layout) {
        const wl = await this.prisma.watchlist.findFirst({ where: { id: watchlistId, userId } });
        if (!wl)
            throw new common_1.NotFoundException('Watchlist not found');
        return this.prisma.watchlist.update({ where: { id: watchlistId }, data: { layout } });
    }
    async addItem(userId, watchlistId, symbol) {
        const [wl, pair] = await Promise.all([
            this.prisma.watchlist.findFirst({ where: { id: watchlistId, userId } }),
            this.prisma.marketPair.findUnique({ where: { symbol: symbol.toUpperCase() } }),
        ]);
        if (!wl)
            throw new common_1.NotFoundException('Watchlist not found');
        if (!pair)
            throw new common_1.NotFoundException('Pair not found');
        return this.prisma.watchlistItem.upsert({
            where: { watchlistId_pairId: { watchlistId, pairId: pair.id } },
            update: {},
            create: { watchlistId, pairId: pair.id },
        });
    }
    async removeItem(userId, watchlistId, pairId) {
        const wl = await this.prisma.watchlist.findFirst({ where: { id: watchlistId, userId } });
        if (!wl)
            throw new common_1.NotFoundException('Watchlist not found');
        await this.prisma.watchlistItem.deleteMany({ where: { watchlistId, pairId } });
        return { ok: true };
    }
};
exports.WatchlistService = WatchlistService;
exports.WatchlistService = WatchlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchlistService);
//# sourceMappingURL=watchlist.service.js.map