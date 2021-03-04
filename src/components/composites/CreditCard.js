/**
 * Credit Card
 *
 * Component for entering credit card info
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2021-03-02
 */

// NPM modules
import Cards from 'react-credit-cards';
import PropTypes from 'prop-types';
import React from 'react';
import 'react-credit-cards/es/styles-compiled.css';

// Material UI
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

// Shared generic modules
import { clone } from 'shared/generic/tools';

/**
 * Credit Card
 *
 * Handles showing a preview of the credit card info to allow a user to
 * see they are entering it correctly
 *
 * @name CreditCard
 * @extends React.Component
 */
export default class CreditCard extends React.Component {

	// Constructor
	constructor(props) {

		// Init parent
		super(props);

		// Init state
		this.state = {
			focused: 'number',
			issuer: '',
			number: '',
			name: props.name,
			expiry: '',
			cvc: '',
			valid: false
		}

		// Bind methods
		this.change = this.change.bind(this);
		this.focus = this.focus.bind(this);
		this.issuer = this.issuer.bind(this);
	}

	// Called when any input changes
	change(ev) {

		// Get the name
		let sName = ev.currentTarget.name;
		let sValue = ev.currentTarget.value;

		// Set the new state
		this.setState({
			[sName]: sValue
		});
	}

	// Called when a new input gets focus
	focus(ev) {
		this.setState({
			focused: ev.currentTarget.name
		});
	}

	issuer(type, valid) {
		this.setState({
			issuer: type.issuer,
			valid: valid
		});
	}

	// Render
	render() {
		return (
			<Box className={this.props.className}>
				<Box className="CreditCard_preview">
					<Cards
						callback={this.issuer}
						cvc={this.state.cvc}
						expiry={this.state.expiry}
						focused={this.state.focused}
						name={this.state.name}
						number={this.state.number}
						acceptedCards={['amex', 'discover', 'mastercard', 'visa']}
					/>
				</Box>
				<Box className="CreditCard_form">
					<Box className="CreditCard_section">
						<TextField
							className="CreditCard_number"
							name="number"
							onChange={this.change}
							onFocus={this.focus}
							placeholder="Card Number"
							type="tel"
							maxLength={19}
							value={this.state.number}
						/>
					</Box>
					{this.props.allowNameChange &&
						<Box className="CreditCard_section">
							<TextField
								className="CreditCard_name"
								name="name"
								onChange={this.change}
								onFocus={this.focus}
								placeholder="Name"
								type="text"
								value={this.state.name}
							/>
						</Box>
					}
					<Box className="CreditCard_section">
						<TextField
							className="CreditCard_expiry"
							maxLength={4}
							name="expiry"
							onChange={this.change}
							onFocus={this.focus}
							placeholder="MMYY"
							type="number"
							value={this.state.expiry}
						/>
						<TextField
							className="CreditCard_code"
							maxLength={3}
							name="cvc"
							onChange={this.change}
							onFocus={this.focus}
							placeholder="CVC"
							type="number"
							value={this.state.cvc}
						/>
					</Box>
				</Box>
			</Box>
		);
	}

	// Get values
	get value() {
		return clone(this.state);
	}
}

// Valid props
CreditCard.propTypes = {
	allowNameChange: PropTypes.bool,
	className: PropTypes.string,
	name: PropTypes.string
}

// Default props
CreditCard.defaultProps = {
	allowNameChange: true,
	className: '',
	name: ''
}
