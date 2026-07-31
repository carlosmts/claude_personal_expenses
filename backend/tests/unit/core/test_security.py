from app.core.security import hash_password, verify_password


def test_verify_password_accepts_the_correct_password() -> None:
    stored = hash_password("correct horse battery staple")

    assert verify_password("correct horse battery staple", stored) is True


def test_verify_password_rejects_the_wrong_password() -> None:
    stored = hash_password("correct horse battery staple")

    assert verify_password("wrong password", stored) is False


def test_hash_password_salts_each_call_differently() -> None:
    first = hash_password("same password")
    second = hash_password("same password")

    assert first != second
