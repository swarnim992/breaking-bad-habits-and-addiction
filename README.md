# PromptWar — Next.js + FastAPI

A full-stack skeleton with Next.js (App Router) frontend and FastAPI backend.

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**API Docs:** http://localhost:8000/api/v1/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**App:** http://localhost:3000

---

## Project Structure

```
warm_up_challenge_promptWar/
│
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI entry point
│   │   ├── config.py            ← Settings (Pydantic)
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py    ← Route aggregator
│   │   │       └── endpoints/
│   │   │           ├── health.py
│   │   │           └── users.py
│   │   ├── core/
│   │   │   ├── exceptions.py
│   │   │   └── logging.py
│   │   ├── schemas/
│   │   │   └── user.py
│   │   └── services/
│   │       └── user_service.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    └── src/
        ├── app/                 ← Next.js pages
        │   ├── page.tsx         ← Home
        │   └── dashboard/
        ├── components/
        │   ├── ui/              ← Button, Input
        │   └── layout/          ← Navbar, Sidebar
        ├── hooks/               ← useFetch
        ├── lib/                 ← api.ts, utils.ts
        ├── services/            ← userService.ts
        └── types/               ← User, API types
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Root info |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/users` | List all users |
| POST | `/api/v1/users` | Create user |
| GET | `/api/v1/users/{id}` | Get user by ID |
