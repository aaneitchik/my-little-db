import React from 'react';
import reactStamp from 'react-stamp';
import {connect} from 'react-redux';

import './Table.scss';

import * as actions from './TableActions';

const Table = reactStamp(React).compose({
	isQueryResult: false,
	modifiedRows: new Set(),
	selectedRows: new Set(),
	componentWillReceiveProps(nextProps) {
		console.log(this.props.tableName, nextProps.tableName);
		if (!nextProps.tableName) {
			return;
		}
		if (nextProps.tableName.includes('Query')) {
			this.isQueryResult = true;
			this.props.setQueryResultAsTable(nextProps.queryResult);
		}
		else if (this.props.tableName !== nextProps.tableName) {
			this.isQueryResult = false;
			this.props.getTableByName(nextProps.tableName);
		}
	},
	handleCheckboxClick(rowIndex) {
		const row = this.props.table.rows[rowIndex];
		row.selected = !row.selected;
		const action = row.selected ? 'add' : 'delete';
		this.selectedRows[action](row[0]);
	},
	deleteRows() {
		this.props.deleteRows(this.props.tableName, [...this.selectedRows]);
		this.selectedRows = new Set();
	},
	saveChanges() {
		const modified = [...this.modifiedRows];
		this.props.saveChanges(this.props.tableName, this.props.table.rows, modified);
		this.modifiedRows = new Set();
	},
	saveCellChange(evt, rowIndex, cellIndex) {
		this.props.saveCellChange(rowIndex, cellIndex, evt.target.innerHTML);
		this.modifiedRows.add(rowIndex);
	},
	render() {
		const buttons = this.isQueryResult ? '' :
			<div className="buttons">
				<i className="fa fa-plus" onClick={() => this.props.addRow()}/>
				<i className="fa fa-floppy-o" onClick={() => this.saveChanges()}/>
				<i className="fa fa-trash" onClick={() => this.deleteRows()}/>
			</div>;

		const checkboxHeader = this.isQueryResult ? '' : <th />;

		return (
			<div className="table-container">
				{buttons}
				<div className="db-table">
					<table>
						<thead>
						{checkboxHeader}
						{this.renderHeaders()}</thead>
						<tbody>{this.renderRows()}</tbody>
					</table>
				</div>
			</div>
		);
	},
	renderHeaders() {
		return this.props.table.metaData.map((name, index) => {
			return <th key={index}>{name}</th>;
		});
	},
	renderRows()  {
		return this.props.table.rows.map((row, rowIndex) => {
			row = row.map((td, cellIndex) => {
				return (
					/* ref is a hack to prevent contentEditable warnings in console.
					 * This way React doesn't even know that the contentEditable property was set */
					<td key={cellIndex}
					    ref={e => {if(e != null) e.contentEditable = true;}}
					    onBlur={(evt) => this.saveCellChange(evt, rowIndex, cellIndex)}>
						{td}
					</td>
				);
			});
			const checkbox = this.isQueryResult ? '' :
				<td>
					<input type="checkbox" onChange={() => this.handleCheckboxClick(rowIndex)}/>
				</td>;
			return (
				<tr key={rowIndex}>
					{checkbox}{row}
				</tr>
			);
		});
	}
});

function mapStateToProps(state) {
	return {
		table: state.table.currentTable
	};
}

export default connect(mapStateToProps, actions)(Table);