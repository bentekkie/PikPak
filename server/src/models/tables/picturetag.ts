import {Table, Column, Model, HasMany, Unique, ForeignKey} from 'sequelize-typescript';
import Tag from './tag';
import Picture from './picture';


@Table
export default class PictureTag extends Model<Tag> {
    @ForeignKey(() => Picture)
    @Column
    pictureId: number;
   
    @ForeignKey(() => Tag)
    @Column
    tagId: number;
}