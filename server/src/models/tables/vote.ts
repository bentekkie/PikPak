import {Table, Column, Model, HasMany, Unique, BelongsToMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import Picture, { IPicture } from './picture';
import User, { IUser } from './user'
import PictureTag from './picturetag';

export interface IVote {
    id?: number
    up: boolean,
    picture: IPicture,
    value: number
    pictureId: number,
    user: IUser,
    userId: number
}

@Table
export default class Vote extends Model<Vote> implements IVote{
    @Column
    up: boolean

    @Column
    value: number

    @ForeignKey(() => Picture)
    @Column
    pictureId: number

    @BelongsTo(() => Picture)
    picture: Picture;

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User;
}