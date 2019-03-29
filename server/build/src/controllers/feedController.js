"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tsoa_1 = require("tsoa");
const picture_1 = require("../models/tables/picture");
const vote_1 = require("../models/tables/vote");
const tag_1 = require("../models/tables/tag");
const sequelize_typescript_1 = require("sequelize-typescript");
let FeedController = class FeedController {
    search({ page, pageSize, tags }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (pageSize > 50)
                pageSize = 50;
            const pictures = yield ((!tags || tags.length === 0) ? picture_1.default.findAll({
                include: [{
                        model: vote_1.default,
                        attributes: ['value']
                    }],
                offset: page * pageSize,
                limit: pageSize,
                order: [['creationDate', 'DESC']],
            }) : picture_1.default.findAll({
                include: [
                    {
                        model: vote_1.default,
                        attributes: ['value']
                    },
                    {
                        model: tag_1.default,
                        where: {
                            value: {
                                [sequelize_typescript_1.Sequelize.Op.in]: tags
                            }
                        }
                    }
                ],
                offset: page * pageSize,
                limit: pageSize,
                order: [['creationDate', 'DESC']],
            }));
            return {
                pictures: pictures,
                page,
                pageSize
            };
        });
    }
};
tslib_1.__decorate([
    tsoa_1.Post(),
    tslib_1.__param(0, tsoa_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], FeedController.prototype, "search", null);
FeedController = tslib_1.__decorate([
    tsoa_1.Route('feed')
], FeedController);
exports.FeedController = FeedController;
//# sourceMappingURL=feedController.js.map