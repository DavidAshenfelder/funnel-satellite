import io from 'socket.io-client';
const port = process.env.PORT || 3002;

const  socket = io();

export default socket;
