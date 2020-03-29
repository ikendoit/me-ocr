import React from 'react';
import { Modal, Button, message } from "antd"
import TableDisplay from '../table-display'
import LinearDisplay from '../linear-display'
import { TableOutlined, UnorderedListOutlined } from '@ant-design/icons';

const ResultDisplay = (props) => {

	const [visibleTable, setVisibleTable] = React.useState(false)
	const [visibleText, setVisibleText] = React.useState(false)

	const showModalTable = () => {
		setVisibleTable(true)
	};
	const handleCancelTable = () => {
		setVisibleTable(false)
	};

	const showModalText = () => {
		setVisibleText(true)
	};
	const handleCancelText = () => {
		setVisibleText(false)
	};

	const exportCSV = () => {
		var rows = document.querySelectorAll('table#table-display tr');
		// Construct csv
		var csv = [];
		for (var i = 0; i < rows.length; i++) {
			var row = [], cols = rows[i].querySelectorAll('td, th');
			for (var j = 0; j < cols.length; j++) {
				// Clean innertext to remove multiple spaces and jumpline (break csv)
				var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
				// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
				data = data.replace(/"/g, '""');
				// Push escaped string
				row.push('"' + data + '"');
			}
			csv.push(row.join(';'));
		}
		var csv_string = csv.join('\n');
		// Download it
		var filename = 'export_' + new Date().toLocaleDateString() + '.csv';
		var link = document.createElement('a');
		link.style.display = 'none';
		link.setAttribute('target', '_blank');
		link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	const copyToClipBoard = () => {
		const containerId = "linear-display-result"

		try {
			if (document.selection) { 
				const range = document.body.createTextRange();
				range.moveToElementText(document.getElementById(containerId));
				range.select().createTextRange();
				document.execCommand("copy"); 

			} else if (window.getSelection) {
				const range = document.createRange();
				range.selectNode(document.getElementById(containerId));
				window.getSelection().addRange(range);
				document.execCommand("copy");

			}
			message.success("Copied To Clipboard")
		} catch(err) {
			message.error("Error copying, please try again")
			console.log(err);
		}
	}

	return (
		<div>
			<div id="Table Display" >
				<Button type="primary"
					onClick={showModalTable}
					style={{
						position: 'fixed',
						top: '45%',
						left: '2%'
					}}
					shape="circle" icon={<TableOutlined />}
				/>
				<Modal
					title={(
						<span>
							Result Table{"  "}    
							<Button onClick={exportCSV}> CSV </Button>
						</span>
					)}
					visible={visibleTable}
					footer={null}
					onCancel={handleCancelTable}
				>
					{props.tableData &&
						<TableDisplay table={props.tableData} />
					}
				</Modal>
			</div>

			<div id="Linear Display" >
				<Button type="primary"
					onClick={showModalText}
					style={{
						position: 'fixed',
						top: '50%',
						left: '2%'
					}}
					shape="circle" icon={<UnorderedListOutlined />}
				/>
				<Modal
					title={(
						<span>
							Result Text {"  "}    
							<Button onClick={copyToClipBoard}> Copy </Button>
						</span>
					)}
					visible={visibleText}
					footer={null}
					onCancel={handleCancelText}
				>
					{props.rawOcrResult &&
						<LinearDisplay rawOcrResult={props.rawOcrResult} />
					}
				</Modal>
			</div>


		</div>
	);
}

export default ResultDisplay;
