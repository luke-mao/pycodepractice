"""
Defines pytest fixtures for setting up the Flask test client and retrieving authentication tokens for test users.
"""

import pytest
from config import create_app
from tests.utils.auth import login_user


# pytest fixture for the app
@pytest.fixture(scope="module")
def client():
    app = create_app("test")
    with app.test_client() as client:
        yield client


# pytest fixture for admin account token, and user account token
@pytest.fixture
def user_token(client):
    # Tom@mail.com, Abcd1234!
    return login_user(client, "Tom@mail.com", "Abcd1234!")


@pytest.fixture
def admin_token(client):
    return login_user(client, "Admin@mail.com", "Abcd1234!")
