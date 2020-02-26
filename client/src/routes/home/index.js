import { h } from 'preact';
import { useState } from 'preact/hooks';
import { input, Upload, message, Button, Icon  } from 'antd';
import style from './style';
import Canvas from '../../components/canvas'
import ModeSelection from '../../components/mode-selection'
import { simplifyGoogleVAPI, pseudoParseVAPI } from "../../utils/data-tools"
import TableDisplay from '../../components/table-display'
import testData from "../../jsons/8.json"

// function locks, to stop event listeners from calling a function multiple-times
var functionLock1 = false;
var functionLock2 = false;

const Home = (props) => {

  let   [ uploadedFile, setUploadedFile ] = useState(null);
	const [ currentMode, setCurrentMode ] = useState('Ghi_Chu'); //TODO: user can create modes
	const [ parseMode, setParseMode ] = useState('TABLE'); //TODO: user can create modes
	const [ rawOcrResult, setRawOcrResult ] = useState([]);
	const [ tableData, setTableData ] = useState([ [] ]);

  const onFileChange = event => {
    const file = event.target.files[0];
    // TODO: perform validation for img file validity HERE
    setUploadedFile(file);
		console.log("performing the file loader");
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
		  const datetime = (new Date()).toISOString().slice(0,10);
		  const randomNumber = parseInt(Math.random()*18081).toString(); // random number prefix for epoch to ensure there's no collision when lambda reads from s3

		  // save to s3 bucket
		  let url = `http://${bucket}.s3.amazonaws.com/${datetime}/${randomNumber}${timeStamp}`;
		  const s3Upload = await fetch(url, {
		  	method: "PUT",
		  	headers: {
		  		"x-amz-acl": "bucket-owner-full-control"
		  	},
		  	body: file
		  });

		  // parse s3 files
		  let response = await fetch("http://192.168.1.76:8001/read", {
		  	method: "POST",
		  	body: JSON.stringify({
		  		Bucket: bucket,
		  		S3Path: `${datetime}/${randomNumber}${timeStamp}` //"2020-02-10/9551581300905669" -> fake path
		  	})
		  });
		  let data = await response.text()
		  data = data.replace(/: None/g, ': null');
		  data = data.replace(/: False/g, ': false');
		  data = data.replace(/: True/g, ': true');
		  data = data.replace(/'/g, '"');
		  data = JSON.parse(data);
		  let parsableData = simplifyGoogleVAPI(data)

		  setRawOcrResult(parsableData);
			const arrayPseudoParsed = pseudoParseVAPI(parsableData)
			console.log(arrayPseudoParsed);
			setTableData(arrayPseudoParsed)

		//const fetchResult = testData;
		//const parsableData = simplifyGoogleVAPI(fetchResult);
		//setRawOcrResult(parsableData);
		//const arrayPseudoParsed = pseudoParseVAPI(parsableData)
		//setTableData(arrayPseudoParsed)


	}


	// TESTTTT ->
		const performRotate = async (file, angle) => {
			if (!file) return;
			console.log("rotating: ", angle)
			const arrBuff = await file.arrayBuffer();
			const srcBytes = new Uint8Array(arrBuff);
      const files = [{ 'name': 'srcFile.png', 'content': srcBytes }];
      const command = ["convert", "srcFile.png", "-trim", "-rotate", angle.toString(), "-gravity","Center", "out.png"];
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
    <div class={style.home}>
      <h1>{ parseMode === "TABLE" ? "Excel" : "Text" } Generator</h1>

      <input
        type="file"
        onChange={onFileChange}
      />

			<ModeSelection setMode={setCurrentMode} setParseMode={setParseMode} mode={currentMode} />

			<div style={{
				display: 'flex',
				flexDirection: 'row'
			}}>
				<Canvas 
					imageFile={uploadedFile}
					lineHighlight={currentMode}
					rawOcrResult={rawOcrResult}
					setTableData={setTableData}
				/>

				<div>
					{ parseMode === "TABLE" && <TableDisplay table={tableData} />}
					{ parseMode === "TEXT" && tableData[0][0] != null && tableData[0][0].split("\n").map( e => <p> {e} </p> )}
				</div>
			</div>

    </div>
  )
};

export default Home;
