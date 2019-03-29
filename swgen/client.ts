import {
  ILoginResponse,
  IErrorResponse,
  ILoginParams,
  IUserResponse,
  INewUserParams,
  IPicture,
  ITag,
  IFeedResponse,
  IFeedRequestBody,
  IImageParams 
} from './models'
export type PostAuthLoginBodyParameters = ILoginParams

export type PostAuthRegisterBodyParameters = INewUserParams

export type PostFeedBodyParameters = IFeedRequestBody

export type PostFeedHeaderParameters = {
'Authorization'?: any
}


export type PostImageUploadFileFormDataParameters = any & Array<string>

export type PostImageUploadFileHeaderParameters = {
'Authorization'?: any
}


export interface ApiResponse<T> extends Response {
  json (): Promise<T>
}
export type RequestFactoryType = (path: string, query: any, body: any, formData: any, headers: any, method: string, configuration: any) => Promise<ApiResponse<any>>

export class Api<T extends {domain:string}> {
  constructor(protected configuration: T, protected requestFactory: RequestFactoryType) {}
PostAuthLogin (body: PostAuthLoginBodyParameters): Promise<ApiResponse<ILoginResponse | IErrorResponse>> {
let path = '/auth/login'
return this.requestFactory(path, undefined, body, undefined, undefined, 'POST', this.configuration)
}

PostAuthRegister (body: PostAuthRegisterBodyParameters): Promise<ApiResponse<IUserResponse | IErrorResponse>> {
let path = '/auth/register'
return this.requestFactory(path, undefined, body, undefined, undefined, 'POST', this.configuration)
}

PostFeed (body: PostFeedBodyParameters, header: PostFeedHeaderParameters): Promise<ApiResponse<IFeedResponse>> {
let path = '/feed'
return this.requestFactory(path, undefined, body, undefined, header, 'POST', this.configuration)
}

GetVersion (): Promise<ApiResponse<void>> {
let path = '/version'
return this.requestFactory(path, undefined, undefined, undefined, undefined, 'GET', this.configuration)
}

PostImageUploadFile (formData: PostImageUploadFileFormDataParameters, header: PostImageUploadFileHeaderParameters): Promise<ApiResponse<void>> {
let path = '/image/uploadFile'
return this.requestFactory(path, undefined, undefined, formData, header, 'POST', this.configuration)
}
}
