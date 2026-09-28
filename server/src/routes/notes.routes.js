const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: { notes: [] },
    message: 'Notes endpoint ready for Phase 2 implementation',
  });
});

module.exports = router;
