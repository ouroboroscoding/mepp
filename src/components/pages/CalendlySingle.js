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
import { useParams } from 'react-router-dom';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';

// Theme
const useStyles = makeStyles((theme) => ({
	content: {
		flexBasis: 0,
		flexGrow: 1,
		flexShrink: 1,
		padding: '10px'
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
	const [event, eventSet] = useState(0);

	// Styles
	const classes = useStyles();

	// Hooks
	let { _key } = useParams();

	// Component did mount effect
	useEffect(() => {
		Rest.read('providers', 'calendly/single', {
			_key: _key
		}, {sesson: false}).done(res => {
			if(res.error && !res._handled) {
				if(res.error.code === 1104) {
					eventSet(-1);
				} else {
					Events.trigger('error', JSON.stringify(res.error));
				}
			}
			if(res.data) {
				eventSet(1);
				window.Calendly.initInlineWidget({
					url: 'https://calendly.com/' + res.data.uri + '?hide_gdpr_banner=1&background_color=ffffff&text_color=ffffff&primary_color=aa1f23',
					prefill: {
						name: res.data.name,
						email: res.data.email
					},
					utm: {
						utmCampaign: res.data.crm_id,
						utmSource: _key
					}
				});
			}
		});
	}, [_key]);

	// Render
	return (
		<Box className={classes.content}>
			{event === -1 &&
				<Typography>Appointment key is invalid or has expired. Please contact support via SMS at +1 (833) 394-7744 or by email at support@maleexcel.com</Typography>
			}
			{event === 0 &&
				<Typography>Loading...</Typography>
			}
			<div className="calendly-inline-widget" style={{minWidth:'320px', height:'580px'}} data-auto-load="false">

			</div>
		</Box>
	);
}
