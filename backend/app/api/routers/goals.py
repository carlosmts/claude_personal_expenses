from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import (
    CreateGoalUseCaseDep,
    DeleteGoalUseCaseDep,
    ListGoalsUseCaseDep,
    UpdateGoalUseCaseDep,
)
from app.api.schemas.goal import GoalCreateRequest, GoalResponse
from app.application.dto import GoalInput
from app.application.exceptions import GoalNotFoundError, UserNotFoundError

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[GoalResponse])
async def list_goals(use_case: ListGoalsUseCaseDep) -> list[GoalResponse]:
    details = await use_case.execute()
    return [GoalResponse.from_detail(detail) for detail in details]


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(request: GoalCreateRequest, use_case: CreateGoalUseCaseDep) -> GoalResponse:
    try:
        detail = await use_case.execute(
            GoalInput(
                user_id=request.user_id,
                name=request.name,
                target_amount=request.target_amount,
                current_amount=request.current_amount,
            )
        )
    except UserNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return GoalResponse.from_detail(detail)


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    request: GoalCreateRequest,
    use_case: UpdateGoalUseCaseDep,
) -> GoalResponse:
    try:
        detail = await use_case.execute(
            goal_id,
            GoalInput(
                user_id=request.user_id,
                name=request.name,
                target_amount=request.target_amount,
                current_amount=request.current_amount,
            ),
        )
    except GoalNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except UserNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return GoalResponse.from_detail(detail)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(goal_id: int, use_case: DeleteGoalUseCaseDep) -> None:
    try:
        await use_case.execute(goal_id)
    except GoalNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
