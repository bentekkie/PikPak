import { IPicture } from '../tables/picture';

export interface IFeedResponse {
    pictures:IPost[]
    page: number,
    pageSize: number
}

export interface IPost{
    id:string,
    pictureID:string,
    nsfwTags:string[],
    tags:string[],
    votes:number
}
