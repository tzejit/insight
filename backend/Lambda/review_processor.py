import json
import os
import requests
import logging
import pandas as pd

logger = logging.getLogger()
logger.setLevel("INFO")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="

class ReviewProcessor:
    def __init__(self, job_id, prompt_template, job_config):
        """
        job_config should have the following keys:
            product_name, prompt_id, review_title_col, review_text_col, review_rating_col
        """
        self.job_id = job_id
        self.API_KEY = os.environ.get("GOOGLE_API_KEY")
        if "{{INPUT_DATA}}" not in prompt_template:
            logger.error(f"[{self.job_id}]" + "{{INPUT_DATA}} field is required in prompt template")
            raise KeyError("{{INPUT_DATA}} field is required in prompt template")
        self.prompt_template = prompt_template
        self.job_config = job_config
        if "product_name" in job_config:
            self.prompt_template = self.prompt_template.replace("{{PRODUCT_NAME}}", job_config["product_name"])

    def query_model(self, query) -> str:
        if self.prompt_template is not None:
            query = self.prompt_template.replace("{{INPUT_DATA}}", query)

        url = GEMINI_API_URL + self.API_KEY
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{"parts": [{"text": query}]}],
            "generationConfig": {
                "temperature": 0.0,
            },
        }

        response = requests.post(url, headers=headers, json=data).json()
        answer = response['candidates'][0]['content']['parts'][0]['text']
        return answer  # will likely be a dictionary in string form

    def process_data(
        self, df
    ) -> pd.DataFrame:
        logger.info(f"[{self.job_id}] Starting data processing")
        columns = [
            (self.job_config["review_title_col"], "review_title"),
            (self.job_config["review_text_col"], "review"),
            (self.job_config["review_rating_col"], "rating"),
        ]
        # keep provided columns only
        filt_columns = [c[0] for c in columns if c[0] != ""]
        data = df[filt_columns]
        # rename them for consistency
        renamed_columns = [c[1] for c in columns if c[0] != ""]
        data.columns = renamed_columns

        def chunk_df(df, chunk_size):
            for i in range(0, df.shape[0], chunk_size):
                chunk = df[i : i + chunk_size]
                chunk_dict = chunk.to_dict(orient="records")
                chunk_str = "\n".join([str(record) for record in chunk_dict])
                yield chunk_str

        # chunk input data and send to Gemini for processing
        logger.info(f"[{self.job_id}] Data has length of {len(data)}")
        collected_responses = []
        for i, input_str in enumerate(chunk_df(data[:200], 20)):
            logger.debug(f"{self.job_id}: Working on chunk {i}")
            response = self.query_model(input_str)
            logger.debug("Response preview: " + str(response))
            collected_responses.append(response)
        logger.info(f"[{self.job_id}] LLM done processing all chunks")

        # merge all responses into a single dataframe
        summary_df = None
        for summary_str in collected_responses:
            # the "common_topics" key should exist (esp. with temperature=0)
            summary = json.loads(summary_str)["common_topics"]
            if summary_df is not None:
                summary_df = pd.concat([summary_df, pd.DataFrame.from_records(summary)])
            else:
                summary_df = pd.DataFrame.from_records(summary)
        logger.info(f"{self.job_id}: Merged all processed data")
        
        # turn into desired output format
        output_df = pd.DataFrame()
        output_df["frequency"] = summary_df.groupby("topic")["frequency"].sum()
        output_df["sentiment"] = summary_df.groupby("topic")["sentiment"].mean()
        return output_df

