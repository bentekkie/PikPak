import { Route, Post, Query, Body, Tags, Security, Get } from 'tsoa';
import { IFeedRequestBody } from '../models/requests/feed';
import Picture from '../models/tables/picture';
import Vote from '../models/tables/vote'
import { IFeedResponse } from '../models/responses/IFeedResponse';
import Tag,{ITag} from '../models/tables/tag';
import {Sequelize,} from 'sequelize-typescript';


@Route('feed')
export class FeedController {
    
    @Get('tags')
    public async getTags() : Promise<ITag[]>{
        const tags : ITag[]= await Tag.findAll()
        return tags
    }


    @Post()
    public async search(@Body() { page, pageSize, tags }: IFeedRequestBody): Promise<IFeedResponse> {
        if (pageSize > 50) pageSize = 50
        console.log(page)
        const pictures = await ((!tags || tags.length === 0) ? Picture.findAll({
             include: [{
                model: Vote,
                attributes:['value']
            },
            {
                model: Tag
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
            pictures: pictures.map(p => ({
                    id:`${p.id}`,
                    pictureID:`img${p.id}`,
                    votes:(p.votes)?p.votes.map(v => v.value as number).reduce((a,b) => a+b,0):0,
                    nsfwTags:p.nsfwTags.split(','),
                    tags:(p.tags)?p.tags.map(t => t.value):[]
            })),
            page,
            pageSize
        }
    }
}