from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import ListUsersUseCaseDep, UpdateUserUseCaseDep
from app.api.schemas.user import UserResponse, UserUpdateRequest
from app.application.exceptions import UserNameConflictError, UserNotFoundError

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
async def list_users(use_case: ListUsersUseCaseDep) -> list[UserResponse]:
    users = await use_case.execute()
    return [UserResponse.from_domain(user) for user in users]


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    request: UserUpdateRequest,
    use_case: UpdateUserUseCaseDep,
) -> UserResponse:
    try:
        user = await use_case.execute(user_id, request.name)
    except UserNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except UserNameConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc

    return UserResponse.from_domain(user)
