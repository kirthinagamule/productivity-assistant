const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Phase 2 database seeding...');

  // 1. Clean existing records for idempotent seed
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@antigravity.ai' },
  });

  if (existingUser) {
    console.log('Cleaning existing demo user data...');
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  // 2. Create Primary Demo User
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'demo@antigravity.ai',
      passwordHash,
      role: 'USER',
      timezone: 'America/New_York',
      preferences: {
        theme: 'dark',
        dailyReminderTime: '08:30',
        workHourStart: 9,
        workHourEnd: 17,
        notifications: {
          email: true,
          push: true,
          sound: true,
        },
      },
    },
  });

  console.log(`👤 User created: ${user.name} (${user.email})`);

  // 3. Create Tags
  const tagEngineering = await prisma.tag.create({
    data: { userId: user.id, name: 'Engineering', color: '#3B82F6' },
  });
  const tagAI = await prisma.tag.create({
    data: { userId: user.id, name: 'AI & Research', color: '#8B5CF6' },
  });
  const tagProduct = await prisma.tag.create({
    data: { userId: user.id, name: 'Product Strategy', color: '#EC4899' },
  });
  const tagWellness = await prisma.tag.create({
    data: { userId: user.id, name: 'Wellness & Health', color: '#10B981' },
  });
  const tagUrgent = await prisma.tag.create({
    data: { userId: user.id, name: 'Urgent Ops', color: '#EF4444' },
  });

  console.log('🏷️ Tags created');

  // 4. Create Tasks
  const task1 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Benchmark pgvector similarity search performance with HNSW index',
      description: 'Run 100k vector query benchmark on PostgreSQL 16 pgvector comparing IVFFlat vs HNSW indexing latency at p99.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      estimatedMinutes: 60,
      actualMinutes: 35,
      aiPriorityScore: 9.3,
      aiSuggestedSlot: new Date(Date.now() + 4 * 60 * 60 * 1000),
      taskTags: {
        create: [
          { tagId: tagEngineering.id },
          { tagId: tagAI.id },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Implement WebSocket real-time task sync and notification push',
      description: 'Hook up Socket.IO rooms to broadcast task updates and reminder popups across all connected client tabs.',
      status: 'TODO',
      priority: 'URGENT',
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      estimatedMinutes: 45,
      actualMinutes: 0,
      aiPriorityScore: 9.8,
      taskTags: {
        create: [
          { tagId: tagEngineering.id },
          { tagId: tagUrgent.id },
        ],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Review Q3 Product Strategy & Roadmap Deck',
      description: 'Provide executive feedback on upcoming AI agent workflows and user journey enhancements.',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      estimatedMinutes: 30,
      actualMinutes: 30,
      aiPriorityScore: 7.2,
      completedAt: new Date(),
      taskTags: {
        create: [{ tagId: tagProduct.id }],
      },
    },
  });

  const task4 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Midday 30-Minute Aerobic Reset',
      description: 'Light jog or outdoor walk to reset cognitive fatigue between deep focus sessions.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
      estimatedMinutes: 30,
      aiPriorityScore: 5.0,
      taskTags: {
        create: [{ tagId: tagWellness.id }],
      },
    },
  });

  console.log('📋 Tasks created');

  // 5. Create Notes
  const note1 = await prisma.note.create({
    data: {
      userId: user.id,
      title: 'AI Productivity Assistant Architecture RFC',
      content: `# Architecture Design Document\n\n## 1. System Overview\n- **Client**: React 18 + Vite + Tailwind CSS\n- **Backend**: Node.js + Express + Prisma ORM\n- **AI Microservice**: Python FastAPI + pgvector + Gemini/OpenAI SDK\n- **Database**: PostgreSQL 16 with pgvector extension\n\n## 2. Key Capabilities\n1. Natural Language Task Generation\n2. Real-Time WebSocket Synchronization\n3. Cosine Vector Similarity Semantic Search\n4. Dynamic Energy-Curve Daily Planner`,
      summary: 'Architecture RFC defining the multi-tier microservice architecture, real-time Socket.IO communication, and pgvector embeddings.',
      isPinned: true,
      isArchived: false,
      noteTags: {
        create: [
          { tagId: tagEngineering.id },
          { tagId: tagAI.id },
        ],
      },
    },
  });

  const note2 = await prisma.note.create({
    data: {
      userId: user.id,
      title: 'Productivity Optimization Principles',
      content: `### Core Rules for Flow State\n\n1. **Deep Work Windows**: Protect 90-minute morning blocks.\n2. **Batching**: Group email and asynchronous review in single afternoon slot.\n3. **Context Switching**: Minimize concurrent in-progress tasks to under 3.`,
      summary: 'Guidelines for maintaining flow state and structuring high-impact daily work blocks.',
      isPinned: false,
      isArchived: false,
      noteTags: {
        create: [
          { tagId: tagProduct.id },
          { tagId: tagWellness.id },
        ],
      },
    },
  });

  console.log('📝 Notes created');

  // 6. Create Reminders
  await prisma.reminder.createMany({
    data: [
      {
        userId: user.id,
        taskId: task1.id,
        title: 'Reminder: Benchmark pgvector performance before team demo',
        remindAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'PENDING',
        isSent: false,
      },
      {
        userId: user.id,
        taskId: task2.id,
        title: 'Reminder: Check WebSocket connection heartbeat',
        remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'PENDING',
        isSent: false,
        repeatPattern: 'DAILY',
      },
    ],
  });

  console.log('⏰ Reminders created');

  // 7. Create Calendar Events
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30);
  const endDeepWork = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30);
  const startMeeting = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0);
  const endMeeting = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0);

  await prisma.calendarEvent.createMany({
    data: [
      {
        userId: user.id,
        taskId: task1.id,
        title: 'Deep Focus Block: pgvector Benchmarking',
        description: 'Dedicated focus block with zero Slack interruptions.',
        startTime: startOfDay,
        endTime: endDeepWork,
        isAllDay: false,
        eventColor: '#8B5CF6',
        isAiGenerated: true,
      },
      {
        userId: user.id,
        taskId: null,
        title: 'Engineering Architecture Sync',
        description: 'Review schema migrations and AI microservice endpoints.',
        startTime: startMeeting,
        endTime: endMeeting,
        isAllDay: false,
        location: 'Google Meet',
        eventColor: '#3B82F6',
        isAiGenerated: false,
      },
    ],
  });

  console.log('📅 Calendar Events created');

  // 8. Create Chat Conversations & Messages
  const conversation = await prisma.chatConversation.create({
    data: {
      userId: user.id,
      title: 'Daily Productivity Coaching & Schedule Planning',
      messages: {
        create: [
          {
            role: 'USER',
            content: 'Can you help me organize my morning? I have a pgvector benchmark to run and team sync at 2pm.',
            tokensUsed: 28,
          },
          {
            role: 'ASSISTANT',
            content: 'Good morning Alex! I scheduled a 2-hour Deep Focus block from 09:30 AM to 11:30 AM for your pgvector benchmark during your peak cognitive window. Your team sync is set for 02:00 PM. Would you like me to reserve 30 minutes for a midday recharge?',
            tokensUsed: 62,
            contextReferences: [
              { type: 'task', id: task1.id, title: task1.title },
            ],
          },
        ],
      },
    },
  });

  console.log('💬 Chat Conversation & Messages created');

  // 9. Create Historical Productivity Metrics
  const pastDays = [0, 1, 2, 3, 4, 5, 6];
  for (const dayOffset of pastDays) {
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    d.setHours(0, 0, 0, 0);

    await prisma.productivityMetric.create({
      data: {
        userId: user.id,
        date: d,
        tasksCompleted: 4 + (dayOffset % 3),
        focusMinutes: 180 + (dayOffset * 15),
        efficiencyScore: 88.0 + (dayOffset * 1.5),
        burnoutRiskLevel: dayOffset > 4 ? 'MODERATE' : 'LOW',
        metadata: {
          deepWorkSessions: 3,
          interruptions: 1 + (dayOffset % 2),
        },
      },
    });
  }

  console.log('📊 Productivity Metrics created');

  // 10. Create Vector Embeddings
  await prisma.embedding.createMany({
    data: [
      {
        userId: user.id,
        entityType: 'TASK',
        entityId: task1.id,
        content: `Task: ${task1.title}. Description: ${task1.description}`,
        metadata: { priority: task1.priority, tags: ['Engineering', 'AI'] },
      },
      {
        userId: user.id,
        entityType: 'NOTE',
        entityId: note1.id,
        content: `Note: ${note1.title}. Content: ${note1.summary}`,
        metadata: { isPinned: note1.isPinned, tags: ['Engineering', 'AI'] },
      },
    ],
  });

  console.log('🧠 Vector Embeddings created');
  console.log('====================================================');
  console.log('✅ Phase 2 Seed Completed Successfully!');
  console.log(`Demo Credentials:
    Email:    demo@antigravity.ai
    Password: Password123!
  `);
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
