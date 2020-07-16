/**
 * Theme
 *
 * Primary theme for the Site
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-07-14
 */

// Material UI
import { createMuiTheme }  from '@material-ui/core/styles'

// Create the theme
const Theme = createMuiTheme({
	typography: {
		fontFamily: 'ITCAvantGardePro-Bk'
	},
	palette: {
		primary: {
			main: '#191919',
			constrastText: '#ffffff'
		},
		secondary: {
			main: '#aa1f23',
			constrastText: '#ffffff'
		}
	}
})

// Export the theme
export default Theme
