from pydantic import BaseModel, Field

from app.domain.entities.user import User


class UserUpdateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class UserResponse(BaseModel):
    id: int
    name: str

    @classmethod
    def from_domain(cls, user: User) -> "UserResponse":
        assert user.id is not None, "persisted user must have an id"
        return cls(id=user.id, name=user.name)
