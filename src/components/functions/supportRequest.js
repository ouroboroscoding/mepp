/**
 * Support Request
 *
 * Notifies support the patient wishes to be contacted
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-22
 */

// Shared communication modules
import Rest from 'shared/communication/rest';

// Shared generic modules
import Events from 'shared/generic/events';

/**
 * Support Request
 *
 * Notifies support the patient wishes to be contacted
 *
 * @name supportRequest
 * @access public
 * @param String type The type of support request
 * @param Function success The function to call upon success
 * @return void
 */
export default function supportRequest(type, success=null) {

	// Send request to service
	Rest.create('patient', 'support_request', {
		type: type
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

			// Notify success
			Events.trigger('success', 'A support agent will contact you as soon as possible');

			// Call callback if passed
			if(success) {
				success();
			}
		}
	});
}
