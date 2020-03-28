#!/usr/bin/env bash

source /home/ken/.bashrc
source ./.env

# build and push to s3
npm run build && aws s3 sync build/ s3://samson-ocr-web --delete

# invalidate cloudfront distribution
aws cloudfront create-invalidation --distribution-id=$DISTRIBUTION_ID --paths "/*"
