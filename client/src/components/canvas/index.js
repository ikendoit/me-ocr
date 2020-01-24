import { useRef, useEffect, useState } from "preact/hooks"
import { drawLine, drawWordBlocks, getMouseCoord } from "./drawer-utils"
import { detectOverlapBlocks } from "../../utils/canvas-tools"
import { uniqifyWordBlockObject } from "../../utils/data-tools"

const Canvas = (props) => {

	const canvasRef = useRef(null); 
	let [isTrackingMouse, setIsTrackingMouse] = useState(false);
	const [drawnLines, setDrawnLines]           = useState([]);
	const [currentLine, setCurrentLine]         = useState([]);
	const [detectedBlocksGroup, setDetectedBlockGroup] = useState({});

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

		// for every 5 points detected with mouse, perform tracking of crossed blocks
		if (currentLine.length % 5 === 0) {

			// detect blocks the line has crossed, save the ids
			const detectedBlocks = detectOverlapBlocks(props.rawOcrResult, currentLine);
			// init array if not already
			if (!detectedBlocksGroup[props.lineHighlight]) detectedBlocksGroup[props.lineHighlight] = [];
			// add the detected Blocks into group
			detectedBlocksGroup[props.lineHighlight] = detectedBlocksGroup[props.lineHighlight].concat(detectedBlocks);

		}
	}

	const onCanvasMouseUp = (e) => {
		isTrackingMouse = false;
		if (!props.lineHighlight) {	
			return;
		}
		drawnLines.push({
			name: props.lineHighlight,
			data: [...currentLine]
		})
		setCurrentLine([])
		setIsTrackingMouse(isTrackingMouse);
		uniqifyWordBlockObject(detectedBlocksGroup)
		console.log(detectedBlocksGroup);
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
		if (props.imageFile) {
			const ctx = canvasRef.current.getContext('2d');
			ctx.clearRect(0,0,canvasRef.width, canvasRef.height);
			loadImageOnCanvas()
		}

	} , [canvasRef.current, props.imageFile, props.rawOcrResult])

	if (canvasRef.current && props.rawOcrResult.length > 0) {
		addEventListenerCanvas();
		loadWordBlocksOnCanvas();
	}

	console.log('rendering: ',detectedBlocksGroup);
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
