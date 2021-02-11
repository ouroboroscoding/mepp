/**
 * How To
 *
 * Displays how to pages based on product and type
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2021-02-10
 */

// NPM modules
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Shared modules
import $ from 'shared/3rd/jquery.ajax';

// 404
import NotFound from '../NotFound';

/**
 * How To
 *
 * Displays pre-built HTML
 *
 * @name HowTo
 * @access public
 * @param Object props Attributes sent to the component
 * @returns React.Component
 */
export default function HowTo(props) {

	// State
	let [content, contentSet] = useState('');

	// Hooks
	let location = useLocation();

	// Load the html
	useEffect(() => {
		$.ajax({
			type: 'get',
			url: '/static' + location.pathname + '.html',
			success: (data, textStatus, XMLHttpRequest) => {
				if(data.includes('<html ')) {
					contentSet(false);
				} else {
					contentSet(data);
				}
			},
			error: xhr => {
				contentSet(false);
			}
		})
	}, [location.pathname]);

	// If content is false
	if(content === false) {
		return <NotFound />
	}

	// Render
	return (
		<div dangerouslySetInnerHTML={{__html: content}} />
	);
}
