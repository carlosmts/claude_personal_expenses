class UserNotFoundError(Exception):
    """Raised when a transaction references a user that does not exist."""


class TransactionNotFoundError(Exception):
    """Raised when looking up, updating, or deleting a transaction that does not exist."""


class GoalNotFoundError(Exception):
    """Raised when looking up, updating, or deleting a goal that does not exist."""


class CategoryNotFoundError(Exception):
    """Raised when renaming or deleting a category that does not exist."""


class CategoryInUseError(Exception):
    """Raised when deleting a category that still has transactions referencing it."""


class CategoryNameConflictError(Exception):
    """Raised when renaming a category to a name already used by a different category."""


class UserNameConflictError(Exception):
    """Raised when renaming a user to a name already used by a different user."""
