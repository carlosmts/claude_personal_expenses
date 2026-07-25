from datetime import date
from decimal import Decimal

import pytest

from app.domain.entities.transaction import Transaction, TransactionType


def test_transaction_accepts_positive_amount() -> None:
    transaction = Transaction(
        date=date(2026, 1, 1),
        type=TransactionType.EXPENSE,
        amount=Decimal("12.50"),
        category_id=1,
        user_id=1,
    )

    assert transaction.amount == Decimal("12.50")


@pytest.mark.parametrize("amount", [Decimal("0"), Decimal("-5.00")])
def test_transaction_rejects_non_positive_amount(amount: Decimal) -> None:
    with pytest.raises(ValueError, match="positive"):
        Transaction(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=amount,
            category_id=1,
            user_id=1,
        )
