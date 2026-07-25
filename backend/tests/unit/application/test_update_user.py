import pytest

from app.application.exceptions import UserNameConflictError, UserNotFoundError
from app.application.use_cases.update_user import UpdateUserUseCase
from app.domain.entities.user import User
from tests.unit.application.fakes import FakeUserRepository


async def test_renames_existing_user() -> None:
    repository = FakeUserRepository([User(id=1, name="Carlos")])
    use_case = UpdateUserUseCase(repository)

    updated = await use_case.execute(1, "Carlitos")

    assert updated.name == "Carlitos"


async def test_raises_when_user_does_not_exist() -> None:
    use_case = UpdateUserUseCase(FakeUserRepository([]))

    with pytest.raises(UserNotFoundError):
        await use_case.execute(999, "Carlitos")


async def test_raises_when_new_name_conflicts_with_another_user() -> None:
    repository = FakeUserRepository([User(id=1, name="Carlos"), User(id=2, name="Filipa")])
    use_case = UpdateUserUseCase(repository)

    with pytest.raises(UserNameConflictError):
        await use_case.execute(1, "Filipa")
