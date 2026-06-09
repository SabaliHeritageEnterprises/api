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
exports.TradesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const trades_service_1 = require("./trades.service");
const trades_dto_1 = require("./dto/trades.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TradesController = class TradesController {
    constructor(trades) {
        this.trades = trades;
    }
    place(userId, dto) {
        return this.trades.placeOrder(userId, dto);
    }
    orders(userId, status) {
        return this.trades.listOrders(userId, status);
    }
    cancel(userId, id) {
        return this.trades.cancelOrder(userId, id);
    }
    positions(userId, status = 'OPEN') {
        return this.trades.listPositions(userId, status);
    }
    close(userId, id) {
        return this.trades.closePosition(userId, id);
    }
};
exports.TradesController = TradesController;
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, trades_dto_1.PlaceOrderDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "place", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "orders", null);
__decorate([
    (0, common_1.Delete)('orders/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('positions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "positions", null);
__decorate([
    (0, common_1.Post)('positions/:id/close'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "close", null);
exports.TradesController = TradesController = __decorate([
    (0, common_1.Controller)('trades'),
    __metadata("design:paramtypes", [trades_service_1.TradesService])
], TradesController);
//# sourceMappingURL=trades.controller.js.map