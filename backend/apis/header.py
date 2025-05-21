"""
Defines a request header parser for extracting the Authorization token from incoming API requests.
"""

from flask_restx import reqparse

# a authroization header parser
auth_parser = reqparse.RequestParser()
auth_parser.add_argument(
    "Authorization", location="headers", required=True, help="token, no Bearer prefix"
)
