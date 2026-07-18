# PromptWar — FastAPI Backend

## Quick Start

```bash
# 1. Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and set SECRET_KEY

# 4. Run the dev server
uvicorn app.main:app --reload --port 8000
```

## API Docs

| URL | Description |
|-----|-------------|
| `http://localhost:8000/api/v1/docs` | Swagger UI |
| `http://localhost:8000/api/v1/redoc` | ReDoc |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | - | Root info |
| GET | `/api/v1/health` | - | Health check |
| POST | `/api/v1/auth/login` | - | Login → JWT |
| POST | `/api/v1/auth/logout` | - | Logout |
| POST | `/api/v1/users` | - | Register |
| GET | `/api/v1/users/me` | Bearer | Current user |

## Running Tests

```bash
pytest tests/ -v
```

## Project Structure

```
app/
├── main.py           ← FastAPI entry point
├── config.py         ← Settings (Pydantic)
├── api/              ← Route handlers
│   ├── deps.py       ← Dependency injection
│   └── v1/
│       ├── router.py
│       └── endpoints/
├── core/             ← Security, logging, exceptions
├── schemas/          ← Pydantic I/O models
└── services/         ← Business logic
```
