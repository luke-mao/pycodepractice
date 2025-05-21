"""
Provides API endpoints for account-related operations.

Routes:
- POST /account/login: Logs in a user using either email or username along with a password. Returns user info and a session token.
- POST /account/register: Registers a new user with a username, email, and password. Returns the created user info and a session token.
"""

from flask_restx import Namespace, Resource, fields
from flask import request, abort
import secrets
from config import db
from tables import *

api = Namespace("account", description="Account related operations")

# login requires: username, password or email, password
login_model = api.model(
    "login",
    {
        "email": fields.String(required=False, description="Email"),
        "username": fields.String(required=False, description="Username"),
        "password": fields.String(required=True, description="Password"),
    },
)


# create POST for login account
@api.route("/login")
class LoginResource(Resource):
    @api.expect(login_model)
    @api.response(200, "Success")
    @api.response(400, "Bad Request")
    def post(self):
        """Login to account, use username and password"""

        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if not email and not username:
            abort(400, "Username or email is required")

        # check user exist
        if email:
            user = User.query.filter_by(email=email, password=password).first()
        else:
            user = User.query.filter_by(username=username, password=password).first()

        if not user:
            abort(400, "Invalid username or password")

        # create a token for the user
        token = secrets.token_urlsafe(32)

        # insert to the db
        user.token = token
        db.session.commit()

        # convert to a dictionary
        return user.to_dict(), 200


# signup requires: username, email, password
signup_model = api.model(
    "signup",
    {
        "username": fields.String(required=True, description="Username"),
        "email": fields.String(required=True, description="Email"),
        "password": fields.String(required=True, description="Password"),
    },
)


@api.route("/register")
class RegisterResource(Resource):
    @api.expect(signup_model)
    @api.response(200, "Success")
    @api.response(400, "Bad Request")
    def post(self):
        """Register an account"""

        data = request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # check if the same username or email is already in the db
        is_username_exist = User.query.filter_by(username=username).first()
        is_email_exist = User.query.filter_by(email=email).first()

        if is_username_exist:
            abort(400, "Username already exist")
        if is_email_exist:
            abort(400, "Email already exist")

        # create a new user
        token = secrets.token_urlsafe(32)
        new_user = User(username=username, email=email, password=password, token=token)
        db.session.add(new_user)
        db.session.commit()

        # convert to a dictionary
        return new_user.to_dict(), 200
