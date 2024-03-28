import os
import logging
from dotenv import load_dotenv
from flask import Flask, json, request
from aws_interface import AWS
from datetime import datetime, timedelta, timezone
import jwt
from passlib.hash import pbkdf2_sha256
from flask_cors import CORS
import asyncio
from data_processing import ReviewProcessor

logger = logging.getLogger(__name__)
load_dotenv()


# create and configure the app
app = Flask(__name__, instance_relative_config=True)
aws = AWS(test_env=True)
# app.config.from_pyfile("config.py", silent=True)
CORS(app)

# create a queue that we will use to store LLM processing tasks
queue = asyncio.Queue()

try:
    os.makedirs(app.instance_path)
except OSError:
    pass

file_dict = {}
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

    return create_response(
        user_id=user_id,
        file_id=file_id,
        link=f"{user_id}/{file_id}.csv",
    )


async def llm_worker(name, queue):
    review_processor = ReviewProcessor(
        "backend/prompt.txt",
        "Amazon Kindle",
        review_title_col="reviews.title",
        review_text_col="reviews.text",
        review_rating_col="reviews.rating",
    )  # TODO: Put these constants in user config somehow
    while True:
        # Get a "work item" out of the queue.
        (user_id, file_id) = await queue.get()

        # Do the LLM shit
        file_df = aws.s3.readObject(user_id, file_id)
        output_df = review_processor.process_data(
            file_df,
        )
        output_json = output_df.to_json(path_or_buf=None)  # return json as str
        aws.s3.writeJsonObject(user_id, file_id, output_json)  # save file

        # Notify the queue that the "work item" has been processed.
        # queue.task_done()
        # We don't actually need this?
        # Maybe next time when we are multiprocessing each CSV

        logger.info(f"Done processing file {user_id}/{file_id}")


@app.route("/queue_file/<user_id>/<file_id>", methods=["POST"])
def upload_file(user_id, file_id):
    if "uploadFile" not in request.files:
        return create_error("No file uploaded")

    queue.put((user_id, file_id))  # send file to queue for processing

    file = request.files["uploadFile"]
    aws.s3.upload(user_id, file, file_id)
    return create_response()


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


## TODO:
# 1. POST user data
# send as CSV file directly
# upload to S3 on my side

## 2. GET user data
# get report data after processing
# use SQS to communicate with front-end

## 3. GET user history
# past reports
