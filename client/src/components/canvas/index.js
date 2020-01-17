import { useRef, useEffect, useState } from "preact/hooks"
import { drawLine, getMouseCoord } from "./drawer-utils"
import testData from "./jsons/1.json"

const Canvas = (props) => {

	const canvasRef = useRef(null); 
	let [isTrackingMouse, setIsTrackingMouse] = useState(false);
	const [drawnLines, setDrawnLines]           = useState({});
	const [currentLine, setCurrentLine]         = useState([]);
	const [lineHighlight, setLineHighlight]     = useState(null);
	const [detectedBlocksGroup, setDetectedBlockGroup] = useState({});
	const [googleVAPIResponse, setGoogleVAPIResponse] = useState([]);

	const detectTrackedBlocks = () => {}

	const onCanvasMouseDown = (e) => {
		const mouseCoord = getMouseCoord(e, canvasRef.current)
		currentLine.push(mouseCoord);
		setCurrentLine(currentLine)
		isTrackingMouse = true;
		setIsTrackingMouse(isTrackingMouse);
		console.log("mouse downing", currentLine, isTrackingMouse);
	}

	const onCanvasMouseMove = (e) => {
		console.log("mobing: ", isTrackingMouse);	
		if (!isTrackingMouse) return;
		const mouseCoord = getMouseCoord(e, canvasRef.current)
		currentLine.push(mouseCoord);
		setCurrentLine(currentLine)
		console.log("moving")
		drawLine(currentLine, props.lineHighlight, canvasRef.current)
		if (currentLine.length % 5 === 0) {
			// detect blocks the line has crossed, save the ids
			const detectedBlocks = 
		}
	}

	const onCanvasMouseUp = (e) => {
		if (!props.lineHighlight) {	
			console.log("line heih
			return;
		}
		drawnLines.push({
			name: props.lineHighlight,
			color: props.lineColor,
			data: [...currentLine]
		})
		setCurrentLine([])
		console.log("mouse upping", currentLine, isTrackingMouse)
		isTrackingMouse = false;
		setIsTrackingMouse(isTrackingMouse);
	}

	/*
	  Receive the image from parent, 
		push the image into lambda function, get the raw google vision api result

	*/
	const loadData = async () => {
		//let data = await fetch("http://127.0.0.1:8080/jsons/4.json");
		//data = await data.json();
		//return data;
		setGoogleVAPIResponse(testData);
	}

	const addEventListenerCanvas = () => {
		canvasRef.current.onmousedown = onCanvasMouseDown
		canvasRef.current.onmousemove = onCanvasMouseMove
		canvasRef.current.onmouseup = onCanvasMouseUp
	}

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
	}
				
	useEffect( () => {
		if (props.imageFile) {
			loadImageOnCanvas()
		}
	} , [canvasRef.current, props.imageFile])

	return (
		<div>
			<canvas
				id="myCanvas"
				height="1000px"
				width="1000px"
				ref={canvasRef}
				style={{
					border: '1px solid #d3d3d3'
				}}
			>
				Your browser does not support the HTML5 canvas tag.
			</canvas>
			<img id="place-holder-img-upload"> </img>
		</div>
	)
}

export default Canvas;
