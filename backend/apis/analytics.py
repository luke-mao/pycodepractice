from flask_restx import Namespace, Resource
from flask import request, abort
from config import db
from tables import *
from apis.header import auth_parser
from datetime import datetime, timedelta

api = Namespace("analytics", description="Admin analytics operations")


# timeframe = "today", "this_week", "this_month", "this_quarter", "this_year"
@api.route("/usage-count/<string:timeframe>")
@api.doc(
    params={
        "timeframe": {
            "description": "Timeframe for submission count and ai tutor usage count",
            "enum": ["today", "this_week", "this_month", "this_quarter", "this_year"],
            "type": "string",
        }
    }
)
class SubmissionCountAndAICountInTimeRange(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(401, "Unauthorized")
    @api.response(400, "Invalid timeframe")
    def get(self, timeframe):
        """Get the submission count and ai tutor usage count in a given timeframe"""

        token = request.headers.get("Authorization")
        if not token:
            abort(401, "Authorization token required")

        admin = User.query.filter_by(role=UserEnum.admin, token=token).first()
        if not admin:
            abort(401, "Unauthorized")

        # get the current date and time
        now = datetime.now()

        # for "today", give a 2-hour breakdown of the submission count,
        # for other timeframes, give a 1-day breakdown of the submission count
        if timeframe == "today":
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = now.replace(hour=23, minute=59, second=59, microsecond=999999)

            results = []
            current_time = start_date

            while current_time < end_date:
                next_time = current_time + timedelta(hours=2)

                pass_count = Submission.query.filter(
                    Submission.created_at >= current_time,
                    Submission.created_at < next_time,
                    Submission.is_pass == True,
                ).count()

                fail_count = Submission.query.filter(
                    Submission.created_at >= current_time,
                    Submission.created_at < next_time,
                    Submission.is_pass == False,
                ).count()

                total_count = pass_count + fail_count

                conversations = AIConversation.query.filter(
                    AIConversation.created_at >= current_time,
                    AIConversation.created_at < next_time,
                ).all()

                # remove the system prompt message from the count,
                # and one usage means one user message and one gpt reply
                message_count = sum((len(c.messages) - 1) // 2 for c in conversations)

                results.append(
                    {
                        "date": f"{current_time.strftime('%H:%M')} - {next_time.strftime('%H:%M')}",
                        "pass_count": pass_count,
                        "fail_count": fail_count,
                        "total_count": total_count,
                        "message_count": message_count,
                    }
                )

                current_time = next_time

            return results, 200

        # for other timeframes, get the start and end date
        if timeframe == "this_week":
            start_date = now - timedelta(days=now.weekday())
            end_date = now + timedelta(
                days=(6 - now.weekday()), hours=23, minutes=59, seconds=59
            )
        elif timeframe == "this_month":
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now.replace(day=1) + timedelta(days=31)
            end_date = end_date.replace(day=1) - timedelta(seconds=1)
        elif timeframe == "this_quarter":
            start_date = now.replace(
                month=(now.month - 1) // 3 * 3 + 1,
                day=1,
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )
            end_date = start_date + timedelta(days=90)
            end_date = end_date.replace(day=1) - timedelta(seconds=1)
        elif timeframe == "this_year":
            start_date = now.replace(
                month=1, day=1, hour=0, minute=0, second=0, microsecond=0
            )
            end_date = now.replace(month=1) + timedelta(days=365)
            end_date = end_date.replace(day=1) - timedelta(seconds=1)
        else:
            abort(400, "Invalid timeframe")

        # for each day in the range, get the submission count
        results = []
        current_date = start_date

        while current_date <= end_date:
            next_date = current_date + timedelta(days=1)

            pass_count = Submission.query.filter(
                Submission.created_at >= current_date,
                Submission.created_at < next_date,
                Submission.is_pass == True,
            ).count()

            fail_count = Submission.query.filter(
                Submission.created_at >= current_date,
                Submission.created_at < next_date,
                Submission.is_pass == False,
            ).count()

            total_count = pass_count + fail_count

            # ai conversation count
            conversations = AIConversation.query.filter(
                AIConversation.created_at >= current_date,
                AIConversation.created_at < next_date,
            ).all()

            # remove the system prompt message from the count,
            # and one usage means one user message and one gpt reply
            message_count = sum((len(c.messages) - 1) // 2 for c in conversations)

            results.append(
                {
                    "date": current_date.strftime("%Y-%m-%d"),
                    "pass_count": pass_count,
                    "fail_count": fail_count,
                    "total_count": total_count,
                    "message_count": message_count,
                }
            )

            current_date = next_date

        return results, 200


@api.route("/execution-summary/<int:problem_id>")
@api.doc(params={"problem_id": "ID of the problem to fetch execution data for"})
class ExecutionSummary(Resource):
    @api.expect(auth_parser)
    @api.response(200, "Success")
    @api.response(401, "Unauthorized")
    @api.response(404, "Problem not found or no correct submissions")
    def get(self, problem_id):
        """Get execution time and memory usage for a specific problem (correct submissions only)"""

        token = request.headers.get("Authorization")
        if not token:
            abort(401, "Authorization token required")

        admin = User.query.filter_by(role=UserEnum.admin, token=token).first()
        if not admin:
            abort(401, "Unauthorized")

        # validate problem exists
        problem = Problem.query.filter_by(problem_id=problem_id).first()
        if not problem:
            abort(404, "Problem not found")

        # get correct submissions with valid timing and memory
        submissions = (
            Submission.query.filter_by(problem_id=problem_id, is_pass=True)
            .filter(Submission.real_time.isnot(None), Submission.ram.isnot(None))
            .all()
        )

        if not submissions:
            abort(404, "No valid correct submissions found")

        execution_times = [sub.real_time for sub in submissions]
        memory_usages = [sub.ram for sub in submissions]

        response = {
            "problem_id": problem.problem_id,
            "title": problem.title,
            "execution_times": execution_times,
            "memory_usages": memory_usages,
        }

        return response, 200
