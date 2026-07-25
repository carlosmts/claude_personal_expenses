from datetime import date as date_
from decimal import Decimal

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.entities.transaction import TransactionType
from app.infrastructure.models.base import Base
from app.infrastructure.models.category_model import CategoryModel
from app.infrastructure.models.user_model import UserModel

_TRANSACTION_TYPE_ENUM = Enum(
    TransactionType,
    name="transaction_type",
    values_callable=lambda enum: [member.value for member in enum],
)


class TransactionModel(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[date_] = mapped_column(Date, nullable=False, index=True)
    type: Mapped[TransactionType] = mapped_column(_TRANSACTION_TYPE_ENUM, nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    category: Mapped[CategoryModel] = relationship(lazy="joined")
    user: Mapped[UserModel] = relationship(lazy="joined")
