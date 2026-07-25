# Personal Expense Tracker

A production-quality personal expense tracker for two users, built with a
FastAPI + PostgreSQL backend, a SwiftUI iOS client, and a React web client.

## Architecture

- **Backend** (`backend/`): FastAPI, following Clean Architecture layering
  (`domain` → `application` → `infrastructure` → `api`), SQLAlchemy, Alembic
  migrations, PostgreSQL.
- **iOS app** (`ios/`): SwiftUI, MVVM, async/await networking. Sideloaded
  directly to a personal device (not distributed via the App Store). Used
  day-to-day.
- **Web app** (`web/`): React + TypeScript SPA, same backend. Used for
  bigger-screen viewing/editing (laptop/desktop) alongside the iPhone app.
- **Infrastructure**: Docker Compose for local Postgres + backend.

See `backend/README.md`, `ios/README.md`, and `web/README.md` for
platform-specific setup instructions.

## Status

Backend and iOS app cover Transactions, Categories, Goals, monthly Reports,
and Settings. Web app in progress, starting with a read-only Dashboard.
