import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import session from 'express-session';
import * as db from "./utils/db";
import cfg from "../config.json";

const app = express();
app.use(
    bodyParser.json(),
    session({
        name: 'session',
        secret: cfg.cookiesecret,
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 1000 * 60 * 60 * 4} //TODO: resave option?
    })
);

const port = 8888;
const listener = app.listen(port, function () {
    console.log('Listening on port ' + port + '\n');
});

db.startup();