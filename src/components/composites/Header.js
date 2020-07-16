/**
 * Header
 *
 * Handles app bar and drawer
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-04-04
 */

// NPM modules
import React from 'react';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

// Material UI Icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Local components
import Loader from './Loader';

// Generic modules
import Events from '../../generic/events';
import Rest from '../../generic/rest';

// Local modules
import Utils from '../../utils';

// Theme
const useStyles = makeStyles((theme) => ({
	toolbar: {
		display: 'flex',
		padding: '10px',
		'& .MuiIconButton-root': {
			color: 'rgba(255, 255, 255, 0.54)'
		},
		'& .MuiSvgIcon-root': {
			fontSize: '2rem'
		}
	},
	tag: {
		flexGrow: 0,
		fontFamily: 'ITCAvantGardePro-Bk',
		fontSize: '16px',
		textAlign: 'right'
	},
	loader: {
		flexGrow: 1,
		textAlign: 'center'
	}
}));

// Header component
export default function Header(props) {

	// Styles
	const classes = useStyles();

	// Signed out
	function signout(ev) {

		// Call the signout
		Rest.create('auth', 'signout', {}).done(res => {

			// If there's an error
			if(res.error && !Utils.serviceError(res.error)) {
				Events.trigger('error', JSON.stringify(res.error));
			}

			// If there's a warning
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// If there's data
			if(res.data) {

				// Reset the session
				Rest.session(null);

				// Trigger the signedOut event
				Events.trigger('signedOut');
			}
		});
	}

	// Render the page
	return (
		<div id="header">
			<AppBar position="relative">
				<Toolbar className={classes.toolbar}>
					<div className={classes.tag}>
						<img src="/images/logo.png" alt="MaleExcel Logo" style={{width: '240px'}} />
						<div>Making Health Care Easy</div>
					</div>
					<div className={classes.loader}>
						<Loader />
					</div>
					{props.user &&
						<React.Fragment>
							<Tooltip title="Sign Out">
								<IconButton onClick={signout}>
									<ExitToAppIcon />
								</IconButton>
							</Tooltip>
						</React.Fragment>
					}
				</Toolbar>
			</AppBar>
		</div>
	);
}
