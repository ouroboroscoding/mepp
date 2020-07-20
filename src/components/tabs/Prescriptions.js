/**
 * Prescriptions
 *
 * Prescriptions associated with the patient
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-16
 */

// NPM modules
import React, { useState, useEffect } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
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
	rx: {
		marginBottom: '10px',
		padding: '10px'
	}
}));

/**
 * Prescriptions
 *
 * Shows prescriptions associated with patient
 *
 * @name Prescriptions
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Prescriptions(props) {

	// Styles
	const classes = useStyles();

	// State
	let [records, recordsSet] = useState(null);

	// Fetch records effect
	useEffect(() => {

		// If we have a user with the correct rights
		if(props.user) {
			fetchRecords();
		} else {
			recordsSet(null);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.user]); // React to user changes

	// Fetch all the records from the server
	function fetchRecords() {

		// Fetch all records
		Rest.read('prescriptions', 'patient/prescriptions', {
			patient_id: parseInt(props.user.rx_id)
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

				// Set the records
				recordsSet(res.data);
			}
		});
	}

	// If we are loading
	if(records === null) {
		return <Box>Loading...</Box>;
	} else {
		return (
			<Box className={classes.box}>
				{records.filter(o => (o.Status < 6 || o.Status > 8)).map((o,i) => {
					return (
						<Paper key={i} className={classes.rx}>
							<p><strong>Pharmacy: </strong><span>{o.PharmacyName}</span></p>
							<p><strong>Prescriber: </strong><span>{o.PrescriberName}</span></p>
							<p><strong>Product: </strong><span>{o.DisplayName} ({o.Quantity})</span></p>
							<p><strong>Written: </strong><span>{o.WrittenDate.substring(0, 10)}</span></p>
							{o.EffectiveDate &&
								<p><strong>Effective: </strong><span>{o.EffectiveDate.substring(0, 10)}</span></p>
							}
							<p><strong>Status: </strong><span>{o.StatusText}</span></p>
							<p><strong>Medication Status: </strong><span>{o.MedicationStatusText}</span></p>
							<p><strong>Directions: </strong><span>{o.Directions}</span></p>
						</Paper>
					);
				})}
			</Box>
		);
	}
}
