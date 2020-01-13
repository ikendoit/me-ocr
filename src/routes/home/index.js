import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './style';
import Canvas from '../../components/canvas'
import { input, Upload, message, Button, Icon  } from 'antd';

const Home = (props) => {

  const [ uploadedFile, setUploadedFile ] = useState(null);

  const onFileChange = event => {
    const file = event.target.files[0];
    // perform validation for img file validity
    setUploadedFile(file);
  }

  return (
    <div class={style.home}>
      <h1>Excel Generator</h1>

      <input
        type="file"
        onChange={onFileChange}
      />

      <Canvas 
        imageFile={uploadedFile}
        lineHighlight={null}
        lineColor={null}
      />


      <p>This is the Home component.</p>
    </div>
  )
};

export default Home;
