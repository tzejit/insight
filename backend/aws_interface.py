import boto3
import os
import io
import dotenv
import json
import logging
import pandas as pd

dotenv.load_dotenv()
logger = logging.getLogger(__name__)

AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_KEY")
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
REGION_NAME = "us-east-1"


class AWS:
    def __init__(self, test_env=False):
        if test_env:
            self.s3 = self.MockS3("./mock_s3")
        else:
            self.session = boto3.Session(
                aws_access_key_id=AWS_ACCESS_KEY,
                aws_secret_access_key=AWS_SECRET_KEY,
                region_name=REGION_NAME,
            )
            self.s3 = self.S3(self.session)
            # self.rds = self.RDS(self.session, self.s3)

    class MockS3:
        def __init__(self, temp_dir):
            self.temp_dir = temp_dir
            if not os.path.exists(self.temp_dir):
                os.mkdir(self.temp_dir)

        def listBuckets(self):
            buckets = os.listdir(self.temp_dir)
            if len(buckets) == 0:
                return "No buckets at this time"
            return buckets

        def listObjects(self, bucket_name):
            path = os.path.join(self.temp_dir, bucket_name)
            if not os.path.exists(path):
                return "Bucket does not exist!"
            object_list = os.listdir(path)
            object_list = [o.replace(".csv", "") for o in object_list]  # hide .csv
            return object_list

        def readObject(self, bucket_name, object_name):
            if not object_name.endswith(".csv"):
                object_name = object_name + ".csv"
            path = os.path.join(self.temp_dir, bucket_name, object_name)
            if not os.path.exists(path):
                return "Object does not exist!"
            df = pd.read_csv(path)
            return df

        # TODO: Deprecate this in favor of using DocumentDB
        def readJsonObject(self, bucket_name, object_name):
            object_name = object_name + "_processed.json"
            path = os.path.join(self.temp_dir, bucket_name, object_name)
            with open(path, 'r') as f:
                json_data = json.loads(f.read())
            return json_data

        # TODO: Deprecate this in favor of using DocumentDB
        def writeJsonObject(self, bucket_name, object_name, object_json):
            object_name = object_name + "_processed.json"
            path = os.path.join(self.temp_dir, bucket_name, object_name)
            with open(path, 'w') as f:
                f.write(json.dumps(object_json))

        def upload(self, bucket_name, file_to_upload, object_name):
            if not object_name.endswith(".csv"):
                object_name = object_name + ".csv"
            bucket_path = os.path.join(self.temp_dir, bucket_name)
            if not os.path.exists(bucket_path):
                os.mkdir(bucket_path)
            path = os.path.join(self.temp_dir, bucket_name, object_name)
            if isinstance(file_to_upload, io.StringIO):
                # this branch is for testing only
                with open(path, "w") as outfile:
                    outfile.write(file_to_upload.getvalue())
            else:
                file_to_upload.save(path)
                file_to_upload.close()
            print(f"File uploaded to S3://{bucket_name}/{object_name}")

    class S3:
        def __init__(self, session):
            self.s3 = session.client("s3")

        def listBuckets(self):
            bucket_list = self.s3.list_buckets()
            # Output the bucket names
            print("Existing buckets:")
            for bucket in bucket_list["Buckets"]:
                print(f'  {bucket["Name"]}')

        def listObjects(self, bucket_name):
            response = self.s3.list_objects(Bucket=bucket_name)
            try:
                keys = [content["Key"] for content in response["Contents"]]
                print(keys)
                return keys
            except Exception as e:
                print("Error listing, bucket may be empty")

        def readObject(self, bucket_name, key):
            # Read a CSV
            file_key = key
            df = pd.read_csv(
                self.s3.get_object(Bucket=bucket_name, Key=file_key)["Body"],
                encoding="utf-8",
            )
            return df

        def upload(self, bucket_name, file_to_upload, filename):
            # Upload a csv
            with open(file_to_upload, "rb") as f:  # Open the file in binary read mode
                self.s3.put_object(
                    Body=f,  # Read the file's contents
                    Bucket=bucket_name,
                    Key=filename,
                )

            print(f"File uploaded to S3://{bucket_name}/{filename}")


if __name__ == "__main__":
    aws = AWS(test_env=True)
    df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
    s_buf = io.StringIO()
    df.to_csv(s_buf, index=False)
    s_buf.seek(0)
    print(aws.s3.listBuckets())
    aws.s3.upload("test_bucket", s_buf, "test_obj")
    print(aws.s3.listBuckets())
    print(aws.s3.listObjects("test_bucket"))
    print(aws.s3.readObject("test_bucket", "test_obj"))
