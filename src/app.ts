import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routes from './routes/v1';
const app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
// import http from 'http';

// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDef from './docs/swaggerDef';
import {appConfigs} from './config/config';
import ApiError from './utils/core/ApiError';
import {errorConverter, errorHandler} from './middlewares/error';

import { morganHandler } from './config/morgan';
if (appConfigs.env !== 'test') {
  app.use(morganHandler.successHandler);
  app.use(morganHandler.errorHandler);
}

// parse json request body
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// parse urlencoded request body
app.use(express.urlencoded({extended: true, limit: '50mb'}));

// enable cors
app.use(cors());
app.options('*', cors());

// // jwt authentication
import passport from 'passport';
import { jwtStrategy } from './config/passport';
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/v1', routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
