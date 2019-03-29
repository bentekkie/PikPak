import { Route, Post, Query, Body, Tags, Security } from 'tsoa';
import { IFeedRequestBody } from '../models/requests/feed';
import Picture from '../models/tables/picture';
import Vote from '../models/tables/vote'
import { IFeedResponse } from '../models/responses/IFeedResponse';
import Tag from '../models/tables/tag';
import {Sequelize,} from 'sequelize-typescript';


@Route('feed')
export class FeedController {
    
    @Post()
    public async search(@Body() { page, pageSize, tags }: IFeedRequestBody): Promise<IFeedResponse> {
        if (pageSize > 50) pageSize = 50
        const pictures = await ((!tags || tags.length === 0) ? Picture.findAll({
            include: [{
                model: Vote,
                attributes:['value']
            }],
            offset: page * pageSize,
            limit: pageSize,
            order: [['creationDate', 'DESC']],
        }) : Picture.findAll({
            include: [
                {
                    model: Vote,
                    attributes:['value']
                },
                {
                    model: Tag,
                    where: {
                        value: {
                            [Sequelize.Op.in]: tags
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
        }
    }
}