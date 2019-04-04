export type ILoginResponse = {
'authToken': string
'username'?: string
'id'?: number
}

export type IErrorResponse = {
'thrown'?: boolean
'error'?: void
'message'?: string
}

export type ILoginParams = {
'username': string
'password'?: string
}

export type IUserResponse = {
'username': string
'id'?: number
}

export type INewUserParams = {
'username': string
'password'?: string
}

export type IPost = {
'id': string
'pictureID'?: string
'nsfwTags'?: Array<string>
'tags'?: Array<string>
'votes'?: number
}

export type IFeedResponse = {
'pictures': Array<IPost>
'page'?: number
'pageSize'?: number
}

export type IFeedRequestBody = {
'page': number
'pageSize'?: number
'tags'?: Array<string>
}

export type IPicture = {
'id'?: number
'creationDate': string
'tags'?: Array<ITag>
'votes'?: Array<IVote>
'data'?: string
}

export type ITag = {
'_id'?: number
'value': string
'pictures'?: Array<IPicture>
}

export type IVote = {
'id'?: number
'up': boolean
'picture'?: IPicture
'value'?: number
'pictureId'?: number
'user'?: IUser
'userId'?: number
}

export type IUser = {
'username': string
'password'?: string
'id'?: number
}

export type IImageParams = {
'tags': Array<string>
}
