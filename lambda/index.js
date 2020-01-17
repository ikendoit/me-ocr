// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "./credentials/service_account.json"
});

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const imageName="4"
const fileName = `./source/${imageName}.jpg`;

(async () => {
  // Read a local image as a text document
  const [result] = await client.documentTextDetection(fileName, { imageContext: { "languageHints": ["vi-t-i0-handwrit"] }});
  const fullTextAnnotation = result.fullTextAnnotation;
	require("fs").writeFileSync(`./${imageName}.json`, JSON.stringify(fullTextAnnotation, null, 2))
  console.log(`Full text: ${fullTextAnnotation.text}`);
  fullTextAnnotation.pages.forEach(page => {
    page.blocks.forEach(block => {
      console.log(`Block confidence: ${block.confidence}`);
      block.paragraphs.forEach(paragraph => {
        console.log(`Paragraph confidence: ${paragraph.confidence}`);
        paragraph.words.forEach(word => {
          const wordText = word.symbols.map(s => s.text).join("");
          console.log(`Word text: ${wordText}`);
          console.log(`Word confidence: ${word.confidence}`);
          word.symbols.forEach(symbol => {
            console.log(`Symbol text: ${symbol.text}`);
            console.log(`Symbol confidence: ${symbol.confidence}`);
          });
        });
      });
    });
  });
})();

export const handler = (event, ctx) => {

	console.log("the handler was created");

	return {
		status: 201
	}

}
