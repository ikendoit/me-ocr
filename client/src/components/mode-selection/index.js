import { useRef, useEffect, useState } from "preact/hooks"

const ModeSelection = (props) => {

	const setMode = (mode) => {
		props.setMode(mode);
	}

	return (
		<div> 
			<p> Highlighting: {props.mode} </p>
			<p>
				<button style={{display: 'inline-block'}} onClick={() => setMode("Ghi_Chu")}> Ghi Chu </button>
				<button style={{display: 'inline-block'}} onClick={() => setMode("Thu")}> Thu </button>
				<button style={{display: 'inline-block'}} onClick={() => setMode("Chi")}> Chi </button>
			</p>
		</div>
	)
	
}
