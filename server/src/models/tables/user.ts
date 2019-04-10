import {Table, Column, Model, HasMany, Unique} from 'sequelize-typescript';



export interface IUser {
    username: string;
    password?: string
    nsfwtags: string
    id?: number;
}

@Table
export default class User extends Model<User> implements IUser{
    
    @Unique
    @Column
    username: string

    @Column
    password: string

    @Column
    nsfwtags: string
}