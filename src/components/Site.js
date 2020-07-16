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
import { SnackbarProvider } from 'notistack';

// Material UI
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'

// Generic modules
import Events from '../generic/events';
import Hash from '../generic/hash';
import Rest from '../generic/rest';

// Hooks
import useEvent from '../hooks/event';

// Composite component modules
import Alerts from './composites/Alerts';
import Header from './composites/Header';
import NoUser from './dialogs/NoUser';

// CSS Theme
import Theme from './Theme'

// Local modules
import { LoaderHide, LoaderShow } from './composites/Loader';

// Init the rest services
Rest.init(process.env.REACT_APP_MEMS_DOMAIN, xhr => {

	// If we got a 401, let everyone know we signed out
	if(xhr.status === 401) {
		Events.trigger('error', 'Your previous session has expired');
		Events.trigger('signedOut');
	} else {
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

window.loaderHide = LoaderHide;
window.loaderShow = LoaderShow;

// Init the Hash module
Hash.init();

// Site
function Site(props) {

	// State
	let [user, setUser] = useState(false);

	// User hooks
	useEvent('signedIn', user => setUser(user));
	useEvent('signedOut', () => setUser(false));

	// Return the Site
	return (
		<SnackbarProvider maxSnack={3}>
			<Alerts />
			<ThemeProvider theme={Theme}>
				<CssBaseline />
				<div id="site">
					{user === false &&
						<NoUser />
					}
					<Header
						user={user}
					/>
					<div id="content">

					</div>
				</div>
			</ThemeProvider>
		</SnackbarProvider>
	);
}

// Export the app
export default Site;
