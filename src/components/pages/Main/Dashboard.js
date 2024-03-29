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
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

// Shared functions
import supportRequest from 'components/functions/supportRequest';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';

// Local modules
import Utils from 'utils';

// Theme
const useStyles = makeStyles((theme) => ({
	box: {
		margin: '0 auto',
		maxWidth: '640px'
	},
	cancel: {
		textAlign: 'right'
	},
	child: {
		textAlign: 'center'
	},
	grid: {
		padding: '10px'
	},
	paper: {
		marginBottom: '15px'
	},
	title: {
		marginBottom: '10px'
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
	let [cancel, cancelSet] = useState(null);
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
			if(res.error && !res._handled) {
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
				purchasesSet(res.data.filter(o => ['ACTIVE','TRIAL'].includes(o.status)));
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
			if(res.error && !res._handled) {
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

	function toggleCancel() {
		cancelSet(val => !val);
	}

	// If we have a user
	if(props.user) {

		// Render elements
		let lRender = []

		if(purchases !== null && purchases.length > 0) {
			lRender.push(
				<Box key={'r' + lRender.length}>
					<Typography className={classes.title} variant="h3">{purchases[0].shipping.lastName}, {purchases[0].shipping.firstName}</Typography>
				</Box>
			);
		}

		// If we are loading
		if(tracking !== null) {
			lRender.push(
				<Paper key={'r' + lRender.length} className={classes.paper}>
					<Grid className={classes.grid} container justify="center" spacing={2}>
						<Grid item xs={12}><strong>Tracking Codes</strong></Grid>
						{tracking.length === 0 ?
							<span>No tracking available yet.</span> :
							tracking.slice(0,3).map((o,i) =>
								<React.Fragment>
									<Grid item xs={4}>{Utils.niceDate(o.date + 'T00:00:00')}</Grid>
									<Grid item xs={8}>{o.type} <Link color="secondary" href={o.link} target="_blank">{o.code}</Link></Grid>
								</React.Fragment>
							)
						}
					</Grid>
				</Paper>
			);
		}

		// If we are loading
		if(purchases === null) {
			lRender.push(<Box key={'r' + lRender.length}>Loading...</Box>);
		} else {
			if(purchases.length === 0) {
				lRender.push(<Paper className={classes.grid} key={'r' + lRender.length}>You have no subscriptions</Paper>);
			} else {
				lRender.push(...purchases.map((o, i) =>
					<Paper className={classes.paper} key={i}>
						<Grid className={classes.grid} container justify="center" spacing={2}>
							<Grid item xs={12}><strong>{o.product.name}</strong></Grid>
							<Grid item xs={4}>Last Charged Date</Grid>
							<Grid item xs={4}>{o.latest ? Utils.niceDate(o.latest.date.replace(' ', 'T')) : 'No Order found'}</Grid>
							<Grid item xs={4}>{o.latest ? ('$' + o.latest.price.toFixed(2)) : ''}</Grid>
							<Grid item xs={4}>Next Charged Date</Grid>
							<Grid item xs={4}>{o.nextBillDate ? Utils.niceDate(o.nextBillDate + 'T00:00:00') : 'No Future Refills'}</Grid>
							<Grid item xs={4}>{o.nextBillDate ? ('$' + o.price) : ''}</Grid>
							<Grid className={classes.cancel} item xs={12}>
								<Button variant="contained" color="primary" onClick={toggleCancel}>Pause Subscription</Button>
							</Grid>
						</Grid>
					</Paper>
				));
			}
		}

		// If cancel clicked
		if(cancel) {
			lRender.push(
				<Dialog
					fullWidth={true}
					key={'r' + lRender.length}
					maxWidth="sm"
					onClose={toggleCancel}
					open={true}
				>
					<DialogTitle>Pause Subscription</DialogTitle>
					<DialogContent dividers>
						<p>To pause your subscription please contact support or
						click the button below to be added to our support queue
						and an agent will contact you as soon as your request is
						completed.</p>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" color="secondary" onClick={toggleCancel}>Cancel</Button>
						<Button variant="contained" color="primary" onClick={ev => supportRequest('cancel_order', () => cancelSet(false))}>Request Pause</Button>
					</DialogActions>
				</Dialog>
			);
		}

		// Render
		return (
			<Box className={classes.box}>{lRender}</Box>
		);
	}
	// No user
	else {
		return <React.Fragment />
	}
}

// Valid props
Dashboard.propTypes = {
	user: PropTypes.object.isRequired
}
