import { io } from 'socket.io-client';

const SOCKET_URL = 'https://scout-bite-businesses-om.trycloudflare.com'; // your socket server url (no /api)

const Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false, // connect manually
});

export default Socket;
