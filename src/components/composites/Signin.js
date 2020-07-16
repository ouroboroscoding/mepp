/**
 * Signin
 *
 * Handles sign in modal
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-04-04
 */

// NPM modules
import React, { useEffect, useRef, useState } from 'react';

// Material UI
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

// Generic modules
import Events from '../../generic/events';
import Hash from '../../generic/hash';
import Rest from '../../generic/rest';

// Local modules
import Utils from '../../utils';

// Hooks
import { useLocationHash } from '../../hooks/hash.js';

// Sign In
export default function Signin(props) {

	// State
	let [errors, errorsSet] = useState({})
	let [key, keySet] = useState(null);

	// Hooks
	useLocationHash('setup', setupHashChange);
	useLocationHash('forgot', forgotHashChange);

	// Refs
	let userRef = useRef();
	let passRef = useRef();

	// Init only effect
	useEffect(() => {

		// See if we have a forgot or setup key
		let sForgot = Hash.get('forgot');
		let sSetup = Hash.get('setup');

		// If setup
		if(sSetup) {
			keySet({"type": "setup", "value": sSetup});
		}
		// Else if forgot
		else if(sForgot) {
			keySet({"type": "forgot", "value": sForgot});
		}
	}, []);

	function fetchUser() {

		// Fetch the user data
		Rest.read('monolith', 'user', {}).done(res => {

			// If there's an error
			if(res.error && !Utils.restError(res.error)) {
				Events.trigger('error', JSON.stringify(res.error));
			}

			// If there's a warning
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// If there's data
			if(res.data) {

				// Welcome user
				Events.trigger('success', 'Welcome to your Male Excel!');

				// Trigger the signedIn event
				Events.trigger('signedIn', res.data);
			}
		});
	}

	function forgotHashChange(value) {
		keySet(value === null ? null : {"type": "forgot", "value": value});
	}

	function keyPressed(event) {
		if(event.key === 'Enter') {
			this.signin();
		}
	}

	function setupHashChange(value) {
		keySet(value === null ? null : {"type": "setup", "value": value});
	}

	function signin() {

		// Call the signin
		Rest.create('monolith', 'signin', {
			"userName": userRef.current.value,
			"passwd": passRef.current.value
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
					case 1201:
						Events.trigger('error', 'User or password invalid');
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

				// Set the session with the service
				Rest.session(res.data.session);

				// Fetch the user info
				fetchUser();
			}
		});
	}

	let type = key === null ?
		'signin' :
		(key.type === 'forgot' ?
			'forgot' :
			'setup');

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="lg"
			open={true}
			aria-labelledby="confirmation-dialog-title"
		>
			{type === 'signin' &&
				<React.Fragment>
					<DialogTitle id="confirmation-dialog-title">Sign In</DialogTitle>
					<DialogContent dividers>
						<div><TextField
							error={errors.userName ? true : false}
							helperText={errors.userName || ''}
							inputRef={userRef}
							label="User"
							onKeyPress={keyPressed}
							type="text"
						/></div>
						<div><TextField
							error={errors.passwd ? true : false}
							helperText={errors.passwd || ''}
							inputRef={passRef}
							label="Password"
							onKeyPress={keyPressed}
							type="password"
						/></div>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" color="primary" onClick={signin}>
							Sign In
						</Button>
					</DialogActions>
				</React.Fragment>
			}
			{type === 'forgot' &&
				<p>Forgot</p>
			}
			{type === 'setup' &&
				<p>Setup</p>
			}
		</Dialog>
	);
}
