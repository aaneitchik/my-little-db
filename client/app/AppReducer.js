import * as actions from './AppActions';

const INITIAL_STATE = {
	queries: [],
	triggers: [],
	tables: [],
	tableName: '',
	queryResult: {
		metaData: [],
		rows: []
	}
};

export default (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case actions.CHANGE_TABLE:
			return {...state, tableName: action.payload};
		case actions.GET_QUERIES:
			return {...state, queries: action.payload};
		case actions.GET_TABLES:
			return {...state, tables: action.payload, tableName: action.payload[2]};
		case actions.GET_TRIGGERS:
			return {...state, triggers: action.payload};
		case actions.RUN_QUERY:
			const {tableName, queryResult} = action.payload;
			return {...state, tableName, queryResult};
		default:
			return state;
	}
};