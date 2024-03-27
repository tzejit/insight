import os
import logging
import dotenv
from flask import Flask, json, request
from aws_interface import AWS


logger = logging.getLogger(__name__)
dotenv.load_dotenv()


# create and configure the app
app = Flask(__name__, instance_relative_config=True)
aws = AWS(test_env=True)

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
    if user_id not in aws.s3.listBuckets():
        return create_error(f"User {user_id} does not exist")
    list_of_files = aws.s3.listObjects(user_id)
    return create_response(user_id=user_id, files=list_of_files)


@app.route("/get_file/<user_id>/<file_id>", methods=["GET"])
def get_file(user_id, file_id):
    if user_id not in aws.s3.listBuckets():
        return create_error(f"User {user_id} does not exist")
    if file_id not in aws.s3.listObjects(user_id):
        return create_error(f"File {file_id} does not exist for user {user_id}")
    return create_response(
        user_id=user_id,
        file_id=file_id,
        link=f"{user_id}/{file_id}.csv",
    )


@app.route("/upload_file/<user_id>/<file_id>", methods=["POST"])
def upload_file(user_id, file_id):
    if "uploadFile" not in request.files:
        return create_error("No file uploaded")

    # TODO: asynchronously run ReviewProcessor.process_data

    file = request.files["uploadFile"]
    aws.s3.upload(user_id, file, file_id)
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
