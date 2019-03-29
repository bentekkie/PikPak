"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const tag_1 = require("./tag");
const picture_1 = require("./picture");
let PictureTag = class PictureTag extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.ForeignKey(() => picture_1.default),
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", Number)
], PictureTag.prototype, "pictureId", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.ForeignKey(() => tag_1.default),
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", Number)
], PictureTag.prototype, "tagId", void 0);
PictureTag = tslib_1.__decorate([
    sequelize_typescript_1.Table
], PictureTag);
exports.default = PictureTag;
//# sourceMappingURL=picturetag.js.map