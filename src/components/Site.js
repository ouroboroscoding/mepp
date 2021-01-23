/**
 * Site
 *
 * Primary entry into React app
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-04-04
 */

// NPM modules
import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';
import Hash from 'shared/generic/hash';

// Hooks
import { useEvent } from 'shared/hooks/event';

// Composite component modules
import Alerts from 'components/composites/Alerts';
import Header from 'components/composites/Header';

// Pages
import Main from 'components/pages/Main';
import CalendlySingle from 'components/pages/CalendlySingle';

// Verify
import Verify from 'components/Verify';

// CSS Theme
import Theme from 'components/Theme'

// Local modules
import { LoaderHide, LoaderShow } from './composites/Loader';

// Init the rest services
Rest.init(process.env.REACT_APP_MEMS_DOMAIN, process.env.REACT_APP_MEMS_DOMAIN, xhr => {

	// If we got a 401, let everyone know we signed out
	if(xhr.status === 401) {
		Events.trigger('error', 'Your session has expired');
		Events.trigger('signedOut');
	} else {
		console.error('Rest call failed: ', xhr);
		Events.trigger('error',
			'Unable to connect to ' + process.env.REACT_APP_MEMS_DOMAIN +
			': ' + xhr.statusText +
			' (' + xhr.status + ')');
	}
}, (method, url, data) => {
	LoaderShow();
}, (method, url, data) => {
	LoaderHide();
});

// If we have a session, fetch the user
if(Rest.session()) {
	Rest.read('patient', 'session', {}).done(res => {
		Rest.read('patient', 'account', {}).done(res => {
			Events.trigger('signedIn', res.data);
		});
	});
}

// Make Events available from console
window.Events = Events;

// Hide the loader
LoaderHide();

// Init the Hash module
Hash.init();

// Theme
const useStyles = makeStyles((theme) => ({
	site: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	}
}));

/**
 * Site
 *
 * Primary component of the site
 *
 * @name Site
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Site(props) {

	// Styles
	const classes = useStyles();

	// State
	let [user, userSet] = useState(false);

	// hooks
	let location = useLocation();
	useEvent('signedIn', user => userSet(user));
	useEvent('signedOut', () => userSet(false));

	// Render
	return (
		<SnackbarProvider maxSnack={3}>
			<Alerts />
			<ThemeProvider theme={Theme}>
				<CssBaseline />
				<div className={classes.site}>
					<Header
						user={user}
					/>
					<Switch>
						<Route
							exact
							path="/"
						>
							<Main user={user} />
						</Route>
						<Route
							exact
							path="/appointment/:_key"
							children={
								<CalendlySingle
									key={location.pathname}
								/>
							}
						/>
						<Route
							exact
							path="/verify"
						>
							<div className={classes.content}>
								<Verify />
							</div>
						</Route>
					</Switch>
				</div>
			</ThemeProvider>
		</SnackbarProvider>
	);
}
