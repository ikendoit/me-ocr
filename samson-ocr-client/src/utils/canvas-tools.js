import { polygon, lineString } from "@turf/turf";
import lineIntersect from "@turf/line-intersect";

/*
	
	@param block
	@param line
	@return boolean: block overlap with line

*/
export const doesBlockOverlapLine = (block3DArray, line2DArray) => {

	const turfPolygon = polygon(block3DArray)
	const turfLine = lineString(line2DArray);
	const resultFT = lineIntersect(turfPolygon, turfLine); // return a feature collection

	const point2Ds = resultFT.features.map(e => e.geometry.coordinates);

	return point2Ds;


}

/*
  receive the 
  @param: simplifiedGoogleVAPI: the result of data-tools -> simplifyGoogleVAPI(..) function
  @param: line2D: 2D array of the line: [ [x,y] ]
  @return: [
    { 
      value 
      wordCoordinate
    },
  ] - the words that are selected with the line
*/
export const detectOverlapBlocks = (simplifiedGoogleVAPI, line2D) => {
	const detectedWordBlocks = []

	// iterate paragraph -> words -> check if the word overlaps with line
	for (let paragraph of simplifiedGoogleVAPI) {
		for (let word of paragraph.words) {
			const pointsOverlap = doesBlockOverlapLine([word.wordCoordinate], line2D);
			if (pointsOverlap.length > 0) {
				detectedWordBlocks.push(word)
			}
		}
	}

	return detectedWordBlocks
}
