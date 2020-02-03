/*
	simplify google vision api response
	return: [{
		paragraphCoordinate: [ [x,y] ]
		value: text
		words: [{
			wordCoordinate: [ [x,y] ],
			value: text
		}]
	}]
*/
export const simplifyGoogleVAPI = (visionAPIContent) => {

	const finalizedResult = [];

  if (!visionAPIContent.pages[0]) return finalizedResult;

	const blocks = visionAPIContent.pages[0].blocks
	for (let i = 0; i < blocks.length; i++) {
		const curBlock = blocks[i];

		// iterate each paragraph, which contains lots of words
		for (let iPara = 0 ; iPara < curBlock.paragraphs.length; iPara++) {
			const curParagraph = curBlock.paragraphs[iPara]
			const curParagraphObject = {
				paragraphCoordinate: convertVerticesTo2DPolygon(curParagraph.boundingBox.vertices),
				words: []
			}

			// iterate the word array of this single paragraph
			for (let iWord = 0 ; iWord < curParagraph.words.length; iWord ++ ) {
				const curWord = curParagraph.words[iWord]
				const text = curWord.symbols.reduce( (m, s) => m+s.text, "")
				curParagraphObject.words.push({
					wordCoordinate: convertVerticesTo2DPolygon(curWord.boundingBox.vertices),
					value: text
				})
			}

			finalizedResult.push(curParagraphObject);
		}
	}

	return finalizedResult;
}

/*
  @param: vertices: [ { x, y } x4 ]
  @return: [ [x,y] ] ( closing polygon )
*/
const convertVerticesTo2DPolygon = (vertices) => {

  // map to [ [x,y] ]
  const rawArray = vertices.map(e => [e.x,e.y])
  // close open polygon
  rawArray.push(rawArray[0])

  return rawArray

}

/*
	param: wordBlockGroups: {
		<group_name>: [
			coordinate: [ [x,y] x 4 ]
			value
		] 
	} 
	- array elements may repeat
	mutate that object into: {
		<group_name>: [
			coordinate: [ [x,y] x 4 ]
			value
		]
	}
	- array elements are unique
*/
export const uniqifyWordBlockObject = (wordBlockGroups) => {
	for (let key in wordBlockGroups) {
		const elements = wordBlockGroups[key]
		const uniqDict = elements.reduce( (master, ele) => {
			master[`${ele.wordCoordinate[0][0]}-${ele.wordCoordinate[0][1]}`] = ele;
			return master;
		}, {});
		const uniqArray = Object.values(uniqDict);
		wordBlockGroups[key] = uniqArray;
	}
}

export const autoConvertGoogleVAPIToTable = (visionAPIContent) => {

	console.log("testing auto conversion");

}
