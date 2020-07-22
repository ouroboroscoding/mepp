

// Generic modules
import Events from '../../generic/events';
import Rest from '../../generic/rest';

// Local modules
import Utils from '../../utils';

/**
 * Support Request
 *
 * Notifies support the patient wishes to be contacted
 *
 * @name suppoerRequest
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
		if(res.error && !Utils.restError(res.error)) {
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
