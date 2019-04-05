import { Get, Route, Security, Request, Post, Body, Query } from 'tsoa';
import * as express from 'express';
import * as multer from 'multer';
import Picture, { IPicture } from '../models/tables/picture';
import { IImageParams } from '../models/params/IImageParams';
import Tag from '../models/tables/tag';
import Vote, { IVote } from '../models/tables/vote';
import { Sequelize } from 'sequelize-typescript';
import { IPost } from '../models/responses/IFeedResponse';
import * as request from 'request-promise-native'
import {promisify} from 'util'
import {createReadStream} from 'fs'
import * as FormData from 'form-data'
import fetch from 'node-fetch'
import { picpurify } from '../config'
import { Duplex } from 'stream';
import {arrayBufferToBlob} from 'blob-util'

@Route('image')
export class ImageController {


    @Get('imageFile/{fileId}.jpeg')
    public async getAttachment(@Request() request: express.Request,
        fileId: string) {
        const response = (<any>request).res as express.Response;
        const pic = await Picture.findByPk(fileId)
        if (pic) {
            response.end(pic.data);
        }
        return null;
    }

    @Get('vote')
    @Security('JWT')
    public async vote(@Query('id') id: number, @Query('up') up: boolean, @Request() { user }: express.Request): Promise<IPost> {
        const prevVote = await Vote.findOne({
            where: {
                userId: user.user.id,
                pictureId: id,
            }
        })
        if (prevVote) {
            if (prevVote.up !== up) {
                prevVote.up = up
                prevVote.value = (up) ? 1 : -1
                await prevVote.save()
            } else {
                prevVote.destroy()
            }
            const p = await Picture.findByPk(id, {
                include: [{
                    model: Vote,
                    attributes: ['value']
                },
                {
                    model: Tag
                }
                ]
            })
            return {
                id: `${p.id}`,
                pictureID: `img${p.id}`,
                votes: (p.votes) ? p.votes.map(v => v.value as number).reduce((a, b) => a + b, 0) : 0,
                nsfwTags: [],
                tags: (p.tags) ? p.tags.map(t => t.value) : []
            }
        }
        const v = new Vote({
            up,
            userId: user.user.id,
            pictureId: id,
            value: (up) ? 1 : -1
        })

        await v.save()
        const p = await Picture.findByPk(id, {
            include: [{
                model: Vote,
                attributes: ['value']
            },
            {
                model: Tag
            }
            ]
        })
        return {
            id: `${p.id}`,
            pictureID: `img${p.id}`,
            votes: (p.votes) ? p.votes.map(v => v.value as number).reduce((a, b) => a + b, 0) : 0,
            nsfwTags: p.nsfwTags.split(','),
            tags: (p.tags) ? p.tags.map(t => t.value) : []
        }
    }

    @Get('getVoteInfo')
    @Security('JWT')
    public async getVotes(@Request() { user }: express.Request) {
        const v: IVote[] = await Vote.findAll({
            where: {
                userId: user.user.id
            }
        })
        return v
    }

    @Post('uploadFile')
    @Security('JWT')
    public async uploadFile(@Request() req: express.Request, @Body() { tags }: IImageParams, ): Promise<IPost> {
        await this.handleFile(req);
        const tagIds: Tag[] = []
        for (const value of tags.slice(1)) {
            try {
                tagIds.push((await Tag.findOrCreate({
                    where: {
                        value
                    },
                    defaults: {
                        value,
                        pictures: []
                    }
                }))[0])
            } catch (error) {
                console.error(error)
            }

        }

        const p = new Picture()
        p.data = req.files[0].buffer
        var imagePath = '/path/to/local/file.jpg'
        let nsfwTags : string[] = []
        try{
            const formData = new FormData()
            formData.append('file_image',p.data,{
                knownLength:req.files[0].size,
                contentType:req.files[0].mimetype,
                filename:'image.jpg'
            })
            formData.append('API_KEY',picpurify.api_key)
            formData.append('task',"porn_detection,drug_detection,gore_detection")
            formData.append('origin_id','xxxxxx')
            formData.append('reference_id','xxxxxx')
            //const body = await request.post({ url: picpurify.url, formData , json:true });
            const body = await fetch(picpurify.url,{method:"POST",body: formData as any}).then(res => res.json())
            console.log(body)
            if(body.status === "success"){
                for(let tag of ['porn','drug','gore']){
                    if(body[`${tag}_detection`][`${tag}_content`]){
                        nsfwTags.push(tag)
                    }
                }
            }
        }catch(e){
            console.log(e)
        }
        //
        p.nsfwTags = nsfwTags.join(',')
        const psaved = await p.save()
        await psaved.$set('votes', [])
        await psaved.$add('tag', tagIds)
        // file will be in request.randomFileIsHere, it is a buffer
        return {
            id: `${psaved.id}`,
            pictureID: `img${psaved.id}`,
            votes: (psaved.votes) ? psaved.votes.map(v => v.value as number).reduce((a, b) => a + b, 0) : 0,
            nsfwTags:psaved.nsfwTags.split(','),
            tags: (psaved.tags) ? psaved.tags.map(t => t.value) : []
        }
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

    private bufferToStream(b : Buffer){
        const s = new Duplex();
        s.push(b)
        s.push(null)
        return s
    }
}