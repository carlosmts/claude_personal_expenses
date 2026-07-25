from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Category:
    name: str
    id: int | None = None

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise ValueError("Category name must not be empty")
