# Insight Backend

Simple Flask backend connected to Google's Gemini LLM and AWS S3 + DocumentDB (in progress).

## Setup

Install required libraries:

```bash
python -m pip install google-generativeai pandas boto3 flask
```

## Deployment

For development, make sure your working directory is the main directory.

```bash
python -m flask --app backend/main run --debug
```

## To-do

1. Connect Flask backend with Gemini LLM for data processing
2. Connect Flask backend with Amazon S3 and DocumentDB
