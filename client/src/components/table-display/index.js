import { useRef, useEffect, useState } from "preact/hooks"

const TableDisplay = (props) => {
	
	/*
		receive props.table: [ [ primitive value ] ]
	*/
  const generateTables = () => {
    // 2D array of primitive values ( string, int.. )
    const table = props.table;

		const allRows = [];
		for (let row = 0; row < table.length; row++) {
			const allColumns = [];

			for (let col = 0; col < table[row].length; col++) {
				allColumns.push(<td> {table[row][col]} </td>);
			}
			const currentRow = <tr> {allColumns} </tr>;
			allRows.push(currentRow);
		}

		const currentTable = <table>{allRows}</table>;

    return currentTable;
  };


	if (!props.table) return <div />

	return (
		<span> 
      {generateTables()}
		</span>
	)
	
}

export default TableDisplay
