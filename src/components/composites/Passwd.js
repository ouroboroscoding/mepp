/**
 * Password
 *
 * Standard Password change fields
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2021-10-14
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
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
	}
}));

/**
 * Passwd
 *
 * Handles fetching and validating address info
 *
 * @name Passwd
 * @access public
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Passwd(props) {

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
				label="Current Password"
				name="old_passwd"
				onChange={change}
				type="password"
				value={props.value.old_passwd}
			/>
			<br />
			<br />
			<TextField
				label="New Password"
				name="passwd"
				onChange={change}
				type="password"
				value={props.value.passwd}
			/>
			<TextField
				label="Confirm New Password"
				name="confirm"
				onChange={change}
				type="password"
				value={props.value.confirm}
			/>
		</Box>
	);
}

// Valid props
Passwd.propTypes = {
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.object
}

// Default props
Passwd.defaultProps = {
	value: {}
}
