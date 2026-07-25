from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CreateTransactionUseCaseDep, ListTransactionsUseCaseDep
from app.api.schemas.transaction import TransactionCreateRequest, TransactionResponse
from app.application.dto import CreateTransactionInput
from app.application.exceptions import UserNotFoundError

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    request: TransactionCreateRequest,
    use_case: CreateTransactionUseCaseDep,
) -> TransactionResponse:
    try:
        detail = await use_case.execute(
            CreateTransactionInput(
                date=request.date,
                type=request.type,
                amount=request.amount,
                category_name=request.category_name,
                user_id=request.user_id,
                description=request.description,
            )
        )
    except UserNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return TransactionResponse.from_detail(detail)


@router.get("", response_model=list[TransactionResponse])
async def list_transactions(use_case: ListTransactionsUseCaseDep) -> list[TransactionResponse]:
    details = await use_case.execute()
    return [TransactionResponse.from_detail(detail) for detail in details]
