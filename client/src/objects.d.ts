
type NsfwTag = "nudity"|"gore"

export interface IUser {
    id:string
    username: string
    password: string
    isHashed: boolean
}

export interface IPost{
    id:string,
    pictureID:string,
    nsfwTags:string[],
    tags:string[],
    votes:number
}

export interface IUpvoteInfo{
    upvotes:string[],
    downvotes:string[]
}

export interface IUserSettings {
    user: Partial<IUser>
    nsfwTags: NsfwTag[]
}
