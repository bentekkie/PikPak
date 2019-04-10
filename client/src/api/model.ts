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
'nsfwtags'?: string
}

export type INewUserParams = {
'username': string
'password'?: string
}

export type PartialIUser = void

export type ITag = {
'id'?: number
'value': string
'pictures'?: Array<IPicture>
}

export type IPicture = {
'id'?: number
'creationDate': string
'tags'?: Array<ITag>
'votes'?: Array<IVote>
'data'?: string
'nsfwTags'?: string
'location'?: void
}

export type IUser = {
'username': string
'password'?: string
'nsfwtags'?: string
'id'?: number
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

export type IPost = {
'id': string
'pictureID'?: string
'nsfwTags'?: Array<string>
'tags'?: Array<string>
'votes'?: number
'coordinates'?: void
}

export type IFeedResponse = {
'pictures': Array<IPost>
'page'?: number
'pageSize'?: number
}

export type ILocationInfo = {
'lat': number
'lon'?: number
}

export type IFeedRequestBody = {
'page': number
'pageSize'?: number
'location'?: ILocationInfo
'tags'?: Array<string>
}

export type IImageParams = {
'tags': Array<string>
'coords'?: string
}
