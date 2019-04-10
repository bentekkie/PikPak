import {compare, genSalt, hash} from 'bcryptjs';
import { Route, Get, Query, Body, Response, Request, Tags, Post, Security } from 'tsoa';
import { ILoginParams } from '../models/params/ILoginParams';
import User, { IUser } from '../models/tables/user'
import { IErrorResponse, throwError } from '../models/responses/IErrorResponse';
import { ILoginResponse } from '../models/responses/ILoginResponse';
import {sign} from 'jsonwebtoken';
import { auth } from '../config';
import { INewUserParams } from '../models/params/INewUserParams';
import { IUserResponse } from '../models/responses/IUserResponse';
import express = require('express');
@Route('auth')
export class AuthController {
        /**
     * Login user
     *
     * @param {ILoginParams} loginParams Parameters to login
     * @returns {Promise<ILoginResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ILoginResponse>('200', 'Success')
    @Tags('Auth')
    @Post('login')
    public async login(@Body() loginParams: ILoginParams): Promise<ILoginResponse> {
        const username: string = loginParams.username;;
        const password: string = loginParams.password;
        const fetchedUser = await User.findOne({
            where:{
                username
            }
        })
        if (!fetchedUser || fetchedUser === null) throwError({message:'Does not exist'});

        const isMatched: boolean = await compare(password, fetchedUser.password);

        if (!isMatched) throwError({message:'Password does not match'});

        const payload = {user: fetchedUser};
        const token: string = sign(payload, process.env.JWT_SECRET || auth.jwt_secret, {expiresIn: 1800});

        if (!token) throwError({message:'Error signing payload'});

        try {
            const result = await fetchedUser.save();
            return {
                authToken: `JWT ${token}`,
                id: fetchedUser.id,
                username: fetchedUser.username
            };
        } catch (error) {
            throwError({error,message:"Validation Error"})
        }
    }

        /**
     * Register new user
     *
     * @param {INewUserParams} requestBody Parameters to register new user
     * @returns {Promise<IUserResponse>}
     */
    @Response<IErrorResponse>('default', 'Error occurred')
    @Response<IUserResponse>('200', 'Success')
    @Tags('Auth')
    @Post('register')
    public async registerUser(@Body() requestBody: INewUserParams): Promise<IUserResponse> {
        const username: string = requestBody.username;
        const password: string = requestBody.password;
        
        const existUser: User = await User.findOne({
                                                        where:{
                                                            username
                                                        }
                                                    })
        console.log("Test")
        if (existUser) throwError({message:'Email or Username already existed.'});

        const newUser: User = new User();
        newUser.username = username;
        newUser.nsfwtags = ""
        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);
        try{
            return newUser.save().then(({username,id,nsfwtags}) => ({
                username,
                id:newUser.id,
                nsfwtags: newUser.nsfwtags
            }))
        }catch(error){
            throwError({error,message:"Validation Error"})
        }
    }

    @Response<IErrorResponse>('default', 'Error occurred')
    @Response<IUserResponse>('200', 'Success')
    @Tags('Auth')
    @Get()
    @Security('JWT')
    public async currentUser(@Request() request: any): Promise<IUserResponse> {
        return User.findByPk(request.user.user.id).then(({username,id,nsfwtags}) => ({
            username,
            id,
            nsfwtags
        }))
    }

    @Post('update')
    @Security('JWT')
    public async updateUser(@Request() request: any, @Body() user : Partial<IUser>) : Promise<IUserResponse>{
        let dbuser = await User.findByPk(request.user.user.id)
        console.log(user)
        if(dbuser){
            let update : Partial<IUser> = {}
            if(user.nsfwtags !== undefined){
                update.nsfwtags = user.nsfwtags
            }
            if(user.password !== undefined){
                const salt = await genSalt(10)
                update.password = await hash(user.password,salt)
            }
            return dbuser.update(update).then(({username,id,nsfwtags}) => ({
                username,
                id,
                nsfwtags
            }))                
        } else {
            throwError({
                message:"Could not save to db"
            })
        }
    }
}