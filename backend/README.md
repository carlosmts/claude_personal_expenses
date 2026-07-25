# Backend

FastAPI backend for the personal expense tracker, following Clean
Architecture layering:

```
app/
├── domain/          # Entities + repository interfaces (no framework deps)
├── application/     # Use cases / services — business logic
├── infrastructure/  # SQLAlchemy models, repository implementations, DB session
├── api/             # FastAPI routers, request/response schemas
├── core/            # Settings, DI wiring
└── main.py          # FastAPI app factory
```

Dependency rule: `api` and `infrastructure` depend on `domain`/`application`;
`domain` depends on nothing else in the project.

## Local setup

```bash
cd backend
uv sync
cp ../.env.example ../.env   # if not already done at repo root
uv run uvicorn app.main:app --reload
```

## Running via Docker Compose (from repo root)

```bash
cp .env.example .env
docker compose up --build
```

The API will be available at `http://localhost:8000`, with a health check at
`http://localhost:8000/health`.

## Tests

```bash
uv run pytest
```
