from app.domain.entities.category import Category
from app.domain.entities.dashboard import DashboardSummary
from app.domain.entities.goal import Goal
from app.domain.entities.summary import MonthlySummary
from app.domain.entities.transaction import Transaction
from app.domain.entities.user import User
from app.domain.repositories.category_repository import CategoryRepository
from app.domain.repositories.dashboard_repository import DashboardRepository
from app.domain.repositories.goal_repository import GoalRepository
from app.domain.repositories.summary_repository import SummaryRepository
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

    async def update(self, category: Category) -> Category:
        index = next(i for i, c in enumerate(self._categories) if c.id == category.id)
        self._categories[index] = category
        return category

    async def delete(self, category_id: int) -> bool:
        index = next(
            (i for i, c in enumerate(self._categories) if c.id == category_id), None
        )
        if index is None:
            return False
        del self._categories[index]
        return True


class FakeUserRepository(UserRepository):
    def __init__(self, users: list[User] | None = None) -> None:
        self._users = list(users or [])

    async def list_all(self) -> list[User]:
        return list(self._users)

    async def get_by_id(self, user_id: int) -> User | None:
        return next((u for u in self._users if u.id == user_id), None)

    async def update(self, user: User) -> User:
        index = next(i for i, u in enumerate(self._users) if u.id == user.id)
        self._users[index] = user
        return user


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

    async def exists_for_category(self, category_id: int) -> bool:
        return any(t.category_id == category_id for t in self._transactions)


class FakeSummaryRepository(SummaryRepository):
    def __init__(self, summary: MonthlySummary) -> None:
        self._summary = summary

    async def get_monthly_summary(self, year: int, month: int) -> MonthlySummary:
        return self._summary


class FakeGoalRepository(GoalRepository):
    def __init__(self) -> None:
        self._goals: list[Goal] = []
        self._next_id = 1

    async def add(self, goal: Goal) -> Goal:
        persisted = Goal(
            id=self._next_id,
            user_id=goal.user_id,
            name=goal.name,
            target_amount=goal.target_amount,
            current_amount=goal.current_amount,
        )
        self._next_id += 1
        self._goals.append(persisted)
        return persisted

    async def list_all(self) -> list[Goal]:
        return list(self._goals)

    async def get_by_id(self, goal_id: int) -> Goal | None:
        return next((g for g in self._goals if g.id == goal_id), None)

    async def update(self, goal: Goal) -> Goal:
        index = next(i for i, g in enumerate(self._goals) if g.id == goal.id)
        self._goals[index] = goal
        return goal

    async def delete(self, goal_id: int) -> bool:
        index = next((i for i, g in enumerate(self._goals) if g.id == goal_id), None)
        if index is None:
            return False
        del self._goals[index]
        return True


class FakeDashboardRepository(DashboardRepository):
    def __init__(self, summary: DashboardSummary) -> None:
        self._summary = summary

    async def get_dashboard_summary(self, year: int, month: int, user_id: int | None) -> DashboardSummary:
        return self._summary
