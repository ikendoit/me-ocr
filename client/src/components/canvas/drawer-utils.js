/*
  params:
    currentLine: [ [x,y], [x,y].. ]
    lineHighlight: null, "Chi", "Thu", "text"
    ctx
*/
export const drawLine = (currentLine, lineHighlight, canvasRefObj) => {
  const ctx = canvasRefObj.getContext('2d');
  ctx.globalAlpha = 0.5;
	ctx.lineWidth = "10";
	ctx.strokeStyle = 'rgba(0,0,0,0.7)';
	if (lineHighlight === "Chi") ctx.strokeStyle = "yellow";
	if (lineHighlight === "Thu") ctx.strokeStyle = "green";
  else ctx.strokeStyle = "black";

	// points
	const lastLength      = currentLine.length;
	const lastPoint 			= currentLine[lastLength - 1]
	const secondLastPoint = currentLine[lastLength - 2]

	ctx.beginPath();
	ctx.moveTo(...lastPoint);
	ctx.lineTo(...secondLastPoint);
	ctx.stroke();
}

/*
  given the simplified format of the google vision api response ( utils->data-tools.js->simplify function )
  render the words on the screen.
*/
export const drawWordBlocks = (simplifiedGoogleVAPI, canvasRefObj) => {
  const ctx = canvasRefObj.getContext('2d');
  const hostWidth = canvasRef.width;
  const hostHeight = canvasRef.height;

  for (let paragraph of simplifiedGoogleVAPI) {
    for (let word of simplifiedGoogleVAPI) {

      const {X, Y, W, H} = canvasCoordFromWordCoord(word.wordCoordinate, hostWidth, hostHeight);
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "red";
      ctx.strokeOpacity = 0.1;
      ctx.rect(X, Y, W, H);
      ctx.stroke();

      ctx.font = "30px bold";
      ctx.fillText(symbol.text, X, Y + 25);
    }
  }

}

/*
  e: mouse action object
  return [x,y]
*/
export const getMouseCoord = (e, canvasRefObj) => {
  console.log(canvasRefObj.offsetLeft);
	let offsetX = canvasRefObj.offsetLeft,
		offsetY = canvasRefObj.offsetTop;

	const x = e.pageX - offsetX;
	const y = e.pageY - offsetY;
	return [x,y]
}

/*
  Given word coord, from the simplified google vision api
  @param: wordCoord: [ [x,y] x 4|5 ]
  @return: {
    X,
    Y,
    W,
    H
  } - renderable rectangle for canvas
*/
const canvasCoordFromWordCoord = (wordCoord, hostWidth, hostHeight) => {
  return {
    // TODO: check if this ratio will wokr
    X: wordCoord[0][0] * hostWidth / 1000,
    Y: wordCoord[0][1] * hostHeight / 1000,
    W: (wordCoord[2][0] - wordCoord[0][0]) * hostWidth / 1000,
    H: (wordCoord[2][1] - wordCoord[0][1]) * hostHeight / 1000
  }
}
