/*
 * DataUtils
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2012 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module PreloadJS
 */

(function () {

	/**
	 * A few data utilities for formatting different data types.
	 * @class DataUtils
	 */
	var s = {};

	// static methods
	/**
	 * Parse XML using the DOM. This is required when preloading XML or SVG.
	 * @method parseXML
	 * @param {String} text The raw text or XML that is loaded by XHR.
	 * @return {XML} An XML document
	 * @static
	 */
	s.parseXML = function (text) {
		var xml = null;
		// CocoonJS does not support XML parsing with either method.

		// Most browsers will use DOMParser
		// IE fails on certain SVG files, so we have a fallback below.
		try {
			if (window.DOMParser) {
				var parser = new DOMParser();
				xml = parser.parseFromString(text, "text/xml");
			}
		} catch (e) {
		}

		// Fallback for IE support.
		if (!xml) {
			try {
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = false;
				xml.loadXML(text);
			} catch (e) {
				xml = null;
			}
		}

		return xml;
	};

	/**
	 * Parse a string into an Object.
	 * @method parseJSON
	 * @param {String} value The loaded JSON string
	 * @returns {Object} A JavaScript object.
	 */
	s.parseJSON = function (value) {
		if (value == null) {
			return null;
		}

		try {
			return JSON.parse(value);
		} catch (e) {
			// TODO; Handle this with a custom error?
			throw e;
		}
	};

	/**
	 * converts base64 string to an Array buffer for use in converting dataURI to formats we can use
	 *
	 * @method base64ToArrayBuffer
	 * @param {Function} method The function to call
	 * @param {String} base64 encoded string
	 * @returns {Object} Uint8Array ArrayBuffer
	 * @public
	 * @static
	 */
	s.base64ToArrayBuffer = function (base64) {
		var binaryString =  window.atob(base64); 
		var len = binaryString.length; 
		var bytes = new Uint8Array( len ); 
		for (var i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i); 
		return bytes.buffer; 
	}

	/**
	 * converts base64 string to an Array buffer for use in converting dataURI to formats we can use
	 *
	 * @method dataURItoBlob
	 * @param {Function} method The function to call
	 * @param {String} dataURI encoded string in dataURI format
	 * @returns {Object} Blob converted from dataURI
	 * @public
	 * @static
	 */
	s.dataURItoBlob = function (dataURI) {
		var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {type: mime});
	}
	
	createjs.DataUtils = s;

}());
