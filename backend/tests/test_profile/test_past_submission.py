def test_user_recent_challenges(client, user_token):
    response = client.get(
        "/profile/recent-challenges", headers={"Authorization": user_token}
    )
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0

    item = response.json[0]
    assert isinstance(item, dict)

    # it should contain: problem key, and submission key
    assert "problem" in item, "problem not found in the recent challenges item"
    assert "submission" in item, "submission not found in the recent challenges item"


def test_user_submission_frequency(client, user_token):
    response = client.get(
        "/profile/submission/frequency", headers={"Authorization": user_token}
    )

    assert response.status_code == 200
    assert isinstance(response.json, list)

    # this includes data for the last 60 days
    data = response.json
    assert (
        len(data) == 60
    ), "The submission frequency data should contain 60 days of data"

    # for each day, there is a date and count key
    one_day = data[0]
    assert isinstance(one_day, dict)
    assert "date" in one_day, "date not found in the submission frequency data"
    assert "count" in one_day, "count not found in the submission frequency data"


def test_user_submission_summary(client, user_token):
    response = client.get(
        "/profile/submission/summary", headers={"Authorization": user_token}
    )

    assert response.status_code == 200
    assert isinstance(response.json, dict)

    # data: total_submission, total_passed, total_submission_7_days, total_passed_7_days
    data = response.json
    assert (
        "total_submission" in data
    ), "total_submission not found in the submission summary data"
    assert (
        "total_passed" in data
    ), "total_passed not found in the submission summary data"
    assert (
        "total_submission_7_days" in data
    ), "total_submission_7_days not found in the submission summary data"
    assert (
        "total_passed_7_days" in data
    ), "total_passed_7_days not found in the submission summary data"
