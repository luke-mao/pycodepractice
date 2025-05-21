"""
Defines all database models and enums for the application using SQLAlchemy.
"""

from datetime import datetime
from sqlalchemy import JSON, Enum
from sqlalchemy.ext.mutable import MutableList
import enum
from config import db


class Base(db.Model):
    __abstract__ = True
    __table_args__ = {"extend_existing": True}

    def to_dict(self):
        result = {}
        for key in self.__mapper__.c.keys():
            if key == "avatar" or "url" in key:
                result[key] = "uploads/" + self.__getattribute__(key)
            elif key == "password":
                continue
            else:
                value = self.__getattribute__(key)
                if isinstance(value, enum.Enum):
                    result[key] = value.value
                elif isinstance(value, datetime):
                    # convert to Australian format HH:MM:SS DD/MM/YYYY
                    result[key] = value.strftime("%H:%M:%S %d/%m/%Y")
                else:
                    result[key] = value

        return result


# some enum for the tables
class UserEnum(enum.Enum):
    admin = "admin"
    user = "user"


class User(Base):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    avatar = db.Column(db.String(50), nullable=True, default="img1.jpg")
    role = db.Column(Enum(UserEnum), nullable=False, default=UserEnum.user)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # after login, the user has a token
    token = db.Column(db.String(50), nullable=True, default=None)

    # each account is allowed to have 100 gpt message credits
    # and the threshold is reset every day
    gpt_credits = db.Column(db.Integer, nullable=False, default=100)
    last_reset_time = db.Column(db.DateTime, default=datetime.now)

    # is_activate flag for the admin to deactivate the user
    is_activate = db.Column(db.Boolean, nullable=False, default=True)


# enum difficulty: easy, medium, hard
class DifficultyEnum(enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


# topic enum:
# assume each problem has only one topic,
# array, string, linked list, stack, queue, hash map, heap, tree, graph,
# sorting, dynamic programming, greedy
class TopicEnum(enum.Enum):
    array = "array"
    string = "string"
    linked_list = "linked_list"
    stack = "stack"
    queue = "queue"
    hash_map = "hash_map"
    heap = "heap"
    tree = "tree"
    graph = "graph"
    sorting = "sorting"
    dynamic_programming = "dynamic_programming"
    greedy = "greedy"
    other = "other"


# problem status enum: draft, published, removed
class StatusEnum(enum.Enum):
    draft = "draft"
    published = "published"
    removed = "removed"


class Problem(Base):
    __tablename__ = "problems"
    problem_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)

    # enums
    difficulty = db.Column(Enum(DifficultyEnum), nullable=False)
    topic = db.Column(Enum(TopicEnum), nullable=False)
    status = db.Column(Enum(StatusEnum), nullable=False, default=StatusEnum.draft)

    # author: reference user_id
    author = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # for each problem, the admin needs to upload:
    # description.md, submission_template.py, testcase.py, solution.py
    # they are stored under the uploads/problems/p{problem_id}/ folder
    folder_url = db.Column(db.String(50), nullable=False)


# user submission for a problem, all submission are Python
class Submission(Base):
    __tablename__ = "submissions"
    submission_id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(
        db.Integer, db.ForeignKey("problems.problem_id"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)

    # user submission is not allowed to change once submitted
    created_at = db.Column(db.DateTime, default=datetime.now)

    # the actual code is stored as text
    code = db.Column(db.Text, nullable=False, default="")

    # the result of the submission
    results = db.Column(JSON, nullable=True, default=None)

    # check submission is_pass or not
    is_pass = db.Column(db.Boolean, nullable=False, default=False)

    # time and ram
    real_time = db.Column(db.Float, nullable=True, default=None)
    ram = db.Column(db.Float, nullable=True, default=None)


# everyone can leave comments
# content is text, support markdown
class Comment(Base):
    __tablename__ = "comments"
    comment_id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(
        db.Integer, db.ForeignKey("problems.problem_id"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)


# user can discuss the problem with the ai-tutor powered by GPT-4o mini
# one conversation contains: the problem, the user, the conversation id
class AIConversation(Base):
    __tablename__ = "ai_conversations"
    conversation_id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(
        db.Integer, db.ForeignKey("problems.problem_id"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    # the messages is a JSON list, so we can customize its structure
    messages = db.Column(MutableList.as_mutable(JSON), nullable=False, default=[])
