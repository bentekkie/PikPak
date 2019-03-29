"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../models/tables/user");
const config_1 = require("../config");
const jwt = require("jsonwebtoken");
exports.authenticateUser = (passport) => {
    const options = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.JWT_SECRET || config_1.auth.jwt_secret
    };
    passport.use(new passport_jwt_1.Strategy(options, (jwtPayload, done) => {
    }));
};
function expressAuthentication(request, securityName, scopes) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(securityName);
        if (securityName === 'JWT') {
            let token = request.body.token || request.query.token || request.headers['authorization'];
            if (token === undefined) {
                throw new Error("No token provided");
            }
            token = token.split(' ')[1];
            return new Promise((resolve, reject) => jwt.verify(token, config_1.auth.jwt_secret, (err, decoded) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                console.log('a');
                if (err) {
                    reject(err);
                }
                else {
                    const result = yield user_1.default.findByPk(decoded.user.id);
                    if (!result) {
                        reject(new Error("Invalid User"));
                    }
                    else {
                        console.log(decoded);
                        resolve(decoded);
                    }
                }
            })));
        }
    });
}
exports.expressAuthentication = expressAuthentication;
;
//# sourceMappingURL=authentication.js.map