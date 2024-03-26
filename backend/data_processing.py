import json
import os
import pandas as pd
from llm_core import Gemini


def make_gemini_instance():
    API_KEY = os.environ.get("GOOGLE_API_KEY")
    gemini = Gemini(API_KEY, enable_history=False)  # no need for memory here

    # read and configure prompt template
    # TODO: read kwargs from some config file (in S3 or mongo)
    with open("backend/prompt.txt", "r") as f:
        prompt_template = f.read().strip()
    gemini.use_prompt_template(prompt_template, product_name="Amazon Kindle")
    return gemini


def process_data(llm):
    data = pd.read_csv("backend/data_example.csv")
    data = data[["reviews.title", "reviews.text", "reviews.rating"]]
    data.columns = ["review_title", "review", "rating"]

    def chunk_df(df, chunk_size):
        for i in range(0, df.shape[0], chunk_size):
            chunk = df[i : i + chunk_size]
            chunk_dict = chunk.to_dict(orient="records")
            chunk_str = "\n".join([str(record) for record in chunk_dict])
            yield chunk_str

    collected_responses = []
    for i, input_str in enumerate(chunk_df(data[:200], 20)):
        print(f"Working on chunk {i}")
        response = llm.query(input_str)
        collected_responses.append(response)

    print("#" * 200)
    print(response)

    summary_df = None
    for summary_str in collected_responses:
        summary = json.loads(summary_str)["common_topics"]
        if summary_df is not None:
            summary_df = pd.concat([summary_df, pd.DataFrame.from_records(summary)])
        else:
            summary_df = pd.DataFrame.from_records(summary)

    output_df = summary_df.groupby("topic").mean()
    print(output_df)
    output_df.to_csv("backend/output.csv")
