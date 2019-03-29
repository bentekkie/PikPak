import { Get, Route, Security, Response, Request, Post, Body, Query } from 'tsoa';
import * as express from 'express';
import * as multer from 'multer';
import Picture, { IPicture } from '../models/tables/picture';
import { IImageParams } from '../models/params/IImageParams';
import Tag from '../models/tables/tag';
import {writeFileSync} from 'fs'
import * as path from 'path'
import Vote, { IVote } from '../models/tables/vote';
import { Sequelize } from 'sequelize-typescript';
import { serverDir } from '../pathUtil';

@Route('image')
export class ImageController {



    @Get('vote')
    @Security('JWT')
    public async vote(@Query('id') id : number, @Query('up') up : boolean, @Request() {user}: express.Request) : Promise<IPicture>{
        console.log(user)
        const prevVote = await Vote.findOne({
            where:{
                userId: user.user.id,
                pictureId: id,
            }
        })
        if(prevVote){
            if(prevVote.up !== up){
                prevVote.up = up
                prevVote.value = (up)?1:-1
                await prevVote.save()
            }else{
                prevVote.destroy()
            }
            return Picture.findByPk(id,{
                include: [{
                    model: Vote,
                    attributes:[[Sequelize.fn('SUM',Sequelize.col('votes.value')),'up']]
                }]
            })
        }
        const v = new Vote({
            up,
            userId:user.user.id,
            pictureId:id,
            value:(up)?1:-1
        })

        await v.save()
        return Picture.findByPk(id,{
            include: [{
                model: Vote,
                attributes:[[Sequelize.fn('SUM',Sequelize.col('votes.value')),'up']]
            }]
        })
    }

    @Get('getVoteInfo')
    @Security('JWT')
    public async getVotes(@Request() {user}: express.Request){
        const v : IVote[] = await Vote.findAll({
            where:{
                userId:user.user.id
            }
        })
        return v
    }

    @Post('uploadFile')
    @Security('JWT')
    public async uploadFile(@Body() {tags} : IImageParams, @Request() request: express.Request): Promise<IPicture> {
        await this.handleFile(request);
        const tagIds : Tag[] = []
        for(const value of tags){
            tagIds.push((await Tag.findOrCreate({
                where: {
                    value
                },
                defaults:{
                    value
                }
            }))[0])
        }
        const p = new Picture()
        p.$set('votes',[])
        p.$add('tag',tagIds)
        const file = request.files[0]
        const psaved = await p.save()
        writeFileSync(path.join(serverDir,'images',`img${p.id}.jpeg`),file.buffer)
        // file will be in request.randomFileIsHere, it is a buffer
        return psaved
    }
    
    private handleFile(request: express.Request): Promise<any> {
        const multerSingle = multer().single('imageFile');
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, async (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
}