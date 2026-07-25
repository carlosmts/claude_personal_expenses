from pydantic import BaseModel

from app.domain.entities.user import User


class UserResponse(BaseModel):
    id: int
    name: str

    @classmethod
    def from_domain(cls, user: User) -> "UserResponse":
        assert user.id is not None, "persisted user must have an id"
        return cls(id=user.id, name=user.name)
