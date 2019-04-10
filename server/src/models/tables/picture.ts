import { Table, Model, BelongsToMany, CreatedAt, Column, HasMany, Sequelize } from 'sequelize-typescript';
import Tag, { ITag } from './tag';
import PictureTag  from './picturetag';
import Vote, { IVote } from './vote';
import { NumberLiteralType } from 'typescript';


export interface IPicture {
    id?: number
    creationDate: Date;
    tags?: ITag[];
    votes: IVote[]
    data: Buffer,
    nsfwTags: string,
    lat: number,
    lon: number
}

@Table
export default class Picture extends Model<Picture> implements IPicture {
    @CreatedAt
    creationDate: Date;

    @BelongsToMany(() => Tag, () => PictureTag)
    tags: Tag[];

    @HasMany(() => Vote)
    votes: Vote[]

    @Column
    data: Buffer

    @Column
    nsfwTags: string

    @Column
    lat: number

    @Column
    lon: number
}