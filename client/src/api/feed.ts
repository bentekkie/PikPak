import { IPost, IUpvoteInfo } from "../../../common/objects";
const tags = "Duis sit amet nibh accumsan efficitur justo vitae iaculis libero Morbi suscipit ligula ut metus commodo iaculis Donec ut risus eget lectus finibus rutrum vel at est Suspendisse sed venenatis magna Praesent eget mi massa Etiam at pulvinar nisi luctus mollis leo Class aptent taciti sociosqu ad litora torquent per conubia nostra per inceptos himenaeos Morbi non tempus lacus ut lacinia quam Mauris venenatis eros sollicitudin tempor molestie leo tellus suscipit odio elementum aliquam erat tellus eu ex".split(" ")

let posts : IPost[] = []


function initPosts(){
    for(let i = 0; i < 100 ; i++){
        posts.push({
        id: "post"+i,
        pictureID:"picture"+i,
        authorID:"author"+(i % 2),
        nsfwTags: [],
        tags:tags.filter(() => Math.random() <= 0.1).slice(0,5),
        votes:0
    })
    }
}



export async function getPosts(last :number) : Promise<[IPost[],boolean]>{
    if(posts.length === 0){
        initPosts()
    }
    return [posts.slice(last,last+10),last+20 < posts.length]
    /* When backend is implemented
    return fetch("/api/posts")
      .then(res => res.json())
      */
}

const upvoteInfo = {
        upvotes:["post1","post3"],
        downvotes:["post2","post7"]
    }
    
export async function upvote(postID:string) : Promise<IPost>{
    let i = upvoteInfo.upvotes.indexOf(postID);
    if(i > -1){
        upvoteInfo.upvotes.splice(i,1)
    }else{
        i = upvoteInfo.downvotes.indexOf(postID);
        if(i > -1){
            upvoteInfo.downvotes.splice(i,1)
        }
        upvoteInfo.upvotes.push(postID)
    }
    i = posts.findIndex(({id}) => id === postID)
    posts[i].votes = (postID in upvoteInfo.upvotes)?1:(postID in upvoteInfo.downvotes)?-1:0
    return posts[i]
}

export async function downvote(postID:string) : Promise<IPost>{
    let i = upvoteInfo.downvotes.indexOf(postID);
    if(i > -1){
        upvoteInfo.downvotes.splice(i,1)
    }else{
        i = upvoteInfo.upvotes.indexOf(postID);
        if(i > -1){
            upvoteInfo.upvotes.splice(i,1)
        }
        upvoteInfo.downvotes.push(postID)
    }
    i = posts.findIndex(({id}) => id === postID)
    posts[i].votes = (postID in upvoteInfo.upvotes)?1:(postID in upvoteInfo.downvotes)?-1:0
    return posts[i]
}

export async function getUpvoteInfo() : Promise<IUpvoteInfo>{
    return upvoteInfo
}