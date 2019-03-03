
type NsfwTag = "nudity"|"gore"

export interface IUser {
    id:string
    username: string
    password: string
    isHashed: boolean
}

export interface IPost {
    id:string
    authorID: string
    pictureID: string
    tags: string[]
    nsfwTags: NsfwTag[]
    votes: number
}

export interface IUpvoteInfo{
    upvotes:string[],
    downvotes:string[]
}

export interface IUserSettings {
    user: Partial<IUser>
    nsfwTags: NsfwTag[]
}
