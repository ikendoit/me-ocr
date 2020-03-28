//const fs = require("fs");
var AWS = require('aws-sdk');
const vision = require("@google-cloud/vision");
const fs = require("fs");

// Load credentials and set Region from JSON file
AWS.config.loadFromPath('./credentials/aws-config.json');
const s3 = new AWS.S3({apiVersion: '2006-03-01'})
const textract = new AWS.Textract();
const sqs = new AWS.SQS();

// GCP - Cloud Vision - Creates a client
const client = new vision.ImageAnnotatorClient({
	keyFilename: "./credentials/service_account.json"
});


// Wait until textract finishes parsing pdf, by waiting for the "its done" flag on SQS
const pollSQSMessage = async (jobId) => {
	if (jobId == ""  || jobId == null) {
		throw new Error("Invalid Job Id: " + jobId);
	}

	const attributes = "ALL"
	const receiveMessageInput = {
		QueueUrl: "https://sqs.us-west-2.amazonaws.com/220817231329/samson-ocr-sqs-queue",
		MaxNumberOfMessages: 10,
		MessageAttributeNames: ['ALL'],
		WaitTimeSeconds: 5,
	}

	let received = false

	while (!received) {

		try {

			const messageRes = await sqs.receiveMessage(receiveMessageInput).promise()

			if (messageRes.Messages == null) continue;

			for (let message of messageRes.Messages) {
				const stringMessage = JSON.parse(message.Body);
				const content 			= JSON.parse(stringMessage.Message);

				console.log(content.JobId, jobId, content.Status);

				if ( content.JobId == jobId && content.Status == "SUCCEEDED" ) {
					received = true
					console.log("DONE polling");
				} else {
					console.log("polling..");
				}
			}

		} catch(err) {
			console.log("Error pulling the sqs: ", err);
			throw new Error("Error receiving SQS messages "+ err.toString())
		}

	} 

	return false;
}


const parseS3File = async (fileName, bucket) => {

  let params = {
		Document: { /* required */
			S3Object: {
				Bucket: bucket,
				Name: fileName
			}
		},
		FeatureTypes: [ /* required */
			'TABLES'
		],
	};

  try {
		
    const resAnalysis = await textract.analyzeDocument(params).promise() // register ocr job
		return resAnalysis
  } catch(err) {
		console.log("error during parsing of pdf");
    console.log(err, err.stack); 
		throw err;
  }

}

const parseGCPVision = async (fileName, bucket) => {

	// download file to local storage
	const localFileName = `/tmp/${fileName.replace(/\//g,'_')}`
	const data = await s3.getObject({
		Bucket: bucket,
		Key: fileName 
	}).promise(); 

	fs.writeFileSync(localFileName, data.Body);

	// run vision api on downloaded file
	const [result] = await client.documentTextDetection(localFileName, { imageContext: { "languageHints": ["vi-t-i0-handwrit"] } });
	const fullTextAnnotation = result.fullTextAnnotation;

	return fullTextAnnotation


}

module.exports = {
	parseS3File,
	parseGCPVision
}
