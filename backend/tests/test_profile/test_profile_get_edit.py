import uuid
from tests.utils.auth import login_user


def test_get_profile(client):
    profile_id = 3
    response = client.get(f"/profile/{profile_id}")
    assert response.status_code == 200

    data = response.json
    assert isinstance(data, dict)

    # now: username = Alice, email = Alice@mail.com, role = user
    assert data["username"] == "Alice", "username not found in the profile item"
    assert data["email"] == "Alice@mail.com", "email not found in the profile item"
    assert data["role"] == "user", "role not found in the profile item"


def test_edit_profile(client, user_token):
    # generate a random username and email
    user_id = 2
    uid = uuid.uuid4().hex[:8]

    new_username = f"testuser_{uid}"
    new_email = f"testuser_{uid}@mail.com"
    new_password = "Abcd1234!"

    payload = {"username": new_username, "email": new_email, "password": new_password}

    # edit the profile
    response = client.put(
        f"/profile/{user_id}/edit",
        data=payload,
        headers={"Authorization": user_token},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200, "Failed to edit profile"

    # verify the changes
    data = response.json
    assert data["user_id"] == user_id, "user_id not found in the profile item"
    assert data["username"] == new_username, "username not found in the profile item"
    assert data["email"] == new_email, "email not found in the profile item"

    # now edit back
    payload = {
        "email": "Tom@mail.com",
        "username": "Tom",
        "password": "Abcd1234!",
    }

    response = client.put(
        f"/profile/{user_id}/edit",
        data=payload,
        headers={"Authorization": user_token},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200, "Failed to edit profile"
