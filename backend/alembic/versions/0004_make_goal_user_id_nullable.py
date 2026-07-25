"""make goals.user_id nullable for shared/household goals

Revision ID: 0004
Revises: 0003
Create Date: 2026-07-25

"""

from collections.abc import Sequence

from alembic import op

revision: str = "0004"
down_revision: str | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("goals", "user_id", nullable=True)


def downgrade() -> None:
    op.alter_column("goals", "user_id", nullable=False)
