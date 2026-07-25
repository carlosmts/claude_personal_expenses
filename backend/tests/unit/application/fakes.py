from app.domain.entities.category import Category
from app.domain.entities.transaction import Transaction
from app.domain.entities.user import User
from app.domain.repositories.category_repository import CategoryRepository
from app.domain.repositories.transaction_repository import TransactionRepository
from app.domain.repositories.user_repository import UserRepository


class FakeCategoryRepository(CategoryRepository):
    def __init__(self, categories: list[Category] | None = None) -> None:
        self._categories = list(categories or [])
        self._next_id = max((c.id for c in self._categories if c.id is not None), default=0) + 1

    async def add(self, category: Category) -> Category:
        persisted = Category(id=self._next_id, name=category.name)
        self._next_id += 1
        self._categories.append(persisted)
        return persisted

    async def list_all(self) -> list[Category]:
        return list(self._categories)

    async def get_by_name(self, name: str) -> Category | None:
        return next((c for c in self._categories if c.name == name), None)

    async def get_by_id(self, category_id: int) -> Category | None:
        return next((c for c in self._categories if c.id == category_id), None)


class FakeUserRepository(UserRepository):
    def __init__(self, users: list[User] | None = None) -> None:
        self._users = list(users or [])

    async def list_all(self) -> list[User]:
        return list(self._users)

    async def get_by_id(self, user_id: int) -> User | None:
        return next((u for u in self._users if u.id == user_id), None)


class FakeTransactionRepository(TransactionRepository):
    def __init__(self) -> None:
        self._transactions: list[Transaction] = []
        self._next_id = 1

    async def add(self, transaction: Transaction) -> Transaction:
        persisted = Transaction(
            id=self._next_id,
            date=transaction.date,
            type=transaction.type,
            amount=transaction.amount,
            category_id=transaction.category_id,
            user_id=transaction.user_id,
            description=transaction.description,
        )
        self._next_id += 1
        self._transactions.append(persisted)
        return persisted

    async def list_all(self) -> list[Transaction]:
        return list(self._transactions)

    async def get_by_id(self, transaction_id: int) -> Transaction | None:
        return next((t for t in self._transactions if t.id == transaction_id), None)

    async def update(self, transaction: Transaction) -> Transaction:
        index = next(i for i, t in enumerate(self._transactions) if t.id == transaction.id)
        self._transactions[index] = transaction
        return transaction

    async def delete(self, transaction_id: int) -> bool:
        index = next(
            (i for i, t in enumerate(self._transactions) if t.id == transaction_id), None
        )
        if index is None:
            return False
        del self._transactions[index]
        return True
