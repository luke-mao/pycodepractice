from io import BytesIO


# post a problem, require to submit some files
def test_post_problem_successful(client, admin_token):
    data = {
        "title": "Sample Problem Title",
        "difficulty": "easy",
        "topic": "string",
        "status": "draft",
        "submission_template": (
            BytesIO(b"Here is the submission_template.py"),
            "submission_template.py",
        ),
        "solution": (BytesIO(b"Here is the solution.py"), "solution.py"),
        "testcase": (BytesIO(b"Here is the testcase.py"), "testcase.py"),
        "description": (BytesIO(b"# Problem description"), "description.md"),
    }

    response = client.post(
        "/problem",
        data=data,
        content_type="multipart/form-data",
        headers={"Authorization": admin_token},
    )

    assert response.status_code == 201
    assert "problem_id" in response.json


# post a problem, but missing all files, should return 400
def test_post_problem_missing_files(client, admin_token):
    data = {
        "title": "Sample Problem Title",
        "difficulty": "easy",
        "topic": "string",
        "status": "draft",
    }

    response = client.post(
        "/problem",
        data=data,
        content_type="multipart/form-data",
        headers={"Authorization": admin_token},
    )

    assert response.status_code == 400
    assert (
        response.json["message"]
        == "Missing files, please check all the required files and filenames"
    )
