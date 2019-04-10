import { IUpvoteInfo } from "../objects";
import { IFeedRequestBody, IFeedResponse, IPicture, IVote, IPost, ITag } from "./model";
import { postData, fetchData, postForm } from "./utils";
import { async } from "q";


export async function getTags() : Promise<ITag[]>{
    return fetchData('/api/feed/tags')
}

export async function getPosts(page : number, pageSize: number, coords: Coordinates,tags?: string[]) : Promise<{
    newPosts:IPost[],
    hasMore:boolean
}>{
    if(tags){
        return postData('/api/feed',{
            page,
            pageSize,
            tags,
            location:{
                lat:coords.latitude,
                lon:coords.longitude
            }
        } as IFeedRequestBody).then((resp : IFeedResponse) => ({newPosts:resp.pictures,hasMore:resp.pictures.length === 0}))
    }else{
        return postData('/api/feed',{
            page,
            pageSize,
            location:{
                lat:coords.latitude,
                lon:coords.longitude
            }
        } as IFeedRequestBody).then((resp : IFeedResponse) => ({newPosts:resp.pictures,hasMore:resp.pictures.length === 0}))
    }
}

    
export async function upvote(postID:string) : Promise<IPost>{
    return fetchData(`/api/image/vote?id=${postID}&up=true`)
}

export async function downvote(postID:string) : Promise<IPost>{
    return fetchData(`/api/image/vote?id=${postID}&up=false`)
}

export async function getUpvoteInfo() : Promise<IUpvoteInfo>{
    return fetchData(`/api/image/getVoteInfo`).then((votes : IVote[]) => ({
            upvotes:votes.filter(v => v.up).map(v => `${v.pictureId}`),
            downvotes:votes.filter(v => !v.up).map(v => `${v.pictureId}`)
        }))
}

export async function uploadImage(file : string | Blob, tags : string[],{latitude,longitude}: Coordinates){
    const data = new FormData()

    data.append('imageFile',file)
    data.append('tags','~empty~')
    const tmp = {
        latitude,
        longitude
    }
    console.log(JSON.stringify(tmp))
    data.append('coords',JSON.stringify(tmp))
    for(const tag of tags){
        data.append('tags',tag)
    }
    return postForm('/api/image/uploadFile',data)
}


// API key: 