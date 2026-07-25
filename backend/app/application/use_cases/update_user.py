from app.application.exceptions import UserNameConflictError, UserNotFoundError
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository


class UpdateUserUseCase:
    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    async def execute(self, user_id: int, new_name: str) -> User:
        existing = await self._user_repository.get_by_id(user_id)
        if existing is None:
            raise UserNotFoundError(f"User {user_id} does not exist")

        all_users = await self._user_repository.list_all()
        if any(user.name == new_name and user.id != user_id for user in all_users):
            raise UserNameConflictError(f"User name '{new_name}' is already in use")

        return await self._user_repository.update(User(id=user_id, name=new_name))
