/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { AuthController } from './controllers/authController';
import { FeedController } from './controllers/feedController';
import { VersionController } from './controllers/versionController';
import { ImageController } from './controllers/imageController';
import { expressAuthentication } from './middleware/authentication';
import * as express from 'express';

const models: TsoaRoute.Models = {
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
            "nsfwtags": { "dataType": "string", "required": true },
        },
    },
    "INewUserParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "PartialIUser": {
    },
    "ITag": {
        "properties": {
            "id": { "dataType": "double" },
            "value": { "dataType": "string", "required": true },
            "pictures": { "dataType": "array", "array": { "ref": "IPicture" } },
        },
    },
    "IPicture": {
        "properties": {
            "id": { "dataType": "double" },
            "creationDate": { "dataType": "datetime", "required": true },
            "tags": { "dataType": "array", "array": { "ref": "ITag" } },
            "votes": { "dataType": "array", "array": { "ref": "IVote" }, "required": true },
            "data": { "dataType": "buffer", "required": true },
            "nsfwTags": { "dataType": "string", "required": true },
        },
    },
    "IUser": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string" },
            "nsfwtags": { "dataType": "string", "required": true },
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
    "IPost": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "pictureID": { "dataType": "string", "required": true },
            "nsfwTags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "votes": { "dataType": "double", "required": true },
        },
    },
    "IFeedResponse": {
        "properties": {
            "pictures": { "dataType": "array", "array": { "ref": "IPost" }, "required": true },
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
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
    app.post('/api/auth/login',
        function(request: any, response: any, next: any) {
            const args = {
                loginParams: { "in": "body", "name": "loginParams", "required": true, "ref": "ILoginParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthController();


            const promise = controller.login.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/auth/register',
        function(request: any, response: any, next: any) {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "INewUserParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthController();


            const promise = controller.registerUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/auth',
        authenticateMiddleware([{ "JWT": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthController();


            const promise = controller.currentUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/auth/update',
        authenticateMiddleware([{ "JWT": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                user: { "in": "body", "name": "user", "required": true, "ref": "PartialIUser" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthController();


            const promise = controller.updateUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/feed/tags',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FeedController();


            const promise = controller.getTags.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/feed',
        function(request: any, response: any, next: any) {
            const args = {
                undefined: { "in": "body", "required": true, "ref": "IFeedRequestBody" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FeedController();


            const promise = controller.search.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/version',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new VersionController();


            const promise = controller.version.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/image/imageFile/:fileId.jpeg',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                fileId: { "in": "path", "name": "fileId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ImageController();


            const promise = controller.getAttachment.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/image/vote',
        authenticateMiddleware([{ "JWT": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "query", "name": "id", "required": true, "dataType": "double" },
                up: { "in": "query", "name": "up", "required": true, "dataType": "boolean" },
                undefined: { "in": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ImageController();


            const promise = controller.vote.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/image/getVoteInfo',
        authenticateMiddleware([{ "JWT": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                undefined: { "in": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ImageController();


            const promise = controller.getVotes.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/image/uploadFile',
        authenticateMiddleware([{ "JWT": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                undefined: { "in": "body", "required": true, "ref": "IImageParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ImageController();


            const promise = controller.uploadFile.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = 401;
                    next(error)
                }
            }

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
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
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
