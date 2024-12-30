
// socket.js
const http = require('http');
const socketIo = require('socket.io');

let io;

const setupSocket = (server) => {
  io = socketIo(server);
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

const getSocket = () => {
  if (!io) {
    throw new Error('Socket not initialized!');
  }
  return io;
};

module.exports = { setupSocket, getSocket };
