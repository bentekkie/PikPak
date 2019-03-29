"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tsoa_1 = require("tsoa");
const express = require("express");
const multer = require("multer");
const picture_1 = require("../models/tables/picture");
const tag_1 = require("../models/tables/tag");
const fs_1 = require("fs");
const path = require("path");
const vote_1 = require("../models/tables/vote");
const sequelize_typescript_1 = require("sequelize-typescript");
const pathUtil_1 = require("../pathUtil");
let ImageController = class ImageController {
    vote(id, up, { user }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(user);
            const prevVote = yield vote_1.default.findOne({
                where: {
                    userId: user.user.id,
                    pictureId: id,
                }
            });
            if (prevVote) {
                if (prevVote.up !== up) {
                    prevVote.up = up;
                    prevVote.value = (up) ? 1 : -1;
                    yield prevVote.save();
                }
                else {
                    prevVote.destroy();
                }
                return picture_1.default.findByPk(id, {
                    include: [{
                            model: vote_1.default,
                            attributes: [[sequelize_typescript_1.Sequelize.fn('SUM', sequelize_typescript_1.Sequelize.col('votes.value')), 'up']]
                        }]
                });
            }
            const v = new vote_1.default({
                up,
                userId: user.user.id,
                pictureId: id,
                value: (up) ? 1 : -1
            });
            yield v.save();
            return picture_1.default.findByPk(id, {
                include: [{
                        model: vote_1.default,
                        attributes: [[sequelize_typescript_1.Sequelize.fn('SUM', sequelize_typescript_1.Sequelize.col('votes.value')), 'up']]
                    }]
            });
        });
    }
    getVotes({ user }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const v = yield vote_1.default.findAll({
                where: {
                    userId: user.user.id
                }
            });
            return v;
        });
    }
    uploadFile({ tags }, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.handleFile(request);
            const tagIds = [];
            for (const value of tags) {
                tagIds.push((yield tag_1.default.findOrCreate({
                    where: {
                        value
                    },
                    defaults: {
                        value
                    }
                }))[0]);
            }
            const p = new picture_1.default();
            p.$set('votes', []);
            p.$add('tag', tagIds);
            const file = request.files[0];
            const psaved = yield p.save();
            fs_1.writeFileSync(path.join(pathUtil_1.serverDir, 'images', `img${p.id}.jpeg`), file.buffer);
            // file will be in request.randomFileIsHere, it is a buffer
            return psaved;
        });
    }
    handleFile(request) {
        const multerSingle = multer().single('imageFile');
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, (error) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (error) {
                    reject(error);
                }
                resolve();
            }));
        });
    }
};
tslib_1.__decorate([
    tsoa_1.Get('vote'),
    tsoa_1.Security('JWT'),
    tslib_1.__param(0, tsoa_1.Query('id')), tslib_1.__param(1, tsoa_1.Query('up')), tslib_1.__param(2, tsoa_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Boolean, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageController.prototype, "vote", null);
tslib_1.__decorate([
    tsoa_1.Get('getVoteInfo'),
    tsoa_1.Security('JWT'),
    tslib_1.__param(0, tsoa_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageController.prototype, "getVotes", null);
tslib_1.__decorate([
    tsoa_1.Post('uploadFile'),
    tsoa_1.Security('JWT'),
    tslib_1.__param(0, tsoa_1.Body()), tslib_1.__param(1, tsoa_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageController.prototype, "uploadFile", null);
ImageController = tslib_1.__decorate([
    tsoa_1.Route('image')
], ImageController);
exports.ImageController = ImageController;
//# sourceMappingURL=imageController.js.map