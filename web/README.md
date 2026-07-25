# Web

React + TypeScript SPA, talking to the same FastAPI backend as the iOS app.
Meant for bigger-screen viewing/editing (laptop/desktop) alongside daily use
of the iPhone app.

```
src/
├── domain/        # Camel-case domain types (Transaction, Category, Goal, ...)
├── api/           # Fetch client + wire-format DTOs (snake_case, Decimal-as-string)
├── components/    # Shared UI (Sidebar, Layout, StatCard, BalanceCard, CategoryIcon)
├── features/      # One folder per page: queries (React Query) + the page component
└── lib/           # Small framework-free utilities (currency formatting, category icon lookup)
```

Mirrors the iOS app's layering: `domain` types are clean and framework-free,
`api/dto.ts` handles the wire-format quirks (snake_case, Decimal-as-string)
and maps to domain types, and each feature's React Query hooks play the same
role the iOS ViewModels do — wrapping fetch/mutate calls with loading/error
state.

## Local setup

```bash
cd web
npm install
npm run dev
```

Opens at `http://localhost:5173`. The backend must be running
(`docker compose up -d` from the repo root) — CORS is already enabled there
for local development.

## Configuring the backend URL

Defaults to `http://localhost:8000` (works when both run on the same Mac).
Override via a `.env.local` file:

```
VITE_API_BASE_URL=http://192.168.1.x:8000
```

Or change it at runtime from the Settings page once built (persisted to
`localStorage`, no rebuild needed) — same pattern as the iOS app's editable
backend URL.

## Checks

```bash
npx tsc -b       # type-check
npm run lint     # oxlint
npm run build    # production build
```
