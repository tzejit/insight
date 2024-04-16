import json
import os
import requests
import logging
import pandas as pd

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

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
            logger.error(
                f"[{self.job_id}]"
                + "{{INPUT_DATA}} field is required in prompt template"
            )
            raise KeyError("{{INPUT_DATA}} field is required in prompt template")
        self.prompt_template = prompt_template
        self.job_config = job_config
        if "product_name" in job_config:
            self.prompt_template = self.prompt_template.replace(
                "{{PRODUCT_NAME}}", job_config["product_name"]
            )

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
        answer = response["candidates"][0]["content"]["parts"][0]["text"]
        return answer  # will likely be a dictionary in string form

    def process_data(self, df):
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
        for i, input_str in enumerate(chunk_df(data, 25)):
            logger.debug(f"{self.job_id}: Working on chunk {i}")
            response = self.query_model(input_str)
            logger.debug("Response preview: " + str(response))
            collected_responses.append(response)
        logger.info(f"[{self.job_id}] LLM done processing all chunks")

        # merge all responses into a single dataframe
        raw_df = None
        MAX_FIX_ATTEMPTS = 5
        for raw_str in collected_responses:
            # attempt to fix a common LLM error where it runs out of output tokens
            fix_attempts = 0
            while fix_attempts < MAX_FIX_ATTEMPTS:
                try:
                    # the "common_topics" key should exist (esp. with temperature=0)
                    raw_dict = json.loads(raw_str)["common_topics"]
                    break
                except json.decoder.JSONDecodeError:
                    logger.debug(
                        "Failed to read JSON str - fix attempts:" + str(fix_attempts)
                    )
                    raw_str = "},".join(raw_str.split("},")[:-1]) + "}]}"
                    logger.debug(raw_str)
                    fix_attempts += 1
                    if fix_attempts == MAX_FIX_ATTEMPTS:
                        logger.error(
                            f"Failed to read JSON str after {MAX_FIX_ATTEMPTS} attempts, skipping"
                        )
                except Exception as e:
                    # if any other error, no chance of fixing - just dump this particular str
                    logger.error("Failed to read JSON str - unknown error")
                    logger.error(e)
                    continue

            if raw_df is not None:
                raw_df = pd.concat([raw_df, pd.DataFrame.from_records(raw_dict)])
            else:
                raw_df = pd.DataFrame.from_records(raw_dict)
        logger.info(f"{self.job_id}: Merged all processed data")

        # turn underscores into spaces in topics
        raw_df["topic"] = raw_df["topic"].apply(lambda x: x.replace("_", " "))

        # turn into desired output format
        output_df = pd.DataFrame()
        output_df["frequency"] = raw_df.groupby("topic")["frequency"].sum()
        output_df["sentiment"] = raw_df.groupby("topic")["sentiment"].mean()

        # return both dfs
        return output_df, raw_df


if __name__ == "__main__":
    os.environ["GOOGLE_API_KEY"] = "AIzaSyB30Fptqtj4kDp9qgEkKWQAiDPinjPtmdM"
    with open("backend/Lambda/prompt.txt", "r") as f:
        prompt_template = f.read()
    processor = ReviewProcessor(
        "jobid",
        prompt_template,
        dict(
            product_name="Amazon Kindle",
            review_title_col="reviews.title",
            review_text_col="reviews.text",
            review_rating_col="reviews.rating",
        ),
    )

    # FOR LOCAL DEBUGGING
    # for mth in ("feb", "mar", "apr"):
    #     print("#" * 300)
    #     print("Working on", mth)
    #     df = pd.read_csv(f"C:\\Users\\JunYou\\Downloads\\reviews\\{mth}_reviews.csv")
    #     output_df, raw_df = processor.process_data(df)
    #     output_df.to_json(f"C:\\Users\\JunYou\\Downloads\\reviews\\{mth}_results.json")
    #     raw_df.to_csv(f"C:\\Users\\JunYou\\Downloads\\reviews\\{mth}_summary.csv")
