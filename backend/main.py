import os
import threading
from dotenv import load_dotenv
from flask import Flask, json, request
from datetime import datetime, timedelta, timezone
import jwt
from passlib.hash import pbkdf2_sha256
from flask_cors import CORS

from aws_interface import AWS
from data_processing import llm_worker

load_dotenv()

# create and configure the app
app = Flask(__name__, instance_relative_config=True)
aws = AWS(test_env=True)
# app.config.from_pyfile("config.py", silent=True)
CORS(app)

try:
    os.makedirs(app.instance_path)
except OSError:
    pass

jwtSecretKey = "put in env var later"


def create_response(**kwargs):
    return app.response_class(
        response=json.dumps(dict(**kwargs)),
        status=200,
        mimetype="application/json",
    )


def create_error(message):
    return app.response_class(
        response=json.dumps({"message": str(message)}),
        status=400,
        mimetype="application/json",
    )


def auth(request):
    tokenHeaderKey = "jwt-token"
    token = request.headers[tokenHeaderKey]

    try:
        payload = jwt.decode(token, jwtSecretKey, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return False, "Login has expired"
    except Exception as e:
        return False, e

    return True, payload


def mock_to_db(data):
    pass


def mock_get_db(username):
    try:
        return {
            "test": {
                "password": "$pbkdf2-sha256$29000$wNibszbmHGNMqZWyFkKotQ$8hZRuLv5.OqW4BEqqLmUmUySIvse8/7CXQm/VsufUAQ"
            }
        }[username]
    except:
        return {}


# Example usage of auth
@app.route("/auth_api", methods=["GET"])
def auth_api():
    if not auth(request):
        return create_error("You are not logged in")
    return create_response()


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


@app.route("/get_results/<user_id>/<file_id>", methods=["GET"])
def get_results(user_id, file_id):
    if user_id not in aws.s3.listBuckets():
        return create_error(f"User {user_id} does not exist")
    if file_id not in aws.s3.listObjects(user_id):
        return create_error(f"File {file_id} does not exist for user {user_id}")
    results = aws.s3.readJsonObject(user_id, file_id)
    return create_response(
        user_id=user_id,
        file_id=file_id,
        results=results,
    )


@app.route("/queue_file/<user_id>/<file_id>", methods=["POST"])
async def upload_file(user_id, file_id):
    if "uploadFile" not in request.files:
        return create_error("No file uploaded")

    file = request.files["uploadFile"]
    aws.s3.upload(user_id, file, file_id)

    # work on file in a separate thread
    # TODO: set up a pool of workers and a queue for incoming processing requests
    # also need to figure out how to rate limit requests per minute
    worker_thread = threading.Thread(
        target=llm_worker, args=(user_id, file_id, aws, app.logger)
    )
    worker_thread.start()

    return create_response(thread_name=str(worker_thread.name), started=True)


@app.route("/get_queue_size", methods=["GET"])
async def get_queue_size():
    curr_queue_size = threading.active_count()
    return create_response(queue_size=curr_queue_size)


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["username"]
    password = data["password"]

    hash = pbkdf2_sha256.hash(password)

    # Save username and hash to db
    mock_to_db({username: {"password": hash}})

    data = {
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=7),
        "username": username,
    }
    encoded_jwt = jwt.encode(data, jwtSecretKey, algorithm="HS256")
    return create_response(message="success", token=encoded_jwt)


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    # Authenticate with password, get hash from DB
    hash = mock_get_db(username).get("password", "")
    if hash == "" or not pbkdf2_sha256.verify(password, hash):
        return create_error("Password is wrong")

    data = {
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=7),
        "username": username,
    }
    encoded_jwt = jwt.encode(data, jwtSecretKey, algorithm="HS256")
    return create_response(message="success", token=encoded_jwt)


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)  # TODO: Put debug in env

## TODO:
# 1. POST user data
# send as CSV file directly
# upload to S3 on my side

## 2. GET user data
# get report data after processing
# use SQS to communicate with front-end

## 3. GET user history
# past reports
