class UserNotFoundError(Exception):
    """Raised when a transaction references a user that does not exist."""


class TransactionNotFoundError(Exception):
    """Raised when looking up, updating, or deleting a transaction that does not exist."""
