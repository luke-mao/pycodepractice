"""
Provides API endpoints for handling code submissions, including creation, evaluation, retrieval, and ranking.

Routes:
- POST /submission/<problem_id>: Submit a solution for a problem. Triggers sandbox evaluation. Requires token.
- GET /submission/<submission_id>: Retrieve a specific submission and previous attempts. Requires token.
- GET /submission/user/<problem_id>: Get all submissions of the user for a specific problem. Requires token.
- GET /submission/ranking/<submission_id>: Get RAM and time performance rankings for a passed submission. Requires token.
- GET /submission/all: Retrieve all submissions made by the current user. Requires token.
"""

from flask_restx import Namespace, Resource, fields
from flask import abort, request, current_app
import os
import ast
from tables import *
from apis.header import auth_parser
from apis.sandbox import sandbox_eval

api = Namespace(
    "submission",
    description="User submits a solution and triggers the sandbox evaluation",
)


# Submission Model
submission_model = api.model(
    "Submission",
    {"code": fields.String(required=True, description="The code of the submission")},
)


# Check if the code can compile
def check_is_code_compile(code):
    try:
        compile(code, "<submitted_code>", "exec")
        return
    except SyntaxError as e:
        abort(400, f"Syntax Error: {e}")


# Extract function names and argument names from Python code using AST.
def extract_function_signature(code):
    try:
        tree = ast.parse(code)
        functions = {
            node.name: [arg.arg for arg in node.args.args]
            for node in tree.body
            if isinstance(node, ast.FunctionDef)
        }
        return functions
    except SyntaxError:
        return None


# Check if the template function is all present in the submission
def check_is_template_function_present(template_code, submission_code):
    template_signature = extract_function_signature(template_code)
    submission_signature = extract_function_signature(submission_code)

    if template_signature is None:
        abort(
            500,
            "Error in the submission template code, please contact the administrator.",
        )

    if submission_signature is None:
        abort(
            400,
            "Error in the submission code. Please implement the function as per the template.",
        )

    for func_name, params in template_signature.items():
        if func_name not in submission_signature:
            abort(400, f"Function '{func_name}' is missing in the submission.")
        if submission_signature[func_name] != params:
            abort(
                400,
                f"Function '{func_name}' has incorrect parameters. Expected {params}.",
            )


@api.route("/<int:problem_id>")
class SubmissionResource(Resource):
    @api.expect(auth_parser, submission_model)
    @api.response(200, "Submission created")
    @api.response(401, "Unauthorized")
    @api.response(400, "Bad request")
    def post(self, problem_id):
        """User submits a solution for a problem"""

        token = request.headers.get("Authorization")
        user = User.query.filter_by(token=token).first()
        if user is None:
            abort(401, "Unauthorized")

        # Get submission code
        data = request.json
        code = data.get("code")
        if not code:
            abort(400, "Empty code")

        # Check 1: check if the code can compile
        check_is_code_compile(code)

        # Retrieve the problem and submission template
        problem = Problem.query.get(problem_id)
        if problem is None:
            abort(404, "Problem not found")

        template_path = os.path.join(
            current_app.config["UPLOAD_FOLDER"],
            problem.folder_url,
            "submission_template.py",
        )
        if not os.path.exists(template_path):
            abort(500, "Template file missing")

        # Read template file
        with open(template_path, "r") as file:
            template_code = file.read()

        # Check 2: check if the template function is all present in the submission
        check_is_template_function_present(template_code, code)

        # Save the submission
        submission = Submission(user_id=user.user_id, problem_id=problem_id, code=code)

        db.session.add(submission)
        db.session.commit()

        # Trigger the sandbox evaluation
        submission_id = submission.submission_id
        is_success, results, real_time, ram = sandbox_eval(submission_id)

        if not is_success:
            abort(500, results)

        # return both things
        submission.results = results
        submission.real_time = real_time
        submission.ram = ram

        # add the is_pass flag
        # when the Passed is in every results, then it is passed
        submission.is_pass = all("Passed" in r for r in results)

        # save the submission
        db.session.commit()

        # return the submission record
        return submission.to_dict(), 200


@api.route("/<int:submission_id>")
class SubmissionResource(Resource):
    @api.response(200, "Submission retrieved")
    @api.response(404, "Submission not found")
    @api.expect(auth_parser)
    def get(self, submission_id):
        """Get the submission result, admin can view all submissions, user can only view his own submission"""

        # check the token
        token = auth_parser.parse_args()["Authorization"]
        user = User.query.filter_by(token=token).first()
        if user is None:
            abort(401, "Unauthorized")

        # get the submission
        submission = Submission.query.get(submission_id)
        if submission is None:
            abort(404, "Submission not found")

        # check if the user is admin, or the user is the author of the submission
        is_valid_user = (
            user.role == UserEnum.admin or user.user_id == submission.user_id
        )
        if not is_valid_user:
            abort(401, "You are not authorized to view this submission")

        # get the problem from the submission
        problem = Problem.query.get(submission.problem_id)

        # also get a list of all his previous submissions for this problem
        # order by the created_at desc
        previous = (
            Submission.query.filter_by(
                user_id=user.user_id, problem_id=problem.problem_id
            )
            .order_by(Submission.created_at.desc())
            .all()
        )

        # return everything
        result = {
            "submission": submission.to_dict(),
            "problem": problem.to_dict(),
            "previous": [sub.to_dict() for sub in previous],
        }

        return result, 200


@api.route("/user/<int:problem_id>")
class UserSubmissionsResource(Resource):
    @api.response(200, "User submissions retrieved")
    @api.response(401, "Unauthorized")
    @api.response(404, "No submissions found")
    @api.expect(auth_parser)
    def get(self, problem_id):
        """Get all submissions of the token user for a specific problem"""

        # Verify user authentication
        token = auth_parser.parse_args()["Authorization"]
        user = User.query.filter_by(token=token).first()

        if user is None:
            abort(401, "Unauthorized")

        # Fetch all submissions for the user & problem, order by the created_at desc
        submissions = (
            Submission.query.filter_by(user_id=user.user_id, problem_id=problem_id)
            .order_by(Submission.created_at.desc())
            .all()
        )

        # return a list
        result = [sub.to_dict() for sub in submissions]
        return result, 200


@api.route("/ranking/<int:submission_id>")
class SubmissionRankingResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Ranking data retrieved")
    @api.response(400, "Invalid submission")
    @api.response(404, "Submission not found")
    def get(self, submission_id):
        """Get ranking of a successful submission based on RAM and Time, only the submission owner can view"""

        # Authenticate user
        token = auth_parser.parse_args()["Authorization"]
        user = User.query.filter_by(token=token).first()
        if user is None:
            abort(401, "Unauthorized")

        # Get the submission
        submission = Submission.query.get(submission_id)
        if not submission:
            abort(404, "Submission not found")

        # Ensure user is owner or admin
        if submission.user_id != user.user_id and user.role != UserEnum.admin:
            abort(401, "Unauthorized access to submission ranking")

        # Ensure submission passed
        if not submission.is_pass:
            abort(400, "Submission did not pass the test cases")

        problem_id = submission.problem_id

        # Get all successful submissions for this problem
        passed_submissions = Submission.query.filter_by(
            problem_id=problem_id, is_pass=True
        ).all()

        # Sort by RAM and Time
        # The passed submission definitely has the RAM and Time
        ram_sorted = sorted(passed_submissions, key=lambda s: s.ram)
        time_sorted = sorted(passed_submissions, key=lambda s: s.real_time)

        # Total passed submissions
        total_passed = len(passed_submissions)

        # RAM and Time rankings (1-based)
        ram_rank = ram_sorted.index(submission) + 1
        time_rank = time_sorted.index(submission) + 1

        # Convert to percentile (better = higher)
        # Calculate aginst the passed submissions only
        ram_percentile = round(100 * (1 - (ram_rank - 1) / total_passed), 2)
        time_percentile = round(100 * (1 - (time_rank - 1) / total_passed), 2)

        # Total submissions and participants
        total_submissions = Submission.query.filter_by(problem_id=problem_id).count()
        total_participants = (
            db.session.query(Submission.user_id)
            .filter_by(problem_id=problem_id)
            .distinct()
            .count()
        )

        # the result
        result = {
            "ram_percentile": ram_percentile,
            "time_percentile": time_percentile,
            "total_passed_submissions": total_passed,
            "total_submissions": total_submissions,
            "total_participants": total_participants,
        }

        return result, 200


# get all submission of a user
@api.route("/all")
class AllUserSubmissionResource(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(401, "Unauthorized")
    def get(self):
        """Get all submissions of the user"""

        token = request.headers.get("Authorization")
        if not token:
            abort(401, "Authorization token required")

        # fetch the user trying to edit
        user = User.query.filter_by(token=token).first()
        if not user:
            abort(401, "Invalid token")

        # get all submissions of the user, order by the created_at desc
        submissions = (
            Submission.query.filter_by(user_id=user.user_id)
            .order_by(Submission.created_at.desc())
            .all()
        )

        # for each submission, also attach the problem
        results = []

        for submission in submissions:
            problem = Problem.query.get(submission.problem_id)

            result = {
                "problem": problem.to_dict(),
                "submission": submission.to_dict(),
            }

            results.append(result)

        return results, 200
