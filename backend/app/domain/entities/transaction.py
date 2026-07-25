from dataclasses import dataclass
from datetime import date as date_
from decimal import Decimal
from enum import StrEnum


class TransactionType(StrEnum):
    EXPENSE = "expense"
    INCOME = "income"


@dataclass(frozen=True, slots=True)
class Transaction:
    date: date_
    type: TransactionType
    amount: Decimal
    category_id: int
    user_id: int
    description: str | None = None
    id: int | None = None

    def __post_init__(self) -> None:
        if self.amount <= 0:
            raise ValueError("Transaction amount must be positive")
