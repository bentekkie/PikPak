"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tsoa_1 = require("tsoa");
let VersionController = class VersionController {
    version() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                version: "0.0.1"
            };
        });
    }
};
tslib_1.__decorate([
    tsoa_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VersionController.prototype, "version", null);
VersionController = tslib_1.__decorate([
    tsoa_1.Route('version')
], VersionController);
exports.VersionController = VersionController;
//# sourceMappingURL=versionController.js.map