/**
 * Forgot
 *
 * Allows the user to request a password change
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-15
 */

// NPM modules
import React, { useRef, useState } from 'react';

// Material UI
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

// Generic modules
import Events from '../../../generic/events';
import Hash from '../../../generic/hash';
import Rest from '../../../generic/rest';

// Local modules
import Utils from '../../../utils';

// Theme
const useStyles = makeStyles((theme) => ({
	dialog: {
		"& .MuiFormControl-root": {
			marginTop: '10px',
			width: '100%'
		}
	}
}));

// Sign In
export default function Forgot(props) {

	// Styles
	const classes = useStyles();

	// State
	let [errors, errorsSet] = useState({})

	// Refs
	let emailRef = useRef();

	function keyPressed(event) {
		if(event.key === 'Enter') {
			forgot();
		} else {
			errorsSet({});
		}
	}

	function forgot() {

		// Call the signin
		Rest.create('patient', 'account/forgot', {
			"email": emailRef.current.value,
			"url": 'https://' + process.env.REACT_APP_SELF_DOMAIN + '/#key=c'
		}).done(res => {

			// If there's an error
			if(res.error && !Utils.restError(res.error)) {
				switch(res.error.code) {
					case 1001:
						// Go through each message and mark the error
						let errors = {};
						for(let i in res.error.msg) {
							errors[i] = res.error.msg[i];
						}
						errorsSet(errors);
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
				Events.trigger('success', 'Thank you, if the e-mail is valid in our system, you will received a link to change your password.');

				// Remove the has key so we go to sign in
				Hash.set('key', null);
			}
		});
	}

	return (
		<React.Fragment>
			<DialogTitle id="confirmation-dialog-title">Forgot Password</DialogTitle>
			<DialogContent className={classes.dialog} dividers>
				<p>
					Forgetting your password is never fun
					but not to worry, fill in your email
					below and we will send you a link to
					reset your password. For additional
					assistance you can contact <Link color="secondary" href="mailto:support@maleexcel.com">support@maleexcel.com</Link>.
				</p>
				<TextField
					error={errors.email ? true : false}
					helperText={errors.email || ''}
					inputRef={emailRef}
					label="E-mail Address"
					onKeyPress={keyPressed}
					type="text"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={forgot}>
					Request Password Change
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}
