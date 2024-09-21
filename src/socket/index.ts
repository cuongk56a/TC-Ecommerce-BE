import Bull from 'bull';
import SocketQueue from './queue/SocketQueue';
const SocketIO = require('socket.io');
import {Socket} from 'socket.io';
import {chatService} from '../modules/message/chat/chat.service';
import {notificationService} from '../modules/notification/notification.service';
import { IChatDoc } from '../modules/message/chat/chat.type';

export const startSocketModule = (
  opts: Bull.QueueOptions,
  server: any,
  authSocketMid?: (socket: Socket, next: any) => void,
  listeners?: (socket: Socket) => void,
) => {
  const io = SocketIO(server, {
    cors: {
      origin: '*',
    },
  });
  if (!!authSocketMid) {
    io.use(authSocketMid);
  }

  const pushSocketQueue = new SocketQueue('SocketQueue');
  pushSocketQueue.initQueue(io, opts);

  io.on('connect_error', (err: Error) => {
    console.log(err instanceof Error); // true
    console.log('Socket:connect_error: ', err.message);
  });

  io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('joinRoom', async (data: {roomId: string; userId: string}) => {
      if (!!data && !!data.roomId) {
        socket.join(data.roomId);
        console.log(`User ${data.userId} joined room ${data.roomId}`);

        const chats = await chatService.getAll({roomId: data.roomId}, {hasTarget: true, hasUser: true});
        socket.emit('LOAD_CHAT', chats);
      }
    });

    socket.on('sendMessage', async (data: {roomId: string; senderId: string; newChat: IChatDoc}) => {
      if (!!data && !!data.roomId && data.senderId && !!data.newChat) {

        io.to(data.roomId).emit('CHAT_MESSAGE', data.newChat);
      }
    });

    socket.on('leaveRoom', (data: {roomName: string}) => {
      if (!!data && !!data.roomName) {
        socket.leave(data.roomName);
        socket.emit('appToClientLeaved', data);
      }
    });

    socket.on('joinRoomNotication', async (data: { roomId : string, userId : string}) => {
      if(!!data && !!data.roomId){
        socket.join(data.roomId);
        console.log(`User ${data.userId} joined roomNotification ${data.roomId}`);

        const notifications = await notificationService.getAll({ roomId: data.roomId }, {hasTarget: true, hasUser: true});
        socket.emit('loadNotifications', notifications);
      }
    });

    socket.on('sendNotification', async (data: {roomId: string; senderId: string; content: string}) => {
      if (!!data && !!data.roomId && data.senderId && !!data.content) {
        const newMessage = await chatService.createOne({
          roomId: data.roomId,
          senderId: data.senderId,
          content: data.content,
        });

        io.to(data.roomId).emit('CHAT_MESSAGE', newMessage);
      }
    });

    socket.on('disconnect', function () {
      console.log('socketIo disconnect');
    });

    !!listeners && listeners(socket);

    socket.onAny((eventName, data) => {
      console.log('socket_onAny', {
        eventName,
        data,
      });
    });
  });

  return io;
};
