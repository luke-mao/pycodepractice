def test_get_user_submission(client, user_token):
    response = client.get("/submission/all", headers={"Authorization": user_token})
    assert response.status_code == 200, "Failed to get user submission"

    data = response.json
    assert isinstance(data, list), "Response is not a list"

    # the existing user should have a lot of submissions
    assert len(data) > 0, "No submission found for the user"

    # get the first submission, should contain problem, submission keys
    item = data[0]
    assert isinstance(item, dict), "Submission item is not a dictionary"
    assert "problem" in item, "problem not found in the submission item"
    assert "submission" in item, "submission not found in the submission item"


def test_get_one_user_submission(client, user_token):
    submission_id = 1
    response = client.get(
        f"/submission/{submission_id}", headers={"Authorization": user_token}
    )
    assert response.status_code == 200, "Failed to get user submission"

    # this is a dictionary
    data = response.json
    submission = data["submission"]

    # it contains: submission_id, problem_id, user_id, and code, and results, is_pass, real_time, ram
    assert isinstance(submission, dict), "Submission is not a dictionary"
    assert (
        "submission_id" in submission
    ), "submission_id not found in the submission item"
    assert "problem_id" in submission, "problem_id not found in the submission item"
    assert "user_id" in submission, "user_id not found in the submission item"
    assert submission["user_id"] == 2, "user_id is not the same as the user token"
    assert "code" in submission, "code not found in the submission item"
    assert "results" in submission, "results not found in the submission item"
    assert "is_pass" in submission, "is_pass not found in the submission item"
    assert "real_time" in submission, "real_time not found in the submission item"
    assert "ram" in submission, "ram not found in the submission item"
    assert "created_at" in submission, "created_at not found in the submission item"


def test_get_non_existing_user_submission(client, user_token):
    submission_id = 999999
    response = client.get(
        f"/submission/{submission_id}", headers={"Authorization": user_token}
    )
    assert response.status_code == 404, "Should return 404 for non-existing submission"


def test_submission_ranking(client, user_token):
    submission_id = 1
    response = client.get(
        f"/submission/ranking/{submission_id}", headers={"Authorization": user_token}
    )
    assert response.status_code == 200, "Failed to get submission ranking"

    data = response.json
    assert isinstance(data, dict), "Response is not a dictionary"

    # ram_percentile, time_percentile, total_passed_submissions
    # totl_submissions, total_participants
    assert "ram_percentile" in data, "ram_percentile not found in the response"
    assert "time_percentile" in data, "time_percentile not found in the response"
    assert (
        "total_passed_submissions" in data
    ), "total_passed_submissions not found in the response"
    assert "total_submissions" in data, "total_submissions not found in the response"
    assert "total_participants" in data, "total_participants not found in the response"
