from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.use_cases.create_category import CreateCategoryUseCase
from app.application.use_cases.create_transaction import CreateTransactionUseCase
from app.application.use_cases.list_categories import ListCategoriesUseCase
from app.application.use_cases.list_transactions import ListTransactionsUseCase
from app.application.use_cases.list_users import ListUsersUseCase
from app.infrastructure.database import get_db_session
from app.infrastructure.repositories.sqlalchemy_category_repository import (
    SqlAlchemyCategoryRepository,
)
from app.infrastructure.repositories.sqlalchemy_transaction_repository import (
    SqlAlchemyTransactionRepository,
)
from app.infrastructure.repositories.sqlalchemy_user_repository import (
    SqlAlchemyUserRepository,
)

DbSession = Annotated[AsyncSession, Depends(get_db_session)]


def get_category_repository(session: DbSession) -> SqlAlchemyCategoryRepository:
    return SqlAlchemyCategoryRepository(session)


def get_transaction_repository(session: DbSession) -> SqlAlchemyTransactionRepository:
    return SqlAlchemyTransactionRepository(session)


def get_user_repository(session: DbSession) -> SqlAlchemyUserRepository:
    return SqlAlchemyUserRepository(session)


CategoryRepositoryDep = Annotated[SqlAlchemyCategoryRepository, Depends(get_category_repository)]
TransactionRepositoryDep = Annotated[
    SqlAlchemyTransactionRepository, Depends(get_transaction_repository)
]
UserRepositoryDep = Annotated[SqlAlchemyUserRepository, Depends(get_user_repository)]


def get_create_category_use_case(
    category_repository: CategoryRepositoryDep,
) -> CreateCategoryUseCase:
    return CreateCategoryUseCase(category_repository)


def get_list_categories_use_case(
    category_repository: CategoryRepositoryDep,
) -> ListCategoriesUseCase:
    return ListCategoriesUseCase(category_repository)


def get_list_users_use_case(user_repository: UserRepositoryDep) -> ListUsersUseCase:
    return ListUsersUseCase(user_repository)


CreateCategoryUseCaseDep = Annotated[CreateCategoryUseCase, Depends(get_create_category_use_case)]
ListCategoriesUseCaseDep = Annotated[ListCategoriesUseCase, Depends(get_list_categories_use_case)]
ListUsersUseCaseDep = Annotated[ListUsersUseCase, Depends(get_list_users_use_case)]


def get_create_transaction_use_case(
    transaction_repository: TransactionRepositoryDep,
    user_repository: UserRepositoryDep,
    create_category_use_case: CreateCategoryUseCaseDep,
) -> CreateTransactionUseCase:
    return CreateTransactionUseCase(
        transaction_repository=transaction_repository,
        user_repository=user_repository,
        create_category_use_case=create_category_use_case,
    )


def get_list_transactions_use_case(
    transaction_repository: TransactionRepositoryDep,
    category_repository: CategoryRepositoryDep,
    user_repository: UserRepositoryDep,
) -> ListTransactionsUseCase:
    return ListTransactionsUseCase(
        transaction_repository=transaction_repository,
        category_repository=category_repository,
        user_repository=user_repository,
    )


CreateTransactionUseCaseDep = Annotated[
    CreateTransactionUseCase, Depends(get_create_transaction_use_case)
]
ListTransactionsUseCaseDep = Annotated[
    ListTransactionsUseCase, Depends(get_list_transactions_use_case)
]
