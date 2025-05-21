"""
Provides API endpoints for managing coding problems, including creation, retrieval, update, and file operations.

Routes:
- GET /problem/: Retrieve all problems.
- POST /problem/: Create a new problem. Admin only.
- GET /problem/<problem_id>: Retrieve a specific problem by ID.
- PUT /problem/<problem_id>: Update an existing problem. Admin only.
- GET /problem/<problem_id>/download: Download all problem-related files as a ZIP archive.
- GET /problem/random: Retrieve a random problem.
- GET /problem/search-index: Get a minimal list of published problems (title, ID, and topic) for search functionality.
"""

from flask_restx import Namespace, Resource, fields
from flask import abort, request, send_file, current_app
import os
import zipfile
import io
import random
from tables import *
from apis.header import auth_parser

api = Namespace("problem", description="Problem related operations")

# this is for a new problem
# problem has: title, difficulty, topic, status, content,
# and the 3 urls
problem_model = api.model(
    "Problem",
    {
        "title": fields.String(required=True, description="The problem title"),
        "difficulty": fields.String(
            required=True, description="The problem difficulty"
        ),
        "topic": fields.String(required=True, description="The problem topic"),
        "status": fields.String(required=True, description="The problem status"),
    },
)


@api.route("/")
class ProblemResourcePost(Resource):
    # anyone can get a problem list
    # so here we will return all the problems,
    # and the frontend will filter using the status
    @api.response(200, "Success")
    def get(self):
        """Get all problems"""

        # get all problems, sort via problem_id
        problems = Problem.query.order_by(Problem.problem_id).all()
        return [problem.to_dict() for problem in problems]

    # only admin can post a problem
    @api.expect(auth_parser)
    @api.response(201, "Problem created")
    @api.response(401, "Unauthorized")
    @api.response(400, "Bad request")
    def post(self):
        """Admin create a new problem, frontend sends FormData"""

        token = auth_parser.parse_args()["Authorization"]
        admin = User.query.filter_by(token=token).first()

        if admin is None or admin.role != UserEnum.admin:
            abort(401, "Unauthorized")

        # get the post data
        data = request.form
        title = data.get("title")

        # convert to enum, try catch
        try:
            difficulty = DifficultyEnum(data.get("difficulty"))
            topic = TopicEnum(data.get("topic"))
            status = StatusEnum(data.get("status"))
        except ValueError:
            abort(400, "Bad request")

        # get the files from the request
        submission_template = request.files.get("submission_template")
        solution = request.files.get("solution")
        testcase = request.files.get("testcase")
        description = request.files.get("description")

        # all files must be present
        if (
            submission_template is None
            or solution is None
            or testcase is None
            or description is None
        ):
            abort(
                400, "Missing files, please check all the required files and filenames"
            )

        # check the file names
        # submission_template must be submission_template.py
        # solution must be solution.py
        # testcase must be testcase.py
        # description must be description.md
        is_valid_name = (
            submission_template.filename == "submission_template.py"
            and solution.filename == "solution.py"
            and testcase.filename == "testcase.py"
            and description.filename == "description.md"
        )

        if not is_valid_name:
            abort(
                400,
                "File names must be submission_template.py, solution.py, testcase.py, description.md",
            )

        # create the record first, so we can get the problem_id to create the folder
        new_problem = Problem(
            title=title,
            difficulty=difficulty,
            topic=topic,
            status=status,
            author=admin.user_id,
            folder_url="temp",
        )

        db.session.add(new_problem)
        db.session.commit()

        # create the folder using new_problem.problem_id
        folder_path = os.path.join(
            current_app.config["UPLOAD_FOLDER"], f"problems/p{new_problem.problem_id}"
        )
        os.makedirs(folder_path, exist_ok=True)

        # save these files to that
        submission_template.save(os.path.join(folder_path, "submission_template.py"))
        solution.save(os.path.join(folder_path, "solution.py"))
        testcase.save(os.path.join(folder_path, "testcase.py"))
        description.save(os.path.join(folder_path, "description.md"))

        # update the folder_url
        new_problem.folder_url = f"problems/p{new_problem.problem_id}"
        db.session.commit()

        # return the problem
        return new_problem.to_dict(), 201


@api.route("/<int:problem_id>")
class ProblemResource(Resource):
    @api.response(200, "Success")
    @api.response(404, "Problem not found")
    def get(self, problem_id):
        """Get a problem via problem_id"""

        problem = Problem.query.get(problem_id)
        if problem is None:
            abort(404, "Problem not found")
        else:
            return problem.to_dict()

    # Admin can update a problem
    @api.expect(auth_parser)
    @api.response(200, "Problem updated")
    @api.response(401, "Unauthorized")
    @api.response(404, "Problem not found")
    @api.response(400, "Bad request")
    def put(self, problem_id):
        """Admin can update a problem, frontend sends FormData"""

        token = auth_parser.parse_args()["Authorization"]
        admin = User.query.filter_by(token=token).first()

        if admin is None or admin.role != UserEnum.admin:
            abort(401, "Unauthorized")

        # get the problem
        problem = Problem.query.get(problem_id)
        if problem is None:
            abort(404, "Problem not found")

        # get the data
        data = request.form

        # title, topic, status, difficlty always exist
        if data.get("title"):
            problem.title = data.get("title")

        try:
            if data.get("difficulty"):
                problem.difficulty = DifficultyEnum(data.get("difficulty"))

            if data.get("topic"):
                problem.topic = TopicEnum(data.get("topic"))

            if data.get("status"):
                problem.status = StatusEnum(data.get("status"))

        except ValueError:
            abort(400, "Wrong enum value for difficulty, topic, or status")

        # check if file is uploaded
        submission_template = request.files.get("submission_template")
        solution = request.files.get("solution")
        testcase = request.files.get("testcase")
        description = request.files.get("description")

        if submission_template is not None:
            submission_template.save(
                os.path.join(
                    current_app.config["UPLOAD_FOLDER"],
                    problem.folder_url,
                    "submission_template.py",
                )
            )

        if solution is not None:
            solution.save(
                os.path.join(
                    current_app.config["UPLOAD_FOLDER"],
                    problem.folder_url,
                    "solution.py",
                )
            )

        if testcase is not None:
            testcase.save(
                os.path.join(
                    current_app.config["UPLOAD_FOLDER"],
                    problem.folder_url,
                    "testcase.py",
                )
            )

        if description is not None:
            description.save(
                os.path.join(
                    current_app.config["UPLOAD_FOLDER"],
                    problem.folder_url,
                    "description.md",
                )
            )

        db.session.commit()
        return problem.to_dict(), 200


@api.route("/<int:problem_id>/download")
class ProblemDownloadResource(Resource):
    @api.response(200, "ZIP file created and sent")
    @api.response(404, "Problem not found")
    def get(self, problem_id):
        """Download all problem files as a ZIP archive"""

        # Fetch the problem from the database
        problem = Problem.query.get(problem_id)
        if problem is None:
            abort(404, "Problem not found")

        # Define the folder path (adjust as necessary)
        problem_folder = f"uploads/problems/p{problem_id}"

        # Ensure the folder exists
        if not os.path.exists(problem_folder):
            abort(404, "Problem files not found")

        # Create an in-memory ZIP archive
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for root, _, files in os.walk(problem_folder):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, problem_folder)
                    zip_file.write(file_path, arcname)

        zip_buffer.seek(0)

        # Send the ZIP file as a response
        return send_file(
            zip_buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name=f"problem_{problem_id}.zip",
        )


@api.route("/random")
class RandomProblemResource(Resource):
    @api.response(200, "Success")
    def get(self):
        """Get a random problem"""

        # seed 9900
        random.seed(9900)
        problems = Problem.query.all()
        problem = random.choice(problems)

        return problem.to_dict()


# for the frontend search bar
@api.route("/search-index")
class SearchIndex(Resource):
    @api.response(200, "Success")
    def get(self):
        """Get the published problem title and problem_id only"""

        problems = Problem.query.filter_by(status=StatusEnum.published).all()
        result = [
            {"problem_id": p.problem_id, "title": p.title, "topic": p.topic.value}
            for p in problems
        ]
        return result, 200
