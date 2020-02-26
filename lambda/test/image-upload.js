const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

const test1 = async () => {

	const image = fs.readFileSync("test.jpg");
	const body = JSON.stringify({
		Bucket: 'samson-ocr-us-west-2',
		S3Path: "2020-02-24/174871582526597961"
	})

	let response = await fetch("http://localhost:8001/read", {
		method: "POST",
		//mode: 'no-cors',
		body
	});
	let data = await response.text()
	data = data.replace(/: None/g, ': null');
	data = data.replace(/: False/g, ': false');
	data = data.replace(/: True/g, ': true');
	data = data.replace(/'/g, '"');
	data = JSON.parse(data);	
	console.log(data);
}

test1();
