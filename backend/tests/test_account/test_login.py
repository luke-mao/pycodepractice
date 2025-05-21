def test_admin_login(client):
    response = client.post(
        "/account/login",
        json={
            "email": "Admin@mail.com",
            "password": "Abcd1234!",
        },
    )

    assert response.status_code == 200
    assert "token" in response.json


def test_user_login(client):
    # Tom@mail.com, Abcd1234!
    response = client.post(
        "/account/login",
        json={
            "email": "Tom@mail.com",
            "password": "Abcd1234!",
        },
    )

    assert response.status_code == 200
    assert "token" in response.json


def test_login_failure(client):
    # fake@fake.user.com, fakepassword
    response = client.post(
        "/account/login",
        json={
            "email": "fake@fake.user.com",
            "password": "fakepassword",
        },
    )

    assert response.status_code == 400
