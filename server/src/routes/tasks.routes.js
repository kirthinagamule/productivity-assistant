const express = require('express');
const router = express.Router();
const { authenticateToken, checkOwnership, scopeUserQuery } = require('../middleware/auth');
const { prisma } = require('../config/db');

// All task routes require authentication
router.use(authenticateToken);

/**
 * GET /api/tasks
 * Returns tasks strictly scoped to the authenticated user
 */
router.get('/', async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      include: {
        taskTags: {
          include: { tag: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tasks
 * Creates a new task strictly owned by the authenticated user
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, estimatedMinutes, tagIds } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Task title is required',
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        userId: req.user.id, // Enforce authenticated user ownership
        title: title.trim(),
        description: description || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedMinutes: estimatedMinutes || 30,
        taskTags: tagIds && Array.isArray(tagIds)
          ? {
              create: tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: {
        taskTags: {
          include: { tag: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/:id
 * Fetches single task with strict ownership authorization
 */
router.get('/:id', async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        taskTags: {
          include: { tag: true },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    // Strict Backend Ownership Authorization Check
    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_RESOURCE',
          message: 'Access denied. You do not have permission to access this resource.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletes task with strict ownership authorization
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    // Strict Backend Ownership Check
    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_RESOURCE',
          message: 'Access denied. You cannot delete tasks owned by another user.',
        },
      });
    }

    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
