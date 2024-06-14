// const SocketIO = require('socket.io');
// import {Socket} from 'socket.io';

// export const startSocketModule = (
//     server: any,
//     authSocketMid?: (socket: Socket, next: any) => void,
//     listeners?: (socket: Socket) => void,
//   ) => {
//     const io = SocketIO(server, {
//       cors: {
//         origin: '*',
//       },
//     });
//     if (!!authSocketMid) {
//       io.use(authSocketMid);
//     }
  
//     io.on('connect_error', (err: Error) => {
//       console.log(err instanceof Error); // true
//       console.log('Socket:connect_error: ', err.message); // not authorized
//     });
  
//     io.on('connection', (socket: Socket) => {
//       console.log('A user connected');
  
//       socket.on('CTA_CONNECTED', data => {
//         // console.log('CLIENT_CONNECTED: ' + JSON.stringify(data));
//         socket.emit('ATC_CONNECTED', {
//           message: 'Xác nhận kết nối!',
//         });
//       });
  
//       socket.on('CTA_JOINROOM', (data: {roomName: string}) => {
//         // console.log('CTA_JOINROOM: ' + JSON.stringify(data));
//         if (!!data && !!data.roomName && typeof data.roomName == 'string') {
//           socket.join(data.roomName);
//           socket.emit('APPTOCLIENT_JOINED', data);
//         }
//       });
  
//       // multiple
//       socket.on('CTA_JOINMULTIPLEROOM', (data: {roomNames: string[]}) => {
//         // console.log('CTA_JOINROOM: ' + JSON.stringify(data));
//         if (!!data && !!data.roomNames) {
//           socket.join(data.roomNames);
//           socket.emit('APPTOCLIENT_JOINED', data);
//         }
//       });
  
//       socket.on('CTA_LEAVEROOM', (data: {roomName: string}) => {
//         // console.log('CTA_LEAVEROOM: ' + JSON.stringify(data));
  
//         if (!!data && !!data.roomName && typeof data.roomName == 'string') {
//           socket.leave(data.roomName);
//           socket.emit('APPTOCLIENT_LEAVED', data);
//         }
//       });
  
//       socket.on('disconnect', function () {
//         console.log('socketIo disconnect');
//         if (socket.id) {
//           // userOnlineService.offline(socket.id);
//         }
//       });
  
//       !!listeners && listeners(socket);
  
//       socket.onAny((eventName, data) => {
//         console.log('socket_onAny', {
//           eventName,
//           data,
//         });
//       });
//     });
  
//     return io;
//   };