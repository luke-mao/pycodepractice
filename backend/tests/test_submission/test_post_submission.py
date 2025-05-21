def test_post_submission_no_function_signature(client, user_token):
    problem_id = 1
    code = "nothing"

    payload = {
        "code": code,
        "problem_id": problem_id,
    }

    response = client.post(
        f"/submission/{problem_id}", json=payload, headers={"Authorization": user_token}
    )

    assert response.status_code == 400, "Should return 400 for invalid submission"
    assert (
        response.json["message"]
        == "Function 'findTwoSum' is missing in the submission."
    )


def test_post_submission_syntax_error(client, user_token):
    problem_id = 1
    code = "def findTwoSum(hello):"

    payload = {
        "code": code,
        "problem_id": problem_id,
    }

    response = client.post(
        f"/submission/{problem_id}", json=payload, headers={"Authorization": user_token}
    )

    assert response.status_code == 400, "Should return 400 for invalid submission"
    message = response.json["message"]
    assert message.startswith("Syntax Error"), "Should return Syntax Error message"


def test_post_submission_syntax_error_2(client, user_token):
    problem_id = 1
    code = "def findTwoSum(nums, target):\n1111"

    payload = {
        "code": code,
        "problem_id": problem_id,
    }

    response = client.post(
        f"/submission/{problem_id}", json=payload, headers={"Authorization": user_token}
    )

    assert response.status_code == 400, "Should return 400 for invalid submission"
    message = response.json["message"]
    assert message.startswith("Syntax Error"), "Should return Syntax Error message"
