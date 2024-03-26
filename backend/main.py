import os
import logging
import dotenv
from flask import Flask, json, request
from datetime import datetime, timedelta, timezone
import jwt
from passlib.hash import pbkdf2_sha256
from flask_cors import CORS

logger = logging.getLogger(__name__)
dotenv.load_dotenv()


# create and configure the app
app = Flask(__name__, instance_relative_config=True)
# app.config.from_pyfile("config.py", silent=True)
CORS(app)

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
        response=json.dumps({'message': str(message)}),
        status=400,
        mimetype="application/json",
    )

def auth(request):
    tokenHeaderKey = 'jwt-token'
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
        return {'test': {'password': '$pbkdf2-sha256$29000$wNibszbmHGNMqZWyFkKotQ$8hZRuLv5.OqW4BEqqLmUmUySIvse8/7CXQm/VsufUAQ'}}[username]
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

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["username"]
    password = data["password"]


    hash = pbkdf2_sha256.hash(password)

    # Save username and hash to db
    mock_to_db({username: {'password': hash}})

    data = {
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=7),
        "username": username,
    }
    encoded_jwt = jwt.encode(data, jwtSecretKey, algorithm="HS256")
    return create_response(message='success', token=encoded_jwt)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    # Authenticate with password, get hash from DB
    hash = mock_get_db(username).get("password", "")
    if hash =="" or not pbkdf2_sha256.verify(password, hash):
        return create_error("Password is wrong")

    data = {
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=7),
        "username": username,
    }
    encoded_jwt = jwt.encode(data, jwtSecretKey, algorithm="HS256")
    return create_response(message='success', token=encoded_jwt)



## TODO:
# 1. POST user data
# send as CSV file directly
# upload to S3 on my side

## 2. GET user data
# get report data after processing
# use SQS to communicate with front-end

## 3. GET user history
# past reports
