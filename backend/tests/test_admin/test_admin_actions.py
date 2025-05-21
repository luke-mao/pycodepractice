def test_admin_get_users(client, admin_token):
    response = client.get("/admin/users", headers={"Authorization": admin_token})
    assert response.status_code == 200, "Failed to get users"

    users = response.json
    assert isinstance(users, list), "Users should be a list"
