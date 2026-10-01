import { io } from 'socket.io-client';

const SOCKET_URL = 'https://unitedcabsmerthyr.uk'; // your socket server url (no /api)

const Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 10000,
  autoConnect: true,   
});
Socket.on('connect', () => {
  console.log('SOCKET CONNECTED', Socket.id);
});

Socket.on('disconnect', reason => {
  console.log('SOCKET DISCONNECTED:', reason);
});

Socket.on('connect_error', err => {
  console.log('SOCKET ERROR:', err.message);
});
export default Socket;
