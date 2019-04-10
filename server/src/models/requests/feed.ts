export interface IFeedRequestBody {
    page: number
    pageSize: number,
    location: ILocationInfo
    tags?: string[]
}

export interface ILocationInfo {
    lat:number,
    lon:number
}


