import { h } from 'preact';
import { useState } from 'preact/hooks';
import { input, Upload, message, Button, Icon  } from 'antd';
import style from './style';
import Canvas from '../../components/canvas'
import ModeSelection from '../../components/mode-selection'
import { simplifyGoogleVAPI } from "../../utils/data-tools"
import testData from "../../jsons/8.json"

const Home = (props) => {

  const [ uploadedFile, setUploadedFile ] = useState(null);
	const [ currentMode, setCurrentMode ] = useState('Ghi_Chu'); //TODO: user can create modes
	const [ rawOcrResult, setRawOcrResult ] = useState([]);

  const onFileChange = event => {
    const file = event.target.files[0];
    // TODO: perform validation for img file validity HERE
    setUploadedFile(file);
		console.log("performing the file loader");
		loadGoogleVAPI(file);
  }

	/*
	  Receive the image File,
		push the image into lambda function, get the raw google vision api result
	*/
	const loadGoogleVAPI = async (file) => {
	  const formData  = new FormData();

		console.log("checking the ", file);

		formData.append("image", file);
		let data = await fetch("http://localhost:8001/read", {
			method: "POST",
			mode: 'no-cors',
			body: formData
		});
		data = await data.json();
		return data;
		//const fetchResult = testData;
		//const simplified = simplifyGoogleVAPI(fetchResult);
		//setRawOcrResult(simplified);
	}

  return (
    <div class={style.home}>
      <h1>Excel Generator</h1>

      <input
        type="file"
        onChange={onFileChange}
      />

			<ModeSelection setMode={setCurrentMode} mode={currentMode} />

      <Canvas 
        imageFile={uploadedFile}
        lineHighlight={currentMode}
				rawOcrResult={rawOcrResult}
      />

    </div>
  )
};

export default Home;
