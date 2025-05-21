def test_user_post_comment(client, user_token):
    problem_id = 1
    content = "This is a test comment"
    payload = {"content": content}

    response = client.post(
        f"/comment/problem/{problem_id}",
        json=payload,
        headers={"Authorization": user_token},
    )

    assert response.status_code == 201, "Failed to post comment"


def test_user_edit_comment(client, user_token):
    # first get all comments under the user id 2
    user_id = 2
    response = client.get(
        f"/comment/user/{user_id}", headers={"Authorization": user_token}
    )
    assert response.status_code == 200, "Failed to get user comments"

    comment_id = response.json["comments"][0]["comment"]["comment_id"]
    new_content = "This is an edited test comment"
    payload = {"content": new_content}

    response = client.put(
        f"/comment/{comment_id}", json=payload, headers={"Authorization": user_token}
    )

    assert response.status_code == 200, "Failed to edit comment"
    comment = response.json["comment"]
    assert comment["content"] == new_content, "Comment content not updated"


def test_user_delete_comment(client, user_token):
    # first post a comment, then delete it
    response = client.post(
        "/comment/problem/1",
        json={"content": "This is a test comment"},
        headers={"Authorization": user_token},
    )

    assert response.status_code == 201, "Failed to post comment"

    # obtain the comment id
    comment_id = response.json["comment"]["comment_id"]

    # now delete the comment
    response = client.delete(
        f"/comment/{comment_id}", headers={"Authorization": user_token}
    )

    assert response.status_code == 200, "Failed to delete comment"
