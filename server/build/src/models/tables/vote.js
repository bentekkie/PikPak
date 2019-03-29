"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const picture_1 = require("./picture");
const user_1 = require("./user");
let Vote = class Vote extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", Boolean)
], Vote.prototype, "up", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", Number)
], Vote.prototype, "value", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.ForeignKey(() => picture_1.default),
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", Number)
], Vote.prototype, "pictureId", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.BelongsTo(() => picture_1.default),
    tslib_1.__metadata("design:type", picture_1.default)
], Vote.prototype, "picture", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", Number)
], Vote.prototype, "userId", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default),
    tslib_1.__metadata("design:type", user_1.default)
], Vote.prototype, "user", void 0);
Vote = tslib_1.__decorate([
    sequelize_typescript_1.Table
], Vote);
exports.default = Vote;
//# sourceMappingURL=vote.js.map