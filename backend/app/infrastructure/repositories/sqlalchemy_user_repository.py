from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.models.user_model import UserModel


def _to_domain(model: UserModel) -> User:
    return User(id=model.id, name=model.name)


class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_all(self) -> list[User]:
        result = await self._session.execute(select(UserModel).order_by(UserModel.id))
        return [_to_domain(model) for model in result.scalars()]

    async def get_by_id(self, user_id: int) -> User | None:
        model = await self._session.get(UserModel, user_id)
        return _to_domain(model) if model else None
