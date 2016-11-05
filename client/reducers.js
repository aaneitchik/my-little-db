import {combineReducers} from 'redux';
import {reducer as ToastrReducer} from 'react-redux-toastr'

import AppReducer from './app/AppReducer';
import TableReducer from './table/TableReducer';

const rootReducer = combineReducers({
	app: AppReducer,
	table: TableReducer,
	toastr: ToastrReducer
});

export default rootReducer;

