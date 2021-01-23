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
import { withSnackbar } from 'notistack';

// Shared generic modules
import Events from 'shared/generic/events';

class LibraryWritersAreOftenIdiots extends React.Component {

	constructor(props) {

		// Call the parent constructor
		super(props);

		// Bind methods to this instance
		this.error = this.error.bind(this);
		this.popup = this.popup.bind(this);
		this.warning = this.warning.bind(this);
	}

	componentDidMount() {

		// Track any popup events
		Events.add('error', this.error);
		Events.add('popup', this.popup);
		Events.add('success', this.popup);
		Events.add('warning', this.warning);
	}

	componentWillUnmount() {

		// Stop tracking any popup events
		Events.remove('error', this.error);
		Events.remove('popup', this.popup);
		Events.remove('success', this.popup);
		Events.remove('warning', this.warning);
	}

	error(msg) {
		this.popup(msg, 'error');
	}

	popup(text, type='success') {

		// Add the popup
		this.props.enqueueSnackbar(text, {variant: type});
	}

	render() {
		return <div />
	}

	warning(msg) {
		this.popup(msg, 'warning');
	}
}

export default withSnackbar(LibraryWritersAreOftenIdiots);
