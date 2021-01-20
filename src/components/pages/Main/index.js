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
					</Tabs>
				</AppBar>
				<Box className={classes.content}>
					{tab === 0 &&
						<Dashboard user={props.user} />
					}
					{tab === 1 &&
						<Personal user={props.user} />
					}
					{tab === 2 &&
						<Prescriptions user={props.user} />
					}
				</Box>
			</React.Fragment>
		)
	} else {
		return <NoUser />
	}
}
