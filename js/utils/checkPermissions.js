"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
async function checkPermissions(command, message) {
    const member = await message.guild.members.fetch({ user: message.client.user.id });
    const requiredPermissions = command.permissions;
    if (!command.permissions)
        return { result: true };
    const missing = member.permissions.missing(requiredPermissions);
    if (missing.length) {
        return { result: false, missing: missing };
    }
    return { result: true };
}
exports.checkPermissions = checkPermissions;
//# sourceMappingURL=checkPermissions.js.map