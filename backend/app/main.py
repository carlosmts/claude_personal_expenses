from fastapi import FastAPI

from app.api.routers import categories, transactions, users
from app.core.config import get_settings


def create_app() -> FastAPI:
    """Application factory, so tests can build isolated app instances."""
    settings = get_settings()

    app = FastAPI(
        title="Expense Tracker API",
        version="0.1.0",
        debug=settings.environment == "development",
    )

    @app.get("/health")
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(transactions.router)
    app.include_router(categories.router)
    app.include_router(users.router)

    return app


app = create_app()
