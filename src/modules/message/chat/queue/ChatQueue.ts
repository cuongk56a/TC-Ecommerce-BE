import AbstractQueueProcessor, { createNewQueue } from '../../../../redis/queue';
import { IChatModelDoc } from '../chat.model';

export class ChatQueue extends AbstractQueueProcessor {
  processQueue = async (
    job: {
      data: {
        chat: IChatModelDoc;
      };
    },
    done: any,
  ) => {
    const {chat} = job.data;
    const {roomId, senderId, content} = chat;
    const socketQueue = createNewQueue('SocketQueue');
    socketQueue.add({
      socketRoom: roomId,
      data: chat,
      eventType: 'sendMessage',
    }).finally(() => {
      done();
    });
  };
}
