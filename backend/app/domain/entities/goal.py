from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class Goal:
    user_id: int
    name: str
    target_amount: Decimal
    current_amount: Decimal = Decimal("0")
    id: int | None = None

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise ValueError("Goal name must not be empty")
        if self.target_amount <= 0:
            raise ValueError("Goal target amount must be positive")
        if self.current_amount < 0:
            raise ValueError("Goal current amount must not be negative")
