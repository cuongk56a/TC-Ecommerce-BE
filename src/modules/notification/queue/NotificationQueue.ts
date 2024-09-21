import AbstractQueueProcessor, { createNewQueue } from '../../../redis/queue';
import SocketQueue from '../../../socket/queue/SocketQueue';
import { NOTIFICATION_FOR } from '../notification.type';

export class NotificationQueue extends AbstractQueueProcessor {
  processQueue = async (
    job: {
      data: {
        notification: any;
      };
    },
    done: any,
  ) => {
    const {notification} = job.data;
    const {targetId, notiType, entityId, notiFor, users} = notification
    const newSocket = createNewQueue('SocketQueue');
    if(notiFor == NOTIFICATION_FOR.ADMIN){
      newSocket.add({
        socketRoom: 'notification_' + targetId,
        data: notification,
        eventType: 'notifacation',
      }).finally(() => {
        console.log('DONE');
        done();
      });
    }else{
      await Promise.all([
        users.map(async(u:any)=>{
          newSocket.add({
            socketRoom: 'notification_' + u,
            data: notification,
            eventType: 'notifacation',
          })
        })
      ]).finally(() => {
        console.log('DONE');
        done();
      });
    }
    done();
  };
}
