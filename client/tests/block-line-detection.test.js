import { detectOverlapBlocks } from "../src/utils/canvas-tools"
import { simplifyGoogleVAPI } from "../src/utils/data-tools"
import seedGoogleVisionAPIResponse from "./seed/sample-blocks.json"

describe('Test line overlapping blocks', () => {
	test('Simple case: line DOES NOT overlap straight blocks', () => {
		const simplifiedGoogleVAPI = simplifyGoogleVAPI(seedGoogleVisionAPIResponse);
		const line = [
			[1, 300],
			[1, 400]
		]
		const overlapWords = detectOverlapBlocks(simplifiedGoogleVAPI, line)

		expect(overlapWords.length === 0);
  });

	test('Simple case: line overlaps straight blocks', () => {
		const simplifiedGoogleVAPI = simplifyGoogleVAPI(seedGoogleVisionAPIResponse);
		const line = [
			[120, 300],
			[120, 400]
		]
		const overlapWords = detectOverlapBlocks(simplifiedGoogleVAPI, line)

		expect(overlapWords.length > 0);
  });


	test('Complex line overlaps 2 straight blocks', () => {
		const simplifiedGoogleVAPI = simplifyGoogleVAPI(seedGoogleVisionAPIResponse);
		const line = [
			[120, 300],
			[120, 400],
			[750, 100]
		]
		const overlapWords = detectOverlapBlocks(simplifiedGoogleVAPI, line)

		expect(overlapWords.length >= 2);
  });

});

describe('Test Simplifying google vision api response', () => {

	test('Test simple simplification', () => {
		const result = simplifyGoogleVAPI(seedGoogleVisionAPIResponse);
		expect(result.length > 0 )
		expect(result[0].paragraphCoordinate.length === 4 )
		expect(result[0].words.length > 0 )
		expect(result[0].words[0].wordCoordinate.length === 4 )
  });

})
