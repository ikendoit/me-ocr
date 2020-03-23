import React from 'react';
import { useRef, useEffect, useState } from "react"
import "./styles.css"

const ModeSelection = (props) => {

	return (
		<div id="mode-selection"> 
			<p> Highlighting: {props.mode} </p>
			<p>
				<button style={{display: 'inline-block'}} onClick={() => props.setMode("Ghi_Chu")}> Ghi Chu </button>
				<button style={{display: 'inline-block'}} onClick={() => props.setMode("Thu")}> Thu </button>
				<button style={{display: 'inline-block'}} onClick={() => props.setMode("Chi")}> Chi </button>
			</p>
			<p>
				<button style={{display: 'inline-block'}} onClick={() => props.setParseMode("TEXT")}> Text </button>
				<button style={{display: 'inline-block'}} onClick={() => props.setParseMode("TABLE")}> Table </button>
			</p>
		</div>
	)
	
}

export default ModeSelection
