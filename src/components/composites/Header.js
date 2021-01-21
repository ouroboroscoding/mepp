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
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

// Material UI Icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Local components
import Loader from './Loader';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';

// Local modules
import Utils from 'utils';

// Theme
const useStyles = makeStyles((theme) => ({
	appbar: {
		flexGrow: 0,
		flexShrink: 0
	},
	toolbar: {
		display: 'flex',
		padding: '10px',
		'& .MuiIconButton-root': {
			color: 'rgba(255, 255, 255, 0.54)',
			padding: '5px',
			[theme.breakpoints.down('sm')]: {
				padding: 0
			}
		},
		'& .MuiSvgIcon-root': {
			fontSize: '2rem',
			[theme.breakpoints.down('sm')]: {
				fontSize: '1.5rem'
			}
		}
	},
	tag: {
		flexGrow: 0,
		fontFamily: 'ITCAvantGardePro-Bk',
		fontSize: '16px',
		textAlign: 'right',
		[theme.breakpoints.down('sm')]: {
			fontSize: '10px'
		},
		'& a': {
			color: '#ffffff',
			'& img': {
				width: '240px',
				[theme.breakpoints.down('sm')]: {
					width: '180px'
				}
			}
		}
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
		<AppBar position="relative" className={classes.appbar}>
			<Toolbar className={classes.toolbar}>
				<Box className={classes.tag}>
					<Link href="/">
						<img src="/images/logo.png" alt="MaleExcel Logo" style={{}} />
						<Box>Making Health Care Easy</Box>
					</Link>
				</Box>
				<Box className={classes.loader}>
					<Loader />
				</Box>
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
	);
}
