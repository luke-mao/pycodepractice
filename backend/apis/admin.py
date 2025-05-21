"""
Provides API endpoints for administrative operations.

Routes:
- GET /admin/users: Retrieves a list of all users. Requires admin authorization.
- POST /admin/users/<user_id>/<action>: Activates or deactivates a user account. `action` must be 'activate' or 'deactivate'. Requires admin authorization.
"""

from flask_restx import Namespace, Resource
from flask import request, abort
from config import db
from tables import *
from apis.header import auth_parser

api = Namespace("admin", description="Admin operations")


# admin get all users into a list
@api.route("/users")
class UsersResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(403, "Unauthorized")
    def get(self):
        """Get all users, only admin can access"""
        token = request.headers.get("Authorization")
        user = User.query.filter_by(token=token).first()
        if not user or user.role != UserEnum.admin:
            abort(403, "Unauthorized")

        users = User.query.all()
        result = [user.to_dict() for user in users]
        return result, 200


# admin can activate or deactivate a user, in the same route
@api.route("/users/<int:user_id>/<string:action>")
class ActivateResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(403, "Unauthorized")
    @api.response(400, "Bad request")
    def post(self, user_id, action):
        """Activate or deactivate a user, only admin can access, action = activate | deactivate"""

        token = request.headers.get("Authorization")
        user = User.query.filter_by(token=token).first()
        if not user or user.role != UserEnum.admin:
            abort(403, "Unauthorized")

        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            abort(400, "Bad request")

        # the action can only be activate or deactivate
        if action not in ["activate", "deactivate"]:
            abort(400, "Bad request")

        if user.is_activate and action == "activate":
            abort(400, "The user is already activated")

        if (not user.is_activate) and action == "deactivate":
            abort(400, "The user is already deactivated")

        user.is_activate = action == "activate"
        db.session.commit()
        return {}, 200
