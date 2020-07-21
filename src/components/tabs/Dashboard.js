/**
 * Dashboard
 *
 * Next and latest order info
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-16
 */

// NPM modules
import { Decimal } from 'decimal.js';
import React, { useState, useEffect } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

// Generic modules
import Events from '../../generic/events';
import Rest from '../../generic/rest';

// Local modules
import Utils from '../../utils';

// Theme
const useStyles = makeStyles((theme) => ({
	box: {
		margin: '0 auto',
		maxWidth: '640px'
	},
	child: {
		textAlign: 'center'
	},
	grid: {
		padding: '10px'
	},
	paper: {
		marginBottom: '15px'
	}
}));

/**
 * Dashboard
 *
 * Shows latest order info
 *
 * @name Dashboard
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Dashboard(props) {

	// Styles
	const classes = useStyles();

	// State
	let [purchases, purchasesSet] = useState(null);
	let [tracking, trackingSet] = useState(null);

	// Fetch purchases effect
	useEffect(() => {

		// If we have a user with the correct rights
		if(props.user) {
			fetchPurchases();
			fetchTracking();
		} else {
			purchasesSet(null);
			trackingSet(null);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.user]); // React to user changes

	// Fetch all the purchases from the server
	function fetchPurchases() {

		// Fetch all purchases
		Rest.read('konnektive', 'customer/purchases', {
			customerId: parseInt(props.user.crm_id)
		}).done(res => {

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

				// Find the latest transaction for each purchase
				filterLatest(res.data)

				// Set the purchases
				purchasesSet(res.data);
			}
		});
	}

	// Fetch all the tracking from the server
	function fetchTracking() {

		// Fetch all tracking
		Rest.read('monolith', 'customer/shipping', {
			customerId: props.user.crm_id
		}).done(res => {

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

				// Set the tracking
				trackingSet(res.data);
			}
		});
	}

	function filterLatest(purchases) {

		// Go through each purchase
		for(let oP of purchases) {
			let latest = null;
			for(let oT of oP['transactions']) {
				if(latest === null ||
					(oT.response === 'APPROVED' && oT.date > latest.date)) {

					// Store the latest with the price minus any refunds
					latest = oT;
					latest.price = new Decimal(oT.price);
					latest.price = latest.price.minus(latest.refunded);
				}
			}
			oP.latest = latest;
		}
	}

	// Render elements
	let lRender = []

	// If we are loading
	if(tracking === null) {
		lRender.push(<Box>Loading...</Box>);
	} else {
		lRender.push(
			<Paper className={classes.paper}>
				<Grid className={classes.grid} container justify="center" spacing={2}>
					<Grid item xs={12}><strong>Tracking Codes</strong></Grid>
					{tracking.slice(0,3).map((o,i) =>
						<React.Fragment>
							<Grid item xs={4}>{o.date}</Grid>
							<Grid item xs={8}>{o.type} <Link color="secondary" href={o.link} target="_blank">{o.code}</Link></Grid>
						</React.Fragment>
					)}
				</Grid>
			</Paper>
		);
	}

	// If we are loading
	if(purchases === null) {
		lRender.push(<Box>Loading...</Box>);
	} else {
		lRender.push(...purchases.filter(o => o.status === 'ACTIVE').map((o, i) =>
			<Paper className={classes.paper} key={i}>
				<Grid className={classes.grid} container justify="center" spacing={2}>
					<Grid item xs={12}><strong>{o.product}</strong></Grid>
					<Grid item xs={4}>Last Order</Grid>
					<Grid item xs={4}>{o.latest ? o.latest.date.substr(0, 10) : 'No Order found'}</Grid>
					<Grid item xs={4}>{o.latest ? ('$' + o.latest.price.toFixed(2)) : ''}</Grid>
					<Grid item xs={4}>Next Refill</Grid>
					<Grid item xs={4}>{o.nextBillDate ? o.nextBillDate.substr(0, 10) : 'No Future Refills'}</Grid>
					<Grid item xs={4}>{o.nextBillDate ? ('$' + o.price) : ''}</Grid>
				</Grid>
			</Paper>
		));
	}

	// Render
	return (
		<Box className={classes.box}>{lRender}</Box>
	);
}
