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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const admin_dto_1 = require("./dto/admin.dto");
let AdminController = class AdminController {
    constructor(admin) {
        this.admin = admin;
    }
    actor(user) {
        return { id: user.id, role: user.role };
    }
    analytics() {
        return this.admin.analytics();
    }
    users(search, take = '50', skip = '0') {
        return this.admin.listUsers(search, parseInt(take, 10), parseInt(skip, 10));
    }
    userDashboard(id) {
        return this.admin.getUserDashboard(id);
    }
    userActivity(id) {
        return this.admin.getUserActivity(id);
    }
    createUser(user, dto) {
        return this.admin.createUser(this.actor(user), dto);
    }
    updateUser(user, id, dto) {
        return this.admin.updateUser(this.actor(user), id, dto);
    }
    updateUserSettings(user, id, dto) {
        return this.admin.updateUserSettings(this.actor(user), id, dto);
    }
    resetPassword(user, id, dto) {
        return this.admin.resetUserPassword(this.actor(user), id, dto);
    }
    notifyUser(user, id, dto) {
        return this.admin.notifyUser(this.actor(user), id, dto);
    }
    deleteUser(user, id) {
        return this.admin.deleteUser(this.actor(user), id);
    }
    createPair(actorId, dto) {
        return this.admin.createPair(actorId, dto);
    }
    updatePair(actorId, id, dto) {
        return this.admin.updatePair(actorId, id, dto);
    }
    broadcast(user, dto) {
        return this.admin.broadcast(this.actor(user), dto);
    }
    adminLogs() {
        return this.admin.adminLogs();
    }
    activityLogs() {
        return this.admin.activityLogs();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "analytics", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "userDashboard", null);
__decorate([
    (0, common_1.Get)('users/:id/activity'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "userActivity", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.AdminCreateUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.AdminUpdateUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/settings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.AdminUpdateSettingsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserSettings", null);
__decorate([
    (0, common_1.Post)('users/:id/reset-password'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.AdminResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('users/:id/notify'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.SendUserNotificationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "notifyUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('pairs'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.CreatePairDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createPair", null);
__decorate([
    (0, common_1.Patch)('pairs/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, admin_dto_1.UpdatePairDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePair", null);
__decorate([
    (0, common_1.Post)('notifications/broadcast'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.BroadcastNotificationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Get)('logs/admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminLogs", null);
__decorate([
    (0, common_1.Get)('logs/activity'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "activityLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map