"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const metadataGenerator_1 = require("tsoa/dist/metadataGeneration/metadataGenerator");
const specGenerator_1 = require("tsoa/dist/swagger/specGenerator");
const path = require("path");
const pathUtil_1 = require("./pathUtil");
const config = {
    "outputDirectory": path.join(pathUtil_1.serverDir, 'dist'),
    "entryFile": path.join(pathUtil_1.serverDir, 'src', "/server.ts"),
    "basePath": "/api",
    "routesDir": path.join(pathUtil_1.serverDir, "src"),
    "securityDefinitions": {
        "JWT": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    },
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "specMerging": "recursive",
    "spec": {
        "paths": {
            "/image/uploadFile": {
                "post": {
                    "consumes": [
                        "multipart/form-data"
                    ],
                    "parameters": [
                        {
                            "in": "formData",
                            "name": "imageFile",
                            "required": true,
                            "type": "file"
                        },
                        {
                            "in": "formData",
                            "name": "tags",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
};
exports.getSwaggerJson = (compilerOptions, ignorePaths, 
/**
 * pass in cached metadata returned in a previous step to speed things up
 */
metadata) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    if (!metadata) {
        metadata = new metadataGenerator_1.MetadataGenerator(config.entryFile, compilerOptions, ignorePaths).Generate();
    }
    const spec = new specGenerator_1.SpecGenerator(metadata, config).GetSpec();
    console.log("hi, generating");
    return spec;
});
//# sourceMappingURL=generatesw.js.map