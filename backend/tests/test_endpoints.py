import uuid

def test_user_endpoints(client):
    # 1. Create a user
    user_id = f"test-user-{uuid.uuid4()}"
    create_response = client.post("/api/v1/users", json={"id": user_id})
    assert create_response.status_code == 201
    user_data = create_response.json()
    assert user_data["id"] == user_id
    assert "created_at" in user_data

    # 2. Get the created user
    get_response = client.get(f"/api/v1/users/{user_id}")
    assert get_response.status_code == 200
    assert get_response.json()["id"] == user_id

    # 3. Get non-existent user should return 404
    get_missing = client.get("/api/v1/users/non-existent-user")
    assert get_missing.status_code == 404


def test_habit_endpoints(client):
    # 1. Create a user first
    user_id = f"test-user-habit-{uuid.uuid4()}"
    client.post("/api/v1/users", json={"id": user_id})

    # 2. Create habit for the user
    habit_payload = {
        "user_id": user_id,
        "habit_name": "Screen Time",
        "current_level": 4.5,
        "target_level": 1.0,
        "trigger": "Boredom at night",
        "motivation": "Better sleep and health",
        "ai_plan": "Turn off screens 30m before bedtime",
    }
    create_response = client.post("/api/v1/habits", json=habit_payload)
    assert create_response.status_code == 201
    habit_data = create_response.json()
    assert habit_data["habit_name"] == "Screen Time"
    assert habit_data["user_id"] == user_id
    assert "id" in habit_data
    habit_id = habit_data["id"]

    # 3. Retrieve habit by ID
    get_response = client.get(f"/api/v1/habits/{habit_id}")
    assert get_response.status_code == 200
    assert get_response.json()["habit_name"] == "Screen Time"

    # 4. List habits filtered by user_id via query parameter
    list_response = client.get(f"/api/v1/habits?user_id={user_id}")
    assert list_response.status_code == 200
    habits_list = list_response.json()
    assert len(habits_list) == 1
    assert habits_list[0]["id"] == habit_id

    # 5. List habits filtered by user_id via path parameter
    list_path_response = client.get(f"/api/v1/habits/user/{user_id}")
    assert list_path_response.status_code == 200
    assert len(list_path_response.json()) == 1


def test_checkin_endpoints(client):
    # 1. Create user and habit
    user_id = f"test-user-checkin-{uuid.uuid4()}"
    client.post("/api/v1/users", json={"id": user_id})
    habit_payload = {
        "user_id": user_id,
        "habit_name": "Gaming",
        "current_level": 3.0,
        "target_level": 0.5,
        "trigger": "Stress",
        "motivation": "Save time",
    }
    habit_id = client.post("/api/v1/habits", json=habit_payload).json()["id"]

    # 2. Log check-in
    checkin_payload = {
        "habit_id": habit_id,
        "progress": 2.0,
        "mood": "okay",
        "note": "Played 2 hours, controlled the urge after dinner.",
        "ai_feedback": "Great job keeping it below 3 hours!",
    }
    create_response = client.post("/api/v1/checkins", json=checkin_payload)
    assert create_response.status_code == 201
    checkin_data = create_response.json()
    assert checkin_data["habit_id"] == habit_id
    assert checkin_data["progress"] == 2.0
    assert checkin_data["mood"] == "okay"
    checkin_id = checkin_data["id"]

    # 3. Retrieve check-ins by habit_id via query parameter
    get_query = client.get(f"/api/v1/checkins?habit_id={habit_id}")
    assert get_query.status_code == 200
    checkins_list = get_query.json()
    assert len(checkins_list) == 1
    assert checkins_list[0]["id"] == checkin_id

    # 4. Retrieve check-ins by habit_id via path parameter
    get_path = client.get(f"/api/v1/checkins/habit/{habit_id}")
    assert get_path.status_code == 200
    assert len(get_path.json()) == 1


def test_urge_endpoints(client):
    # 1. Create user and habit
    user_id = f"test-user-urge-{uuid.uuid4()}"
    client.post("/api/v1/users", json={"id": user_id})
    habit_payload = {
        "user_id": user_id,
        "habit_name": "Junk Food",
        "current_level": 7.0,
        "target_level": 2.0,
        "trigger": "Smell of bakery",
        "motivation": "Weight loss",
    }
    habit_id = client.post("/api/v1/habits", json=habit_payload).json()["id"]

    # 2. Create urge event
    urge_payload = {
        "habit_id": habit_id,
        "feeling": "Wanted to order a donut.",
        "ai_response": "Take 3 deep breaths and wait 10 minutes.",
        "outcome": "pending",
    }
    create_response = client.post("/api/v1/urges", json=urge_payload)
    assert create_response.status_code == 201
    urge_data = create_response.json()
    assert urge_data["habit_id"] == habit_id
    assert urge_data["outcome"] == "pending"
    urge_id = urge_data["id"]

    # 3. Patch urge outcome
    patch_response = client.patch(f"/api/v1/urges/{urge_id}", json={"outcome": "resisted"})
    assert patch_response.status_code == 200
    assert patch_response.json()["outcome"] == "resisted"

    # 4. Retrieve urge events by habit_id via query parameter
    get_query = client.get(f"/api/v1/urges?habit_id={habit_id}")
    assert get_query.status_code == 200
    urges_list = get_query.json()
    assert len(urges_list) == 1
    assert urges_list[0]["id"] == urge_id
    assert urges_list[0]["outcome"] == "resisted"

    # 5. Retrieve urge events by habit_id via path parameter
    get_path = client.get(f"/api/v1/urges/habit/{habit_id}")
    assert get_path.status_code == 200
    assert len(get_path.json()) == 1
