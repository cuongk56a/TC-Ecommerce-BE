import mongoose from 'mongoose';
import app from './app';
import logger from './config/logger';
import { appConfigs } from './config/config';
import { fakeData } from './fakeData/fake';
import { onConnetCallback } from './redis';
import http from 'http';
import { Server } from 'socket.io';
import { OrderQueue } from './modules/order/queue/OrderQueue';

declare global {
  let __basedir: string;
  namespace Express {
    interface Request {
      userId: any;
      roleId: any;
      // isAdmin: boolean;
    }
  }
}

const server = http.createServer(app);
const io = new Server(server);

onConnetCallback(() => {
  console.log('Redis Connect Success!');
  mongoose
    .connect(appConfigs.mongoose.url)
    .then(async () => {
      logger.info('Connected to MongoDB');

      if (appConfigs.env == 'development') {
        // Handle development-specific tasks here
      }

      server.listen(appConfigs.port, async () => {
        logger.info(`Listening to port ${appConfigs.port}`);

        io.on('connection', (socket) => {
          console.log('Client connected:', socket.id);
        });

        const onOrderQUE = new OrderQueue('OrderQueue');
        onOrderQUE.initQueue();

        // fakeData();
      });
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
});

const exitHandler = () => {
  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });
};

const unexpectedErrorHandler = (error: any) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close();
});