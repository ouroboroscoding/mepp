/**
 * Personal
 *
 * Personal info associated with the patient
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-16
 */

// NPM modules
import React, { useEffect, useRef, useState } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Material UI Icons
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

// Composite components
import Address from 'components/composites/Address';
import CreditCard from 'components/composites/CreditCard';

// Shared functions
import supportRequest from 'components/functions/supportRequest';

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';
import { clone, compare } from 'shared/generic/tools';

// Local modules
import Utils from 'utils';

// Theme
const useStyles = makeStyles((theme) => ({
	box: {
		margin: '0 auto',
		maxWidth: '640px'
	},
	table: {
		marginBottom: '10px',
		'& .descr': {
			width: '20%'
		},
		'& .content': {
			width: '75%'
		},
		'& .edit': {
			width: '5%',
			'& .MuiIconButton-root': {
				padding: 0
			}
		},
		'& td': {
			verticalAlign: 'top'
		},
		'& .MuiFormControlLabel-root': {
			'& .MuiIconButton-root': {
				paddingTop: 0
			},
			alignItems: 'flex-start'
		}
	},
	cc: {
		'& .rccs': {
			margin: '0'
		},
		'& .CreditCard_preview': {
			marginBottom: '10px'
		},
		'& .CreditCard_section': {
			marginBottom: '10px',
			'& .CreditCard_number, .CreditCard_name': {
				width: '145px'
			},
			'& .CreditCard_expiry': {
				marginRight: '55px',
				width: '50px'
			},
			'& .CreditCard_code': {
				width: '40px'
			},
			'& input::-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0
			},
			'& input[type=number]': {
				'-moz-appearance': 'textfield'
			}
		}
	}
}));

/**
 * Personal
 *
 * Shows personal info associated with the patient
 *
 * @name Personal
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Personal(props) {

	// Styles
	const classes = useStyles();

	// State
	let [billing, billingSet] = useState(false);
	let [email, emailSet] = useState(false);
	let [info, infoSet] = useState(null);
	let [payment, paymentSet] = useState(0);
	let [phone, phoneSet] = useState(false);
	let [shipping, shippingSet] = useState(false);
	let [urgent, urgentSet] = useState(false);

	// Refs
	let refUrgent = useRef();
	let refCC = useRef();

	// Fetch info effect
	useEffect(() => {

		// If we have a user with the correct rights
		if(props.user) {
			fetch();
		} else {
			infoSet(null);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.user]); // React to user changes

	// Update the e-mail address used for signing in
	function accountEmail(email, success) {

		// Send the update request
		Rest.update('patient', 'account/email', {
			email: email,
			url: 'https://' + process.env.REACT_APP_SELF_DOMAIN + '/verify#key='
		}).done(res => {

			// If there's an error or warning
			if(res.error && !res._handled) {
				if(res.error.code === 1900) {
					Events.trigger('error', 'This E-mail address is already in use and can\'t be saved.');
				} else {
					Events.trigger('error', JSON.stringify(res.error));
				}
			}
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// On success
			if(res.data) {
				success();
			}
		});
	}

	// Update the phone number
	function accountPhone(phone, success) {

		// Send the update request
		Rest.update('patient', 'account/phone', {
			phone: phone
		}).done(res => {

			// If there's an error or warning
			if(res.error && !res._handled) {
				Events.trigger('error', JSON.stringify(res.error));
			}
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// On success
			if(res.data) {
				success();
			}
		});
	}

	// Fetch all the info from the server
	function fetch() {

		// Fetch all info
		Rest.read('konnektive', 'customer', {
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

				// Set the info
				infoSet(res.data);
			}
		});
	}

	// Toggle billing mode
	function toggleBilling(ev) {
		if(billing) {

			// Only update if the data is different
			if(!compare(billing, info.billing)) {
				update('billing', billing, billingSet);
			} else {
				billingSet(false);
			}
		} else {
			billingSet(info.billing);
		}
	}

	// Toggle email mode
	function toggleEmail(ev) {
		if(email) {
			// Only update if the data is different
			if(!compare(email, info.email)) {
				accountEmail(email, () => {
					update('email', email, emailSet);
				});
			} else {
				emailSet(false);
			}
		} else {
			emailSet(info.email);
		}
	}

	function togglePayment(ev) {
		if(payment) {
			updatePayment();
		} else {
			paymentSet(1);
		}
	}

	// Toggle phone mode
	function togglePhone(ev) {
		if(phone) {
			// Only update if the data is different
			if(!compare(phone, info.phone)) {
				accountPhone(phone, () => {
					update('phone', phone, phoneSet);
				});
			} else {
				phoneSet(false);
			}
		} else {
			phoneSet(info.phone);
		}
	}

	// Toggle shipping mode
	function toggleShipping(ev) {
		if(shipping) {
			// Only update if the data is different
			if(!compare(shipping, info.shipping)) {

				// Is it urgent
				let urgent = refUrgent.current.checked;

				// Send the request to the service
				update('shipping', shipping, shippingSet, () => {
					if(urgent) {
						supportRequest('urgent_address');
					}
				});
			} else {
				shippingSet(false);
			}
		} else {
			shippingSet(info.shipping);
		}
	}

	// Update the info
	function update(type, data, state, success=null) {

		// Generate the request data
		let oData = {
			customerId: info.customerId,
			[type]: data
		}

		// Send the info to the server
		Rest.update('konnektive', 'customer', oData).done(res => {

			// If there's an error
			if(res.error && !res._handled) {
				if(res.error.code === 1700) {
					Events.trigger('error', 'Can not connect to USPS to verify address.');
				} else if(res.error.code === 1701) {
					Events.trigger('error', 'No such address in the USPS database. Please verify you have entered the information correctly.');
				} else if(res.error.code === 1701) {
					Events.trigger('error', 'No such city in the USPS database. Please verify you have entered the information correctly.');
				} else {
					Events.trigger('error', JSON.stringify(res.error));
				}
			}

			// If there's a warning
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// If there's data
			if(res.data) {

				// Clone the current info
				let newInfo = clone(info);

				// Update the part that changed
				newInfo[type] = data;

				// Update the state
				infoSet(newInfo);
				state(false);

				// Notify succes
				Events.trigger('success', 'Info successfully saved');

				// If the caller needs to know success
				if(success) {
					success();
				}
			}
		});
	}

	// Update payment info
	function updatePayment() {

		// Get the payment info
		let oPayment = refCC.current.value;

		// If the card is invalid
		if(!oPayment.valid && process.env.REACT_APP_ALLOW_INVALID_CC !== 'true') {
			Events.trigger('Credit card information is not valid. Please verify your info before submitting again.');
			return;
		}

		// Show loading icon
		paymentSet(2);

		// Make the request to the server
		Rest.update('patient', 'account/payment', {
			cc_number: oPayment.number,
			cc_expiry: oPayment.expiry,
			cc_cvc: oPayment.cvc
		}).done(res => {

			// If there's an error or warning
			if(res.error && !res._handled) {
				if(res.error.code === 1100) {
					Events.trigger('error', res.error.msg);
				} else {
					Events.trigger('error', JSON.stringify(res.error));
				}
			}
			if(res.warning) {
				Events.trigger('warning', JSON.stringify(res.warning));
			}

			// If we were successful
			if(res.data) {

				// Clone the current info
				let newInfo = clone(info);

				// Update payment info
				newInfo.pay = {
					type: oPayment.issuer.toUpperCase(),
					last4: oPayment.number.substr(oPayment.number.length - 4),
					expires: '20' + oPayment.expiry.substr(2,2) + '-' + oPayment.expiry.substr(0,2)
				}

				// Update the state
				infoSet(newInfo);
				paymentSet(0);

				// Success message
				Events.trigger('success', 'Your new card information has been registered. You may see a zero dollar authorization on your statement. This happens when the system checks to see if your card is valid.');
			}
		})
	}

	// If we have a user
	if(props.user) {

		// If we are loading
		if(info === null) {
			return <Box className={classes.box}>Loading...</Box>;
		} else {
			return (
				<Box className={classes.box}>
					<Table className={classes.table}>
						<TableBody>
							<TableRow>
								<TableCell className="descr">Phone Number</TableCell>
								<TableCell className="content">{phone ?
									<TextField name="phone" onChange={ev => phoneSet(ev.currentTarget.value)} type="text" value={phone} /> :
									Utils.nicePhone(info.phone)
								}</TableCell>
								<TableCell className="edit">
									<Tooltip title={(phone ? 'Save' : 'Edit') + ' Phone Number'}><IconButton onClick={togglePhone}>{phone ? <SaveIcon /> : <EditIcon />}</IconButton></Tooltip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="descr">E-Mail Address</TableCell>
								<TableCell className="content">{email ?
									<TextField name="email" onChange={ev => emailSet(ev.currentTarget.value)} type="text" value={email} /> :
									info.email
								}</TableCell>
								<TableCell className="edit">
									<Tooltip title={(email ? 'Save' : 'Edit') + ' E-mail Address'}><IconButton onClick={toggleEmail}>{email ? <SaveIcon /> : <EditIcon />}</IconButton></Tooltip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="descr">Payment</TableCell>
								<TableCell className="content">
									{payment > 0 ?
										<React.Fragment>
											<CreditCard
												allowNameChange={false}
												className={classes.cc}
												name={info.billing.firstName + ' ' + info.billing.lastName}
												ref={refCC}
											/>
											<Typography>If your billing address has changed please be sure to update it before submitting updated credit card info.</Typography>
											<hr />
											<Typography>If you do not wish to change your card online, please contact support or click the button below to have a support agent contact you as soon as one is available.</Typography>
											<Button variant="contained" color="primary" onClick={ev => supportRequest('payment', () => paymentSet(false))}>Have Support Contact You</Button>
										</React.Fragment>
									:
										<React.Fragment>
											<p>{info.pay.type}</p>
											<p>**** **** **** {info.pay.last4}</p>
											<p>{info.pay.expires.substr(5,2)}/{info.pay.expires.substr(0,4)}</p>
										</React.Fragment>
									}
								</TableCell>
								<TableCell className="edit">
									{payment === 2 ?
										<img src="/images/loading.gif" />
									:
										<Tooltip title={(payment ? 'Save' : 'Edit') + ' Payment Info'}><IconButton onClick={togglePayment}>{payment ? <SaveIcon /> : <EditIcon />}</IconButton></Tooltip>
									}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="descr">Billing Address</TableCell>
								<TableCell className="content">{billing ?
									<Address name="billing" onChange={ev => billingSet(ev.currentTarget.value)} value={billing} /> :
									<React.Fragment>
										<p>{info.billing.firstName} {info.billing.lastName}</p>
										{info.billing.company &&
											<p>{info.billing.company}</p>
										}
										<p>{info.billing.address1 + (info.billing.address2 ? (', ' + info.billing.address2) : '')}</p>
										<p>{info.billing.city}, {info.billing.state}</p>
										<p>{info.billing.postalCode}</p>
									</React.Fragment>
								}</TableCell>
								<TableCell className="edit">
									<Tooltip title={(billing ? 'Save' : 'Edit') + ' Billing Address'}><IconButton onClick={toggleBilling}>{billing ? <SaveIcon /> : <EditIcon />}</IconButton></Tooltip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="descr">Shipping Address</TableCell>
								<TableCell className="content">{shipping ?
									<Box>
										<Address name="shipping" onChange={ev => shippingSet(ev.currentTarget.value)} value={shipping} />
										<FormControlLabel
											control={<Checkbox color="primary" checked={urgent} onChange={ev => urgentSet(ev.currentTarget.checked)} inputRef={refUrgent} />}
											label="Check this box if this address change is urgent for an order that's been billed but not shipped yet"
										/>
									</Box> :
									<React.Fragment>
										<p>{info.shipping.firstName} {info.shipping.lastName}</p>
										{info.shipping.company &&
											<p>{info.shipping.company}</p>
										}
										<p>{info.shipping.address1 + (info.shipping.address2 ? (', ' + info.shipping.address2) : '')}</p>
										<p>{info.shipping.city}, {info.shipping.state}</p>
										<p>{info.shipping.postalCode}</p>
									</React.Fragment>
								}</TableCell>
								<TableCell className="edit">
									<Tooltip title={(shipping ? 'Save' : 'Edit') + ' Shipping Address'}><IconButton onClick={toggleShipping}>{shipping ? <SaveIcon /> : <EditIcon />}</IconButton></Tooltip>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Box>
			);
		}
	}
	// No user
	else {
		return <React.Fragment />
	}
}
