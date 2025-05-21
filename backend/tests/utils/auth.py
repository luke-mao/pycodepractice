def login_user(client, email, password):
    response = client.post(
        "/account/login",
        json={
            "email": email,
            "password": password,
        },
    )
    assert response.status_code == 200, f"Login failed for {email}"
    return response.json["token"]
