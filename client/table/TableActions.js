import axios from 'axios';
import {toastr} from 'react-redux-toastr';

export const ADD_ROW = 'ADD_ROW';
export const SAVE_TABLE_CHANGES = 'SAVE_TABLE_CHANGES';
export const SET_TABLE = 'SET_TABLE';
export const UPDATE_CELL_VALUE = 'UPDATE_CELL_VALUE';

const ROOT_URL = '/api/tables';

export function addRow() {
	return dispatch => {
		dispatch({type: ADD_ROW});
	};
}

export function deleteRows(name, rows) {
	return dispatch => {
		axios.delete(ROOT_URL, {params: {name, rows}})
			.then(updatedTable => {
				dispatch({type: SAVE_TABLE_CHANGES, payload: updatedTable.data});
				toastr.success('', 'Rows deleted successfully!');
			}, err => {
				toastr.error('', err.response.data.message);
			});
	};
}

export function saveChanges(name, rows, modifiedRows) {
	return dispatch => {
		rows = rows.filter((row, rowIndex) => modifiedRows.includes(rowIndex));
		axios.put(ROOT_URL, {rows, modifiedRows}, {params: {name}})
			.then(updatedTable => {
				dispatch({type: SAVE_TABLE_CHANGES, payload: updatedTable.data});
				toastr.success('', 'Table changes saved!');
			})
			.catch(err => {
				toastr.error('', err.response.data.message);
			});
	};
}

export function saveCellChange(rowIndex, cellIndex, cellValue) {
	return dispatch => {
		cellValue = !isNaN(cellValue) ? +cellValue : cellValue;
		dispatch({type: UPDATE_CELL_VALUE, payload: {rowIndex, cellIndex, cellValue}});
	};
}

export function getTableByName(name) {
	return dispatch => {
		axios.get(ROOT_URL, {params: {name}})
			.then(res => {
				dispatch({type: SET_TABLE, payload: res.data});
			}, err => {
				toastr.error('', err.response.data.message);
			});
	};
}

export function setQueryResultAsTable(data) {
	return dispatch => {
		dispatch({type: SET_TABLE, payload: data});
	};
}