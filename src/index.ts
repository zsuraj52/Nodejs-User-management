import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import router from "./routes";
import { banner } from "./logger/banner";
import logger from "./logger/logger";
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swagger from '../swagger.json';


const app = express();

app.use(express.json());
app.use(router);
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
    ].join(' ')
}));
const port = process.env.PORT;

const url = `http://localhost:${port}`

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagger));     

AppDataSource.initialize().then(async () => {
    console.log("Database Connected Successfully!");
    app.listen(port, () => {
        banner(logger)
        });
    }).catch((error) => {
    console.log('Failed to Connect to Server, Please Try Again!');
    console.log('Error:',error);
})
