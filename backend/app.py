"""
Main entry point for the Flask RestX API application.
Runs the Flask application and serves uploaded files.
Also checks if Docker is running before starting the server.
"""

from flask import send_from_directory
from config import create_app, db
import docker
import os

# create the Flask application
app = create_app("dev")


@app.route("/uploads/<path:filename>")
def download_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# close the db connection when the request ends
@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


if __name__ == "__main__":
    # check if the .env file exists
    if not os.path.exists(".env"):
        print("Error: .env file not found, please create a .env file.")
        exit()

    # check if the docker is running
    try:
        client = docker.from_env()
        client.containers.list()
    except Exception as e:
        print("Error: Docker is not running, please start the docker first.")
        exit()

    # run the app
    app.run(debug=True, port=9000, host="0.0.0.0")
