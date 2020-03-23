# Handwriting Image Lambda function, 

Samson Hotel Project,
For receivng image files, and parse into text blocks.

## DEV Set up:
```
	<Add a /credentials directory, which contain the Google cloud JSON key>
	npm install
	do dev
```

## TEST The thing:
```
	npm start
	npm test
```

## Run Local Lambda:
Follow this: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-linux.html
```
	npm start
```

## DEPLOY Perform:
< configure aws creds in bashrc >
< configure correct lambda function name in package.json -> deploy-script>
```
	npm run build
	npm run deploy
```

