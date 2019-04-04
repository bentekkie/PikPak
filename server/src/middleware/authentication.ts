import * as _passport from 'passport';
import {PassportStatic} from 'passport';
import {ExtractJwt, Strategy, StrategyOptions, VerifiedCallback} from 'passport-jwt';
import User from '../models/tables/user';
import { auth } from '../config';
import * as express from 'express';
import * as jwt from 'jsonwebtoken'
import { error } from 'util';

export const authenticateUser = (passport: PassportStatic) => {

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.JWT_SECRET || auth.jwt_secret
    };

    passport.use(new Strategy(options, (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
        
    }));
};

export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]) {
    if (securityName === 'JWT') {
        let token = request.body.token || request.query.token || request.headers['authorization'];
        if (token === undefined) {
            throw new Error("No token provided")
        }
        token = token.split(' ')[1]
        return new Promise((resolve,reject) => jwt.verify(token, auth.jwt_secret, async (err: any, decoded: any) => {
            if (err) {
                reject(err)
            } else {
                const result = await User.findByPk(decoded.user.id);
                if (!result) {
                    reject(new Error("Invalid User"));
                }
                else {
                    resolve(decoded);
                }
            }
        }));
    }
};

interface IJwtPayload {
    user?: User;
    iat?: Date;
}