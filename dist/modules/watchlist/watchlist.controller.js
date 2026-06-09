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
exports.WatchlistController = void 0;
const common_1 = require("@nestjs/common");
const watchlist_service_1 = require("./watchlist.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let WatchlistController = class WatchlistController {
    constructor(watchlist) {
        this.watchlist = watchlist;
    }
    favorites(userId) {
        return this.watchlist.listFavorites(userId);
    }
    toggleFavorite(userId, symbol) {
        return this.watchlist.toggleFavorite(userId, symbol);
    }
    lists(userId) {
        return this.watchlist.listWatchlists(userId);
    }
    create(userId, name) {
        return this.watchlist.createWatchlist(userId, name);
    }
    saveLayout(userId, id, layout) {
        return this.watchlist.saveLayout(userId, id, layout);
    }
    addItem(userId, id, symbol) {
        return this.watchlist.addItem(userId, id, symbol);
    }
    removeItem(userId, id, pairId) {
        return this.watchlist.removeItem(userId, id, pairId);
    }
};
exports.WatchlistController = WatchlistController;
__decorate([
    (0, common_1.Get)('favorites'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "favorites", null);
__decorate([
    (0, common_1.Post)('favorites/:symbol'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "lists", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/layout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('layout')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "saveLayout", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:pairId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('pairId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "removeItem", null);
exports.WatchlistController = WatchlistController = __decorate([
    (0, common_1.Controller)('watchlist'),
    __metadata("design:paramtypes", [watchlist_service_1.WatchlistService])
], WatchlistController);
//# sourceMappingURL=watchlist.controller.js.map