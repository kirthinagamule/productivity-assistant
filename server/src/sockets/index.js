const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../config/logger');

let ioInstance = null;

const initSocketIO = (io) => {
  ioInstance = io;

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.userId;
    logger.info(`WebSocket Client Connected: socket_id=${socket.id} user_id=${userId}`);

    // Join personal user room for private real-time broadcasts
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket Client Disconnected: socket_id=${socket.id} reason=${reason}`);
    });

    // Real-time ping/pong
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  });

  return io;
};

/**
 * Emit event to a specific authenticated user
 */
const emitToUser = (userId, event, payload) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, payload);
  }
};

module.exports = {
  initSocketIO,
  emitToUser,
};
