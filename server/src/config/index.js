require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/productivity_assistant_db?schema=public',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_12345',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_change_in_production_12345',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
};

module.exports = config;
