#!/usr/bin/env bash

source /home/ken/.bashrc

# build and push to s3
npm run build && aws s3 sync build/ s3://samson-ocr-web --delete

# invalidate cloudfront distribution
aws cloudfront create-invalidation --distribution-id=E397LJ178VB74Y --paths "/*"
