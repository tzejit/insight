/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getJob = /* GraphQL */ `
  query GetJob($id: ID!) {
    getJob(id: $id) {
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
export const listJobs = /* GraphQL */ `
  query ListJobs(
    $filter: ModelJobFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        user_id
        aws_id
        file_id
        job_name
        job_status
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const jobsByUser_id = /* GraphQL */ `
  query JobsByUser_id(
    $user_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelJobFilterInput
    $limit: Int
    $nextToken: String
  ) {
    jobsByUser_id(
      user_id: $user_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        user_id
        aws_id
        file_id
        job_name
        job_status
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
