from app.application.exceptions import TransactionNotFoundError
from app.domain.repositories.transaction_repository import TransactionRepository


class DeleteTransactionUseCase:
    def __init__(self, transaction_repository: TransactionRepository) -> None:
        self._transaction_repository = transaction_repository

    async def execute(self, transaction_id: int) -> None:
        deleted = await self._transaction_repository.delete(transaction_id)
        if not deleted:
            raise TransactionNotFoundError(f"Transaction {transaction_id} does not exist")
