'use strict';

const {
	parseS3File, 
	parseGCPVision
} = require("./utils");

const headersApi = {
	"Access-Control-Allow-Headers": 
			"Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
	"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
	"Access-Control-Allow-Origin": "*",
}
// MAIN
exports.handler = async (event, ctx, callback) => {

	try {

		let body = event.body
		if (typeof event.body === "string") {
			body = JSON.parse(event.body);
		}

		// check request validity
		if (!body.Bucket || !body.S3Path) {
			callback(null, {
				statusCoce: 400,
				headers: headersApi,
				body: "Invalid S3 Path"
			});
			return;
		}

		const [ gcpTextAnnotation, awsTextAnnotation ] = await Promise.all([
			parseGCPVision(body.S3Path, body.Bucket),
			parseS3File(body.S3Path, body.Bucket)
		]);

		console.log("responding back to client 200")
		// response to client 
		callback(null, {
			statusCode: 200,
			headers: headersApi,
			body: JSON.stringify({
				gcp: gcpTextAnnotation,
				aws: awsTextAnnotation
			})
		})

		return {
			gcp: gcpTextAnnotation,
			aws: awsTextAnnotation
		};

	} catch(err) {
		console.log("ERROR:", err, event.body);
		callback(null, {
			code: 400, 
			headers: headersApi,
			body: err.toString()
		});
	}
}
