const logger = require('../config/logger');

/**
 * Centralized standard error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { stack: err.stack });

  // Default error format
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected error occurred. Please try again later.'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
