"""initial schema: users, categories, transactions

Revision ID: 0001
Revises:
Create Date: 2026-07-25

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

from app.domain.entities.transaction import TransactionType

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TRANSACTION_TYPE_ENUM = sa.Enum(
    TransactionType,
    name="transaction_type",
    values_callable=lambda enum: [member.value for member in enum],
)

# Placeholder seed data — two users, no auth yet. Rename via a follow-up migration
# once real names are confirmed.
SEED_USER_NAMES = ["Carlos", "Partner"]


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
    )

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
    )

    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("type", TRANSACTION_TYPE_ENUM, nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
    )
    op.create_index("ix_transactions_date", "transactions", ["date"])
    op.create_index("ix_transactions_category_id", "transactions", ["category_id"])
    op.create_index("ix_transactions_user_id", "transactions", ["user_id"])

    users_table = sa.table("users", sa.column("id", sa.Integer), sa.column("name", sa.String))
    op.bulk_insert(users_table, [{"name": name} for name in SEED_USER_NAMES])


def downgrade() -> None:
    op.drop_index("ix_transactions_user_id", table_name="transactions")
    op.drop_index("ix_transactions_category_id", table_name="transactions")
    op.drop_index("ix_transactions_date", table_name="transactions")
    op.drop_table("transactions")
    op.drop_table("categories")
    op.drop_table("users")
    TRANSACTION_TYPE_ENUM.drop(op.get_bind(), checkfirst=True)
