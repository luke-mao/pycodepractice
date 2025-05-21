def test_get_all_problems(client):
    response = client.get("/problem")
    assert response.status_code == 200

    # check the json, should be a list of dictionary items
    data = response.json
    assert isinstance(data, list)
    assert len(data) > 0

    item = data[0]
    assert isinstance(item, dict)

    # the problem_id, title, difficulty, topic, status, author should be inide the dict
    keys = ["problem_id", "title", "difficulty", "topic", "status", "author"]
    for key in keys:
        assert key in item, f"{key} not found in the problem item"


def test_get_random_problem(client):
    response = client.get("/problem/random")
    assert response.status_code == 200

    # response is a dictionary
    data = response.json
    assert isinstance(data, dict)
    assert "problem_id" in data, "problem_id not found in the problem item"


def test_get_search_index(client):
    response = client.get("/problem/search-index")
    assert response.status_code == 200

    # response is a list of dictionary items
    data = response.json
    assert isinstance(data, list)
    assert len(data) > 0

    item = data[0]
    assert isinstance(item, dict)

    # contain 3 keys: problem_id (int), title (str), topic (str)
    assert "problem_id" in item, "problem_id not found in the problem item"
    assert "title" in item, "title not found in the problem item"
    assert "topic" in item, "topic not found in the problem item"


def test_get_problem_by_id(client):
    # get the problem by id
    problem_id = 1
    response = client.get(f"/problem/{problem_id}")
    assert response.status_code == 200

    # response is a dictionary
    data = response.json
    assert isinstance(data, dict)

    # contain 6 keys: problem_id (int), title (str), difficulty (str), topic (str), status (str), author (str)
    keys = [
        "problem_id",
        "title",
        "difficulty",
        "topic",
        "status",
        "author",
        "folder_url",
    ]
    for key in keys:
        assert key in data, f"{key} not found in the problem item"
