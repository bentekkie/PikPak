import { Route, Post, Query, Body, Tags, Security, Get } from 'tsoa';
import { IFeedRequestBody } from '../models/requests/feed';
import Picture from '../models/tables/picture';
import Vote from '../models/tables/vote'
import { IFeedResponse, IPost } from '../models/responses/IFeedResponse';
import Tag,{ITag} from '../models/tables/tag';
import {Sequelize} from 'sequelize-typescript';
import { parsePoint, parseCoords } from '../common/utils';


@Route('feed')
export class FeedController {
    
    @Get('tags')
    public async getTags() : Promise<ITag[]>{
        const tags : ITag[]= await Tag.findAll()
        return tags
    }


    @Post()
    public async search(@Body() { page, pageSize, tags, location }: IFeedRequestBody): Promise<IFeedResponse> {
        if (pageSize > 50) pageSize = 50
        console.log(page)
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate()-1)
        const distance = Sequelize.literal(`(6371 * acos ( cos ( radians(${location.lat}) ) * cos( radians( \`Picture\`.\`lat\` ) )* cos( radians( \`Picture\`.\`lon\` ) - radians(${location.lon}) ) + sin ( radians(${location.lat}) ) * sin( radians( \`Picture\`.\`lat\` ) ) ) )`)
        const pictures = await ((!tags || tags.length === 0) ? Picture.findAll({
             include: [{
                model: Vote,
                attributes:['value']
            },
            {
                model: Tag
            }],
            where:{
                creationDate:{
                    $gt:yesterday
                },
                $and:Sequelize.where(distance,'<',10)
            },
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
            where:{
                creationDate:{
                    $gt:yesterday
                },
                $and:Sequelize.where(distance,'<',10)
            },
            offset: page * pageSize,
            limit: pageSize,
            order: [['creationDate', 'DESC']],
        }));
        const posts : IPost[] = []
        for(const p of pictures){
            const tags : ITag[] = (await p.$get("tags")) as any as  ITag[]
            console.log((p as any).distance)
            posts.push({
                id:`${p.id}`,
                pictureID:`img${p.id}`,
                votes:(p.votes)?p.votes.map(v => v.value as number).reduce((a,b) => a+b,0):0,
                nsfwTags:p.nsfwTags.split(','),
                tags:(tags)?tags.map(t => t.value):[],
                coordinates:{
                    lat:p.lat,
                    lon:p.lon
                }
            })
        }
        return {
            pictures: posts,
            page,
            pageSize
        }
    }
}