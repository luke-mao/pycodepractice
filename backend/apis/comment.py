"""
Provides API endpoints for commenting on problems.

Routes:
- POST /comment/problem/<problem_id>: Add a new comment to a problem. Requires user token.
- GET /comment/problem/<problem_id>: Retrieve all comments for a problem. Public access.
- PUT /comment/<comment_id>: Edit an existing comment. Only the original author can edit. Requires token.
- DELETE /comment/<comment_id>: Delete a comment. Only the original author or an admin can delete. Requires token.
- GET /comment/user/<user_id>: Retrieve all comments made by a specific user. Public access.
"""

from flask_restx import Namespace, Resource, fields
from flask import request, abort
from config import db
from tables import Comment, Problem, User
from apis.header import auth_parser

api = Namespace("comment", description="Comment operations")

# Leave a comment under a problem,
# the comment content supports markdown
comment_model = api.model(
    "comment",
    {
        "content": fields.String(required=True, description="Comment content"),
    },
)


# add a comment to a problem, require token
@api.route("/problem/<int:problem_id>")
class AddComment(Resource):
    @api.expect(comment_model, auth_parser)
    @api.response(201, "Comment Created")
    @api.response(400, "Bad Request")
    @api.response(404, "Problem Not Found")
    def post(self, problem_id):
        """Post a new comment on a problem"""

        # check token
        token = request.headers.get("Authorization")
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(401, "Unauthorized")

        # Check if problem exists
        problem = Problem.query.get(problem_id)
        if not problem:
            return {"message": "Problem not found"}, 404

        # get the data
        data = request.json
        content = data.get("content")

        # Create and save the new comment
        new_comment = Comment(
            problem_id=problem_id, user_id=user.user_id, content=content
        )
        db.session.add(new_comment)
        db.session.commit()

        return {"comment": new_comment.to_dict()}, 201

    # get all comments for a problem, no token required
    @api.response(200, "Success")
    @api.response(404, "Problem Not Found")
    def get(self, problem_id):
        """Get all comments for a problem (nested format)"""

        problem = Problem.query.get(problem_id)
        if not problem:
            abort(404, "Problem not found")

        # get comments, each comment also attach the user object
        comments = Comment.query.filter_by(problem_id=problem_id).all()
        results = []
        for comment in comments:
            user = User.query.get(comment.user_id)
            user_dict = user.to_dict()
            comment_dict = comment.to_dict()

            result = {
                "comment": comment_dict,
                "user": user_dict,
            }

            results.append(result)

        return {"comments": results}, 200


# edit an existing comment, require token
@api.route("/<int:comment_id>")
class EditComment(Resource):
    @api.expect(comment_model, auth_parser)
    @api.response(200, "Comment Updated")
    @api.response(403, "Unauthorized")
    @api.response(404, "Comment Not Found")
    def put(self, comment_id):
        """Edit an existing comment (only by the original author)"""

        # Extract token from Authorization header
        token = request.headers.get("Authorization")
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(401, "Unauthorized")

        # check the comment
        comment = Comment.query.get(comment_id)
        if not comment or comment.user_id != user.user_id:
            abort(404, "Comment not found")

        # Get the data
        data = request.json
        content = data.get("content")

        # Update comment content
        comment.content = content
        db.session.commit()

        return {"comment": comment.to_dict()}, 200

    @api.expect(auth_parser)
    @api.response(200, "Comment Deleted")
    @api.response(403, "Unauthorized")
    @api.response(404, "Comment Not Found")
    def delete(self, comment_id):
        """Delete a comment (only by the original author or admin),
        the comment content will be simply replaced by [deleted]"""

        # Extract token from Authorization header
        token = request.headers.get("Authorization")
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(401, "Unauthorized")

        # check the comment
        comment = Comment.query.get(comment_id)
        if not comment or (comment.user_id != user.user_id and user.role != "admin"):
            abort(404, "Comment not found")

        # delete the record
        db.session.delete(comment)
        db.session.commit()

        return {}, 200


# get all comments for a user, no token required
@api.route("/user/<int:user_id>")
class GetUserComments(Resource):
    @api.response(200, "Success")
    @api.response(404, "User Not Found")
    def get(self, user_id):
        """Get all comments for a user"""

        user = User.query.get(user_id)
        if not user:
            abort(404, "User not found")

        # get comments
        comments = Comment.query.filter_by(user_id=user_id).all()

        # for each comment, add the user object
        results = []
        for comment in comments:
            problem = Problem.query.get(comment.problem_id)
            problem_dict = problem.to_dict()
            comment_dict = comment.to_dict()

            result = {
                "comment": comment_dict,
                "problem": problem_dict,
            }

            results.append(result)

        return {"comments": results}, 200
