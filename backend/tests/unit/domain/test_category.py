import pytest

from app.domain.entities.category import Category


def test_category_accepts_non_empty_name() -> None:
    category = Category(name="Groceries")

    assert category.name == "Groceries"


@pytest.mark.parametrize("name", ["", "   "])
def test_category_rejects_empty_name(name: str) -> None:
    with pytest.raises(ValueError, match="empty"):
        Category(name=name)
