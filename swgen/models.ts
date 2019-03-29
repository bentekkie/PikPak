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

export type IPicture = {
'creationDate': string
'tags'?: Array<ITag>
}

export type ITag = {
'value': string
'pictures'?: Array<IPicture>
}

export type IFeedResponse = {
'pictures': Array<IPicture>
'page'?: number
'pageSize'?: number
}

export type IFeedRequestBody = {
'page': number
'pageSize'?: number
'tags'?: Array<string>
}

export type IImageParams = {
'tags': Array<string>
}
