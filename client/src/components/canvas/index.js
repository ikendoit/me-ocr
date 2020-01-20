import { useRef, useEffect, useState } from "preact/hooks"
import { drawLine, drawWordBlocks, getMouseCoord } from "./drawer-utils"
import { detectOverlapBlocks } from "../../utils/canvas-tools"

const Canvas = (props) => {

	const canvasRef = useRef(null); 
	let [isTrackingMouse, setIsTrackingMouse] = useState(false);
	const [drawnLines, setDrawnLines]           = useState({});
	const [currentLine, setCurrentLine]         = useState([]);
	const [detectedBlocksGroup, setDetectedBlockGroup] = useState({});

	const detectTrackedBlocks = () => {}

	const onCanvasMouseDown = (e) => {
		const mouseCoord = getMouseCoord(e, canvasRef.current)
		currentLine.push(mouseCoord);
		setCurrentLine(currentLine)
		isTrackingMouse = true;
		setIsTrackingMouse(isTrackingMouse);
	}

	const onCanvasMouseMove = (e) => {
		if (!isTrackingMouse) return;
		const mouseCoord = getMouseCoord(e, canvasRef.current)
		currentLine.push(mouseCoord);
		setCurrentLine(currentLine)
		drawLine(currentLine, props.lineHighlight, canvasRef.current)
		if (currentLine.length % 5 === 0) {
			// detect blocks the line has crossed, save the ids
			const detectedBlocks = detectOverlapBlocks(props.rawOcrResult, currentLine);
			console.log("detected: ", detectedBlocks);
		}
	}

	const onCanvasMouseUp = (e) => {
		isTrackingMouse = false;
		if (!props.lineHighlight) {	
			return;
		}
		drawnLines.push({
			name: props.lineHighlight,
			color: props.lineColor,
			data: [...currentLine]
		})
		setCurrentLine([])
		setIsTrackingMouse(isTrackingMouse);
	}

	const addEventListenerCanvas = () => {
		canvasRef.current.onmousedown = onCanvasMouseDown
		canvasRef.current.onmousemove = onCanvasMouseMove
		canvasRef.current.onmouseup = onCanvasMouseUp
	}

	/*
		given an image,
		render it on the canvas 
	*/
	const loadImageOnCanvas = () => {
		const ctx = canvasRef.current.getContext('2d')

    var reader = new FileReader();
    var file = props.imageFile;
    // load to image to get it's width/height
    var img = new Image();
    img.onload = function() {
        // scale canvas to image
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        // draw image
        ctx.drawImage(img, 0, 0
            , ctx.canvas.width, ctx.canvas.height
        );
    }
    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
    }
    // this is to read the file
   	reader.readAsDataURL(file);
		addEventListenerCanvas()
		if (props.rawOcrResult.length > 0) {
      console.log("drawing words blocks on image");
			loadWordBlocksOnCanvas();
		}
    setDetectedBlockGroup([]);
	}

	/*
		given the simplified format of the google vision api response ( utils->data-tools.js->simplify function )
		render the words on the screen.
	*/
	const loadWordBlocksOnCanvas = () => {
		drawWordBlocks(props.rawOcrResult, canvasRef.current);
	}
				
	useEffect( () => {

		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext('2d');

		ctx.clearRect(0,0,canvasRef.width, canvasRef.height);
		
		if (props.imageFile) {
			loadImageOnCanvas()
		}
	} , [canvasRef.current, props.imageFile, props.rawOcrResult])

  if (canvasRef.current && props.rawOcrResult.length > 0) {
		const ctx = canvasRef.current.getContext('2d');
    loadWordBlocksOnCanvas();
  }


	return (
		<div>
			<canvas
				id="myCanvas"
				height="1000px"
				width="1000px"
				ref={canvasRef}
				style={{
					border: '1px solid #d3d3d3',
				}}
			>
				Your browser does not support the HTML5 canvas tag.
			</canvas>
			<img id="place-holder-img-upload"> </img>
		</div>
	)
}

export default Canvas;
