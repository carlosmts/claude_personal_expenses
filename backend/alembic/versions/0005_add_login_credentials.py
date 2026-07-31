"""add login_username and password_hash to users for Basic Auth

Revision ID: 0005
Revises: 0004
Create Date: 2026-08-01

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: str | None = "0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

LOGIN_USERNAMES = {"Carlos": "litos", "Filipa": "pipa"}


def upgrade() -> None:
    op.add_column("users", sa.Column("login_username", sa.String(length=50), nullable=True))
    op.add_column("users", sa.Column("password_hash", sa.String(length=255), nullable=True))

    users_table = sa.table("users", sa.column("name", sa.String), sa.column("login_username", sa.String))
    for name, login_username in LOGIN_USERNAMES.items():
        op.execute(users_table.update().where(users_table.c.name == name).values(login_username=login_username))

    op.alter_column("users", "login_username", nullable=False)
    op.create_unique_constraint("uq_users_login_username", "users", ["login_username"])


def downgrade() -> None:
    op.drop_constraint("uq_users_login_username", "users", type_="unique")
    op.drop_column("users", "password_hash")
    op.drop_column("users", "login_username")
