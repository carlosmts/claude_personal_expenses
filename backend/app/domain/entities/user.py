from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class User:
    name: str
    id: int | None = None

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise ValueError("User name must not be empty")
