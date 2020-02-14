'use strict';

const vision = require("@google-cloud/vision");
const parser = require("aws-lambda-multipart-parser");
const fs = require("fs");

// S3
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Load credentials and set Region from JSON file
AWS.config.loadFromPath('./credentials/aws-config.json');
const s3 = new AWS.S3({apiVersion: '2006-03-01'})

// GCP - Cloud Vision
// Creates a client
const client = new vision.ImageAnnotatorClient({
	keyFilename: "./credentials/service_account.json"
});

const headersApi = {
	"Access-Control-Allow-Headers": 
			"Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
	"Access-Control-Allow-Methods": "HEAD,OPTIONS,POST",
	"Access-Control-Allow-Origin": "*",
}

// MAIN
exports.handler = async (event, ctx, callback) => {

	try {
		const body = JSON.parse(event.body);

		// check request validity
		if (!body.Bucket || !body.S3Path) {
			callback(null, {
				statusCoce: 400,
				headers: headersApi,
				body: "Invalid S3 Path"
			});
			return;
		}

		// download file to local storage
		const fileName = `/tmp/${body.S3Path.replace(/\//g,'_')}`
		const data = await s3.getObject({
			Bucket: body.Bucket,
			Key: body.S3Path
		}).promise(); 

		fs.writeFileSync(fileName, data.Body);
		console.log("writing to file: ", fileName);

		// run vision api on downloaded file
	  const [result] = await client.documentTextDetection(fileName, { imageContext: { "languageHints": ["vi-t-i0-handwrit"] } });
		const fullTextAnnotation = result.fullTextAnnotation;
				//fs.writeFileSync(`./${imageName}.json`, JSON.stringify(fullTextAnnotation, null, 2))

		console.log(JSON.stringify(fullTextAnnotation, null, 2));

		// response to client 
		callback(null, {
			statusCode: 200,
			headers: headersApi,
			body: fullTextAnnotation
		})

		return fullTextAnnotation;

	} catch(err) {
		console.log(err);
		callback(null, {
			code: 400, 
			headers: headersApi,
			body: err.toString()
		});
	}
}
