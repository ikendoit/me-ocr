import { useRef, useEffect, useState } from "preact/hooks"

const ModeSelection = (props) => {

	return (
		<div> 
			<p> Highlighting: {props.mode} </p>
			<p>
				<button style={{display: 'inline-block'}} onClick={() => props.setMode("Ghi_Chu")}> Ghi Chu </button>
				<button style={{display: 'inline-block'}} onClick={() => props.setMode("Thu")}> Thu </button>
				<button style={{display: 'inline-block'}} onClick={() => props.setMode("Chi")}> Chi </button>
			</p>
		</div>
	)
	
}

export default ModeSelection
