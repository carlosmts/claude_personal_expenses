from app.application.exceptions import UserNotFoundError
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository


async def resolve_optional_user(user_id: int | None, user_repository: UserRepository) -> User | None:
    """Looks up a user by id, or returns None when user_id is None (a shared goal).

    Raises UserNotFoundError if a user_id is given but doesn't match any user.
    """
    if user_id is None:
        return None

    user = await user_repository.get_by_id(user_id)
    if user is None:
        raise UserNotFoundError(f"User {user_id} does not exist")
    return user
