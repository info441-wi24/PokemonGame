import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';
import msIdExpress from 'microsoft-identity-express'
import sessions from 'express-session'

import apiRouter from './routes/api.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const appSettings = {
    appCredentials: {
      clientId:  "e4649360-cb57-4800-9a7b-58b1b2fb3878",
      tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
      clientSecret: "euL8Q~HZoc~Z_kim30TO7Iw3X9F~8Zw1qgqmIbyl"
    },
    authRoutes: {
      redirect: "/redirect",
      error: "/error",
      unauthorized: "/unauthorized"
    }
  };
// https://pokemongame441.azurewebsites.net
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

// Middleware
app.use((req, res, next) => {
    req.models = models;
    console.log("session info:", req.session)
    next();
  });

app.use('/api', apiRouter)

app.get('/signin',
	msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
	msid.signOut({postLogoutRedirect: '/'})
)

export default app;
