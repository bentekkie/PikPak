import { IPost, IUpvoteInfo } from "../objects";
import { IFeedRequestBody, IFeedResponse, IPicture, IVote } from "./model";
import { postData, fetchData, postForm } from "./utils";


export async function getPosts(page : number, pageSize: number) : Promise<[IPost[],boolean]>{
    let resp : IFeedResponse = await postData('/api/feed',{
        page,
        pageSize,
    } as IFeedRequestBody)
    if(resp.pictures.length === 0){
        return [[],false]
    }
    let p : IPost[] = resp.pictures.map(p => ({
        id:`${p.id}`,
        pictureID:`img${p.id}`,
        votes:(p.votes)?p.votes.map(v => v.value as number).reduce((a,b) => a+b,0):0,
        nsfwTags:[],
        tags:(p.tags)?p.tags.map(t => t.value):[]
    }))
    return [p,true]
}

    
export async function upvote(postID:string) : Promise<IPost>{
    return fetchData(`/api/image/vote?id=${postID}&up=true`).then((p : IPicture) => ({
            id:`${p.id}`,
            pictureID:`img${p.id}`,
            votes:(p.votes)?p.votes.map(v => v.value as number).reduce((a,b) => a+b,0):0,
            nsfwTags:[],
            tags:(p.tags)?p.tags.map(t => t.value):[]
        }))
}

export async function downvote(postID:string) : Promise<IPost>{
    return fetchData(`/api/image/vote?id=${postID}&up=false`).then((p : IPicture) => ({
        id:`${p.id}`,
        pictureID:`img${p.id}`,
        votes:(p.votes)?p.votes.map(v => v.value as number).reduce((a,b) => a+b,0):0,
        nsfwTags:[],
        tags:(p.tags)?p.tags.map(t => t.value):[]
    }))
}

export async function getUpvoteInfo() : Promise<IUpvoteInfo>{
    return fetchData(`/api/image/getVoteInfo`).then((votes : IVote[]) => ({
            upvotes:votes.filter(v => v.up).map(v => `${v.pictureId}`),
            downvotes:votes.filter(v => !v.up).map(v => `${v.pictureId}`)
        }))
}

export async function uploadImage(file : string | Blob, tags : string[]){
    const data = new FormData()

    data.append('imageFile',file)
    for(const tag of tags){
        data.append('tags',tag)
    }
    return postForm('/api/image/uploadFile',data)
}