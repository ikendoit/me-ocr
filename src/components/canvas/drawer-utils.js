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
