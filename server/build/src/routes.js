"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const tsoa_1 = require("tsoa");
const authController_1 = require("./controllers/authController");
const feedController_1 = require("./controllers/feedController");
const versionController_1 = require("./controllers/versionController");
const imageController_1 = require("./controllers/imageController");
const authentication_1 = require("./middleware/authentication");
const models = {
    "ILoginResponse": {
        "properties": {
            "authToken": { "dataType": "string", "required": true },
            "username": { "dataType": "string", "required": true },
            "id": { "dataType": "double", "required": true },
        },
    },
    "IErrorResponse": {
        "properties": {
            "thrown": { "dataType": "boolean" },
            "error": { "dataType": "any" },
            "message": { "dataType": "string" },
        },
    },
    "ILoginParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "IUserResponse": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "id": { "dataType": "double", "required": true },
        },
    },
    "INewUserParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "IPicture": {
        "properties": {
            "id": { "dataType": "double" },
            "creationDate": { "dataType": "datetime", "required": true },
            "tags": { "dataType": "array", "array": { "ref": "ITag" } },
            "votes": { "dataType": "array", "array": { "ref": "IVote" }, "required": true },
        },
    },
    "ITag": {
        "properties": {
            "_id": { "dataType": "double" },
            "value": { "dataType": "string", "required": true },
            "pictures": { "dataType": "array", "array": { "ref": "IPicture" } },
        },
    },
    "IUser": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string" },
            "id": { "dataType": "double" },
        },
    },
    "IVote": {
        "properties": {
            "id": { "dataType": "double" },
            "up": { "dataType": "boolean", "required": true },
            "picture": { "ref": "IPicture", "required": true },
            "value": { "dataType": "double", "required": true },
            "pictureId": { "dataType": "double", "required": true },
            "user": { "ref": "IUser", "required": true },
            "userId": { "dataType": "double", "required": true },
        },
    },
    "IFeedResponse": {
        "properties": {
            "pictures": { "dataType": "array", "array": { "ref": "IPicture" }, "required": true },
            "page": { "dataType": "double", "required": true },
            "pageSize": { "dataType": "double", "required": true },
        },
    },
    "IFeedRequestBody": {
        "properties": {
            "page": { "dataType": "double", "required": true },
            "pageSize": { "dataType": "double", "required": true },
            "tags": { "dataType": "array", "array": { "dataType": "string" } },
        },
    },
    "IImageParams": {
        "properties": {
            "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
};
const validationService = new tsoa_1.ValidationService(models);
function RegisterRoutes(app) {
    app.post('/api/auth/login', function (request, response, next) {
        const args = {
            loginParams: { "in": "body", "name": "loginParams", "required": true, "ref": "ILoginParams" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new authController_1.AuthController();
        const promise = controller.login.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/auth/register', function (request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "INewUserParams" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new authController_1.AuthController();
        const promise = controller.registerUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/auth', authenticateMiddleware([{ "JWT": [] }]), function (request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new authController_1.AuthController();
        const promise = controller.currentUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/feed', function (request, response, next) {
        const args = {
            undefined: { "in": "body", "required": true, "ref": "IFeedRequestBody" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new feedController_1.FeedController();
        const promise = controller.search.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/version', function (request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new versionController_1.VersionController();
        const promise = controller.version.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/image/vote', authenticateMiddleware([{ "JWT": [] }]), function (request, response, next) {
        const args = {
            id: { "in": "query", "name": "id", "required": true, "dataType": "double" },
            up: { "in": "query", "name": "up", "required": true, "dataType": "boolean" },
            undefined: { "in": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new imageController_1.ImageController();
        const promise = controller.vote.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/image/getVoteInfo', authenticateMiddleware([{ "JWT": [] }]), function (request, response, next) {
        const args = {
            undefined: { "in": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new imageController_1.ImageController();
        const promise = controller.getVotes.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/image/uploadFile', authenticateMiddleware([{ "JWT": [] }]), function (request, response, next) {
        const args = {
            undefined: { "in": "body", "required": true, "ref": "IImageParams" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new imageController_1.ImageController();
        const promise = controller.uploadFile.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    function authenticateMiddleware(security = []) {
        return (request, _response, next) => {
            let responded = 0;
            let success = false;
            const succeed = function (user) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            };
            const fail = function (error) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = 401;
                    next(error);
                }
            };
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises = [];
                    for (const name in secMethod) {
                        promises.push(authentication_1.expressAuthentication(request, name, secMethod[name]));
                    }
                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                }
                else {
                    for (const name in secMethod) {
                        authentication_1.expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        };
    }
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode;
            if (isController(controllerObj)) {
                const headers = controllerObj.getHeaders();
                Object.keys(headers).forEach((name) => {
                    response.set(name, headers[name]);
                });
                statusCode = controllerObj.getStatus();
            }
            if (data || data === false) { // === false allows boolean result
                response.status(statusCode || 200).json(data);
            }
            else {
                response.status(statusCode || 204).end();
            }
        })
            .catch((error) => next(error));
    }
    function getValidatedArgs(args, request) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new tsoa_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
}
exports.RegisterRoutes = RegisterRoutes;
//# sourceMappingURL=routes.js.map