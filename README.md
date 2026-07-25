# Personal Expense Tracker

A production-quality personal expense tracker for two users, built with a
FastAPI + PostgreSQL backend and a SwiftUI iOS client.

## Architecture

- **Backend** (`backend/`): FastAPI, following Clean Architecture layering
  (`domain` → `application` → `infrastructure` → `api`), SQLAlchemy, Alembic
  migrations, PostgreSQL.
- **iOS app** (`ios/`): SwiftUI, MVVM, async/await networking. Sideloaded
  directly to a personal device (not distributed via the App Store).
- **Infrastructure**: Docker Compose for local Postgres + backend.

See `backend/README.md` (added alongside the backend scaffold) for
backend-specific setup instructions.

## Status

Early scaffolding stage — see commit history / project board for progress.
