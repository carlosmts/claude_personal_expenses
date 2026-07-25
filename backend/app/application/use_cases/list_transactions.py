from app.application.dto import TransactionDetail
from app.domain.repositories.category_repository import CategoryRepository
from app.domain.repositories.transaction_repository import TransactionRepository
from app.domain.repositories.user_repository import UserRepository


class ListTransactionsUseCase:
    """Lists transactions enriched with category/user names for display.

    Categories and users are fetched in bulk (not per-transaction) since both
    sets are small for this app's scale, avoiding N+1 queries.
    """

    def __init__(
        self,
        transaction_repository: TransactionRepository,
        category_repository: CategoryRepository,
        user_repository: UserRepository,
    ) -> None:
        self._transaction_repository = transaction_repository
        self._category_repository = category_repository
        self._user_repository = user_repository

    async def execute(self) -> list[TransactionDetail]:
        transactions = await self._transaction_repository.list_all()
        categories_by_id = {category.id: category for category in await self._category_repository.list_all()}
        users_by_id = {user.id: user for user in await self._user_repository.list_all()}

        return [
            TransactionDetail.from_parts(
                transaction,
                categories_by_id[transaction.category_id],
                users_by_id[transaction.user_id],
            )
            for transaction in transactions
        ]
