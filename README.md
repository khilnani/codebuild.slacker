# codebuild.slacker

> AWS Lambda Serverless app to send AWS CodeBuild notifications to Slack 

This is an AWS Lambda Serverless app that can be used to respond to AWS Cloudwatch events
from AWS CodeBuild by sending messages to Slack


# Instructions

## AWS CodeBuild

- Navigate to https://console.aws.amazon.com/codebuild/
- Setup a new AWS CodeBuild project
    - See https://docs.aws.amazon.com/codebuild/latest/userguide/getting-started.html

## Create a Slack Webhook

> You need to set this up for each AWS CodeBuild project & Slack Channel combination

- Log into your Slack workspace online
- Navigate to https://my.slack.com/services/new/incoming-webhook/
- Select the Channel to post notifications to. e.g. `dev-pipeline-events`
- Customize the Integration name. e.g. `AWS CodeBuild - PROJECT_NAME`
- Use the Webhook URL from the next screen to update the `config.json` file.

## Setup the Serverless App

- Update the project name in `package.json`
- Rename `config.sample.json` to `config.json`
- Update the default project's AWS CodeBuild Project name and Slack Webhook
- Update `project-name` in the `fixtures/**.json` files to match
- Add more than one item if needed

## Deploy the Serverless App

> - Ensure you have Node.js 8.1 or higher. See https://nodejs.org/en/download/
> - AWS Profile credentials are setup. See https://serverless.com/framework/docs/providers/aws/guide/credentials/

- `npm install` - Installs Serverless and other dependencies locally
- `npm run deploy` - Use NPX to deploy to AWS
- `npx run info` - Print the Serverless Stack info
- `npm run logs` - Tail CloudWatch Logs from AWS
- `npm run test-build` - Run the Lambda locally using a Build json event
- `npm run test-phase` - Run the Lambda locally using a Phase json event

## Test the Serverless App

- Run a AWS CodeBuild build and look for the Slack alert!

# Reference Links
 
- Cloud Watch Events - https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#codebuild_event_type
- CodeBuild BuildSpec - https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
- CodeBuild Docker Images - https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
- CodeBuild Events - https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref

