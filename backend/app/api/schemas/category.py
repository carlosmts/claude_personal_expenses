from pydantic import BaseModel, Field

from app.domain.entities.category import Category


class CategoryCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class CategoryResponse(BaseModel):
    id: int
    name: str

    @classmethod
    def from_domain(cls, category: Category) -> "CategoryResponse":
        assert category.id is not None, "persisted category must have an id"
        return cls(id=category.id, name=category.name)
