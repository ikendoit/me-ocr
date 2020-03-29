import React from 'react';

const LinearDisplay = (props) => {

	/*
		Receive Simplified GCP Result ( see output of data-tools -> simplifyGoogleVAPI ) from props.rawOcrResult

		return: HTML (
			<div> 
				<p> {lineValue} </p> ...
			</div>
		)
	*/
	const generateLines = () => {
		const allWords = props.rawOcrResult.reduce((master, e) =>
			master.concat(e.words), []
		)
		if (allWords.length === 0) return null
		const wordHeight =
			allWords[allWords.length - 1].wordCoordinate[2][1] -
			allWords[allWords.length - 1].wordCoordinate[0][1]

		// sort by y-value ( lines ), messed up x-order
		// return: { <number-line_index>: [word] }
		const separateLines = allWords.reduce((allLines, word) => {
			const yValue = word.wordCoordinate[2][1]
			const lineIndex = parseInt(yValue / wordHeight)

			if (!allLines[lineIndex]) allLines[lineIndex] = []
			allLines[lineIndex].push(word)

			return allLines
		}, {})

		Object.values(separateLines)
			// sort the words in each line, so that they become x-ordered
			.forEach(line =>
				line.sort(
					(w1, w2) =>
						w1.wordCoordinate[0][0] > w2.wordCoordinate[0][0] ? 1 : -1
				)
			);

		const formattedLines = Object.values(separateLines)
			// map the word Objects to be String texts
			.map(line => line.map(word => word.value))

		return (
			<div>
				{
					formattedLines.map(
						line => <p> {line.join(" ").toString()}</p>
					)
				}
			</div>
		)

	}

	if (!props.rawOcrResult) return <div />

	return (
		<span 
			id="linear-display-result"
			style={{
				display: 'inline',
				width: '95%',
				marginLeft: '3%'
			}}>
			{generateLines()}
		</span>
	)

}

export default LinearDisplay
