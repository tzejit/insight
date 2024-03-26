import os
import logging
import dotenv
from flask import Flask, json, request


logger = logging.getLogger(__name__)
dotenv.load_dotenv()


# create and configure the app
app = Flask(__name__, instance_relative_config=True)
# app.config.from_pyfile("config.py", silent=True)

try:
    os.makedirs(app.instance_path)
except OSError:
    pass

file_dict = {}


def create_response(**kwargs):
    return app.response_class(
        response=json.dumps(dict(**kwargs)),
        status=200,
        mimetype="application/json",
    )


def create_error(message):
    return app.response_class(
        response=message,
        status=400,
        mimetype="text/plain",
    )


@app.route("/get_file_listing/<user_id>", methods=["GET"])
def get_file_listing(user_id):
    if user_id not in file_dict:
        return create_error(f"User {user_id} does not exist")
    list_of_files = list(file_dict[user_id].keys())
    return create_response(user_id=user_id, files=list_of_files)


@app.route("/get_file/<user_id>/<file_id>", methods=["GET"])
def get_file(user_id, file_id):
    if user_id not in file_dict:
        return create_error(f"User {user_id} does not exist")
    if file_id not in file_dict[user_id]:
        return create_error(f"File {file_id} does not exist for user {user_id}")
    return create_response(
        user_id=user_id,
        file_id=file_id,
        link=file_dict[user_id][file_id],
    )


@app.route("/upload_file/<user_id>/<file_id>", methods=["POST"])
def upload_file(user_id, file_id):
    if "uploadFile" not in request.files:
        return create_error("No file uploaded")

    file = request.files["uploadFile"]
    link = (
        f"link://{file.filename}"  # placeholder link, TODO: update after S3 integration
    )
    if user_id not in file_dict:
        file_dict[user_id] = {file_id: link}
    else:
        file_dict[user_id][file_id] = link
    return create_response()


## TODO:
# 1. POST user data
# send as CSV file directly
# upload to S3 on my side

## 2. GET user data
# get report data after processing
# use SQS to communicate with front-end

## 3. GET user history
# past reports
