"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcryptjs_1 = require("bcryptjs");
const tsoa_1 = require("tsoa");
const user_1 = require("../models/tables/user");
const IErrorResponse_1 = require("../models/responses/IErrorResponse");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
let AuthController = class AuthController {
    /**
 * Login user
 *
 * @param {ILoginParams} loginParams Parameters to login
 * @returns {Promise<ILoginResponse>}
 */
    login(loginParams) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const username = loginParams.username;
            ;
            const password = loginParams.password;
            const fetchedUser = yield user_1.default.findOne({
                where: {
                    username
                }
            });
            if (!fetchedUser || fetchedUser === null)
                IErrorResponse_1.throwError({ message: 'Does not exist' });
            const isMatched = yield bcryptjs_1.compare(password, fetchedUser.password);
            if (!isMatched)
                IErrorResponse_1.throwError({ message: 'Password does not match' });
            const payload = { user: fetchedUser };
            const token = jsonwebtoken_1.sign(payload, process.env.JWT_SECRET || config_1.auth.jwt_secret, { expiresIn: 1800 });
            if (!token)
                IErrorResponse_1.throwError({ message: 'Error signing payload' });
            try {
                const result = yield fetchedUser.save();
                return {
                    authToken: `JWT ${token}`,
                    id: fetchedUser.id,
                    username: fetchedUser.username
                };
            }
            catch (error) {
                IErrorResponse_1.throwError({ error, message: "Validation Error" });
            }
        });
    }
    /**
 * Register new user
 *
 * @param {INewUserParams} requestBody Parameters to register new user
 * @returns {Promise<IUserResponse>}
 */
    registerUser(requestBody) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const username = requestBody.username;
            const password = requestBody.password;
            const existUser = yield user_1.default.findOne({
                where: {
                    username
                }
            });
            console.log("Test");
            if (existUser)
                IErrorResponse_1.throwError({ message: 'Email or Username already existed.' });
            const newUser = new user_1.default();
            newUser.username = username;
            const salt = yield bcryptjs_1.genSalt(10);
            newUser.password = yield bcryptjs_1.hash(password, salt);
            try {
                yield newUser.save();
                return {
                    username,
                    id: newUser.id
                };
            }
            catch (error) {
                IErrorResponse_1.throwError({ error, message: "Validation Error" });
            }
        });
    }
    currentUser(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(request.user);
            return {
                username: request.user.user.username,
                id: request.user.user.id
            };
        });
    }
};
tslib_1.__decorate([
    tsoa_1.Response('default', 'Error Occurred'),
    tsoa_1.Response('200', 'Success'),
    tsoa_1.Tags('Auth'),
    tsoa_1.Post('login'),
    tslib_1.__param(0, tsoa_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    tsoa_1.Response('default', 'Error occurred'),
    tsoa_1.Response('200', 'Success'),
    tsoa_1.Tags('Auth'),
    tsoa_1.Post('register'),
    tslib_1.__param(0, tsoa_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
tslib_1.__decorate([
    tsoa_1.Response('default', 'Error occurred'),
    tsoa_1.Response('200', 'Success'),
    tsoa_1.Tags('Auth'),
    tsoa_1.Get(),
    tsoa_1.Security('JWT'),
    tslib_1.__param(0, tsoa_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "currentUser", null);
AuthController = tslib_1.__decorate([
    tsoa_1.Route('auth')
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map