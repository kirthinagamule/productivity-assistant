# AI-Powered Personal Productivity Assistant

A modern, full-stack personal productivity ecosystem combining task management, smart notes, calendar scheduling, real-time reminders, and cutting-edge AI capabilities (natural language task parsing, daily planning, semantic vector search, note summarization, and interactive AI coaching).

---

## Architecture Overview

- **Frontend (`client/`)**: React 18, Vite, Tailwind CSS, Lucide Icons, Socket.IO Client, Axios, Zustand.
- **Backend API (`server/`)**: Node.js, Express.js, Prisma ORM, Socket.IO, JWT + bcrypt, Winston.
- **AI Microservice (`ai-service/`)**: Python, FastAPI, Pydantic, pgvector embeddings, Gemini / OpenAI SDKs with smart fallback.
- **Database**: PostgreSQL 16 with `pgvector` vector similarity search extension.
- **Orchestration**: Docker & Docker Compose.

---

## Directory Structure

```text
productivity-assistant/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, svg
│   │   ├── components/         # Reusable UI & layout components
│   │   │   ├── layout/         # Navbar, Sidebar, AppLayout
│   │   │   └── ui/             # Buttons, Cards, Inputs, Badges, Modals
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Dashboard, Tasks, Notes, Calendar, AI Planner, Analytics
│   │   ├── services/           # Axios API client, Socket.io client
│   │   ├── utils/              # Formatting, date helpers
│   │   ├── App.jsx             # Main router & app shell
│   │   ├── index.css           # Design tokens, Tailwind directives
│   │   └── main.jsx            # React root mount
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Full relational schema + pgvector models
│   │   ├── init-pgvector.sql   # PostgreSQL vector extension initialization
│   │   └── seed.js             # Initial database seeder
│   ├── src/
│   │   ├── config/             # Environment, Database, Logger configs
│   │   ├── controllers/        # Request handlers (Auth, Tasks, Notes, AI, Analytics)
│   │   ├── middleware/         # JWT Auth, Error Handler, Request Validation
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Core business logic & AI bridge
│   │   ├── sockets/            # Socket.IO event handlers
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point & listener
│   ├── Dockerfile
│   └── package.json
│
├── ai-service/                 # AI Engine (Python + FastAPI)
│   ├── app/
│   │   ├── api/v1/endpoints/   # Parser, Planner, Search, Chat endpoints
│   │   ├── core/               # Settings & Logging configuration
│   │   ├── models/             # Pydantic request/response schemas
│   │   ├── services/           # LLM Providers (Gemini/OpenAI/Mock), Embeddings
│   │   └── main.py             # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
│
├── .env.example                # Unified environment variables template
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Full multi-container composition
├── package.json                # Monorepo root scripts
└── README.md                   # Project documentation
```

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Docker & Docker Compose (or local PostgreSQL 16 with pgvector)

### Running with Docker Compose
```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start all services in detached mode
docker compose up -d --build

# 3. Access applications:
# Frontend:     http://localhost:5173
# Backend API:  http://localhost:5000/api/health
# AI Service:   http://localhost:8000/health
# PostgreSQL:   localhost:5432
```

### Running Locally (Manual Development)
1. **Database**: Ensure PostgreSQL is running on port `5432` with database `productivity_assistant_db`.
2. **Backend**:
   ```bash
   cd server
   npm install
   npx prisma generate
   npx prisma db push
   npm run seed
   npm run dev
   ```
3. **AI Service**:
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
4. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
