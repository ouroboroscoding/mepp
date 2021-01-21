/**
 * Calendly Single
 *
 * Allows use of a single use Calendly key to allow the patient to create an
 * appointment without logging in
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2021-01-20
 */

// NPM modules
import React, { useEffect, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import { useParams } from 'react-router-dom';

// Material UI
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';
import { isObject } from 'shared/generic/tools';

// Theme
const useStyles = makeStyles((theme) => ({
	content: {
		flexBasis: 0,
		flexGrow: 1,
		flexShrink: 1,
		padding: '10px',
		textAlign: 'center'
	},
	error: {
		margin: '0 auto',
		textAlign: 'left',
		maxWidth: '400px',
		'& p': {
			marginBottom: '10px'
		}
	}
}));

/**
 * Calendly Single
 *
 * Displays an embedded Calendly appointment selector
 *
 * @name CalendlySingle
 * @access public
 * @param Object props Attributes sent to the component
 * @returns React.Component
 */
export default function CalendlySingle(props) {

	// State
	const [details, detailsSet] = useState(0);

	// Styles
	const classes = useStyles();

	// Hooks
	let { _key } = useParams();

	// Component did mount effect
	useEffect(() => {
		detailsSet(1);
		Rest.read('providers', 'calendly/single', {
			_key: _key
		}, {session: false}).done(res => {
			if(res.error && !res._handled) {
				if(res.error.code === 1104) {
					detailsSet(-1);
				} else {
					Events.trigger('error', JSON.stringify(res.error));
				}
			}
			if(res.data) {
				detailsSet(res.data);
			}
		});
	}, [_key]);

	// Render
	return (
		<Box className={classes.content}>
			{details === -1 &&
				<Box className={classes.error}>
					<Typography>
						Appointment key is invalid or has expired. If you need
						to reschedule your appointment please contact support by
					</Typography>
					<Typography>SMS: <Link color="secondary" href="sms:+18336253392">+1 (833) 625-3392</Link></Typography>
					<Typography>Phone: <Link color="secondary" href="tel:+18333947744">+1 (833) 394-7744</Link></Typography>
					<Typography>E-mail: <Link color="secondary" href="mailto:support@maleexcel.com">support@maleexcel.com</Link></Typography>
				</Box>
			}
			{details === 0 &&
				<Typography>Loading...</Typography>
			}
			{isObject(details) &&
				<InlineWidget
					pageSettings={{
						backgroundColor: 'ffffff',
						hideLandingPageDetails: true,
						primaryColor: 'aa1f23',
						textColor: '000000'
					}}
					prefill={{
						email: details.email,
						name: details.name,
					}}
					styles={{height: '100%'}}
					url={'https://calendly.com' + details.uri}
					utm={{
						utmCampaign: details.crm_id,
						utmSource: _key
					}}
				/>
			}
		</Box>
	);
}
