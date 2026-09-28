const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authRateLimiter } = require('../middleware/rateLimiter');

// ==========================================
// Validation Rules
// ==========================================

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
];

// ==========================================
// Endpoints
// ==========================================

// Public routes with rate limiting
router.post('/register', authRateLimiter, validate(registerValidation), authController.register);
router.post('/login', authRateLimiter, validate(loginValidation), authController.login);
router.post('/refresh-token', validate(refreshTokenValidation), authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes (require Bearer JWT)
router.get('/me', authenticateToken, authController.getMe);
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/change-password', authenticateToken, validate(changePasswordValidation), authController.changePassword);

module.exports = router;
