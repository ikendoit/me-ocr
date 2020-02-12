const index = require("../index");

index.handler( {
	body: JSON.stringify({
		"Bucket":"samson-ocr",
		"S3Path":"2020-02-09/1721581281725530"
	})
}, {}, ()=>{});
