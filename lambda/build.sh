#!/usr/bin/env bash

zip -r samson-ocr-parser-lambda.zip \
	node_modules/ \
	credentials/ \
	index.js \
	package.json \
	package-lock.json \
	utils.js
