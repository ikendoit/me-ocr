/*
	simplify google vision api response
	return: [{
		paragraphCoordinate: [ [x,y] ]
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
export const uniqifyBlocksGroupObject = (wordBlockGroups) => {
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

/*
	param: wordBlockGroups: {
		<group_name>: [
			coordinate: [ [x,y] x 4 ]
			value
		] 
	} 
	return [
		type: 'group_name'
		coordinate: [ [x,y] x 4 ]
		value
	}
	- array elements are unique
*/
export const flattenBlockGroupObject = (wordBlockGroups) => {
	let result = []
	for (let typeName in wordBlockGroups) {
		wordBlockGroups[typeName].forEach(block => block.type = typeName)
		result = result.concat( wordBlockGroups[typeName] )
	}
	return result;
}

/*
	receive :
		- simplified google VAPI Response, 
		- mode: TABLE - TEXT
	return: [ [ primitive-type ] ] - representable 2d array in <table/>
*/
export const pseudoParseVAPI = (visionAPIContent, mode = "TEXT") => {
	const words = visionAPIContent.reduce ( (master,e) => master.concat(e.words) , []);
	const lines = convertPageDetectionTo2dArray(words)
	console.log(lines);
	if (mode === "TEXT") {
		return parseLinesIntoText(lines)
	} else {
		const table = parseLinesIntoColumns(lines)
		return table;
	}
}

const parseLinesIntoText = (lines) => {
	for (let line of lines) {
		line.blocks.sort( (x,y) => x.wordCoordinate[0][0] > y.wordCoordinate[0][0] ? 1 : -1 )
		line.value = line.blocks.reduce( (master,ele) => {
			return master + ele.value + " ";
		}, "");
	}
	const textBlock = lines.reduce( (master, line) => {
		return master + line.value + "\n"
	}, "");
	return [[ textBlock ]]
}

/*
	receive parsed Lines array [
		{ yValue: float, blocks: { wordCoordinate, value } }
	]
	return [ [ primitive-type ] ]
*/
const parseLinesIntoColumns = (lines, columnNumber) => {
	let result = [];
	for (let line of lines) {
		// sort the lines by x value first.
		line.blocks.sort( (x,y) => x.wordCoordinate[0][0] > y.wordCoordinate[0][0] ? 1 : -1 )
	}
}

/*
	Receive:
		wordBlockArray: [
				{
					type: "col-1"
					wordCoordinate: [ [x,y] x5 ]: polygon 
					value: string 
				}
				{
					type: "col-2"
					wordCoordinate: [ [x,y] x5 ]: polygon 
					value: string 
				}
			]
	Return: [
		{ yValue: float, blocks: {type, wordCoordinate, value} }
	]

*/
export const convertPageDetectionTo2dArray = (wordBlockArray) => {

	const allLines = [];

	// sort block array by Y coordinate of top-left
	wordBlockArray.sort( (x,y) => x.wordCoordinate[0][1] > y.wordCoordinate[0][1]);

	/* iterate the blocks array
	     detect blocks in same line by
				 iterate each block, find a line that cuts its middle 
			 	find other blocks that intersects with that line. Put them to a group
			 continue, until the array has no more elements to process
	*/
	for (let i in wordBlockArray) {

		const currentBlock = wordBlockArray[i];

		// check if a line that can contain this block already exists
		const hostLine = allLines.find(line => checkWordBlockIntersectHorizonLine(currentBlock, line.yValue))

		if (hostLine != null) {
			hostLine.blocks.push(currentBlock)
		} else {
			const middleYValue = getMiddlePointOfBlock(currentBlock);
			allLines.push({
				yValue: middleYValue,
				blocks: [ currentBlock ]
			});
		}
	}

	return allLines;

}

/*
	given: [
		{
			yValue: float 
			blocks: [ wordCoordinate, value, type ]
		}
	]

	return [ [ value, value ] ] - 2d array, representatble in html table
*/
export const flatten2DArrayBlock = (table2DBlocks) => {
	const columns = ["Ghi_Chu", "Thu", "Chi"] // TODO: to be replced with params

	let result = [];
	// sort the line, based on yValue - veritcal middle point of the line
	table2DBlocks.sort ( (x,y) => x.yValue > y.yValue ? 1 : -1 );
	for (let line of table2DBlocks) {
		// sort the blocks, so that they order horizontally
		line.blocks.sort( (x,y) => x.wordCoordinate[0][0] > y.wordCoordinate[0][0] ? 1 : -1 )

		// init the different columns
		const currentLine = Array(columns.length).fill("")
		for (let block of line.blocks) {
			const columnIndex = columns.findIndex( e => e === block.type );
			if ( columnIndex === -1  || columnIndex == null ){
				console.log(columnIndex)
				throw new Error(`What's happening, type ${block.type} should always match column name ${columns.toString()}`)
			}

			currentLine[columnIndex] += block.value + " "
		}
		result.push(currentLine);
	}

	return result
}

/*
	given: wordBlock {
		coordinates: [ [x,y] ]
		value
	}

	return y-value: the middle point, vertically, of the block
*/
const getMiddlePointOfBlock = (wordBlock) => {
	const yValue = (wordBlock.wordCoordinate[3][1] + wordBlock.wordCoordinate[0][1]) / 2
	return yValue
}

/*
	given: wordBlock {
		coordinates: [ [x,y] ]
		value
	},
	yValue: yValue of a horizontal line, that may or may not intersects the wordBlock

	return boolean: does the line cut the block
*/
const checkWordBlockIntersectHorizonLine = (wordBlock, yValue) => {
	return wordBlock.wordCoordinate[3][1] >= yValue &&
		 wordBlock.wordCoordinate[0][1] <= yValue
}

/*
	Given:
		Textract Raw Response. 
*/
export const mergeGCPWithTextract = ({ aws, gcp }) => {

	console.log("merging right now");
	console.log(gcp, aws);

	let tableBlock = aws.Blocks.find( block => block.BlockType === "TABLE" )
	if (!tableBlock) return;
	let tableCells = aws.Blocks.filter(b => tableBlock.Relationships[0].Ids.includes(b.Id));

	// match table cells with value from gcp
	for (let cell of tableCells) {
		// convert polygon coordinate from [ { X, Y } ] => [ [x,y] ]
		cell.Geometry.Polygon = cell.Geometry.Polygon.map( a => [ a.X, a.Y ] )

		const value = searchTextInGcpByCoordinate(gcp, cell.Geometry.Polygon)
		cell.Text = value;
	}

	const gapFilledChildrenCells = fillGapOfTable(tableCells);
	let array2D = convertCellArrayTo2DArray(gapFilledChildrenCells);

	// fill 1d cells array with exploded cells, to flatten spans of cols and rows
	return array2D

}

/*
	given gcp Object: [{
		paragraphCoordinate: [ [x,y]x5 ],
		words: [ {
			wordCoordinate : [ [x,y]x5 ] TOP_LEFT -> TOP_RIGHT -> BOT_RIGHT -> BOT_LEFT -> TOP_LEFT
			value
		} ]
	}]
	cellPolygonTextract: [ [X, Y] x 4 ] TOP_LEFT -> TOP_RIGHT -> BOT_RIGHT -> BOT_LEFT

	return: string - the text value in the coordinate that match the gcp
*/
const searchTextInGcpByCoordinate = (gcp, cellPolygonTextract) => {
	const squareTextract = {
		left: cellPolygonTextract[0][0] * 1000,
		right: cellPolygonTextract[2][0] * 1000,
		top: cellPolygonTextract[0][1] * 1000,
		bottom: cellPolygonTextract[2][1] * 1000,
	}

	let values = [];

	for (let paragraph of gcp) {
		const squareParagraph = {
			left: paragraph.paragraphCoordinate[0][0],
			right: paragraph.paragraphCoordinate[2][0],
			top: paragraph.paragraphCoordinate[0][1],
			bottom: paragraph.paragraphCoordinate[2][1],
		}
		if (squareIntersect(squareParagraph, squareTextract)) {
			values = values.concat(paragraph.words.map( word => word.value));
		}
	}

	return values.join(" ");
}

// return boolean: check if 2 squares: { left, top, bottom, right } intersects 
const squareIntersect = (square1, square2) => {
	const intersectX = (
		( square1.left > square2.left && square1.left < square2.right ) ||
		( square2.left > square1.left && square2.left < square1.right )
	)

	const intersectY = (
		( square1.top > square2.top && square1.top < square2.bottom ) ||
		( square2.top > square1.top && square2.top < square1.bottom )
	)

	return intersectX && intersectY
}


const fillGapOfTable = textractCellsArray => {
  for (let cell of textractCellsArray) {
    if (cell.ColumnSpan >= 2) {
      for (let i = 1; i < cell.ColumnSpan; i++) {
        textractCellsArray.push(
          genEmptyCell(
            cell.ColumnIndex + 1,
            cell.RowIndex,
            cell.Geometry,
            cell.Page,
            cell.Id
          )
        );
        cell.ColumnSpan = cell.ColumnSpan - 1;
      }
    }
    if (cell.RowSpan >= 2) {
      for (let i = 1; i < cell.RowSpan; i++) {
        textractCellsArray.push(
          genEmptyCell(
            cell.ColumnIndex,
            cell.RowIndex + 1,
            cell.Geometry,
            cell.Page,
            cell.Id
          )
        );
        cell.RowSpan = cell.RowSpan - 1;
      }
    }
  }

  textractCellsArray.sort((a, b) => (a.ColumnIndex < b.ColumnIndex ? 1 : -1));
  textractCellsArray.sort((a, b) => (a.RowIndex > b.RowIndex ? 1 : -1));

  return textractCellsArray;
};

// convert 1d Textract-cell array => 2D String value table
const convertCellArrayTo2DArray = cellsArray => {
  const arraySize = cellsArray.reduce(
    (master, cell) => {
      if (master.col < cell.ColumnIndex) master.col = cell.ColumnIndex;
      if (master.row < cell.RowIndex) master.row = cell.RowIndex;
      return master;
    },
    { col: 0, row: 0 }
  );

  const resultArray = [...Array(arraySize.row)].map(x =>
    Array(arraySize.col).fill("")
  );

  for (let cell of cellsArray) {
    resultArray[cell.RowIndex - 1][cell.ColumnIndex - 1] = cell.Text;
  }

  return resultArray;
};
