from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import (
    CreateCategoryUseCaseDep,
    DeleteCategoryUseCaseDep,
    ListCategoriesUseCaseDep,
    UpdateCategoryUseCaseDep,
)
from app.api.schemas.category import CategoryCreateRequest, CategoryResponse
from app.application.exceptions import (
    CategoryInUseError,
    CategoryNameConflictError,
    CategoryNotFoundError,
)

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(use_case: ListCategoriesUseCaseDep) -> list[CategoryResponse]:
    categories = await use_case.execute()
    return [CategoryResponse.from_domain(category) for category in categories]


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    request: CategoryCreateRequest,
    use_case: CreateCategoryUseCaseDep,
) -> CategoryResponse:
    category = await use_case.execute(request.name)
    return CategoryResponse.from_domain(category)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    request: CategoryCreateRequest,
    use_case: UpdateCategoryUseCaseDep,
) -> CategoryResponse:
    try:
        category = await use_case.execute(category_id, request.name)
    except CategoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except CategoryNameConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc

    return CategoryResponse.from_domain(category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, use_case: DeleteCategoryUseCaseDep) -> None:
    try:
        await use_case.execute(category_id)
    except CategoryNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except CategoryInUseError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
