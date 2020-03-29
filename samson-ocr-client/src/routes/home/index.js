import React from 'react';
import { useState } from 'react';
import { Button } from 'antd';
import style from './style.css';
import ImageCanvasProcessing from '../../components/canvas'
import Camera from '../../components/camera'
import ResultDisplay from '../../components/result-display'
import { simplifyGoogleVAPI, mergeGCPWithTextract } from "../../utils/data-tools"
//import testData from "../../jsons/new-8.json"
const {
	REACT_APP_LAMBDA_FUNCTION,
	REACT_APP_LAMBDA_API_KEY
} = process.env

// function locks, to stop event listeners from calling a function multiple-times
var functionLock1 = false;

const Home = (props) => {

	let [uploadedFile, setUploadedFile] = useState(null);
	const [currentMode, setCurrentMode] = useState('Ghi_Chu'); //TODO: user can create modes
	const [rawOcrResult, setRawOcrResult] = useState([]);
	const [tableData, setTableData] = useState([[]]);
	const [useCamera, setUseCamera] = useState(false);

	const onFileChange = event => {
		const file = event.target.files[0];
		setUploadedFile(file);
		loadGoogleVAPI(file);
	}

	/*
	  Receive the image File,
		push the image into s3 and lambda function, 
		@return the simplified google vision api result
	*/
	const loadGoogleVAPI = async (file) => {

		// variables
		const bucket = 'samson-ocr-us-west-2';
		const timeStamp = new Date().getTime();
		const datetime = (new Date()).toISOString().slice(0, 10);
		const randomNumber = parseInt(Math.random() * 18081).toString(); // random number prefix for epoch to ensure there's no collision when lambda reads from s3

		// save to s3 bucket
		let url = `https://d2733le06a6kyc.cloudfront.net/${datetime}/${randomNumber}${timeStamp}`;
		const s3Upload = await fetch(url, {
			method: "PUT",
			headers: {
				"x-amz-grant-full-control": "id=98ff39d827edc806f72b1268a96f607527818ee4f4007e2754cd9aba104b3980"
			},
			body: file
		});
		console.log(s3Upload)

		// parse s3 files
		let response = await fetch(REACT_APP_LAMBDA_FUNCTION, {
			method: "POST",
			headers: {
				"X-Api-Key": REACT_APP_LAMBDA_API_KEY
			},
			body: JSON.stringify({
				Bucket: bucket,
				S3Path: `${datetime}/${randomNumber}${timeStamp}` //"2020-02-10/9551581300905669" -> fake path
			})
		});
		let data = await response.text()
		data = JSON.parse(data);

		const parsableData = { gcp: {}, aws: {} }

		// register the aws and gcp data into object.
		parsableData.aws = data.aws;
		parsableData.gcp = simplifyGoogleVAPI(data.gcp);

		// set raw ocr of gcp on screen
		setRawOcrResult(parsableData.gcp);

		// display table result ( merge from textract and gcp ) in html table
		const mergeOutput = mergeGCPWithTextract(parsableData)
		setTableData(mergeOutput)


		// TEST
		// const fetchResult = testData;
		// const parsableData = { gcp: {}, aws: {} }
		// // register the aws and gcp data into object.
		// parsableData.aws = fetchResult.aws;
		// parsableData.gcp = simplifyGoogleVAPI(fetchResult.gcp);
		// // set the raw ocr result, so that we can pass into canvas view
		// setRawOcrResult(parsableData.gcp);
		// // pre-parse the gcp vision, in case user does not want to parse themselves.
		// const mergeOutput = mergeGCPWithTextract(parsableData)
		// setTableData(mergeOutput)

	}


	// TESTTTT ROTATION->
	const performRotate = async (file, angle) => {
		if (!file) return;
		console.log("rotating: ", angle)
		const arrBuff = await file.arrayBuffer();
		const srcBytes = new Uint8Array(arrBuff);
		const files = [{ 'name': 'srcFile.png', 'content': srcBytes }];
		const command = ["convert", "srcFile.png", "-trim", "-rotate", angle.toString(), "-gravity", "Center", "out.png"];
		let processedFiles = await window.magick.Call(files, command);
		let firstOutputImage = processedFiles[0]
		const newFile = new File([firstOutputImage['buffer']], 'image.jpg')
		setUploadedFile(newFile)
		uploadedFile = newFile;
	}
	window.onkeyup = async (e) => {
		if (functionLock1) return;
		functionLock1 = true;
		if (e.key === "e")
			await performRotate(uploadedFile, 1)
		else if (e.key === "q")
			await performRotate(uploadedFile, -1)
		else if (e.shiftKey && e.key === "Enter")
			await loadGoogleVAPI(uploadedFile);
		functionLock1 = false;
	};
	// <- END TESTTTT

	return (
		<div className={style.home}>

			<input
				type="file"
				onChange={onFileChange}
			/>
			<Button onClick={() => setUseCamera(!useCamera)}> Use Camera {"  "} 📷 </Button>

			<ResultDisplay
				rawOcrResult={rawOcrResult}
				tableData={tableData}
			/>

			<div
				style={{
					width: '100%',
				}}>
				{uploadedFile &&
					<ImageCanvasProcessing
						id={"ImageDisplay"}
						imageFile={uploadedFile}
						lineHighlight={currentMode}
						rawOcrResult={rawOcrResult}
						setTableData={setTableData}
					/>
				}
				<Camera
					id={"PictureTaker"}
					record={useCamera}
					loadGoogleVAPI={loadGoogleVAPI}
					setUploadedFile={setUploadedFile}
				/>

			</div>
		</div>
	)
};

export default Home;

