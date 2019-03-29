"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const picture_1 = require("./picture");
const picturetag_1 = require("./picturetag");
let Tag = class Tag extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", String)
], Tag.prototype, "value", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.BelongsToMany(() => picture_1.default, () => picturetag_1.default),
    tslib_1.__metadata("design:type", Array)
], Tag.prototype, "pictures", void 0);
Tag = tslib_1.__decorate([
    sequelize_typescript_1.Table
], Tag);
exports.default = Tag;
//# sourceMappingURL=tag.js.map