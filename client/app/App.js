import React from 'react';
import reactStamp from 'react-stamp';
import {connect} from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import 'react-redux-toastr/src/less/index.less';
import './App.scss';

import Panel from './Panel';
import Table from '../table/Table';
import Popup from '../popup/Popup';
import * as actions from './AppActions';

const App = reactStamp(React).compose({
	state: {
		showPopup: false
	},
	componentWillMount() {
		this.props.getQueries();
		this.props.getTriggers();
		this.props.getTables();
	},
	confirmPopup(selectedGenre) {
		this.setState({showPopup: false});
		this.props.runQuery(0, selectedGenre.ID);
	},
	closePopup() {
		this.setState({showPopup: false});
	},
	runQuery(index, genreId) {
		return () => {
			if (!index && !genreId) {
				this.setState({showPopup: true});
				return;
			}
			this.props.runQuery(index, genreId);
		};
	},
	toggleTrigger(index, value) {
		this.props.toggleTrigger(index, value);
	},
	render() {
		const {queries, triggers , tables, tableName, queryResult} = this.props;
		const tableHeaders = tables.map((name, index) => {
			return (
				<span className="table-name"
				      key={index}
				      onClick={() => this.props.changeTable(name)}>
					{name}
				</span>
			);
		});

		const popup = this.state.showPopup ?
			<Popup confirmPopup={this.confirmPopup.bind(this)}
			       closePopup={this.closePopup.bind.this} /> : '';
		const mainClass = `app-main${this.state.showPopup ? ' popup-open' : ''}`;
		const headerClass = `app-header${this.state.showPopup ? ' popup-open' : ''}`;

		return (
			<div className="app-container">
				<div className={headerClass}>
					{ tableHeaders }
				</div>
				<div className={mainClass}>
					<Panel float="left"
					       header="Queries"
					       data={queries}
					       handleClick={this.runQuery.bind(this)}/>
					<Panel float="right"
					       header="Triggers"
					       data={triggers}
					       handleClick={this.toggleTrigger.bind(this)}
					       withToggle={true}/>
					<Table tableName={tableName}
					       queryResult={queryResult}
					       suppressContentEditableWarning={true}/>
				</div>
				{popup}
				<ReduxToastr timeOut={10000}/>
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		queries: state.app.queries,
		triggers: state.app.triggers,
		tables: state.app.tables,
		queryResult: state.app.queryResult,
		tableName: state.app.tableName
	};
}

export default connect(mapStateToProps, actions)(App);