from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import require_auth
from app.api.routers import categories, dashboard, goals, summary, transactions, users
from app.core.config import get_settings


def create_app() -> FastAPI:
    """Application factory, so tests can build isolated app instances."""
    settings = get_settings()

    app = FastAPI(
        title="Expense Tracker API",
        version="0.1.0",
        debug=settings.environment == "development",
    )

    # Auth is Basic Auth (checked per-request, not cookies), so a wide-open
    # origin policy is still safe — avoids needing to track every dev
    # machine's LAN IP/port as an explicit allowed origin.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    protected = [Depends(require_auth)]
    app.include_router(transactions.router, dependencies=protected)
    app.include_router(categories.router, dependencies=protected)
    app.include_router(users.router, dependencies=protected)
    app.include_router(summary.router, dependencies=protected)
    app.include_router(goals.router, dependencies=protected)
    app.include_router(dashboard.router, dependencies=protected)

    return app


app = create_app()
