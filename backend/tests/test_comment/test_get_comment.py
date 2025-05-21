def test_get_problem_comments(client):
    problem_id = 1
    response = client.get(f"/comment/problem/{problem_id}")
    assert response.status_code == 200, "Failed to get problem comments"

    data = response.json
    comments = data["comments"]
    assert isinstance(comments, list), "Comments is not a list"
    assert len(comments) > 0, "No comments found for the problem"

    # contain: comment, user two keys
    item = comments[0]
    assert isinstance(item, dict), "Comment item is not a dictionary"
    assert "comment" in item, "comment not found in the comment item"
    assert "user" in item, "user not found in the comment item"


def test_get_user_comments(client):
    user_id = 2
    response = client.get(f"/comment/user/{user_id}")
    assert response.status_code == 200, "Failed to get user comments"

    data = response.json
    comments = data["comments"]
    assert isinstance(comments, list), "Comments is not a list"
    assert len(comments) > 0, "No comments found for the user"

    # contain: comment, problem two keys
    item = comments[0]
    assert isinstance(item, dict), "Comment item is not a dictionary"
    assert "comment" in item, "comment not found in the comment item"
    assert "problem" in item, "problem not found in the comment item"
