# Backend

This folder is purely for version control for code directly deployed on AWS.

## EventBridge

There is an EventBridge pipe that detects when the front-end writes to DynamoDB. When an insert is detected, it transforms the insertion event into a more developer-friendly format before triggering and passing the friendly-formatted event to the Lambda function.

## Lambda

The Lambda function handles processing of user data. It receives an event from EventBridge, which is a Job submission. The Job type is defined in amplify/graphql/backend/api/schema.graphql.

Workflow:

1. Starts working after getting triggered by EventBridge.
2. Extracts relevant details from Job object. This includes some job configuration details, like the name of the product getting reviewed and column names.
3. Updates job status to IN_PROGRESS.
4. Retrieves the relevant data from S3 (user review data, prompt file).
5. Processes user review data in chunks by sending to LLM.
6. Compiles results and upload to S3.
7. Updates job status to COMPLETED. If there is an error somewhere, then update to FAILED instead.
