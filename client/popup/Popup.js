import React from 'react';
import reactStamp from 'react-stamp';
import Select from 'react-select';
import axios from 'axios';

import './Popup.scss';
import 'react-select/dist/react-select.css';

const Popup = reactStamp(React).compose({
	state: {
		selectedGenre: '',
		options: []
	},
	componentWillMount() {
		axios.get('/api/queries/genres')
			.then(result => {
				this.setState({options: result.data})
			});
	},
	onGenreSelect(genre) {
		this.setState({selectedGenre: genre});
	},
	render() {
		return (
			<div className="popup">
				<div className="popup-header">
					<h3>Select genre</h3>
				</div>
				<div className="popup-body">
					<Select name="select-genre"
					        options={this.state.options}
					        value={this.state.selectedGenre}
					        valueKey="ID"
					        labelKey="NAME"
					        onChange={this.onGenreSelect.bind(this)}/>
				</div>
				<div className="popup-footer">
					<div className="popup-btn"
					     onClick={() => this.props.confirmPopup(this.state.selectedGenre)}>OK
					</div>
					<div className="popup-btn" onClick={() => this.props.closePopup()}>Cancel</div>
				</div>
			</div>
		);
	}
});

export default Popup;