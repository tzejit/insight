/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateJob = /* GraphQL */ `
  subscription OnCreateJob(
    $filter: ModelSubscriptionJobFilterInput
    $user_id: String
  ) {
    onCreateJob(filter: $filter, user_id: $user_id) {
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
export const onUpdateJob = /* GraphQL */ `
  subscription OnUpdateJob(
    $filter: ModelSubscriptionJobFilterInput
    $user_id: String
  ) {
    onUpdateJob(filter: $filter, user_id: $user_id) {
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
export const onDeleteJob = /* GraphQL */ `
  subscription OnDeleteJob(
    $filter: ModelSubscriptionJobFilterInput
    $user_id: String
  ) {
    onDeleteJob(filter: $filter, user_id: $user_id) {
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
