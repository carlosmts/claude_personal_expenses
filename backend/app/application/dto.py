from dataclasses import dataclass
from datetime import date as date_
from decimal import Decimal

from app.domain.entities.transaction import TransactionType


@dataclass(frozen=True, slots=True)
class CreateTransactionInput:
    date: date_
    type: TransactionType
    amount: Decimal
    category_name: str
    user_id: int
    description: str | None = None


@dataclass(frozen=True, slots=True)
class TransactionDetail:
    """Read model for a persisted transaction, enriched with category/user names."""

    id: int
    date: date_
    type: TransactionType
    amount: Decimal
    description: str | None
    category_id: int
    category_name: str
    user_id: int
    user_name: str
