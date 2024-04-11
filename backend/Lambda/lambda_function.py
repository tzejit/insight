import json
import io
import logging
import boto3
import pandas as pd

from review_processor import ReviewProcessor

logger = logging.getLogger()
logger.setLevel("INFO")

# S3 BUCKET NAMES
DATA_BUCKET = "insight-user-dataa6098-dev"
BASE_PATH = "private/us-east-1:d270ea1f-44ab-c89f-3e86-3d6e687f1fb2"  # created by Amplify (let's just roll with it)
DATA_DIR = "userdata"
PROMPT_DIR = "prompts"
RESULT_DIR = "results"

# DYNAMODB TABLE NAME
DDB_JOB_TABLE = "Job-wqkmymbwnrb7vpsstjnpfnvlry-dev"

def gen_file_path(category, user_id, file_id):
    if category not in ("data", "prompts", "results"):
        raise TypeError(f"Category must be one of ('data', 'prompts', 'results'), received {category}")
    else:
        mapper = {"data": DATA_DIR, "prompts": PROMPT_DIR, "results": RESULT_DIR}
        category_dir = mapper[category]
        return f"{BASE_PATH}/{category_dir}/{user_id}/{file_id}"
        

def get_prompt_str(user_id, prompt_id):
    # Pass None or empty string for prompt_id if using the default prompt
    if not prompt_id:
        logger.warn(f"No prompt_id provided, defaulting to default prompt")
        prompt_path = gen_file_path("prompts", "default", "prompt.txt")
    else:
        prompt_path = gen_file_path("prompts", user_id, prompt_id)
    logger.info(f"Retrieving prompt from {prompt_path}")
    prompt_obj = boto3.resource('s3').Object(DATA_BUCKET, prompt_path)
    prompt = prompt_obj.get()['Body'].read().decode('utf-8')
    return prompt


def get_file_df(user_id, file_id):
    file_path = gen_file_path("data", user_id, file_id)
    # File gets asynchronously uploaded at the same time job is submitted,
    # so there is a real chance that file is not uploaded by the time this
    # code runs -- we will wait 5 minutes
    # waiter docs: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/waiter/ObjectExists.html
    waiter = boto3.client('s3').get_waiter('object_exists')
    waiter.wait(  # retry 50 times over 5 minutes
        Bucket=DATA_BUCKET,
        Key=file_path,
        WaiterConfig={  
            'Delay': 6,
            'MaxAttempts': 50,
        }
    )
    logger.info(f"Retrieving data file from {file_path}")
    obj_body = boto3.resource('s3').Object(DATA_BUCKET, file_path).get()['Body']
    df = pd.read_csv(io.BytesIO(obj_body.read()))
    return df


def upload_results_to_s3(user_id, job_id, output_df):
    res_name = str(job_id) + ".json"  # should already be string, but just in case
    res_path = gen_file_path("results", user_id, res_name)
    tmpfile = io.StringIO()
    output_df.to_json(tmpfile)  # write dataframe to a temp file
    obj = boto3.resource('s3').Object(DATA_BUCKET, res_path)
    logger.info(f"[{job_id}] Uploading results to {res_name}")
    obj.put(Body=tmpfile.getvalue())  # upload temp file to S3
    

def update_job_status(job_id, status):
    if status not in ("WAITING", "IN_PROGRESS", "COMPLETED", "FAILED"):
        raise TypeError(f'Status must be one of ("WAITING", "IN_PROGRESS", "COMPLETED", "FAILED"), received {status}')
    job_table = boto3.resource('dynamodb').Table(DDB_JOB_TABLE)
    logger.info(f"[{job_id}] Updating job status to {status}")
    job_table.update_item(
        Key={"id": job_id},
        UpdateExpression="set job_status = :new_status",
        ExpressionAttributeValues={
            ':new_status': status,
        },
        ReturnValues="UPDATED_NEW"
    )
    
    
def process_job(job_id, user_id, file_id, job_config):
    logger.info(f"[{job_id}] Start processing with config {job_config}")
    
    # fix file names (prob not necessary)
    prompt_id = job_config['prompt_id']
    if prompt_id and not prompt_id.endswith(".txt"):
        prompt_id += ".txt"
    if not file_id.endswith(".csv"):
        file_id += ".csv"
    
    # get files from S3
    prompt_template = get_prompt_str(user_id, prompt_id)
    file_df = get_file_df(user_id, file_id)
    
    # create new review processor
    review_processor = ReviewProcessor(
        job_id,
        prompt_template,
        job_config
    )
    
    # try generating output
    # exceptions are caught in lambda_handler
    output_df = review_processor.process_data(file_df)
    logger.info(f"[{job_id}] Processed file, length of output is: {len(output_df)}")

    return output_df


def lambda_handler(event, context):
    job = event[0]
    # Each event is guaranteed to be a list of jobs of length 1, thanks to EventBridge
    # Each event is a dictionary with the following keys:
    #   id, user_id, file_id, job_name, job_config, createdAt, updatedAt
    # ... where job_config is a dictionary with these keys:
    #   product_name, prompt_id, review_title_col, review_text_col, review_rating_col,
    
    timestamp = job['createdAt']
    
    # extract job metadata
    job_id = job['id']
    user_id = job['user_id']
    file_id = job['file_id']
    job_status = job['job_status']
    
    # extract job config
    job_config = job['job_config']
    
    if job_status != "WAITING":
        logger.warn(f"[{job_id}] Job has non-WAITING status: {job_status}")
    
    logger.info(f"[{job_id}] Starting job (user:{user_id}, file:{file_id})")
    try:
        update_job_status(job_id, "IN_PROGRESS")
        output_df = process_job(job_id, user_id, file_id, job_config)
        upload_results_to_s3(user_id, job_id, output_df)  # upload to S3
        update_job_status(job_id, "COMPLETED")
    except Exception as e:
        update_job_status(job_id, "FAILED")
        logger.exception(e)
        return {'statusCode': 400}
        
    logger.info(f"{job_id}: Data uploaded, completed job")
        
        
    return {
        'statusCode': 200
    }
