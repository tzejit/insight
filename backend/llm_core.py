import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)


class Gemini:
    def __init__(self, api_key, enable_history=False, history=[]):
        logger.info("Initializing Gemini 1.5 Pro")
        logger.info(f"History is {'enabled' if enable_history else 'disabled'}")

        if enable_history:
            self.history = history
            self.is_history_enabled = True
        else:
            self.is_history_enabled = False

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            "gemini-pro",
            generation_config=genai.GenerationConfig(temperature=0),
        )

        self.prompt_template = None

    def use_prompt_template(self, prompt_template, **kwargs):
        logger.info(f"Using prompt template: {prompt_template[:50]}...")

        # we require {{INPUT_DATA}} in prompt template
        if "{{INPUT_DATA}}" not in prompt_template:
            raise KeyError("{{INPUT_DATA}} field is required in prompt template")
        self.prompt_template = prompt_template

        # if kwargs are set, then fill up prompt template with them
        # e.g. model.use_prompt_template(..., product_name="Amazon Kindle")
        #      replaces {{PRODUCT_NAME}} in the prompt template with Amazon Kindle
        for replacement_key, replacement_val in kwargs.items():
            replacement_val = str(replacement_val)
            logger.info(
                f"Filling in prompt: {replacement_key.upper()} -> {replacement_val}"
            )
            text_to_replace = "{{" + replacement_key.upper() + "}}"
            self.prompt_template = self.prompt_template.replace(
                text_to_replace, replacement_val
            )

    def clear_history(self):
        logger.info("Clearing history")
        self.history = []

    def query(self, query, query_id=None):
        logger.info(
            f"Making query: prompt_template={self.prompt_template is not None}, id={str(query_id)}"
        )
        # use prompt template if it is set
        if self.prompt_template is not None:
            query = self.prompt_template.replace("{{INPUT_DATA}}", query)

        # use memory if it is enabled
        if self.is_history_enabled:
            self.history.append({"role": "user", "parts": [query]})
            response = self.model.generate_content(self.history)
            self.history.append({"role": "model", "parts": [response.text]})
        else:
            response = self.model.generate_content(query)

        # sometimes, the gemini API returns an error - filter it out here
        try:
            return response.text
        except Exception as err:
            logger.error(err)
            logger.error(response.prompt_feedback)
            return None

    def streamed_query(self, query):
        """Should only be used for testing"""
        response = self.model.generate_content(query, stream=True)

        try:
            for chunk in response:
                print(chunk.text, end="")
        except Exception as err:
            logger.error(err)
            logger.error(response.prompt_feedback)

    def count_tokens(self, query):
        return self.model.count_tokens(query)
