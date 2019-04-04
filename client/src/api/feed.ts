import { IUpvoteInfo } from "../objects";
import { IFeedRequestBody, IFeedResponse, IPicture, IVote, IPost } from "./model";
import { postData, fetchData, postForm } from "./utils";


export async function getPosts(page : number, pageSize: number) : Promise<{
    newPosts:IPost[],
    hasMore:boolean
}>{
    return postData('/api/feed',{
        page,
        pageSize,
    } as IFeedRequestBody).then((resp : IFeedResponse) => ({newPosts:resp.pictures,hasMore:resp.pictures.length === 0}))
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

export async function uploadImage(file : string | Blob, tags : string[]){
    const data = new FormData()

    data.append('imageFile',file)
    data.append('tags','~empty~')
    for(const tag of tags){
        data.append('tags',tag)
    }
    return postForm('/api/image/uploadFile',data)
}