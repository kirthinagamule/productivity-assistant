const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createApp = require('../src/app');
const config = require('../src/config');
const { prisma } = require('../src/config/db');

// Set test environment
process.env.NODE_ENV = 'test';

describe('Authentication & Authorization Test Suite', () => {
  let app;
  let mockUsers = [];
  let mockTasks = [];

  beforeAll(() => {
    app = createApp();

    // Mock Prisma methods for fast, deterministic in-memory testing
    prisma.user = {
      findUnique: jest.fn(async ({ where }) => {
        if (where.email) {
          return mockUsers.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
        }
        if (where.id) {
          const user = mockUsers.find((u) => u.id === where.id);
          if (!user) return null;
          return {
            ...user,
            _count: { tasks: 2, notes: 1, reminders: 0, calendarEvents: 1 },
          };
        }
        return null;
      }),
      create: jest.fn(async ({ data }) => {
        const newUser = {
          id: `user-${Date.now()}-${Math.random()}`,
          name: data.name,
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          role: 'USER',
          timezone: data.timezone || 'UTC',
          preferences: data.preferences,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockUsers.push(newUser);
        return newUser;
      }),
      update: jest.fn(async ({ where, data }) => {
        const index = mockUsers.findIndex((u) => u.id === where.id);
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date() };
          return mockUsers[index];
        }
        return null;
      }),
    };

    prisma.task = {
      findMany: jest.fn(async ({ where }) => {
        return mockTasks.filter((t) => t.userId === where.userId);
      }),
      findUnique: jest.fn(async ({ where }) => {
        return mockTasks.find((t) => t.id === where.id) || null;
      }),
      create: jest.fn(async ({ data }) => {
        const newTask = {
          id: `task-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          taskTags: [],
        };
        mockTasks.push(newTask);
        return newTask;
      }),
      delete: jest.fn(async ({ where }) => {
        const index = mockTasks.findIndex((t) => t.id === where.id);
        if (index !== -1) {
          const deleted = mockTasks.splice(index, 1);
          return deleted[0];
        }
        return null;
      }),
    };
  });

  beforeEach(async () => {
    mockUsers = [];
    mockTasks = [];

    // Seed test User A
    const passwordHashA = await bcrypt.hash('SecurePass123!', 10);
    mockUsers.push({
      id: 'user-a-id',
      name: 'User Alpha',
      email: 'alpha@example.com',
      passwordHash: passwordHashA,
      role: 'USER',
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed test User B
    const passwordHashB = await bcrypt.hash('SecurePass456!', 10);
    mockUsers.push({
      id: 'user-b-id',
      name: 'User Beta',
      email: 'beta@example.com',
      passwordHash: passwordHashB,
      role: 'USER',
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed task for User B
    mockTasks.push({
      id: 'task-b-1',
      userId: 'user-b-id',
      title: "User B's Private Strategy Task",
      priority: 'HIGH',
      createdAt: new Date(),
      taskTags: [],
    });
  });

  // =============================================================
  // 1. REGISTRATION TESTS
  // =============================================================
  describe('POST /api/auth/register', () => {
    it('should successfully register a new user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sarah Connor',
          email: 'sarah@example.com',
          password: 'StrongPassword123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('sarah@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Never exposed
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should reject registration if email is already registered (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Alpha',
          email: 'alpha@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('USER_ALREADY_EXISTS');
    });

    it('should reject registration with invalid email format (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bad Email User',
          email: 'not-an-email',
          password: 'StrongPassword123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with weak password (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Weak Password User',
          email: 'weak@example.com',
          password: '123', // Less than 8 characters, lacks complexity
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // =============================================================
  // 2. LOGIN TESTS
  // =============================================================
  describe('POST /api/auth/login', () => {
    it('should successfully log in with correct credentials and return JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alpha@example.com',
          password: 'SecurePass123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe('user-a-id');
      expect(res.body.data.user.email).toBe('alpha@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('should reject login with wrong password (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alpha@example.com',
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login for non-existent user (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ghost@example.com',
          password: 'SecurePass123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // =============================================================
  // 3. PROTECTED ROUTES & MIDDLEWARE TESTS
  // =============================================================
  describe('GET /api/auth/me (Protected Route)', () => {
    it('should reject requests without Authorization header (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject requests with invalid or corrupted token (401 Unauthorized)', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.payload');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should return current user profile with valid Bearer token', async () => {
      const token = jwt.sign(
        { userId: 'user-a-id', email: 'alpha@example.com', role: 'USER' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe('user-a-id');
      expect(res.body.data.user.name).toBe('User Alpha');
      expect(res.body.data.user.email).toBe('alpha@example.com');
    });
  });

  // =============================================================
  // 4. CHANGE PASSWORD TESTS
  // =============================================================
  describe('POST /api/auth/change-password', () => {
    it('should successfully change password when current password is valid', async () => {
      const token = jwt.sign(
        { userId: 'user-a-id', email: 'alpha@example.com', role: 'USER' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'SecurePass123!',
          newPassword: 'BrandNewPassword999!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Password changed successfully');

      // Verify the password was updated in the DB
      const updatedUser = mockUsers.find((u) => u.id === 'user-a-id');
      const isNewMatch = await bcrypt.compare('BrandNewPassword999!', updatedUser.passwordHash);
      expect(isNewMatch).toBe(true);
    });

    it('should reject password change when current password is incorrect (401)', async () => {
      const token = jwt.sign(
        { userId: 'user-a-id', email: 'alpha@example.com', role: 'USER' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongOldPassword!',
          newPassword: 'BrandNewPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CURRENT_PASSWORD');
    });
  });

  // =============================================================
  // 5. USER OWNERSHIP & AUTHORIZATION TESTS
  // =============================================================
  describe('User Ownership & Tenant Isolation', () => {
    it('User A must NEVER be able to access User B resource (403 Forbidden)', async () => {
      const tokenUserA = jwt.sign(
        { userId: 'user-a-id', email: 'alpha@example.com', role: 'USER' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // User A attempts to access User B's task (`task-b-1`)
      const res = await request(app)
        .get('/api/tasks/task-b-1')
        .set('Authorization', `Bearer ${tokenUserA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN_RESOURCE');
    });

    it('User A must NEVER be able to delete User B resource (403 Forbidden)', async () => {
      const tokenUserA = jwt.sign(
        { userId: 'user-a-id', email: 'alpha@example.com', role: 'USER' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // User A attempts to delete User B's task
      const res = await request(app)
        .delete('/api/tasks/task-b-1')
        .set('Authorization', `Bearer ${tokenUserA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN_RESOURCE');
    });
  });

  // =============================================================
  // 6. LOGOUT TEST
  // =============================================================
  describe('POST /api/auth/logout', () => {
    it('should return success confirmation on logout', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Logged out successfully');
    });
  });
});
