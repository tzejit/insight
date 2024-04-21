# InSight Frontend

React frontend for our CS5224 project, InSight. Hosted using AWS Amplify.

## Setup

Install required libraries:

```bash
npm install
```

## Deployment

For development, make sure your working directory is the main directory.

```bash
npm run start
```

## Workflow:

1. User signs up or logs in to InSight account (Authenticated using Cognito).
2. User submits a csv file for report generation.
3. Frontend calls backend API to upload csv, which triggers report generation (see backend/README.md for more details).
4. Frontend polls backend for job progress.
5. Once job status has been updated to COMPLETED, frontend enables view report button.
6. Clicking on view redirects user to dashboard page that retrieves report data from backend and displays it in relevant graphs.
7. User can enter history page, in which frontend calls backed API to retrieve report history.
8. User can view historical reports by clicking on relevant links, which redirects users to the dashboard page supplied with job ID as its query parameter.


## Structure
```
├── amplify
├── backend
├── src
│   ├── assets
│   │   ├── file logos
│   ├── components
│   │   ├── buttons
│   │   |   ├── styled button components
│   │   ├── graphs
│   │   |   ├── styled graph components
│   │   ├── inputs
│   │   |   ├── styled input components
│   │   ├── themes
│   │   |   ├── theme and colour scheme
│   │   ├── typography
│   │   |   ├── styled text box components
│   │   ├── *.js all other page components
│   ├── graphql
│   │   ├── graphql query strings and schema
│   ├── hooks
│   │   ├── hooks for authentication and backend API calls
│   ├── pages
│   │   ├── UI pages
│   ├── index.js entry point to application
├── package.json
├── package-lock.json
└── .gitignore
```
The application is split into frontend and backend. The frontend portion uses React and is housed under the src folder and contains all UI pages and subcomponents as well as hooks used to abstract the API call to the backend. 

The backend is hosted using AWS Amplify, which contains mostly autogenerated files in the amplify folder, with the exception of amplify/backend/api/insight/schema.graphql which defined the schema used in our database.

The serverless backend is created using Lambda. The configuration code for EventBridge and Lambda as well as the code for Lambda functions can be found in the backend folder. More information regarding the backend workflow can be found under backend/README.md
