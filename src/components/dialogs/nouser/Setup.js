/**
 * Setup
 *
 * Handles setting up a new account
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-15
 */

// NPM modules
import React, { useRef, useState } from 'react';

// Material UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';
import Hash from 'shared/generic/hash';

// Theme
const useStyles = makeStyles((theme) => ({
	forgot: {
		flexGrow: 1,
		textAlign: 'center',
	},
	grid: {
		'& .MuiTextField-root': {
			width: '100%'
		}
	}
}));

// Sign In
export default function Setup(props) {

	// Styles
	const classes = useStyles();

	// State
	let [errors, errorsSet] = useState({});
	let [forgot, forgotSet] = useState(false);

	// Refs
	let lnameRef = useRef();
	let dobRef = useRef();
	let passRef = useRef();
	let confirmRef = useRef();

	function keyPressed(event) {
		if(event.key === 'Enter') {
			setup();
		} else {
			errorsSet({});
		}
	}

	function setup() {

		console.log(dobRef.current.value);

		// Verify the two passwords match
		if(passRef.current.value !== confirmRef.current.value) {
			Events.trigger('error', 'Passwords do not match');
			errorsSet({"confirm": "Passwords do not match"});
			return;
		}

		// Call the setup
		Rest.create('patient', 'setup/validate', {
			"key": props.keyVal,
			"lname": lnameRef.current.value,
			"dob": dobRef.current.value,
			"passwd": passRef.current.value
		}, {session: false}).done(res => {

			// If there's an error
			if(res.error && !res._handled) {
				switch(res.error.code) {
					case 1001:
						// Go through each message and mark the error
						let errors = {};
						for(let i in res.error.msg) {
							if(i === 'key') {
								Events.trigger('error', 'The account setup key provided is not valid, please make sure you copied the URL from your email correctly. If you continue to have trouble, please contact support.');
							} else {
								errors[i] = res.error.msg[i];
							}
						}
						errorsSet(errors);
						break;
					case 1100:
						Events.trigger('error', 'Failed to create account, please contact support.');
						break;
					case 1900:
						Events.trigger('error', 'Your account has already been setup. If you have forgotten your password, click the "Forgot Password" link. If you believe someone else has accessed your account, please contact support ASAP.');
						forgotSet(true);
						break;
					case 1904:
						Events.trigger('error', 'Password must be at least 8 characters and contain one uppercase, one lowercase, and one numeric character');
						errorsSet({"passwd": 'Weak Password'});
						break;
					case 1905:
						Events.trigger('error', 'The account setup key provided is not valid, please make sure you copied the URL from your email correctly. If you continue to have trouble, please contact support.');
						break;
					case 1906:
						Events.trigger('error', 'Too many failed attempts, in order to protect our customers, this setup has been cancelled. Please contact support to have your account setup.');
						Hash.set('key', null);
						break;
					case 1907:
						Events.trigger('error', 'One or more values do not match what we have on file. Please try again.');
						errorsSet({"lname": "Possibly Invalid", "dob": "Possibly Invalid"});
						break;
					case 1911:
						Events.trigger('error', 'Your account is already setup, please sign in with your email and password.');
						Hash.set('key', null);
						break;
					default:
						Events.trigger('error', JSON.stringify(res.error));
						break;
				}
			}

			// If there's a warning
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// If there's data
			if(res.data) {

				// Notify success
				Events.trigger('success', 'Account created, please sign in with your email and password');

				// Remove the has key so we go to sign in
				Hash.set('key', null);
			}
		});
	}

	return (
		<React.Fragment>
			<DialogTitle id="confirmation-dialog-title">Verify Identity</DialogTitle>
			<DialogContent className={classes.dialog} dividers>
				<div>In order to complete setting up your Male Excel Medical
				Patient Portal account we need to verify you are who you claim.
				Please provide us with your last name, date of birth, and the
				password you'd like to use.</div>
				<Grid className={classes.grid} container spacing={2}>
					<Grid item xs={12} md={8}>
						<TextField
							className={classes.lname}
							error={errors.lname ? true : false}
							helperText={errors.lname || ''}
							inputRef={lnameRef}
							label="Last Name"
							onKeyPress={keyPressed}
							type="text"
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							className={classes.dob}
							defaultValue={'1950-10-20'}
							error={errors.dob ? true : false}
							helperText={errors.dob || ''}
							inputRef={dobRef}
							label="Birthday"
							onKeyPress={keyPressed}
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							className={classes.passwd}
							error={errors.passwd ? true : false}
							helperText={errors.passwd || ''}
							inputRef={passRef}
							label="Choose Password"
							onKeyPress={keyPressed}
							type="password"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							className={classes.passwd}
							error={errors.confirm ? true : false}
							helperText={errors.confirm || ''}
							inputRef={confirmRef}
							label="Confirm Password"
							onKeyPress={keyPressed}
							type="password"
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				{forgot &&
					<div className={classes.forgot}>
						<a href="#key=f">Forgot Password</a>
					</div>
				}
				<Button variant="contained" color="primary" onClick={setup}>
					Complete Setup
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}
