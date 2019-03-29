import {Table, Column, Model, HasMany, Unique, BelongsToMany} from 'sequelize-typescript';
import Picture, { IPicture } from './picture';
import PictureTag from './picturetag';

export interface ITag {
    _id?: number
    value: String,
    pictures?: IPicture[]
}

@Table
export default class Tag extends Model<Tag> implements ITag{
    @Column
    value: string
    @BelongsToMany(() => Picture, () => PictureTag)
    pictures: Picture[];
}