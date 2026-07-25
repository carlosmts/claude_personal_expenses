"""rename seed user 'Partner' to 'Filipa'

Revision ID: 0002
Revises: 0001
Create Date: 2026-07-25

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

users_table = sa.table("users", sa.column("name", sa.String))


def upgrade() -> None:
    op.execute(users_table.update().where(users_table.c.name == "Partner").values(name="Filipa"))


def downgrade() -> None:
    op.execute(users_table.update().where(users_table.c.name == "Filipa").values(name="Partner"))
