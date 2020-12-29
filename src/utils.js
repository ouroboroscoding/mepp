/**
 * Utils
 *
 * Shared utilities
 *
 * @author Chris Nasr <bast@maleexcel.com>
 * @copyright MaleExcelMedical
 * @created 2020-04-04
 */

// Regex
const rePhone = /^1?(\d{3})(\d{3})(\d{4})$/

/**
 * Utils
 */
const Utils = {

	date: function(ts) {
		if(typeof ts === 'number') {
			ts = new Date(ts*1000);
		}
		var Y = '' + ts.getFullYear();
		var M = '' + (ts.getMonth() + 1);
		if(M.length === 1) M = '0' + M;
		var D = '' + ts.getDate();
		if(D.length === 1) D = '0' + D;
		return Y + '/' + M + '/' + D;
	},

	datetime: function(ts) {
		if(typeof ts === 'number') {
			ts = new Date(ts*1000);
		}
		var t = ['', '', ''];
		t[0] += ts.getHours();
		if(t[0].length === 1) t[0] = '0' + t[0];
		t[1] += ts.getMinutes();
		if(t[1].length === 1) t[1] = '0' + t[1];
		t[2] += ts.getSeconds();
		if(t[2].length === 1) t[2] = '0' + t[2];
		return this.date(ts) + ' ' + t.join(':')
	},

	nicePhone: function(val) {
		let lMatch = rePhone.exec(val);
		if(!lMatch) {
			return val;
		}
		return '(' + lMatch[1] + ') ' + lMatch[2] + '-' + lMatch[3];
	},

	niceDate: function(val) {
		let d = new Date(val);
		return d.toDateString();
	}
};
export default Utils;
