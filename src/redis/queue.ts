import Queue from 'bull';
import {appConfigs} from '../config/config';
// const redisOptions = {
//     redis: {host: appConfigs.redisHost, port: appConfigs.redisPort, password: appConfigs.redisPassword}
// }

const QueueOptions = {
    redis: {host: 'redis-12030.c99.us-east-1-4.ec2.redns.redis-cloud.com', port: 12030, password: 'BQXiD0Sl9jpLk5R0NoEQnqwVnWqWj7c2'},
    // limit: {
    //     max: 1,
    //     duration: 1000,
    // }
}

export const getAppQueueName = (qName: string) => {
  return `${qName}_${appConfigs.queueNamePrefix}`;
};

export const createNewQueue = (qName: string, opts?: Queue.QueueOptions) => {
  const queueName = getAppQueueName(qName);
  console.log(`___Processor___ createNewQueue: ${queueName} >>> ADD`);
  return new Queue(queueName, {...opts, ...QueueOptions});
};

export default class AbstractQueueProcessor {
  queueName: string;
  queue: any;
  concurrency: number;

  constructor(queueName: string, concurrency = 50) {
    console.log(`___Processor___ AbstractQueueProcessor: ${queueName} >>> constructor`);
    this.queueName = queueName;
    this.concurrency = concurrency;
  }

  initQueue(opts?: Queue.QueueOptions) {
    this.queue = createNewQueue(this.queueName, opts);
    this.start();
  }

  start() {
    this.queue.clean(20);
    this.queue.clean(20, 'failed');

    this.queue.process(this.concurrency, (job: any, done: any) => {
      try {
        this.processQueue(job, done);
      } catch (error: any) {
        console.error(`___Processor___ AbstractQueueProcessor: ${this.queueName} >>> constructor`, error.message);
        done();
      }
    });
  }

  processQueue = (job: any, done: any) => {
    done();
  };

  onError = (errMsg: any, done?: any) => {
    console.log(`___Processor___ AbstractQueueProcessor: ${this.queueName} :Error `, errMsg);
    !!done && done();
  };
}
