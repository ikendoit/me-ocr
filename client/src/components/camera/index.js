import { useRef, useEffect, useState } from "preact/hooks"
import { Button } from "antd"

const Camera = (props) => {

	const canvasRef = useRef(null); 
	const videoRef = useRef(null);
	const [ pictureTaken, setPictureTaken ] = useState(false);

	// Set constraints for the video stream
	const constraints = { video: { facingMode: "user" }, audio: false };

	// Access the device camera and stream to cameraView
	function cameraStart() {
		if (!canvasRef.current || !videoRef.current) {
			console.log("not found ref, re-starting")
			return;
		}
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(function(stream) {
				const track = stream.getTracks()[0];
				videoRef.current.srcObject = stream;
			})
			.catch(function(error) {
					console.error("Oops. Something is broken.", error);
			});
	}

	useEffect(() => {
		cameraStart()
	}, [videoRef, canvasRef])

	if (props.record) {
		cameraStart()
	}

	return (
		<div>
			<div>
				<Button 
					id="camera--trigger" 
					onClick={() => {
						if (!canvasRef.current || !videoRef.current) return;
						canvasRef.current.width = videoRef.current.videoWidth;
						canvasRef.current.height = videoRef.current.videoHeight;
						const file = videoRef.current
						canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0);
						console.log('image: ', canvasRef.current);
						setPictureTaken(true);
						props.loadGoogleVAPI(canvasRef.current.toDataURL())
					}}
				>✔</Button>
				<Button onClick={() => setPictureTaken(false)}> ✖ </Button>
			</div>
			<video 
				ref={videoRef}
				style={{
					width: pictureTaken ? 0 : 1000, 
					height: pictureTaken ? 0 : 1000, 
				}} 
				id="camera--view" autoplay playsinline></video>
			<canvas
				id="camera--sensor"
				style={{
					width: pictureTaken ? 1000 : 0, 
					height: pictureTaken ? 1000 : 0, 
					border: "2px solid black"
				}} 
				ref={canvasRef}
			>Your browser does not support the HTML5 canvas tag.</canvas>
			<img src="//:0" alt="" id="camera--output"> </img>

		</div>
	)
}

export default Camera;
