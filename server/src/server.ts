//import './controllers/usersController';
import * as express from 'express'
import * as path from "path";
import * as http from "http";
import * as passport from "passport"
import { FeedRouter } from './api';
import { RegisterRoutes } from './routes';
import {authenticateUser} from './middleware/authentication'
import {Sequelize} from 'sequelize-typescript';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import './controllers/authController'
import './controllers/feedController'
import './controllers/versionController'
import './controllers/imageController'
import * as bodyParser from 'body-parser';

import * as multer from 'multer';
import {getSwaggerJson} from './generatesw'
import * as tsconfig from '../tsconfig.json'
import * as tsoa from '../tsoa.json'
import { src, client, serverDir } from './pathUtil';
class Server {
    private app = express();
    private sequelize = new Sequelize({
        database: 'some_db',
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: 'db.sqlite',
        modelPaths: [path.join(src,'models','tables')]
    });
    constructor() {
        this.sequelize.sync().then(() => getSwaggerJson(tsconfig as any)).then((swagger) => {
            authenticateUser(passport);
            //console.log(swagger)
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({
                extended: true,
                limit: '5mb',
                parameterLimit: 5000,
            }));

            this.app.use(multer().any());
            this.app.use(passport.initialize());
            this.app.use(passport.session());
            this.app.set('port', process.env.PORT || 3000);
            this.app.use("/static", express.static(path.join(client, 'build', 'static')));
            this.app.use('/images',express.static(path.join(serverDir,'images')))
            console.log(path.join(serverDir,'images'))
            this.app.use('/browse-api',swaggerUi.serve, swaggerUi.setup(swagger))
            RegisterRoutes(this.app);
            this.app.get("*",(req,res) => {
                res.sendFile(path.join(client,"build","index.html"))
            })
            this.app.use( ((err, req, res : express.Response, next) =>  {
                if(err.status) {
                    res.status(err.status).send(err)
                } else {
                    res.send(err)
                }
              }) as express.ErrorRequestHandler )
            let server = http.createServer(this.app);
            server.listen(this.app.get('port'), () => {
              console.log('Express server listening on port ' + this.app.get('port'));
            });
        })
    }
}
new Server()