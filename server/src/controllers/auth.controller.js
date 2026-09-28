const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { prisma } = require('../config/db');
const logger = require('../config/logger');

/**
 * Generate standard JWT access and refresh token pair
 */
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'USER',
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
    tokenType: 'Bearer',
  };
};

/**
 * Clean user object sanitizing sensitive fields like passwordHash
 */
const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || null,
    role: user.role,
    timezone: user.timezone || 'UTC',
    preferences: user.preferences || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * POST /api/auth/register
 * User registration with input validation, bcrypt password hashing, and token generation
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, timezone } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: 'An account with this email address already exists. Please log in or use a different email.',
        },
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user and default productivity tags
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        timezone: timezone || 'UTC',
        preferences: {
          theme: 'system',
          dailyReminderTime: '08:30',
          workHourStart: 9,
          workHourEnd: 17,
        },
        tags: {
          create: [
            { name: 'Engineering', color: '#3B82F6' },
            { name: 'AI & Research', color: '#8B5CF6' },
            { name: 'Strategy', color: '#EC4899' },
            { name: 'Wellness', color: '#10B981' },
          ],
        },
      },
    });

    const safeUser = sanitizeUser(user);
    const tokens = generateTokens(safeUser);

    logger.info(`User registered successfully: ${safeUser.email} (${safeUser.id})`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: safeUser,
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * User login with bcrypt verification and JWT generation
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    const safeUser = sanitizeUser(user);
    const tokens = generateTokens(safeUser);

    logger.info(`User logged in: ${safeUser.email} (${safeUser.id})`);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: safeUser,
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me (and GET /api/auth/profile)
 * Get current authenticated user details
 */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            tasks: true,
            notes: true,
            reminders: true,
            calendarEvents: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found',
        },
      });
    }

    const safeUser = {
      ...sanitizeUser(user),
      stats: user._count,
    };

    return res.status(200).json({
      success: true,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found',
        },
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CURRENT_PASSWORD',
          message: 'The current password provided is incorrect',
        },
      });
    }

    // Ensure new password is not identical to current password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SAME_PASSWORD',
          message: 'New password must be different from the current password',
        },
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update in database
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    logger.info(`Password changed successfully for user: ${user.email} (${user.id})`);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in with your new password on other devices.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * 
 * Logout Architecture Strategy:
 * In this stateless JWT authentication architecture:
 * 1. Tokens are self-contained and signed cryptographically with expiration TTLs.
 * 2. On logout, the client discards the access and refresh tokens from memory/localStorage.
 * 3. The server confirms the logout handshake.
 * 4. For high-security environments, optional token blacklist in Redis or database revocation can be added.
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully. Tokens should be cleared from client storage.',
  });
};

/**
 * POST /api/auth/refresh-token
 * Exchange valid refresh token for a new access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token is required',
        },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token. Please sign in again.',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User associated with refresh token no longer exists',
        },
      });
    }

    const safeUser = sanitizeUser(user);
    const tokens = generateTokens(safeUser);

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getProfile: getMe, // Alias
  changePassword,
  logout,
  refreshToken,
};
