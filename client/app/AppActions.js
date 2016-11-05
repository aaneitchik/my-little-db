import axios from 'axios';
import {toastr} from 'react-redux-toastr';

export const CHANGE_TABLE = 'CHANGE_TABLE';
export const GET_QUERIES = 'GET_QUERIES';
export const GET_TABLES = 'GET_TABLES';
export const GET_TRIGGERS = 'GET_TRIGGERS';
export const RUN_QUERY = 'RUN_QUERY';

const ROOT_URL = '/api/tables';
const TRIGGER_URL = '/api/triggers';
const QUERY_URL = '/api/queries';

export function changeTable(tableName) {
	return dispatch => {
		dispatch({
			type: CHANGE_TABLE,
			payload: tableName
		});
	};
}

export function getQueries() {
	return dispatch => {
		dispatch({
			type: GET_QUERIES,
			payload: [{
				name: 'Easily categorized',
				description: 'Films that have high genre rating.'
			}, {
				name: 'Recent releases',
				description: 'Films that were released in latest years.'
			}, {
				name: 'All-rounders',
				description: 'People that can be both actors and directors.'
			}]
		});
	};
}

const triggersInfo = {
	FILM_GENRES_CHECK: {
		name: 'Enough is enough',
		description: 'Check  that film doesn\'t have more than two genres with maximum rating.'
	},
	ACTORS_OCCUPATION_CHECK: {
		name: 'No workaholics',
		description: 'Check that actor doesn\'t act in more than two films in a year.'
	},
	RUSSIAN_FILM_CHECK: {
		name: 'No english',
		description: 'Check that Russian / Belarussian films have only a name in Russian.'
	}
};

export function getTriggers() {
	return dispatch => {
		axios.get(`${TRIGGER_URL}/all`).then(result => {
			const columns = result.data.metaData;
			const triggers = result.data.rows.reduce((prev, curr, rowIndex) => {
				let trigger = {};
				columns.forEach((col, colIndex) => {
					trigger[col] = curr[colIndex];
				});
				trigger = {...trigger, ...triggersInfo[trigger.TRIGGER_NAME]};
				prev.push(trigger);
				return prev;
			}, []);
			dispatch({
				type: GET_TRIGGERS,
				payload: triggers
			});
		});
	};
}

export function getTables() {
	return dispatch => {
		axios.get(ROOT_URL)
			.then(res => {
				dispatch({type: GET_TABLES, payload: res.data});
			}, err => {
				toastr.error('', err.response.data.message);
			});
	};
}

export function runQuery(index, genreId) {
	return dispatch => {
		axios.get(QUERY_URL, {params: {index, genreId}})
			.then(res => {
				dispatch({
					type: RUN_QUERY,
					payload: {
						tableName: `Query ${index} result`,
						queryResult: res.data
					}
				});
			}, err => {
				toastr.error('', err.response.data.message);
			});
	};
}

export function toggleTrigger(name, value) {
	return () => {
		axios.get(TRIGGER_URL, {params: {name, value}})
			.then(() => toastr.success('', 'Trigger toggled successfully!'),
				err => toastr.error('', err.response.data.message));
	};
}