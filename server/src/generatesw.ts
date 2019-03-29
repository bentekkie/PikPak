import * as ts from 'typescript';
import { SwaggerConfig } from 'tsoa/dist/config';
import { MetadataGenerator } from 'tsoa/dist/metadataGeneration/metadataGenerator';
import { Tsoa } from 'tsoa/dist/metadataGeneration/tsoa';
import { SpecGenerator } from 'tsoa/dist/swagger/specGenerator';
import * as path from "path";

import { src, client, serverDir } from './pathUtil';

const config: any = {
    "outputDirectory": path.join(serverDir, 'dist'),
    "entryFile": path.join(serverDir, 'src', "/server.ts"),
    "basePath": "/api",
    "routesDir": path.join(serverDir, "src"),
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
}


export const getSwaggerJson = async (
    compilerOptions?: ts.CompilerOptions,
    ignorePaths?: string[],
    /**
     * pass in cached metadata returned in a previous step to speed things up
     */
    metadata?: Tsoa.Metadata,
) => {
    if (!metadata) {
        metadata = new MetadataGenerator(
            config.entryFile,
            compilerOptions,
            ignorePaths,
        ).Generate();
    }
    const spec = new SpecGenerator(metadata, config).GetSpec();
    console.log("hi, generating")
    return spec;
};
