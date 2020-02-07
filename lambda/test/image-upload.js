const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

const test1 = async () => {

	const image = fs.readFileSync("test.jpg");
	const form = new FormData();
	form.append("image", image);

	let data = await fetch("http://localhost:8001/read", {
		method: "POST",
		//mode: 'no-cors',
		headers: {
			"Content-Type": "application/octet-stream"
		},
		body: form
	});
	data = await data.json();

	console.log(data);
}

test1();
