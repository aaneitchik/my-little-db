import React from 'react';
import reactStamp from 'react-stamp';
import ToggleButton from 'react-toggle-button';

const Toggle = reactStamp(React).compose({
	componentWillMount() {
		this.setState({value: this.props.state === 'ENABLED'})
	},
	toggle(value) {
		this.props.handleClick(this.props.name, !value);
		this.setState({value: !value});
	},
	render() {
		return (
			<ToggleButton
				value={this.state.value}
				onToggle={(value) => this.toggle(value)} />
		);
	}
});

export default Toggle;