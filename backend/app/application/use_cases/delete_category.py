from app.application.exceptions import CategoryInUseError, CategoryNotFoundError
from app.domain.repositories.category_repository import CategoryRepository
from app.domain.repositories.transaction_repository import TransactionRepository


class DeleteCategoryUseCase:
    def __init__(
        self,
        category_repository: CategoryRepository,
        transaction_repository: TransactionRepository,
    ) -> None:
        self._category_repository = category_repository
        self._transaction_repository = transaction_repository

    async def execute(self, category_id: int) -> None:
        existing = await self._category_repository.get_by_id(category_id)
        if existing is None:
            raise CategoryNotFoundError(f"Category {category_id} does not exist")

        in_use = await self._transaction_repository.exists_for_category(category_id)
        if in_use:
            raise CategoryInUseError(
                f"Category {category_id} still has transactions and cannot be deleted"
            )

        await self._category_repository.delete(category_id)
