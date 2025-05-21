"""
Provides API endpoints for user profile operations, including profile retrieval, updates, and submission activity analytics.

Routes:
- GET /profile/<user_id>: Retrieve a user's profile by ID.
- PUT /profile/<user_id>/edit: Update a user’s profile. Only the user or an admin can perform this action.
- GET /profile/recent-challenges: Retrieve the 5 most recent challenges submitted by the user. Requires token.
- GET /profile/submission/summary: Get submission summary statistics (total, passed, last 7 days). Requires token.
- GET /profile/submission/frequency: Get the user’s submission frequency for the last 60 days (daily count). Requires token.
"""

from flask_restx import Namespace, Resource, fields
from flask import request, abort, current_app
from datetime import datetime, timedelta
import os
from config import db
from tables import *
from apis.header import auth_parser

api = Namespace("profile", description="User profile operations")


# get user profile by user_id, no token required
@api.route("/<int:user_id>")
class ProfileResource(Resource):
    @api.response(200, "Success")
    @api.response(404, "User Not Found")
    def get(self, user_id):
        """Retrieve a user's profile by user_id"""
        user = User.query.get(user_id)
        if not user:
            abort(404, "User not found")
        else:
            return user.to_dict(), 200


# Define the profile update model
profile_update_model = api.model(
    "profile_update",
    {
        "username": fields.String(description="User name"),
        "password": fields.String(description="User password"),
        "email": fields.String(description="User email"),
        "avatar_url": fields.String(
            description="URL of the new avatar, use the file upload api to obtain the url first"
        ),
    },
)


# user himself or admin can edit the profile
@api.route("/<int:user_id>/edit")
class EditProfileResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Profile Updated")
    @api.response(400, "Bad Request")
    @api.response(403, "Unauthorized")
    @api.response(404, "User Not Found")
    def put(self, user_id):
        """Edit profile (only allowed if token matches user or user is an admin), frontend sends FormData"""

        # Extract token from Authorization header (plain token, no Bearer prefix)
        token = request.headers.get("Authorization")
        if not token:
            abort(403, "Authorization token required")

        # Fetch the user trying to edit
        editor = User.query.filter_by(token=token).first()
        if not editor:
            abort(403, "Invalid token")

        # Fetch the target user profile
        user = User.query.get(user_id)
        if not user:
            abort(404, "User not found")

        # Ensure the editor is either the user themselves or an admin
        if editor.user_id != user_id and editor.role != UserEnum.admin:
            abort(403, "You are not authorized to edit this profile")

        # Get updated profile fields, edit username, password, email, avatar
        data = request.form
        if data.get("username"):
            new_username = data.get("username")
            # Check if the new username is already taken
            is_exist = User.query.filter(
                User.username == new_username, User.user_id != user_id
            ).first()
            if is_exist:
                abort(400, "Username already exists")
            else:
                user.username = new_username

        if data.get("password"):
            user.password = data.get("password")

        if data.get("email"):
            # require email to be unique
            new_email = data.get("email")
            # Check if the new email is already taken
            is_exist = User.query.filter(
                User.email == new_email, User.user_id != user_id
            ).first()
            if is_exist:
                abort(400, "Email already exists")
            else:
                user.email = new_email

        # if the request.files contain avatar, then update the avatar
        if "avatar" in request.files:
            new_file = request.files["avatar"]

            # add a timestamp to the filename, YYYYMMDDHHMMSS
            ts = datetime.now().strftime("%Y%m%d%H%M%S")
            new_filename = ts + new_file.filename
            new_file.save(
                os.path.join(
                    current_app.config["UPLOAD_FOLDER"], "avatar", new_filename
                )
            )
            user.avatar = f"avatar/{new_filename}"

        # Save changes
        db.session.commit()

        # return the profile
        return user.to_dict(), 200


@api.route("/recent-challenges")
class RecentChallengesResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(403, "Unauthorized")
    def get(self):
        """Retrieve the recent challenges of the user"""

        token = request.headers.get("Authorization")
        if not token:
            abort(403, "Authorization token required")

        # fetch the user trying to edit
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(403, "Invalid token")

        # get the most recent 5 submission from the user
        # sort by submission time descending
        submissions = (
            Submission.query.filter_by(user_id=user.user_id)
            .order_by(Submission.created_at.desc())
            .limit(5)
            .all()
        )

        # return the results
        results = []

        for submission in submissions:
            # get the problem
            problem = Problem.query.get(submission.problem_id)

            result = {
                "problem": problem.to_dict(),
                "submission": {
                    "submission_id": submission.submission_id,
                    "submission_time": submission.created_at.strftime(
                        "%H:%M:%S %d/%m/%Y"
                    ),
                    "is_pass": submission.is_pass,
                },
            }

            results.append(result)

        return results, 200


# get total submission count, total passed submission count,
# total submission in last 7 days, total passed submission in last 7 days
# for a user
@api.route("/submission/summary")
class SummaryResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(401, "Unauthorized")
    def get(self):
        """Get some summary stats of the user"""

        token = request.headers.get("Authorization")
        if not token:
            abort(401, "Authorization token required")

        # fetch the user trying to edit
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(401, "Invalid token")

        # get total submission count
        total_submission = Submission.query.filter_by(user_id=user.user_id).count()

        # get total passed submission count
        total_passed = Submission.query.filter_by(
            user_id=user.user_id, is_pass=True
        ).count()

        # get total submission in last 7 days
        last_7_days = datetime.now() - timedelta(days=7)

        total_submission_7_days = Submission.query.filter(
            Submission.user_id == user.user_id,
            Submission.created_at >= last_7_days,
        ).count()

        # get total passed submission in last 7 days
        total_passed_7_days = Submission.query.filter(
            Submission.user_id == user.user_id,
            Submission.is_pass == True,
            Submission.created_at >= last_7_days,
        ).count()

        # return the results
        result = {
            "total_submission": total_submission,
            "total_passed": total_passed,
            "total_submission_7_days": total_submission_7_days,
            "total_passed_7_days": total_passed_7_days,
        }

        return result, 200


# get the submission frequency for the last 60 days
# [ { date: yyyy-mm-dd, count: xxxx } ]
@api.route("/submission/frequency")
class SubmissionFrequency(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(401, "Unauthorized")
    def get(self):
        """Get the submission frequency for the last 60 days"""

        token = request.headers.get("Authorization")
        if not token:
            abort(401, "Authorization token required")

        # fetch the user trying to edit
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(401, "Invalid token")

        # get the submission frequency for the last 60 days
        last_60_days = datetime.now() - timedelta(days=60)
        last_60_days = last_60_days.replace(hour=0, minute=0, second=0, microsecond=0)

        # get the submission frequency
        results = []

        for i in range(60):
            t1 = last_60_days + timedelta(days=i)
            t2 = last_60_days + timedelta(days=i + 1)

            count = Submission.query.filter(
                Submission.user_id == user.user_id,
                Submission.created_at >= t1,
                Submission.created_at < t2,
            ).count()

            results.append({"date": t1.strftime("%Y-%m-%d"), "count": count})

        return results, 200
