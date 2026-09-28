const { checkDatabaseConnection } = require('../config/db');
const axios = require('axios');
const config = require('../config');

const getHealthStatus = async (req, res) => {
  const dbHealthy = await checkDatabaseConnection();
  
  // Check AI Service status
  let aiServiceHealthy = false;
  try {
    const aiRes = await axios.get(`${config.aiServiceUrl}/health`, { timeout: 2000 });
    aiServiceHealthy = aiRes.status === 200;
  } catch (err) {
    aiServiceHealthy = false;
  }

  const status = dbHealthy ? 'healthy' : 'degraded';

  res.status(200).json({
    success: true,
    status,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'up',
      database: dbHealthy ? 'up' : 'down',
      aiService: aiServiceHealthy ? 'up' : 'unreachable',
    },
    uptime: process.uptime(),
  });
};

module.exports = {
  getHealthStatus,
};
