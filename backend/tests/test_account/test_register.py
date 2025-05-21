import uuid


# use uuid to prevent duplicate username / emails
def test_register_success(client):
    uid = uuid.uuid4().hex[:8]
    payload = {
        "username": f"testuser_{uid}",
        "email": f"test_{uid}@example.com",
        "password": "Testpass123!",
    }

    response = client.post("/account/register", json=payload)

    assert response.status_code == 200
    assert "token" in response.json


def test_register_missing_fields(client):
    payload = {
        "username": "incomplete_user",
        # email is missing
        "password": "MissingEmail123!",
    }

    response = client.post("/account/register", json=payload)
    assert response.status_code == 400


# register the account first, then test duplicate
def test_register_duplicate_account(client):
    uid = uuid.uuid4().hex[:8]

    payload = {
        "username": f"testuser_{uid}",
        "email": f"test_{uid}@example.com",
        "password": "Testpass123!",
    }

    # this should be successful
    response = client.post("/account/register", json=payload)
    assert response.status_code == 200

    # this should fail
    response = client.post("/account/register", json=payload)
    assert response.status_code == 400
