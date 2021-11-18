/**
 * Address
 *
 * Standard Address Fields
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-17
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

// Shared generic modules
import { clone } from 'shared/generic/tools';

// Theme
const useStyles = makeStyles((theme) => ({
	box: {
		'& .MuiFormControl-root': {
			marginBottom: '15px',
			paddingRight: '10px'
		}
	},
	zip: {
		width: '66px'
	}
}));

/**
 * Address
 *
 * Handles fetching and validating address info
 *
 * @name Address
 * @access public
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Address(props) {

	// Styles
	const classes = useStyles();

	// Capture changes
	function change(ev) {
		let newValue = clone(props.value);
		newValue[ev.currentTarget.name] = ev.currentTarget.value;
		props.onChange({
			currentTarget: {
				name: props.name,
				value: newValue
			}
		});
	}

	// Render the component
	return (
		<Box className={classes.box}>
			<TextField
				label="First Name"
				name="firstName"
				onChange={change}
				type="text"
				value={props.value.firstName}
			/>
			<TextField
				label="Last Name"
				name="lastName"
				onChange={change}
				type="text"
				value={props.value.lastName}
			/>
			<TextField
				label="Company"
				name="company"
				onChange={change}
				type="text"
				value={props.value.company}
			/>
			<TextField
				label="Address 1"
				name="address1"
				onChange={change}
				type="text"
				value={props.value.address1}
			/>
			<TextField
				label="Address 2"
				name="address2"
				onChange={change}
				type="text"
				value={props.value.address2}
			/>
			<TextField
				label="City"
				name="city"
				onChange={change}
				type="text"
				value={props.value.city}
			/>
			<FormControl>
				<InputLabel htmlFor={'name-native-'+props.name}>State</InputLabel>
				<NativeSelect
					name="state"
					onChange={change}
					value={props.value.state}
					inputProps={{
						id: 'name-native'+props.name
					}}
				>
					<option value="AL">Alabama</option>
					<option value="AK">Alaska</option>
					<option value="AZ">Arizona</option>
					<option value="AR">Arkansas</option>
					<option value="AA">Armed Forces America</option>
					<option value="AE">Armed Forces Europe</option>
					<option value="AP">Armed Forces Pacific</option>
					<option value="CA">California</option>
					<option value="CO">Colorado</option>
					<option value="CT">Connecticut</option>
					<option value="DE">Delaware</option>
					<option value="DC">District of Columbia</option>
					<option value="FL">Florida</option>
					<option value="GA">Georgia</option>
					<option value="HI">Hawaii</option>
					<option value="ID">Idaho</option>
					<option value="IL">Illinois</option>
					<option value="IN">Indiana</option>
					<option value="IA">Iowa</option>
					<option value="KS">Kansas</option>
					<option value="KY">Kentucky</option>
					<option value="LA">Louisiana</option>
					<option value="ME">Maine</option>
					<option value="MD">Maryland</option>
					<option value="MA">Massachusetts</option>
					<option value="MI">Michigan</option>
					<option value="MN">Minnesota</option>
					<option value="MS">Mississippi</option>
					<option value="MO">Missouri</option>
					<option value="MT">Montana</option>
					<option value="NE">Nebraska</option>
					<option value="NV">Nevada</option>
					<option value="NH">New Hampshire</option>
					<option value="NJ">New Jersey</option>
					<option value="NM">New Mexico</option>
					<option value="NY">New York</option>
					<option value="NC">North Carolina</option>
					<option value="ND">North Dakota</option>
					<option value="OH">Ohio</option>
					<option value="OK">Oklahoma</option>
					<option value="OR">Oregon</option>
					<option value="PA">Pennsylvania</option>
					<option value="RI">Rhode Island</option>
					<option value="SC">South Carolina</option>
					<option value="SD">South Dakota</option>
					<option value="TN">Tennessee</option>
					<option value="TX">Texas</option>
					<option value="UT">Utah</option>
					<option value="VT">Vermont</option>
					<option value="VA">Virginia</option>
					<option value="WA">Washington</option>
					<option value="WV">West Virginia</option>
					<option value="WI">Wisconsin</option>
					<option value="WY">Wyoming</option>
				</NativeSelect>
			</FormControl>
			<TextField
				className={classes.zip}
				label="Zip"
				name="postalCode"
				onChange={change}
				type="text"
				value={props.value.postalCode}
			/>
		</Box>
	);
}

// Valid props
Address.propTypes = {
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.object
}

// Default props
Address.defaultProps = {
	value: {}
}
