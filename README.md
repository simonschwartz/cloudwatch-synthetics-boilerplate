# Cloudwatch Synthetics Boilerplate

This is a boilerplate project to help teams get started using [AWS CloudWatch canary](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) test scripts. They are used for continuous monitoring of UX flows in production.

## Motivation

Synthetic checks are continuously run tests that validate critical flows that a user would take on your app. These critical user flows could be things like logging in, navigating or watching a video.

There are many products on the market that provide synthetic checks as a service. We created this project because it allowed us to achieve functionality that other products on the market did not have:

- We wanted to write synthetic checks in code and version control them
- We wanted to develop, run and validate synthetic checks locally before deploying them
- The costs for running synthetic checks with other products was high. We found that AWS Cloudwatch synthetics were approximately 10 times cheaper than other products (each test is $0.0012 per canary run).

## Setup

Start by creating a [fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) of this repository.

Navigate to the root of the forked repository and install dependencies with:

```
npm install
```

## Running synthetic checks locally

We have mocked the [AWS Synthetics environment(syn-1.0)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Function_Library.html) locally, which allows us to write and execute synthetic checks before deploying them.

To run a test locally:

```
node -e 'require(".tests/example-test").handler()'
```

One option is to map the scripts for running tests to npm scripts in the `packages.json`.

```
// package.json
...
"scripts": {
  "test:example-test": "node -e 'require(\"./tests/example-test\").handler()'",
  "test:another-test": "node -e 'require(\"./tests/another-test\").handler()'"
},
...
```

Then you can run tests with simpler command:

```
npm run test:example-test
```

To setup a new test:

1. Create the test file in `./tests`. For demo purposes this file will be called `another-test.js`
2. Add required boilerplate to the test file
```
const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const testFunction = async function () {
  // your synthetic check test code here
};

exports.handler = async () => {
    return await testFunction();
};
```
3. Add your test script to `package.json`
```
"scripts": {
  "test:test-example": "node -e 'require(\"./tests/another-test\").handler()'"
},
```

## Deployment

We have included some basic Cloudformation templates for automatically provisioning the required AWS services as part of this project.

You will need to add a `AWS::Synthetics::Canary` entity in `cfn/synthetic_checks_template.yaml` for each synthetic check you want to deploy.

It is up to you to decide how to deploy the artifact and Cloudformation templates. For this example we will deploy our synthetic checks using the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

Please note this is an example deployment and is probably not what you should be doing for production.

1. Deploy the `cfn/synthetic_checks_buckets_template.yaml` to AWS (you only have to do this when first setting up the project in AWS)
```
aws cloudformation deploy --template ./cfn/synthetic_checks_buckets_template.yaml --stack-name synthetic-checks-buckets
```
2. Compile the deploy artifact
```
npm run build
```
3. Deploy the artifact to s3
```
aws s3 cp artifact.zip s3://synthetics-tests/artifact.zip
```
4. Deploy the `cfn/synthetics_checks_template.yaml` to AWS.
```
aws cloudformation deploy --template ./cfn/synthetic_checks_template.yaml --stack-name synthetic-checks --capabilities CAPABILITY_NAMED_IAM
```
