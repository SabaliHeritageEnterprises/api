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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const market_service_1 = require("./market.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let MarketController = class MarketController {
    constructor(market) {
        this.market = market;
    }
    list(type, search, trending) {
        return this.market.list({ type, search, trending: trending === 'true' });
    }
    movers() {
        return this.market.topMovers();
    }
    getPair(symbol) {
        return this.market.getBySymbol(symbol);
    }
    candles(symbol, interval = '1h', limit = '200') {
        return this.market.getCandles(symbol, interval, Math.min(parseInt(limit, 10) || 200, 1000));
    }
};
exports.MarketController = MarketController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('pairs'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('trending')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('movers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "movers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('pairs/:symbol'),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "getPair", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('pairs/:symbol/candles'),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Query)('interval')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "candles", null);
exports.MarketController = MarketController = __decorate([
    (0, common_1.Controller)('market'),
    __metadata("design:paramtypes", [market_service_1.MarketService])
], MarketController);
//# sourceMappingURL=market.controller.js.map