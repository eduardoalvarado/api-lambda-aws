#!/bin/bash

set -e

FUNCTION_NAME="dev-tsb-lmb-crud"
REGION="us-east-2"

echo "Starting deployment process..."

echo "Cleaning previous build artifacts..."
rm -f deployment-package.zip
rm -rf dist

echo "Installing dependecies..."
npm install

echo "Compiling Typescript and building deployment package..."
npm run build

echo "Creating deployment ZIP archive (deployment-package.zip)..."
npm run zip

echo "Deploying to AWS Lambda function: $FUNCTION_NAME"
aws lambda update-function-code \
--function-name dev-tsb-lmb-crud \
--zip-file fileb://deployment-package.zip \
--region "$REGION"

echo "Deployment completed successfully!"