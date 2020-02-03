'use strict';

const vision = require("@google-cloud/vision");
const parser = require("aws-lambda-multipart-parser");

// Creates a client
const client = new vision.ImageAnnotatorClient({
	keyFilename: "./credentials/service_account.json"
});

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const imageName = "4"
const fileName = `./source/${imageName}.jpg`;

exports.handler = async (event, ctx, callback) => {

	try {
		console.log("received request");
    console.log(event)

		callback(null, {
			statusCode: 200,
			body: { x: "['hello world body']" }
		});
		// Read a local image as a text document
		//const [result] = await client.documentTextDetection(fileName, { imageContext: { "languageHints": ["vi-t-i0-handwrit"] } });
		//const fullTextAnnotation = result.fullTextAnnotation;
		//require("fs").writeFileSync(`./${imageName}.json`, JSON.stringify(fullTextAnnotation, null, 2))
		//callback(null, {
		//	statusCode: 200,
		//	body: fullTextAnnotation
		//})
	} catch(err) {
		console.log(err);
		callback(null, {
			code: 400, 
			body: "Error parsing, please fix."
		});
	}
	//console.log(`Full text: ${fullTextAnnotation.text}`);
	//fullTextAnnotation.pages.forEach(page => {
	//	page.blocks.forEach(block => {
	//		console.log(`Block confidence: ${block.confidence}`);
	//		block.paragraphs.forEach(paragraph => {
	//			console.log(`Paragraph confidence: ${paragraph.confidence}`);
	//			paragraph.words.forEach(word => {
	//				const wordText = word.symbols.map(s => s.text).join("");
	//				console.log(`Word text: ${wordText}`);
	//				console.log(`Word confidence: ${word.confidence}`);
	//				word.symbols.forEach(symbol => {
	//					console.log(`Symbol text: ${symbol.text}`);
	//					console.log(`Symbol confidence: ${symbol.confidence}`);
	//				});
	//			});
	//		});
	//	});
	//});

}
