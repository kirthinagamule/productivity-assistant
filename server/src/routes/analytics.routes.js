const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/summary', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      productivityScore: 88.5,
      tasksCompletedToday: 6,
      focusMinutesToday: 185,
      burnoutRisk: 'LOW',
      weeklyTrend: [75, 82, 90, 85, 88],
    },
  });
});

module.exports = router;
