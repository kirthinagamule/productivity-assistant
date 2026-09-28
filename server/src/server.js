const http = require('http');
const { Server } = require('socket.io');
const createApp = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const { checkDatabaseConnection } = require('./config/db');
const { initSocketIO } = require('./sockets');

const startServer = async () => {
  try {
    const app = createApp();
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: config.cors.origin,
        credentials: true,
      },
    });

    initSocketIO(io);

    // Check DB Connection on startup
    await checkDatabaseConnection();

    server.listen(config.port, () => {
      logger.info(`===============================================`);
      logger.info(`🚀 Productivity Assistant API Server Running`);
      logger.info(`📡 Port:        ${config.port}`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`🔌 Healthcheck: http://localhost:${config.port}/api/health`);
      logger.info(`===============================================`);
    });

    // Graceful Shutdown handlers
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP & Socket.IO server closed.');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forceful shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error(`Fatal server startup error: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

startServer();
