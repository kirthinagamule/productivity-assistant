const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

let prisma;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
} catch (err) {
  logger.warn('PrismaClient not yet initialized. Please run `npx prisma generate`.');
  // Mock client fallback for testing without active db generated
  prisma = {};
}

const checkDatabaseConnection = async () => {
  try {
    if (typeof prisma.$queryRaw === 'function') {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Database connection established successfully.');
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  prisma,
  checkDatabaseConnection,
};
