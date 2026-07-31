from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import select

from app.api.dependencies import DbSession
from app.core.security import hash_password, verify_password
from app.infrastructure.models.user_model import UserModel

_security = HTTPBasic()


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Basic"},
    )


async def require_auth(
    credentials: Annotated[HTTPBasicCredentials, Depends(_security)],
    session: DbSession,
) -> None:
    """Verify the request's Basic Auth credentials against a stored user.

    A user with no password set yet "claims" it on first successful request —
    there's no separate registration step, so the first person to
    authenticate as e.g. 'pipa' sets that account's password from then on.
    """
    result = await session.execute(select(UserModel).where(UserModel.login_username == credentials.username))
    user = result.scalar_one_or_none()
    if user is None:
        raise _unauthorized()

    if user.password_hash is None:
        user.password_hash = hash_password(credentials.password)
        return

    if not verify_password(credentials.password, user.password_hash):
        raise _unauthorized()
