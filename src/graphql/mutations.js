/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createJob = /* GraphQL */ `
  mutation CreateJob(
    $input: CreateJobInput!
    $condition: ModelJobConditionInput
  ) {
    createJob(input: $input, condition: $condition) {
      user_id
      aws_id
      file_id
      job_name
      job_status
      job_config {
        product_name
        prompt_id
        review_title_col
        review_text_col
        review_rating_col
        __typename
      }
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateJob = /* GraphQL */ `
  mutation UpdateJob(
    $input: UpdateJobInput!
    $condition: ModelJobConditionInput
  ) {
    updateJob(input: $input, condition: $condition) {
      user_id
      aws_id
      file_id
      job_name
      job_status
      job_config {
        product_name
        prompt_id
        review_title_col
        review_text_col
        review_rating_col
        __typename
      }
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteJob = /* GraphQL */ `
  mutation DeleteJob(
    $input: DeleteJobInput!
    $condition: ModelJobConditionInput
  ) {
    deleteJob(input: $input, condition: $condition) {
      user_id
      aws_id
      file_id
      job_name
      job_status
      job_config {
        product_name
        prompt_id
        review_title_col
        review_text_col
        review_rating_col
        __typename
      }
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
