"""
Initializes the Flask app, database, and API for the 9900-T12B-Chocolate Project.
"""

import os
import sys
from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class DevConfig:
    UPLOAD_FOLDER = "uploads"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
    DEBUG = True


class TestConfig:
    UPLOAD_FOLDER = "uploads"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'tests', 'test.db')}"
    TESTING = True


# initialize variable db
db = SQLAlchemy()


def create_app(env="dev"):
    api = Api(
        version="1.0",
        title="PyHub API - 9900-T12B-Chocolate Project",
        description="API for the 9900-T12B-Chocolate Project",
        validate=True,
        doc="/docs",
    )

    app = Flask(__name__)
    CORS(app)
    app.url_map.strict_slashes = False

    # import the config
    if env == "dev":
        app.config.from_object(DevConfig)
    elif env == "test":
        app.config.from_object(TestConfig)
    else:
        raise ValueError("Invalid environment. Use 'dev' or 'test'.")

    # initialize the database and api
    db.init_app(app)
    api.init_app(app)

    # import all apis from the apis folder
    from apis import (
        account,
        problem,
        profile,
        submission,
        comment,
        ai_tutor,
        admin,
        analytics,
    )

    api.add_namespace(account.api)
    api.add_namespace(problem.api)
    api.add_namespace(profile.api)
    api.add_namespace(submission.api)
    api.add_namespace(comment.api)
    api.add_namespace(ai_tutor.api)
    api.add_namespace(admin.api)
    api.add_namespace(analytics.api)

    return app
