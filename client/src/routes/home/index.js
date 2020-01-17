import { h } from 'preact';
import { useState } from 'preact/hooks';
import { input, Upload, message, Button, Icon  } from 'antd';
import style from './style';
import Canvas from '../../components/canvas'
import ModeSelection from '../../components/mode-selection'
import { simplifyGoogleVAPI } from "../src/utils/data-tools"
import testData from "../jsons/1.json"

const Home = (props) => {

  const [ uploadedFile, setUploadedFile ] = useState(null);
	const [ currentMode, setCurrentMode ] = useState('Ghi_Chu'); //TODO: user can create modes
	const [ rawOcrResult, setRawOcrResult ] = useState([]);

  const onFileChange = event => {
    const file = event.target.files[0];
    // TODO: perform validation for img file validity HERE
    setUploadedFile(file);
		loadGoogleVAPI(file);
  }

	/*
	  Receive the image File,
		push the image into lambda function, get the raw google vision api result
	*/
	const loadGoogleVAPI = (file) => {
		//let data = await fetch("http://127.0.0.1:8080/jsons/4.json");
		//data = await data.json();
		//return data;
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

      <Canvas 
        imageFile={uploadedFile}
        lineHighlight={null}
        lineColor={null}
				googleVAPIResponse={googleVAPIResponse}
				rawOcrResult={rawOcrResult}
      />

      <p>This is the Home component.</p>

    </div>
  )
};

export default Home;
