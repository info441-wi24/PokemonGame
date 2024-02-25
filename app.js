import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';
import msIdExpress from 'microsoft-identity-express'
import sessions from 'express-session'
import bodyParser from 'body-parser';


import apiRouter from './routes/api.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const appSettings = {
  appCredentials: {
    clientId:  "7a1d287a-4ed3-46e6-9ac0-ee4c07e3d5b7",
    tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret:  "E_t8Q~srK70axXVElAEKtl8DFHQaX27mQlrZQdvk"
},
    authRoutes: {
      redirect: "/redirect",
      error: "/error",
      unauthorized: "/unauthorized"
    }
  };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.models = models
  next();
})
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "4ed584bf3c0bb64ddee0",
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
