import React from 'react';

import Toggle from './Toggle';

import './Panel.scss';

const Panel = (props) => {
	const {float, header, data, handleClick, withToggle} = props;
	const options = (data || []).map((elem, index) => {
		let toggle = withToggle ? <Toggle name={elem.TRIGGER_NAME}
		                                  state={elem.STATUS}
		                                  handleClick={handleClick}/> : '';
		return (
			<div className="block"
			     key={index}
			     style={{cursor: withToggle ? 'auto' : 'pointer'}}
			     onClick={withToggle ? null : handleClick(index)}>
				<div className="subheader">{elem.name}</div>
				<div className="toggle-container">{toggle}</div>
				<p className="description">{elem.description}</p>
			</div>
		);
	});

	return (
		<div className="panel" style={{float}}>
			<h4 className="header">{header}</h4>
			{ options }
		</div>
	);
};

export default Panel