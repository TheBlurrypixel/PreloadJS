/*
 * DataURITagRequest
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

// namespace:
this.createjs = this.createjs || {};

(function () {
	"use strict";

	// constructor
	/**
	 * @class DataURITagRequest
	 * @param {LoadItem} loadItem
	 * @param {HTMLAudioElement|HTMLVideoElement} tag
	 * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
	 * @constructor
	 */
	// used in Imageloader
	class DataURITagRequest extends createjs.TagRequest {
		constructor(loadItem, tag, srcAttribute) {
			super(loadItem, tag, srcAttribute);
		}

		load() {
			this._tag.onload = createjs.proxy(this._handleTagComplete, this);
			this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
			this._tag.onerror = createjs.proxy(this._handleError, this);

			var evt = new createjs.Event("initialize");
			evt.loader = this._tag;

			this.dispatchEvent(evt);

			this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
			this._tag[this._tagSrcAttribute] = this._item.dataURI;

			// wdg:: Append the tag AFTER setting the src, or SVG loading on iOS will fail.
			if (this._tag.parentNode == null) {
				createjs.DomUtils.appendToBody(this._tag);
				this._addedToDOM = true;
			}
		}
	}

	createjs.DataURITagRequest = DataURITagRequest;
}());
