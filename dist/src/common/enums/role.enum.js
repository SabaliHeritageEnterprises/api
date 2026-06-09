"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_RANK = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
exports.ROLE_RANK = {
    [Role.USER]: 1,
    [Role.ADMIN]: 2,
    [Role.SUPER_ADMIN]: 3,
};
//# sourceMappingURL=role.enum.js.map