"""
Initializes and populates the database with default users, problems, comments,
and submissions for testing and development.

Please refer to the instruction in the backend/README.md for more details.

Require to turn on the app and the docker first.
"""

import json
from datetime import datetime, timedelta
from faker import Faker
import random
import secrets
import requests
import docker

from config import db, app
from tables import *

# check if the docker is running
try:
    client = docker.from_env()
    client.containers.list()
except Exception as e:
    print("Error: Docker is not running, please start the docker first.")
    exit()

# faker
fake = Faker()

# seed
fake.seed_instance(9900)
random.seed(9900)

# load users and problems two json files
# from ./uploads/default_users.json
# and ./uploads/default_problems.json
users = json.load(open("uploads/default_users.json"))
problems = json.load(open("uploads/default_problems.json"))

print("Initializing database...")

with app.app_context():
    db.drop_all()
    db.create_all()
    db.session.commit()

    # insert the default users
    for user in users:
        new_user = User(
            username=user["username"],
            email=user["email"],
            password=user["password"],
            role=UserEnum[user["role"]],
            avatar=user["avatar"],
            created_at=datetime(2025, 3, 1, 10, 0, 0),
        )

        db.session.add(new_user)
        db.session.commit()

    print("Users inserted!")

    # get the first user as the admin
    admin = User.query.first()

    # admin creates the problems.
    # all problems are created at 2025/03/01 10:00:00
    for i, p in enumerate(problems):
        new_p = Problem(
            title=p["title"],
            difficulty=DifficultyEnum[p["difficulty"]],
            topic=TopicEnum[p["topic"]],
            status=StatusEnum.published,
            author=admin.user_id,
            created_at=datetime(2025, 3, 1, 10, 0, 0),
            updated_at=datetime(2025, 3, 1, 10, 0, 0),
            folder_url=f"problems/p{i+1}",
        )

        db.session.add(new_p)
        db.session.commit()

    print("Problems inserted!")
    print("Creating comments and submissions, this may take a while...")

    # for each user:
    # 1. create 1 comment
    # 2. create some correct submissions for some random problems
    users = User.query.filter_by(role=UserEnum.user).all()
    problems = Problem.query.all()

    # all comments and code submissions are between 2025/01/01 to 2025/04/11
    start_time = datetime(2025, 1, 1, 10, 0, 0)
    end_time = datetime(2025, 4, 11, 10, 0, 0)
    delta = end_time - start_time
    seconds = delta.total_seconds()

    for user_index, user in enumerate(users):
        # insert the token to make the submission request
        token = secrets.token_urlsafe(32)
        user.token = token
        db.session.commit()

        for problem in problems:
            # create a comment
            t1 = start_time + timedelta(seconds=random.randint(0, int(seconds)))

            new_comment = Comment(
                problem_id=problem.problem_id,
                user_id=user.user_id,
                content=fake.paragraph(nb_sentences=random.randint(1, 3)),
                created_at=t1,
                updated_at=t1,
            )

            db.session.add(new_comment)
            db.session.commit()

            # make submission for the 12 random problems
            if random.random() > 12 / len(problems):
                continue

            # do the submission twice
            for _ in range(2):
                # create a correct submission
                # use the admin solution
                solution = open(f"uploads/{problem.folder_url}/solution.py").read()

                # call the api
                # the host url is http://localhost:9000
                url = f"http://localhost:9000/submission/{problem.problem_id}"
                payload = {"code": solution}
                headers = {"Authorization": token, "Content-Type": "application/json"}

                response = requests.post(url, headers=headers, json=payload)

                if not response.ok:
                    print(response.text)

                # obtain the user submission from the database
                # and put a random time
                submission = (
                    Submission.query.filter_by(
                        user_id=user.user_id, problem_id=problem.problem_id
                    )
                    .order_by(Submission.created_at.desc())
                    .first()
                )

                t2 = start_time + timedelta(seconds=random.randint(0, int(seconds)))
                submission.created_at = t2
                db.session.commit()

        # clean up the token
        user.token = None
        db.session.commit()

        print(f"Finish user {user.username} ({user_index+1}/{len(users)})")

    print("Comments and submissions inserted!")
    print("Database initialized!")
