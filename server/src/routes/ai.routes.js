const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');
const config = require('../config');

router.use(authenticateToken);

/**
 * Proxy route to AI Service
 */
router.post('/parse-task', async (req, res, next) => {
  try {
    const response = await axios.post(`${config.aiServiceUrl}/api/v1/parser/parse-task`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.post('/daily-plan', async (req, res, next) => {
  try {
    const response = await axios.post(`${config.aiServiceUrl}/api/v1/planner/generate`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
