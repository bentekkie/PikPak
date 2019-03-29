import { IPicture } from '../tables/picture';

export interface IFeedResponse {
    pictures:IPicture[]
    page: number,
    pageSize: number
}