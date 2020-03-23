import React from 'react';
import { useRef, useEffect, useState } from "react"
import { drawLine, drawWordBlocks, getMouseCoord } from "./drawer-utils"
import { detectOverlapBlocks } from "../../utils/canvas-tools"
import {
	uniqifyBlocksGroupObject,
	flattenBlockGroupObject,
	convertPageDetectionTo2dArray,
	flatten2DArrayBlock
} from "../../utils/data-tools"

const Canvas = (props) => {

	const canvasRef = useRef(null);
	let [isTrackingMouse, setIsTrackingMouse] = useState(false);
	const [drawnLines, setDrawnLines] = useState([]);
	const [currentLine, setCurrentLine] = useState([]);
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

		const lineHighlight = props.lineHighlight;

		const mouseCoord = getMouseCoord(e, canvasRef.current)
		currentLine.push(mouseCoord);
		setCurrentLine(currentLine)
		drawLine(currentLine, lineHighlight, canvasRef.current)

		// for every 5 points detected with mouse, perform tracking of crossed blocks
		if (currentLine.length % 5 === 0) {

			// detect blocks the line has crossed, save the ids
			const detectedBlocks = detectOverlapBlocks(props.rawOcrResult, currentLine);
			// init array if not already
			if (!detectedBlocksGroup[lineHighlight]) detectedBlocksGroup[lineHighlight] = [];
			// add the detected Blocks into group
			detectedBlocksGroup[lineHighlight] = detectedBlocksGroup[lineHighlight].concat(detectedBlocks);

		}
	}

	const onCanvasMouseUp = (e) => {
		isTrackingMouse = false;
		const lineHighlight = props.lineHighlight
		if (!lineHighlight) {
			return;
		}
		drawnLines.push({
			name: lineHighlight,
			data: [...currentLine]
		})
		// clear state
		setCurrentLine([]);
		setIsTrackingMouse(isTrackingMouse);
		uniqifyBlocksGroupObject(detectedBlocksGroup) // uniqify since block group raw will have duplicate blocks, since the stroke goes through those blocks more than once.
		const flattened = flattenBlockGroupObject(detectedBlocksGroup);
		const table2DBlocks = convertPageDetectionTo2dArray(flattened)
		const table2DStrings = flatten2DArrayBlock(table2DBlocks)
		console.log(table2DStrings);
		props.setTableData(table2DStrings)
	}

	const addEventListenerCanvas = () => {
		if (!canvasRef || !canvasRef.current) return;
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
		img.onload = function () {
			// scale canvas to image
			ctx.canvas.width = img.width;
			ctx.canvas.height = img.height;
			ctx.drawImage(img, 0, 0
				, ctx.canvas.width, ctx.canvas.height
			);
			loadWordBlocksOnCanvas();
		}
		// this is to setup loading the image
		reader.onloadend = function () {
			img.src = reader.result;
			addEventListenerCanvas();
			setDetectedBlockGroup([]);
		}
		// this is to read the file
		reader.readAsDataURL(file);
	}

	/*
		given the simplified format of the google vision api response ( utils->data-tools.js->simplify function )
		render the words on the screen.
	*/
	const loadWordBlocksOnCanvas = () => {
		if (canvasRef.current && props.rawOcrResult.length > 0) {
			drawWordBlocks(props.rawOcrResult, canvasRef.current);
		}
	}

	useEffect(() => {

		addEventListenerCanvas();
		if (!canvasRef.current) {
			return;
		}
		if (props.imageFile) {
			const ctx = canvasRef.current.getContext('2d');
			ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
			loadImageOnCanvas()
		}

	}, [canvasRef.current, props.imageFile, props.rawOcrResult])

	addEventListenerCanvas()

	return (
		<span style={{
			display: "inline",
			width: '80%'
		}}>
			<canvas
				id="myCanvas"
				height="80%"
				width="80%"
				ref={canvasRef}
				style={{
					border: '1px solid #d3d3d3',
				}}
			>
				Your browser does not support the HTML5 canvas tag.
			</canvas>
			<img id="place-holder-img-upload" />
		</span >
	)
}

export default Canvas;
