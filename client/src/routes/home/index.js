import { h } from 'preact';
import { useState } from 'preact/hooks';
import { input, Upload, message, Button, Icon  } from 'antd';
import style from './style';
import Canvas from '../../components/canvas'
import ModeSelection from '../../components/mode-selection'
import { simplifyGoogleVAPI } from "../../utils/data-tools"
import TableDisplay from '../../components/table-display'
import testData from "../../jsons/8.json"

const Home = (props) => {

  const [ uploadedFile, setUploadedFile ] = useState(null);
	const [ currentMode, setCurrentMode ] = useState('Ghi_Chu'); //TODO: user can create modes
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

		/*
		  // variables
		  const bucket = 'samson-ocr';
		  const timeStamp = new Date().getTime();
		  const datetime = (new Date()).toISOString().slice(0,10);
		  const randomNumber = parseInt(Math.random()*18081).toString(); // random number prefix for epoch to ensure there's no collision when lambda reads from s3

		  // save to s3 bucket
		  let url = `http://samson-ocr.s3.amazonaws.com/${datetime}/${randomNumber}${timeStamp}`;
		  const s3Upload = await fetch(url, {
		  	method: "PUT",
		  	headers: {
		  		"x-amz-acl": "bucket-owner-full-control"
		  	},
		  	body: file
		  });

		  // parse s3 files
		  let response = await fetch("http://localhost:8001/read", {
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
		  console.log(data);
		  data = JSON.parse(data);
		  let parsableData = simplifyGoogleVAPI(data)

		  setRawOcrResult(parsableData);
		*/

		const fetchResult = testData;
		const simplified = simplifyGoogleVAPI(fetchResult);
		setRawOcrResult(simplified);
	}

  return (
    <div class={style.home}>
      <h1>Excel Generator</h1>

      <input
        type="file"
        onChange={onFileChange}
      />

			<ModeSelection setMode={setCurrentMode} mode={currentMode} />

			<div>
				<Canvas 
					imageFile={uploadedFile}
					lineHighlight={currentMode}
					rawOcrResult={rawOcrResult}
					setTableData={setTableData}
				/>

				<TableDisplay table={tableData} />
			</div>

    </div>
  )
};

export default Home;
