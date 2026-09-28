const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const tasksRoutes = require('./tasks.routes');
const notesRoutes = require('./notes.routes');
const aiRoutes = require('./ai.routes');
const analyticsRoutes = require('./analytics.routes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', tasksRoutes);
router.use('/notes', notesRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
