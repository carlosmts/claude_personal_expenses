from fastapi import APIRouter, status

from app.api.dependencies import CreateCategoryUseCaseDep, ListCategoriesUseCaseDep
from app.api.schemas.category import CategoryCreateRequest, CategoryResponse

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
