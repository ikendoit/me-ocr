#!/usr/bin/env bash

source /home/ken/.bashrc
source ./.env

# build and push to s3, replace the old files
npm run build && aws s3 sync build/ s3://$WEB_BUCKET_NAME --delete

# invalidate cloudfront distribution, to refresh cache, and ensure clients get new versions
aws cloudfront create-invalidation --distribution-id=$DISTRIBUTION_ID --paths "/*"
