import json
import os
import pandas as pd
from llm_core import Gemini


class ReviewProcessor:
    def __init__(self, prompt_path, product_name):
        API_KEY = os.environ.get("GOOGLE_API_KEY")
        gemini = Gemini(API_KEY, enable_history=False)  # no need for memory here

        # read and configure prompt template
        # TODO: read kwargs from some config file (in S3 or mongo)
        with open(prompt_path, "r") as f:
            prompt_template = f.read().strip()
        gemini.use_prompt_template(prompt_template, product_name=product_name)

        self.model = gemini

    def process_data(
        self, df, review_title_col="", review_text_col="", review_rating_col=""
    ):
        columns = [
            (review_title_col, "review_title"),
            (review_text_col, "review"),
            (review_rating_col, "rating"),
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

        collected_responses = []
        for i, input_str in enumerate(chunk_df(data[:200], 20)):
            print(f"Working on chunk {i}")
            response = self.model.query(input_str)
            collected_responses.append(response)

        summary_df = None
        for summary_str in collected_responses:
            summary = json.loads(summary_str)["common_topics"]
            if summary_df is not None:
                summary_df = pd.concat([summary_df, pd.DataFrame.from_records(summary)])
            else:
                summary_df = pd.DataFrame.from_records(summary)

        output_df = pd.DataFrame()
        output_df['frequency'] = summary_df.groupby("topic")['frequency'].sum()
        output_df['sentiment'] = summary_df.groupby("topic")['sentiment'].mean()
        return output_df



def llm_worker(user_id, file_id, aws, logger):
    review_processor = ReviewProcessor(
        "backend/prompt.txt",
        "Amazon Kindle",
    )  # TODO: Put these constants in user config, retrieve by user_id?
        
    # Process review data with LLM
    logger.info(f"Working on {user_id}, {file_id}")
    file_df = aws.s3.readObject(user_id, file_id)
    logger.info("Read file")
    output_df = review_processor.process_data(
        file_df,
        review_title_col="reviews.title",
        review_text_col="reviews.text",
        review_rating_col="reviews.rating",
    )  # TODO: Put these constants in user config somehow
    logger.info(f"Processed file, length of output is: {len(output_df)}")

    output_json = output_df.to_json(path_or_buf=None)  # return json as str
    aws.s3.writeJsonObject(user_id, file_id, output_json)  # save file

    # Notify the queue that the "work item" has been processed.
    # queue.task_done()
    # We don't actually need this?
    # Maybe next time when we are multiprocessing each CSV

    logger.info(f"Done processing file {user_id}/{file_id}")