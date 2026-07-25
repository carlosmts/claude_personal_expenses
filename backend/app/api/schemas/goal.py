from decimal import Decimal

from pydantic import BaseModel, Field

from app.application.dto import GoalDetail


class GoalCreateRequest(BaseModel):
    user_id: int
    name: str = Field(min_length=1, max_length=100)
    target_amount: Decimal = Field(gt=0)
    current_amount: Decimal = Field(default=Decimal("0"), ge=0)


class GoalResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    name: str
    target_amount: Decimal
    current_amount: Decimal

    @classmethod
    def from_detail(cls, detail: GoalDetail) -> "GoalResponse":
        return cls(
            id=detail.id,
            user_id=detail.user_id,
            user_name=detail.user_name,
            name=detail.name,
            target_amount=detail.target_amount,
            current_amount=detail.current_amount,
        )
