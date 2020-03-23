import React from 'react';
import { Modal, Button } from "antd"
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
					title="Result Table"
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
					title="Result Text"
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
