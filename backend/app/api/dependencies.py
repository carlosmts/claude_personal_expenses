from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.use_cases.create_category import CreateCategoryUseCase
from app.application.use_cases.create_goal import CreateGoalUseCase
from app.application.use_cases.create_transaction import CreateTransactionUseCase
from app.application.use_cases.delete_category import DeleteCategoryUseCase
from app.application.use_cases.delete_goal import DeleteGoalUseCase
from app.application.use_cases.delete_transaction import DeleteTransactionUseCase
from app.application.use_cases.get_monthly_summary import GetMonthlySummaryUseCase
from app.application.use_cases.list_categories import ListCategoriesUseCase
from app.application.use_cases.list_goals import ListGoalsUseCase
from app.application.use_cases.list_transactions import ListTransactionsUseCase
from app.application.use_cases.list_users import ListUsersUseCase
from app.application.use_cases.update_category import UpdateCategoryUseCase
from app.application.use_cases.update_goal import UpdateGoalUseCase
from app.application.use_cases.update_transaction import UpdateTransactionUseCase
from app.application.use_cases.update_user import UpdateUserUseCase
from app.infrastructure.database import get_db_session
from app.infrastructure.repositories.sqlalchemy_category_repository import (
    SqlAlchemyCategoryRepository,
)
from app.infrastructure.repositories.sqlalchemy_goal_repository import (
    SqlAlchemyGoalRepository,
)
from app.infrastructure.repositories.sqlalchemy_summary_repository import (
    SqlAlchemySummaryRepository,
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


def get_update_category_use_case(
    category_repository: CategoryRepositoryDep,
) -> UpdateCategoryUseCase:
    return UpdateCategoryUseCase(category_repository)


def get_delete_category_use_case(
    category_repository: CategoryRepositoryDep,
    transaction_repository: TransactionRepositoryDep,
) -> DeleteCategoryUseCase:
    return DeleteCategoryUseCase(category_repository, transaction_repository)


def get_update_user_use_case(user_repository: UserRepositoryDep) -> UpdateUserUseCase:
    return UpdateUserUseCase(user_repository)


CreateCategoryUseCaseDep = Annotated[CreateCategoryUseCase, Depends(get_create_category_use_case)]
ListCategoriesUseCaseDep = Annotated[ListCategoriesUseCase, Depends(get_list_categories_use_case)]
ListUsersUseCaseDep = Annotated[ListUsersUseCase, Depends(get_list_users_use_case)]
UpdateCategoryUseCaseDep = Annotated[
    UpdateCategoryUseCase, Depends(get_update_category_use_case)
]
DeleteCategoryUseCaseDep = Annotated[
    DeleteCategoryUseCase, Depends(get_delete_category_use_case)
]
UpdateUserUseCaseDep = Annotated[UpdateUserUseCase, Depends(get_update_user_use_case)]


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


def get_update_transaction_use_case(
    transaction_repository: TransactionRepositoryDep,
    user_repository: UserRepositoryDep,
    create_category_use_case: CreateCategoryUseCaseDep,
) -> UpdateTransactionUseCase:
    return UpdateTransactionUseCase(
        transaction_repository=transaction_repository,
        user_repository=user_repository,
        create_category_use_case=create_category_use_case,
    )


def get_delete_transaction_use_case(
    transaction_repository: TransactionRepositoryDep,
) -> DeleteTransactionUseCase:
    return DeleteTransactionUseCase(transaction_repository)


UpdateTransactionUseCaseDep = Annotated[
    UpdateTransactionUseCase, Depends(get_update_transaction_use_case)
]
DeleteTransactionUseCaseDep = Annotated[
    DeleteTransactionUseCase, Depends(get_delete_transaction_use_case)
]


def get_summary_repository(session: DbSession) -> SqlAlchemySummaryRepository:
    return SqlAlchemySummaryRepository(session)


SummaryRepositoryDep = Annotated[SqlAlchemySummaryRepository, Depends(get_summary_repository)]


def get_monthly_summary_use_case(
    summary_repository: SummaryRepositoryDep,
) -> GetMonthlySummaryUseCase:
    return GetMonthlySummaryUseCase(summary_repository)


GetMonthlySummaryUseCaseDep = Annotated[
    GetMonthlySummaryUseCase, Depends(get_monthly_summary_use_case)
]


def get_goal_repository(session: DbSession) -> SqlAlchemyGoalRepository:
    return SqlAlchemyGoalRepository(session)


GoalRepositoryDep = Annotated[SqlAlchemyGoalRepository, Depends(get_goal_repository)]


def get_create_goal_use_case(
    goal_repository: GoalRepositoryDep,
    user_repository: UserRepositoryDep,
) -> CreateGoalUseCase:
    return CreateGoalUseCase(goal_repository, user_repository)


def get_list_goals_use_case(
    goal_repository: GoalRepositoryDep,
    user_repository: UserRepositoryDep,
) -> ListGoalsUseCase:
    return ListGoalsUseCase(goal_repository, user_repository)


def get_update_goal_use_case(
    goal_repository: GoalRepositoryDep,
    user_repository: UserRepositoryDep,
) -> UpdateGoalUseCase:
    return UpdateGoalUseCase(goal_repository, user_repository)


def get_delete_goal_use_case(goal_repository: GoalRepositoryDep) -> DeleteGoalUseCase:
    return DeleteGoalUseCase(goal_repository)


CreateGoalUseCaseDep = Annotated[CreateGoalUseCase, Depends(get_create_goal_use_case)]
ListGoalsUseCaseDep = Annotated[ListGoalsUseCase, Depends(get_list_goals_use_case)]
UpdateGoalUseCaseDep = Annotated[UpdateGoalUseCase, Depends(get_update_goal_use_case)]
DeleteGoalUseCaseDep = Annotated[DeleteGoalUseCase, Depends(get_delete_goal_use_case)]
