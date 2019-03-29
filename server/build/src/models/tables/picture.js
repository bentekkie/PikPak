"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const tag_1 = require("./tag");
const picturetag_1 = require("./picturetag");
const vote_1 = require("./vote");
let Picture = class Picture extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.CreatedAt,
    tslib_1.__metadata("design:type", Date)
], Picture.prototype, "creationDate", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.BelongsToMany(() => tag_1.default, () => picturetag_1.default),
    tslib_1.__metadata("design:type", Array)
], Picture.prototype, "tags", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.HasMany(() => vote_1.default),
    tslib_1.__metadata("design:type", Array)
], Picture.prototype, "votes", void 0);
Picture = tslib_1.__decorate([
    sequelize_typescript_1.Table
], Picture);
exports.default = Picture;
//# sourceMappingURL=picture.js.map