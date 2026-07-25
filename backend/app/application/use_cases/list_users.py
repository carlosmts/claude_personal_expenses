from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository


class ListUsersUseCase:
    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    async def execute(self) -> list[User]:
        return await self._user_repository.list_all()
