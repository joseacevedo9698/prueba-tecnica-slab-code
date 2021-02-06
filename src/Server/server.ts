import express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import { authRouter, userRouter, projectRouter } from '../Router';
import { authMiddleware, isAdmin } from '../Middlewares';
import { taskRouter } from '../Router/task';
// import {} from '../Routers';
// import {} from '../Middlewares';

export default class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        dotenv.config();
        this.port = port;
        this.app = express();
        this.app.use(bodyParser.json());

    }

    static init(port: number) {
        return new Server(port);
    }



    start(callback: Function) {
        this.app.listen(this.port, callback());
        this.ConfigHeaders()
        this.middlewares();
        this.Routes();
    }

    middlewares() {
        this.app.use(morgan('dev'));

    }

    Routes() {
        this.app.use(function (error: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
            if (error instanceof SyntaxError) {
                res.status(500).json({ error: "JSON_ERROR" });
            } else {
                next();
            }
        });
        this.app.use('/user', userRouter);
        this.app.use('/project', projectRouter);
        this.app.use('/task', taskRouter);
        this.app.use('/', authRouter);
        this.app.all('*', function(req, res){
            res.status(404).json({message: "Not Found!"});
        });


    }

    ConfigHeaders() {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
    }

}