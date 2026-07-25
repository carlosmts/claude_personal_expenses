from abc import ABC, abstractmethod

from app.domain.entities.transaction import Transaction


class TransactionRepository(ABC):
    """Persistence contract for transactions, independent of any DB technology."""

    @abstractmethod
    async def add(self, transaction: Transaction) -> Transaction: ...

    @abstractmethod
    async def list_all(self) -> list[Transaction]: ...

    @abstractmethod
    async def get_by_id(self, transaction_id: int) -> Transaction | None: ...

    @abstractmethod
    async def update(self, transaction: Transaction) -> Transaction: ...

    @abstractmethod
    async def delete(self, transaction_id: int) -> bool: ...
