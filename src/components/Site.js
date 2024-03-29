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
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

// Shared generic modules
import Hash from 'shared/generic/hash';

// Hooks
import { useEvent } from 'shared/hooks/event';

// Composite component modules
import Alerts from 'components/composites/Alerts';
import Header from 'components/composites/Header';

// Pages
import CalendlySingle from 'components/pages/CalendlySingle';
import HowTo from 'components/pages/HowTo';
import Main from 'components/pages/Main';
import NotFound from 'components/pages/NotFound';
import Verify from 'components/pages/Verify';

// CSS Theme
import Theme from 'components/Theme'

// Shared modules
import { clone, safeLocalStorageJSON } from 'shared/generic/tools';

// Rest
import 'rest_init';

// Init the Hash module
Hash.init();

// Theme
const useStyles = makeStyles((theme) => ({
	override: {
		padding: '10px',
		'& .MuiFormControl-root, .MuiInputBase-root': {
			width: '100%'
		}
	},
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
	let [override, overrideSet] = useState(safeLocalStorageJSON('overrideUser', {}));

	// hooks
	let location = useLocation();
	useEvent('signedIn', user => userSet(user));
	useEvent('signedOut', () => userSet(false));

	// Called when any override fields change
	function overrideChange(k, v) {
		let oOverride = clone(override);

		if(k === 'hrt' && v === '0') {
			oOverride[k] = false;
		} else {
			oOverride[k] = v;
		}

		overrideSet(oOverride);
	}

	// Called when override submit is clicked
	function overrideCustomer() {

		// Clone the current user
		let oUser = clone(user);

		// Set the new values
		oUser.crm_type = override.crm_type;
		oUser.crm_id = override.crm_id;
		oUser.rx_type = override.rx_type;
		oUser.rx_id = override.rx_id;
		oUser.hrt = override.hrt;

		// Set the new user
		userSet(oUser);

		// Store the override in case of reloads
		localStorage.setItem('overrideUser', JSON.stringify(override));
	}

	// Render
	return (
		<SnackbarProvider autoHideDuration={8000} maxSnack={3}>
			<Alerts />
			<ThemeProvider theme={Theme}>
				<CssBaseline />
				<div className={classes.site}>
					{(process.env.REACT_APP_ALLOW_OVERRIDE === 'true' && user) &&
						<Box className={classes.override}>
							<Grid container spacing={2}>
								<Grid item xs={6} sm={4} lg={2}>
									<FormControl variant="outlined">
										<InputLabel>CRM Type</InputLabel>
										<Select label="CRM Type" native onChange={ev => overrideChange('crm_type', ev.currentTarget.value)} value={override.crm_type}>
											<option value="knk">Konnektive</option>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={6} sm={4} lg={2}>
									<TextField label="CRM ID" onChange={ev => overrideChange('crm_id', ev.currentTarget.value)} placeholder="CRM ID" value={override.crm_id} variant="outlined" />
								</Grid>
								<Grid item xs={6} sm={4} lg={2}>
									<FormControl variant="outlined">
										<InputLabel>RX Type</InputLabel>
										<Select label="RX Type" native onChange={ev => overrideChange('rx_type', ev.currentTarget.value)} value={override.rx_type}>
											<option value="0"></option>
											<option value="ds">DoseSpot</option>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={6} sm={4} lg={2}>
									<TextField label="RX ID" onChange={ev => overrideChange('rx_id', ev.currentTarget.value)} placeholder="RX ID" value={override.rx_id} variant="outlined" />
								</Grid>
								<Grid item xs={6} sm={4} lg={2}>
									<FormControl variant="outlined">
										<InputLabel>HRT Stage</InputLabel>
										<Select label="HRT Stage" native onChange={ev => overrideChange('hrt', ev.currentTarget.value)} value={override.hrt || '0'}>
											<option value="0"></option>
											<option value="Onboarding">Onboarding</option>
											<option value="Optimizing">Optimizing</option>
											<option value="Dropped">Dropped</option>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={6} sm={4} lg={2}>
									<Button color="primary" onClick={overrideCustomer} variant="contained">Override</Button>
								</Grid>
							</Grid>
						</Box>
					}
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
							path="/howto"
						>
							<HowTo
								key={location.pathname}
							/>
						</Route>
						<Route
							exact
							path="/verify"
						>
							<div className={classes.content}>
								<Verify />
							</div>
						</Route>
						<Route path="*">
							<NotFound />
						</Route>
					</Switch>
				</div>
			</ThemeProvider>
		</SnackbarProvider>
	);
}
