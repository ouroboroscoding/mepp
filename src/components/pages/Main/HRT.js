/**
 * HRT
 *
 * HRT Related info
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2021-02-18
 */

// NPM modules
import React from 'react';

// Material UI
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Material UI colors
import { green, red } from '@material-ui/core/colors';

// Shared components
import HormoneSymptoms from 'shared/components/monolith/HormoneSymptoms';

// Theme
const useStyles = makeStyles((theme) => ({
	header: {
		fontSize: '1.5rem',
		fontWeight: 'bold'
	},
	symptoms: {
		'& .container': {
			maxHeight: '400px'
		},
		'& tr.dates': {
			'& .empty': {
				backgroundColor: '#fff'
			},
			'& .even,.odd': {
				backgroundColor: '#000',
				color: '#fff',
				fontWeight: 'bold',
				textAlign: 'center'
			}
		},
		'& tr.category': {
			'& td.title': {
				backgroundColor: 'inherit',
				display: 'flex',
				'& .text': {
					flexBasis: 0,
					flexShrink: 1,
					flexGrow: 1,
					fontWeight: 'bold'
				},
				'& .action': {
					flexBasis: 'auto',
					flexShrink: '0',
					flexGrow: '0',
					padding: '0',
					'& .open': {
						color: green[500]
					},
					'& .close': {
						color: red[500]
					}
				}
			}
		},
		'& tr.category.odd': {
			backgroundColor: '#dfdfdf'
		},
		'& tr.category.even': {
			backgroundColor: '#fff'
		},
		'& tr.question': {
			'& td.title': {
				paddingLeft: '50px'
			},
			'& td': {
				color: '#1155cc'
			}
		},
		'& tr.question.odd': {
			backgroundColor: '#cfe2f3'
		},
		'& tr.question.even': {
			backgroundColor: '#f2f7ff'
		},
		'& td.title': {
			backgroundColor: 'inherit',
			left: 0,
			position: 'sticky',
			zIndex: 1
		},
		'& td.date': {
			minWidth: '105px',
			textAlign: 'center'
		}
	}
}));

/**
 * HRT
 *
 * Shows latest order info
 *
 * @name HRT
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function HRT(props) {

	// Styles
	const classes = useStyles();

	// Render
	return (
		<Container>
			<Typography className={classes.header}>HRT Assessment Symptoms</Typography>
			<HormoneSymptoms
				className={classes.symptoms}
				customerId={props.user.crm_id}
			/>
		</Container>
	)
}
