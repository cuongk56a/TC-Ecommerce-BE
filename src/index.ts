import mongoose, { mongo } from 'mongoose';
import app from './app';
import logger from './config/logger';
import {appConfigs} from './config/config';
import { fakeData } from './fakeData/fake';
import { onConnetCallback } from './redis';
export {};

declare global {
  let __basedir: string;
  namespace Express {
    interface Request {
      userId: any;
      roleCheckId: any;
      // isAdmin: boolean;
    }
  }
}

let server: any;

onConnetCallback(() => {
  console.log('Redis Connect Success!');
  mongoose
  .connect(appConfigs.mongoose.url, {
    // useNewUrlParser: true, // <-- no longer necessary
    // useUnifiedTopology: true // <-- no longer necessary
  })
  .then(async () => {
    logger.info('Connected to MongoDB');

    if (appConfigs.env == 'development') {
    }

    server = app.listen(appConfigs.port, async () => {
      logger.info(`Listening to port ${appConfigs.port}`);

      // const {startSocketModule} = require('../submodules/VTSocketLib');
      // startSocketModule(undefined, server, (socket: Socket, next: any) => next(), undefined);

      // const {startNotificationModule} = require('../submodules/VTNotificationLib');
      // startNotificationModule();

      // fakeData()
    });
  });
})



const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
