/**
 * Main
 *
 * Main page of the patient portal
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2021-01-20
 */

// NPM modules
import React, { useState } from 'react';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';

// Composite component modules
import NoUser from 'components/dialogs/NoUser';

// Tab component modules
import Dashboard from './Dashboard';
import HRT from './HRT';
import Personal from './Personal';
import Prescriptions from './Prescriptions';

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
	tabs: {
		flexGrow: 0,
		flexShrink: 0
	}
}));

/**
 * Main
 *
 * Shows tabs for different data types
 *
 * @name Main
 * @access public
 * @param Object props Attributes sent to the component
 * @returns React.Component
 */
export default function Main(props) {

	// Styles
	const classes = useStyles();

	// State
	let [tab, tabSet] = useState(0);

	// Tabs
	let lTabs = ['dashboard', 'personal'];
	if(props.user.rx_id) {
		lTabs.push('rx');
	}
	if(props.user.hrt) {
		lTabs.push('hrt');
	}

	// Render
	if(props.user) {
		return (
			<React.Fragment>
				<AppBar position="static" color="default" className={classes.tabs}>
					<Tabs
						onChange={(ev, newTab) => tabSet(newTab)}
						value={tab}
						variant="fullWidth"
					>
						<Tab label="Dashboard" />
						<Tab label="Personal" />
						{props.user.rx_id &&
							<Tab label="Prescriptions" />
						}
						{props.user.hrt &&
							<Tab label="HRT" />
						}
					</Tabs>
				</AppBar>
				<Box className={classes.content}>
					{lTabs[tab] === 'dashboard' &&
						<Dashboard user={props.user} />
					}
					{lTabs[tab] === 'personal' &&
						<Personal user={props.user} />
					}
					{lTabs[tab] === 'rx' &&
						<Prescriptions user={props.user} />
					}
					{lTabs[tab] === 'hrt' &&
						<HRT user={props.user} />
					}
				</Box>
			</React.Fragment>
		)
	} else {
		return <NoUser />
	}
}
