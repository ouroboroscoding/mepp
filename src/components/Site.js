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
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline'
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

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

// Tab component modules
import Dashboard from './tabs/Dashboard';
import Personal from './tabs/Personal';
import Prescriptions from './tabs/Prescriptions';

// CSS Theme
import Theme from './Theme'

// Local modules
import { LoaderHide, LoaderShow } from './composites/Loader';

// Init the rest services
Rest.init(process.env.REACT_APP_MEMS_DOMAIN, xhr => {

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
	content: {
		flexBasis: 0,
		flexGrow: 1,
		flexShrink: 1,
		height: '100%',
		overflow: 'auto',
		padding: '10px'
	},
	site: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	tabs: {
		flexGrow: 0,
		flexShrink: 0
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
	let [tab, tabSet] = useState(0);
	let [user, userSet] = useState(false);

	// hooks
	useEvent('signedIn', user => userSet(user));
	useEvent('signedOut', () => userSet(false));

	// Render
	return (
		<SnackbarProvider maxSnack={3}>
			<Alerts />
			<ThemeProvider theme={Theme}>
				<CssBaseline />
				<div className={classes.site}>
					{user === false &&
						<NoUser />
					}
					<Header
						user={user}
					/>
					<AppBar position="static" color="default" className={classes.tabs}>
						<Tabs
							onChange={(ev, newTab) => tabSet(newTab)}
							value={tab}
							variant="fullWidth"
						>
							<Tab label="Dashboard" />
							<Tab label="Personal Info" />
							<Tab label="Prescriptions" />
						</Tabs>
					</AppBar>
					<div className={classes.content}>
						{tab === 0 &&
							<Dashboard user={user} />
						}
						{tab === 1 &&
							<Personal user={user} />
						}
						{tab === 2 &&
							<Prescriptions user={user} />
						}
					</div>
				</div>
			</ThemeProvider>
		</SnackbarProvider>
	);
}
