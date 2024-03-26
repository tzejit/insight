import boto3
import os
import dotenv
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
    def __init__(self):
        self.session = boto3.Session(
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=REGION_NAME,
        )
        self.s3 = self.S3(self.session)
        self.rds = self.RDS(self.session, self.s3)

    class S3:
        def __init__(self, session):
            self.s3 = session.client("s3")

        def listBucket(self):
            bucket_list = self.s3.list_buckets()
            # Output the bucket names
            print("Existing buckets:")
            for bucket in bucket_list["Buckets"]:
                print(f'  {bucket["Name"]}')

        def listObject(self, bucket_name):
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

        def upload(self, bucket_name, file_to_upload, output_filename):
            # Upload a csv
            with open(file_to_upload, "rb") as f:  # Open the file in binary read mode
                self.s3.put_object(
                    Body=f,  # Read the file's contents
                    Bucket=bucket_name,
                    Key=output_filename,
                )

            print(f"File uploaded to S3://{bucket_name}/{output_filename}")

    class RDS:
        def __init__(self, session, s3):
            self.rds = session.client("rds")
            self.s3 = s3

        def listInstance(self):
            # List existing RDS instances
            instance_ids = []
            try:
                response = self.rds.describe_db_instances()
                instances = response["DBInstances"]
                for instance in instances:
                    instance_id = instance["DBInstanceIdentifier"]
                    instance_status = instance["DBInstanceStatus"]
                    print(f"Instance ID: {instance_id}, Status: {instance_status}")
                    instance_ids.append(instance_id)
                return instance_ids
            except Exception as e:
                print(f"Error listing RDS instances: {e}")

        def readInstance(self, instance_id="db5102-public"):
            # Describe the RDS instance(s)
            try:
                response = self.rds.describe_db_instances(
                    DBInstanceIdentifier=instance_id
                )
                db_instance = response["DBInstances"][
                    0
                ]  # Access the first instance in the list

                # Extract endpoint address and port (assuming successful description)
                endpoint = db_instance["Endpoint"]["Address"]
                port = db_instance["Endpoint"]["Port"]

                # print(f"RDS endpoint and port: {endpoint}:{port}")
                return endpoint, port
            except Exception as e:
                print(f"Error describing DB instance: {e}")
                return None, None

        def deleteInstance(
            self,
            db_subnet_group_name=cst.DB_SUBNET_GROUP_NAME,
            instance_id="db5102-public",
        ):
            # Delete the DB instance
            try:
                response = self.rds.delete_db_instance(
                    DBInstanceIdentifier=instance_id,
                    SkipFinalSnapshot=True,
                    # FinalDBSnapshotIdentifier='string',
                    DeleteAutomatedBackups=True,
                )
                print(response)
            except Exception as e:
                print(e)

            timeout = 0
            while instance_id in self.rdsListInstance():
                if timeout == 10:
                    print("Timeout waiting for RDS deletion")
                    return
                time.sleep(30)
                timeout += 1

            # Delete the DB subnet group
            try:
                response = self.rds.delete_db_subnet_group(
                    DBSubnetGroupName=db_subnet_group_name
                )
                print("DB subnet group deleted successfully")
            except Exception as e:
                print(f"Error deleting DB subnet group: {e}")

        def createInstance(
            self,
            db_subnet_group_name=cst.DB_SUBNET_GROUP_NAME,
            subnet_ids=[cst.SUBNET_ID1, cst.SUBNET_ID2],
            security_group_id_rds=cst.SECURITY_GROUP_ID_RDS,
        ):
            response = self.rds.create_db_subnet_group(
                DBSubnetGroupName=db_subnet_group_name,
                DBSubnetGroupDescription="LTA Innovation Challenge DB public subnet group",  # public or private
                SubnetIds=subnet_ids,
            )

            subnet_success = response["ResponseMetadata"]["HTTPStatusCode"] == 200
            if not subnet_success:
                print("Error creating RDS subnet")
                return

            # Create a RDS PostGres within free tier
            response = self.rds.create_db_instance(
                DBName=DB_NAME,
                DBInstanceIdentifier="db5102-public",
                AllocatedStorage=20,
                DBInstanceClass="db.t3.micro",
                Engine="postgres",
                MasterUsername=DB_USER,
                MasterUserPassword=DB_PASSWORD,
                VpcSecurityGroupIds=[
                    security_group_id_rds,
                ],
                AvailabilityZone="us-east-1a",
                DBSubnetGroupName=db_subnet_group_name,
                BackupRetentionPeriod=1,
                Port=5432,
                EngineVersion="16.2",
                AutoMinorVersionUpgrade=True,
                LicenseModel="postgresql-license",
                PubliclyAccessible=True,  # Public or private
                StorageType="gp2",
                EnablePerformanceInsights=False,
                DeletionProtection=False,
                MaxAllocatedStorage=20,
            )
            print(response)


if __name__ == "__main__":
    aws = AWS()
    # print("creating EC2 and RDS instances...")
    # aws.start()
    # print("done!")
    aws.ec2.listInstance()
