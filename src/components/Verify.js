/**
 * Verify
 *
 * Verifies the user
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-22
 */

// NPM modules
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Material UI
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

// Generic modules
import Events from '../generic/events';
import Hash from '../generic/hash';
import Rest from '../generic/rest';

// Local modules
import Utils from '../utils';

// Theme
const useStyles = makeStyles((theme) => ({
	box: {
		margin: '0 auto',
		maxWidth: '640px'
	}
}));

/**
 * Verify
 *
 * Primary component of the site
 *
 * @name Verify
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Verify(props) {

	// Styles
	const classes = useStyles();

	// Hooks
	const history = useHistory();

	// Fetch info effect
	useEffect(() => {

		// Get the key from the hash
		let sKey = Hash.get('key');

		// Send it to the service
		Rest.update('patient', 'account/verify', {
			"key": sKey
		}).done(res => {

			// If there's an error
			if(res.error && !Utils.restError(res.error)) {
				if(res.error.code === 1903) {
					Events.trigger('error', 'Key or account invalid');
				} else {
					Events.trigger('error', JSON.stringify(res.error));
				}
			}

			// If there's a warning
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// On success
			if(res.data) {
				Events.trigger('success', 'Your e-mail address is now verified');
			}

			// Clear hash
			Hash.set('key', null)

			// Redirect
			history.push('/');
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // React to user changes

	// Render
	return (
		<Box className={classes.box}>Verifying your email</Box>
	);
}
