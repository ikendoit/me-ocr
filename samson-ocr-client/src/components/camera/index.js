import React from 'react';
import { useRef, useEffect, useState } from "react"
import { Button } from "antd"

const Camera = (props) => {

	const canvasRef = useRef(null);
	const videoRef = useRef(null);
	const [pictureTaken, setPictureTaken] = useState(false);

	// Set constraints for the video stream
	const constraints = { video: { facingMode: "user" }, audio: false };

	// Access the device camera and stream to cameraView
	function cameraStart() {
		if (!canvasRef.current || !videoRef.current) {
			console.log("not found ref, re-starting")
			return;
		}
		// start the camera stream for video element
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(function (stream) {
				const track = stream.getTracks()[0];
				videoRef.current.srcObject = stream;
			})
			.catch(function (error) {
				console.error("Oops. Something is broken.", error);
			});
	}

	const cameraStop = () => {
		if (!videoRef.current || !videoRef.current.srcObject) {
			return;
		}
		videoRef.current.srcObject.getTracks().forEach(track => {
			console.log("stopping", track)
			track.stop()
		})
	}

	useEffect(() => {
		console.log(props.record)
		if (props.record) {
			cameraStart()
		} else {
			cameraStop()
		}
	}, [videoRef, canvasRef, props.record])


	const getVideoRefHeight = () => {
		if (!videoRef || !videoRef.current) return 0
		const rects = videoRef.current.getClientRects()
		console.log(rects)
		if (!rects || rects.length === 0) return 0
		return rects[0].height
	}
	console.log(videoRef.current)
	return (
		<div style={{
			display: props.record ? "block" : "none"
		}}>
			<div>
				<Button
					id="camera--trigger"
					onClick={async () => {
						if (!canvasRef.current || !videoRef.current) return;

						canvasRef.current.width = videoRef.current.videoWidth;
						canvasRef.current.height = videoRef.current.videoHeight;
						canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0);
						setPictureTaken(true);

						const base64URL = canvasRef.current.toDataURL()
						const responseFetchURL = await fetch(base64URL);
						const blobArray = await responseFetchURL.blob()
						const file = new File([blobArray], "cool-img-bro.png", { type: "image/png" })
						props.setUploadedFile(file)
						props.loadGoogleVAPI(file)

					}}
				>✔</Button>
				<Button onClick={() => setPictureTaken(false)}> ✖ </Button>
			</div>
			<div style={{
				position: "relative",
				width: '100%',
				height: '100%'
			}}>
				<video
					ref={videoRef}
					style={{
						width: pictureTaken ? 0 : "95%",
						height: '50vh',
						position: "absolute",
						top: 0,
						left: 0
					}}
					id="camera--view" autoPlay playsInline></video>
				<canvas
					style={{
						width: pictureTaken ? 0 : "95%",
						height: '50vh',
						border: '2px solid blue',
						position: "absolute",
						top: 0,
						left: 0
					}}
				>Your browser does not support the HTML5 canvas tag.</canvas>
			</div>
			<canvas
				id="camera--sensor"
				style={{
					visibility: "hidden",
				}}
				ref={canvasRef}
			>Your browser does not support the HTML5 canvas tag.</canvas>
			<img src="//:0" alt="" id="camera--output" />

		</div>
	)
}

export default Camera;
