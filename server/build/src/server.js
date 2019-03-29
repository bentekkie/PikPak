"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import './controllers/usersController';
const express = require("express");
const path = require("path");
const http = require("http");
const passport = require("passport");
const routes_1 = require("./routes");
const authentication_1 = require("./middleware/authentication");
const sequelize_typescript_1 = require("sequelize-typescript");
const swaggerUi = require("swagger-ui-express");
require("./controllers/authController");
require("./controllers/feedController");
require("./controllers/versionController");
require("./controllers/imageController");
const bodyParser = require("body-parser");
const multer = require("multer");
const generatesw_1 = require("./generatesw");
const tsconfig = require("../tsconfig.json");
const pathUtil_1 = require("./pathUtil");
class Server {
    constructor() {
        this.app = express();
        this.sequelize = new sequelize_typescript_1.Sequelize({
            database: 'some_db',
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: 'db.sqlite',
            modelPaths: [path.join(pathUtil_1.src, 'models', 'tables')]
        });
        this.sequelize.sync().then(() => generatesw_1.getSwaggerJson(tsconfig)).then((swagger) => {
            authentication_1.authenticateUser(passport);
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
            this.app.use("/static", express.static(path.join(pathUtil_1.client, 'build', 'static')));
            this.app.use('/images', express.static(path.join(pathUtil_1.serverDir, 'images')));
            console.log(path.join(pathUtil_1.serverDir, 'images'));
            this.app.use('/browse-api', swaggerUi.serve, swaggerUi.setup(swagger));
            routes_1.RegisterRoutes(this.app);
            this.app.get("*", (req, res) => {
                res.sendFile(path.join(pathUtil_1.client, "build", "index.html"));
            });
            this.app.use(((err, req, res, next) => {
                if (err.status) {
                    res.status(err.status).send(err);
                }
                else {
                    res.send(err);
                }
            }));
            let server = http.createServer(this.app);
            server.listen(this.app.get('port'), () => {
                console.log('Express server listening on port ' + this.app.get('port'));
            });
        });
    }
}
new Server();
//# sourceMappingURL=server.js.map