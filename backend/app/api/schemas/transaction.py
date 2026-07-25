from datetime import date as date_
from decimal import Decimal

from pydantic import BaseModel, Field

from app.application.dto import TransactionDetail
from app.domain.entities.transaction import TransactionType


class TransactionCreateRequest(BaseModel):
    date: date_ = Field(default_factory=date_.today)
    type: TransactionType
    amount: Decimal = Field(gt=0)
    category_name: str = Field(min_length=1, max_length=100)
    user_id: int
    description: str | None = Field(default=None, max_length=255)


class TransactionResponse(BaseModel):
    id: int
    date: date_
    type: TransactionType
    amount: Decimal
    description: str | None
    category_id: int
    category_name: str
    user_id: int
    user_name: str

    @classmethod
    def from_detail(cls, detail: TransactionDetail) -> "TransactionResponse":
        return cls(
            id=detail.id,
            date=detail.date,
            type=detail.type,
            amount=detail.amount,
            description=detail.description,
            category_id=detail.category_id,
            category_name=detail.category_name,
            user_id=detail.user_id,
            user_name=detail.user_name,
        )
