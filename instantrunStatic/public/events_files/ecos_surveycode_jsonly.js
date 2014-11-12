document.write("<iframe src=\"javascript:'';\" id=\"ecos_iframe\" style=\"position:absolute; left: 0; top: 0; width: 1px; height: 1px; visibility: hidden;\" title=\"\"></iframe>");
document.write("<iframe src=\"javascript:'';\" id=\"ecos_iframe2\" style=\"position:absolute; left: 0; top: 0; width: 1px; height: 1px; visibility: hidden;\" title=\"\"></iframe>");
document.write("<div id=\"ecos_surveylayer\" style=\"position:absolute; left: 0; top: 0; width: 1px; height: 1px; visibility: hidden;\" title=\"Visitor Survey (dynamically generated)\"></div>");
/*** eDigitalSurvey survey code v6.0.3.0 *****/
/* Copyright (c) 2012 eDigitalResearch Ltd   */
/* Please refer to our Terms & Conditions    */
/* for conditions of use.                    */
/* Do NOT modify this code unless directed   */
/* to do so by a member of eDigitalResearch  */
/* staff.                                    */
/*********************************************/

var ecos_data = '';
var ecos_data2 = '';
var ecos_data3 = '';
var ecos_test = 0;

var ecos_sid = 154631113;
var ecos_host = 'ecustomeropinions.com';
var ecos_cookie_domain = '';
var ecos_vault = '_';
var ecos_ver = '6030';
var ecos_nc = '';
var ecos_go = 0;
var ecos_pu = 0;
var ecos_hm = 0;
var ecos_pm = 0;
var ecos_survey_size_x = 550;
var ecos_survey_size_y = 400;
var ecos_holding_size_x = 550;
var ecos_holding_size_y = 400;
var ecos_holding_complete_flag = 1;
var ecos_jscode = '';
var ecos_runjs = 'ecos_run();';
var ecos_proportion = 1.0;
var ecos_later_mode = 0;
var ecos_device_type = 1;
var ecos_cookie_old_value = null;
var ecos_doc_domain_changed = false;
var ecos_doc_domain_holding_ie_access_document = window.location;

var brok = false;
if (parseInt(navigator.appVersion.charAt(0)) >= 4)
	brok = true;

function ecos_buildurl(destpage) {
	var ecos_url = ecos_host + '/survey/' + destpage + '.php?sid=' + ecos_sid;

	ecos_url = ((document.location.protocol == 'https:') ? 'https://' : 'http://') + ecos_url;

	if (ecos_test > 0)
		ecos_url = ecos_url + '&test=1';

	ecos_url += '&v=' + ecos_ver + '&r=' + Math.round(Math.random() * 100000);
	if (ecos_vault.index != '_')
		ecos_url += '&vlt=' + ecos_vault;

	var myvar2 = '';
	myvar = window.location.href;

	var icount = 0;
	for (i=0; i<myvar.length; i++) {
		if (myvar.charAt(i) == '/')
			icount++;
		if (icount >= 3)
			myvar2 += myvar.charAt(i);
	}

	if (ecos_data.length > 0)	ecos_url += '&data=' + ecos_data;
	if (ecos_data2.length > 0)	ecos_url += '&data2=' + ecos_data2;
	if (ecos_data3.length > 0)	ecos_url += '&data3=' + ecos_data3;

	if ((screen.width > 0) && (screen.height > 0))
		ecos_url += '&xres=' + screen.width + '&yres=' + screen.height;

	if (screen.colordepth > 0)
		ecos_url += '&depth=' + screen.colordepth;

	if (ecos_proportion < 1.0) ecos_url += '&mult=' + ecos_proportion;
	ecos_url += '&url=' + escape(myvar2.substring(0,100));
	ecos_url += '&referrer=' + escape(document.referrer.substring(0,100));

	var ck;
	if (ck = ecos_getcookie('ecos'))
		ecos_url += '&ecos_cookie=' + ck;

	if (navigator.userAgent.indexOf("Safari") >= 0)
		ecos_url += '&fullurl=' + escape(window.location.href);

	if (ecos_doc_domain_changed)
		ecos_url += '&setdocdomain=' + document.domain;

	return ecos_url;
}

function ecos_open_window(url, name, width, height) {
	var specs = ecos_device_type != 1 ? null :
		'location=0,toolbar=no,width=' + width + ',height=' + height +
			',directories=no,status=no,scrollbars=yes,resizable=yes';
	return window.open(url, name, specs);
}

function ecos_popup_popup() {

	var ua = navigator.userAgent;
	if ((ua.indexOf('NT 5.1') > 0) && (ua.indexOf(' SV1') > 0))
		return false;

	var sw = ecos_open_window(ecos_buildurl('survey'), 'surveywin', ecos_survey_size_x, ecos_survey_size_y);

	if ((ecos_pu) && (sw)) {
		sw.blur();
		sw.parent.blur();
	}

	return sw;
}


function ecos_popup_layer() {
	return ecos_request_via_iframe(ecos_buildurl('layer') + '&inlayer=1');
}


function ecos_popup_holding_showwin(content) {
	var hw = null;

	try {

		var useAccessDoc = ecos_doc_domain_changed && navigator.appName == 'Microsoft Internet Explorer';
		hw = ecos_open_window(
				useAccessDoc ? ecos_doc_domain_holding_ie_access_document : '',
				'ecos_holding_window',
				ecos_holding_size_x,
				ecos_holding_size_y);

		if (content && hw) {

			var attempts = 0, maxTime = 2000, delay = 20;
			var fn = function(hw, content) {

				if (++attempts > (maxTime / delay)) {
					hw.close();
					alert('Failed to access popup window, cannot show survey');
					return;
				}

				try {
					if (!hw.document) throw 'wait';
				}
				catch (e) {
					setTimeout(function() { fn(hw, content); }, delay);
					return;
				}

				if (!hw.document.getElementById) {
					hw.close();
					hw = null;
					ecos_layer_gosurveysize();
				}
				else {
					var e = hw.document.getElementById('ecos_holding');
					if (!e) {
						hw.document.write(content);
					}
				}
			}

			fn(hw, content);
		}
	}
	catch (e) {
		alert('ERROR: ' + e);
		if (hw) hw.close();
	}

	return hw;
}

function ecos_popup_holding() {
	var sw = null;
	if (!(sw = ecos_popup_holding_showwin())) {
		return false;
	}

	if (ecos_request_via_iframe(ecos_buildurl('holding'))) {
		return sw;
	}

	return false;
}

function ecos_request_via_iframe(url) {
	if (!document.getElementById)
		return false;

	return ecos_load_url(document.getElementById("ecos_iframe2"), url);
}

function ecos_load_url(frame, url) {
	if (ecos_doc_domain_changed) {
		el = document.createElement('script');
		el.src = url;
		el.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(el);
	} else {
		var t = '<SCR' + 'IPT LANGUAGE="Javascript" SRC="' + url + '"></SCR' + 'IPT>';
		var b, a = frame;

		if (a.contentDocument)
			b = a.contentDocument;
		else if (a.contentWindow)
			b = a.contentWindow.document;
		else if (a.document)
			b = a.document;
		else
			return false;
		b.open();
		b.write(t);
		b.close();
	}

	return true;
}


function ecos_layer_run() {
	eval(ecos_jscode);

	var check;
	if (!(check = document.getElementById('ecos_cookie_permission'))) {
		ecos_setcookie();
	}
	else {
		if (check.checked) ecos_setcookie();

		check.onclick = function() {
			if (this.checked) {
				ecos_setcookie();
			}
			else {
				ecos_unsetcookie();
			}
		};
	}
}

function ecos_getcookie(name) {
	var cks = document.cookie.split(';');
	for (var i = 0; i < cks.length; i++)
	{
		var c = cks[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(name + '=') == 0) return c.substring(name.length+1, c.length);
	}
	return '';
}

function ecos_layer_gono(delay) {
	if(delay > 0)
		setTimeout("ecos_layer_gono()", delay);
	else
		document.getElementById('ecos_surveylayer').style.visibility = 'hidden';
}


function ecos_layer_gosurveysize() {
	ecos_setcookie();
	ecos_layer_gono();
	var sw = ecos_open_window(ecos_buildurl('survey') + '&doneperm=1', 'surveywin', ecos_survey_size_x, ecos_survey_size_y);
	if ((ecos_pu) && (sw)) {
		sw.blur();
		sw.parent.blur();
	}
	return sw;
}


function ecos_layer_golater() {
	if (ecos_later_mode == 0) {
		sw = ecos_layer_gosurveysize();
		if (sw) {
			sw.blur();
			sw.parent.blur();
		}
		return sw;
	}
	else {
		ecos_setcookie();
		ecos_layer_gono();
		return ecos_popup_holding();
	}
}


var runcounter = 0;
function ecos_popup() {

	if (document.getElementById)
		if (!document.getElementById("ecos_iframe"))
			if (runcounter < 10) {
				runcounter++;
				setTimeout('ecos_popup()', 100);
				return;
			}

	if (ecos_go) {

		switch (ecos_pm) {
		case 0 : ecos_popup_popup(); break;
		case 1 : ecos_popup_layer(); break;
		case 2 : if (!ecos_popup_popup()) ecos_popup_layer(); break;
		case 3 : if (!ecos_popup_layer()) ecos_popup_popup();
		}
	}
}


function ecos_run() {
	if (ecos_go) {
		if (ecos_hm == 0)
			ecos_popup();
		else if ((ecos_hm == 1) && (brok)) {
			ecos_pm = 0;
			window.onunload = ecos_popup;
		}
	}
}


function ecos_i() {
	eval(ecos_runjs);
}

function ecos_get_2nd_level_domain()
{
	if(ecos_cookie_domain != '') {
		return escape(ecos_cookie_domain);
	}
	else
		return document.domain;
}

function ecos_setcookie() {
	var dt = new Date();
	if (ecos_nc != '')
	{
		var ck = ecos_cookie_old_value = ecos_getcookie('ecos');
		if (ck == '')
			ck = escape(ecos_nc);
		else
		{
			var cksid = ecos_nc.split('-', 2)[0];
			var ckre = new RegExp(cksid + '-\\d+');
			var ckmatches = ck.match(ckre);
			if ((!ckmatches) || ckmatches.length == 0)
				ck = ck + '.' + escape(ecos_nc);
			else
				ck = ck.replace(ckre, escape(ecos_nc));
		}
		dt.setDate(dt.getDate() + 7300);
		var domain = ecos_get_2nd_level_domain();
		document.cookie = 'ecos=' + ck + ';domain=' + domain + ';path=/;expires=' + dt.toGMTString();
	}
}

function ecos_unsetcookie() {
	if (ecos_cookie_old_value == null) return;
	var dt = new Date();
	if (ecos_cookie_old_value) {
		dt.setDate(dt.getDate() + 7300);
	}
	else {
		dt.setDate(dt.getDate() - 1);
	}
	document.cookie = 'ecos=' + ecos_cookie_old_value + ';path=/;expires=' + dt.toGMTString();
}


var runcounter2 = 0;
function ecos_load() {
	var a, b;
	if (!(a = document.getElementById("ecos_iframe"))) {
		if (++runcounter2 < 10)
			setTimeout('ecos_load()', 100);
		return;
	}

	if ((ecos_allow == null) && (typeof ecos_should_deploy != 'undefined') && (ecos_should_deploy == false)) return;

	if (document.location.hostname == document.domain) {
		try {
			var t;
			if (a.contentDocument)
				t = a.contentDocument;
			else if (a.contentWindow)
				t = a.contentWindow.document;
			else if (a.document)
				t = a.document;
			else
				ecos_doc_domain_changed = true;
		}
		catch (e) {
			ecos_doc_domain_changed = true;
		}
	}
	else
		ecos_doc_domain_changed = true;

	ecos_load_url(a, ecos_buildurl('i'));
}

var ecos_allow = null;
if (document.location.toString().match('ECOS_SHOW_SURVEY')) {
	ecos_allow = 'y';
} else if (ecos_proportion < 1.0) {
	if (Math.random() > ecos_proportion) {
		ecos_allow = 'n';
	}
}

if (ecos_allow != 'n') {
	if ((document.getElementById) && (window.frames)) {
		setTimeout(ecos_load, 1);
	} else {
		ecos_img = new Image;
		ecos_img.src = ecos_buildurl('i') + '&nosup=1';
	}
}
