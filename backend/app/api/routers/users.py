from fastapi import APIRouter

from app.api.dependencies import ListUsersUseCaseDep
from app.api.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
async def list_users(use_case: ListUsersUseCaseDep) -> list[UserResponse]:
    users = await use_case.execute()
    return [UserResponse.from_domain(user) for user in users]
