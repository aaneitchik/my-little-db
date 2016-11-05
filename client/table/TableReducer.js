import * as actions from './TableActions';

const INITIAL_STATE = {
	currentTable: {
		metaData: [],
		rows: []
	}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actions.ADD_ROW:
			const currentTable = state.currentTable;
			const newRow = state.currentTable.rows[0].map(() => undefined);
			const table = {...currentTable, rows: state.currentTable.rows.concat([newRow])};
			return {...state, currentTable: table};
		case actions.UPDATE_CELL_VALUE:
			const {rowIndex, cellIndex, cellValue} = action.payload;
			const newRows = [...state.currentTable.rows];
			const editedRow = newRows[rowIndex];
			editedRow[cellIndex] = cellValue;
			const newTable = {...state.currentTable, rows: newRows};
			return {...state, currentTable: newTable};
		case actions.SAVE_TABLE_CHANGES:
			return {...state, currentTable: action.payload};
		case actions.SET_TABLE:
			return {...state, currentTable: action.payload};
		default:
			return {...state};
	}
};