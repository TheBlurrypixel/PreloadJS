// seqcontrol.js
// (c) 2025 Michael Gochoco
// v3.7.16

// this is the library for creating SequenceObjects and Controllers
// for Adobe Animate CC
// used in conjunction with Naru.zxp plugin
// update VERSION to update number in controller get version() method

(function (sc) {
	// BEGIN SHIM MODIFICATIONS
	if(!createjs) console.log( "createjs undefined");
	var VERSION = "3.7.16";
	var SYMBOLS = createjs.SYMBOLS;
// 	var SYMBOLS = {
// 		PROTECTED_DRAW: Symbol('protectedDraw'),
// 		PROTECTED_CONTAINER_DRAW: Symbol('protectedContainerDraw'),
// 		SPRITE: Symbol('sprite'),
// 		BITMAPSWAP: Symbol('bitmapswap'),
// 		CHILDREN: Symbol('children'),
// 		WEBGLRENDERSTYLE: Symbol('_webGLRenderStyle'),
// 		SPRITESHEET: Symbol('spriteSheet'),
// 		CURRENTFRAME: Symbol('currentFrame'),
// 		TICKENABLED: Symbol('tickEnabled'),
// 		TICKCHILDREN: Symbol('tickChildren'),
// 		SPRITE_TICK: Symbol('spriteTick'),
// 		ADDCHILDAT: Symbol('addChildAt'),
// 		COMPONENT_DRAW: Symbol('componentDraw'),
// 		DETACH_FUNC: Symbol('detachFunc'),
// 		GET_FRAME: Symbol('getFrame'),
// 		AUDIO_UNLOCK: Symbol('audioUnlock'),
// 		IS_FILE_XHR: Symbol('isFileXHRSupported'),
// 		ALERT: Symbol('alert'),
// 		KNOCKOFF: Symbol('knockoff'),
// 		UPDATETIMELINE: Symbol('updateTimeline'),
// 		SPRITE_COLOR: Symbol('spriteColor'),
// 		CACHE_COLOR: Symbol('cacheColor'),
// 		WARNING_COLORS: Symbol('warningColors')
// 	};
// 	( function() {
// 		function base64ToArrayBuffer(base64) { 
// 			var binaryString =  window.atob(base64); 
// 			var len = binaryString.length; 
// 			var bytes = new Uint8Array( len ); 
// 			for (var i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i); 
// 			return bytes.buffer; 
// 		}
	
// 		function dataURItoBlob(dataURI) {
// 			var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
// 			var binary = atob(dataURI.split(',')[1]);
// 			var array = [];
// 			for (var i = 0; i < binary.length; i++) {
// 				array.push(binary.charCodeAt(i));
// 			}
// 			return new Blob([new Uint8Array(array)], {type: mime});
// 		}

// 		function hexToRgb(hex) { // convert hex to 8-bit color object
// 			// Remove the '#' if present
// 			hex = hex.replace("#", "");

// 			// Check if it's a 3-digit hex code
// 			if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

// 			// Parse hex values
// 			const r = parseInt(hex.substring(0, 2), 16);
// 			const g = parseInt(hex.substring(2, 4), 16);
// 			const b = parseInt(hex.substring(4, 6), 16);

// 			return { r, g, b };
// 		}

// 		createjs.Sound.pauseInstances = function() {
// 			if(createjs.Sound.activePlugin){
// 				var pausedInstances = [];
// 				if(createjs.Sound.activePlugin instanceof createjs.WebAudioPlugin) {
// 					createjs.Sound._instances.forEach(instance => {
// 						if(!instance.paused) {
// 							instance._pause();
// 							pausedInstances.push(instance);
// 						}
// 					});
// 					return pausedInstances;
// 				}
// 				else if(createjs.Sound.activePlugin instanceof createjs.HTMLAudioPlugin) {
// 					var pausedInstances = [];
// 					createjs.Sound._instances.forEach(instance => {
// 						instance[SYMBOLS.WASPAUSED] = instance.paused;
// 						instance.paused = true;
// 						pausedInstances.push(instance);
// 					});
// 					return pausedInstances;
// 				}
// 			}
// 			return null;
// 		};

// 		createjs.Sound.unpauseInstances = function(pausedInstances) {
// 			if(createjs.Sound.activePlugin) {
// 				if(createjs.Sound.activePlugin instanceof createjs.WebAudioPlugin)
// 					pausedInstances.forEach(instance => instance._resume());
// 				else if(createjs.Sound.activePlugin instanceof createjs.HTMLAudioPlugin)
// 					pausedInstances.forEach(instance => instance[SYMBOLS.WASPAUSED] && (instance.paused = instance[SYMBOLS.WASPAUSED]));
// 			}
// 			return null;
// 		};

// 		// overriding alert prompt because it causes webaudio context to toggle between suspend (i.e. need to press alert 2x to return to audio)
// 		// this will force an alert prompt to resume context if webaudio was running
// 		// and make sure that timers for audio instances are also paused
// 		// as window alerts do not stop setTimeout
// 		window[SYMBOLS.ALERT] = window.alert;
// 		window.alert = function() {
// 			if(createjs.Sound.activePlugin){
// 				if((createjs.Sound.activePlugin instanceof createjs.WebAudioPlugin) && createjs.Sound.activePlugin.context.state == 'running') {
// 					var pausedSounds = createjs.Sound.pauseInstances();
// 					window[SYMBOLS.ALERT].apply(window, arguments);
// 					createjs.Sound.unpauseInstances(pausedSounds);
// 					createjs.Sound.activePlugin.context.resume();
// 				}
// 				else if(createjs.Sound.activePlugin instanceof createjs.HTMLAudioPlugin) {
// 					var pausedSounds = createjs.Sound.pauseInstances();
// 					window[SYMBOLS.ALERT].apply(window, arguments);
// 					createjs.Sound.unpauseInstances(pausedSounds);
// 				}
// 				else
// 					window[SYMBOLS.ALERT].apply(window, arguments);
// 			}
// 			else
// 				window[SYMBOLS.ALERT].apply(window, arguments);
// 		};

// 		// these are flags for visualizing sprites and cached clips
// 		// createjs[SYMBOLS.WARNING_COLORS] can be set from 0 to 7
// 		// 0: none
// 		// 1: sprites from imported spritesheets (AnimateCC)*
// 		// 2: sprites from spritify()*
// 		// 3: all sprites
// 		// 4: cache*
// 		// 5: cache + sprites from imported spritesheets
// 		// 6: cache + sprites from spritify()
// 		// 7: cache + all sprites
// 		// *denotes bitmasking flag
// 		createjs[SYMBOLS.SPRITE_COLOR] = "#FF00FF";
// 		createjs[SYMBOLS.CACHE_COLOR] = "#8800FF";
// 		createjs[SYMBOLS.WARNING_COLORS] = 0;

// 		// BEGIN code to delay setTimeout before unlock audio and wait until AudioContext is running
// 		// and code to compensate for window.alert unsynching timers for looping sounds
// 		createjs.WebAudioSoundInstance.prototype._handleSoundReady = function (event) {
// 			this.gainNode.connect(createjs.WebAudioSoundInstance.destinationNode);  // this line can cause a memory leak.  Nodes need to be disconnected from the audioDestination or any sequence that leads to it.
// 			var dur = this._duration * 0.001, pos = Math.min(Math.max(0, this._position) * 0.001, dur);

// 			// dont want to start timer if AudioContext is suspended so wait until it is running
// 			if(createjs.Sound.activePlugin.context.state == 'running') {
// 				this._playbackStartTime = createjs.WebAudioSoundInstance.context.currentTime;
				
// 				this.sourceNode = this._createAndPlayAudioNode((createjs.WebAudioSoundInstance.context.currentTime - dur), pos, true);
// 				this._playbackStartTime = createjs.WebAudioSoundInstance.context.currentTime - pos;
				
// 				clearTimeout(this._soundCompleteTimeout);
// 				this._soundCompleteTimeout = setTimeout(this._endedHandler, (dur - pos) * 1000);
// 				createjs.Sound.activePlugin.context.removeEventListener('statechange', handleStateChange);
				
// 				if(this._loop != 0) this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0);					
// 			}
// 			else {
// 				var handleStateChange;
// 				createjs.Sound.activePlugin.context.addEventListener('statechange', handleStateChange = (function() {
// 					if(createjs.Sound.activePlugin.context.state == 'running') {
// 						this._playbackStartTime = createjs.WebAudioSoundInstance.context.currentTime;
							
// 						this.sourceNode = this._createAndPlayAudioNode((createjs.WebAudioSoundInstance.context.currentTime - dur), pos, true);
// 						this._playbackStartTime = createjs.WebAudioSoundInstance.context.currentTime - pos;
						
// 						clearTimeout(this._soundCompleteTimeout);
// 						this._soundCompleteTimeout = setTimeout(this._endedHandler, (dur - pos) * 1000);
// 						createjs.Sound.activePlugin.context.removeEventListener('statechange', handleStateChange);
							
// 						if(this._loop != 0) this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0);
// 					}
// 				}).bind(this));
// 			}
// 		};

// 		createjs.WebAudioSoundInstance.prototype._createAndPlayAudioNode = function(startTime, offset, playNow = false) {
// 			var audioNode = createjs.WebAudioSoundInstance.context.createBufferSource();
// 			audioNode.buffer = this.playbackResource;
// 			audioNode.connect(this.panNode);
// 			var dur = this._duration * 0.001;

// 			audioNode.startTime = playNow ? 0 : (startTime + dur); // zero for immediate playback
// 			var bufferOffset = playNow ? offset : 0; // zero for full length playback
			
// 			audioNode.start(audioNode.startTime, bufferOffset, dur);
// 			return audioNode;
// 		};	

// 		// modifying to include stoppedTimeOverlap
// 		// createjs.Sound._playInstance = function (instance, playProps) {
// 		// 	var defaultPlayProps = createjs.Sound._defaultPlayPropsHash[instance.src] || {};
// 		// 	if (playProps.interrupt == null) {playProps.interrupt = defaultPlayProps.interrupt || createjs.Sound.defaultInterruptBehavior};
// 		// 	if (playProps.delay == null) {playProps.delay = defaultPlayProps.delay || 0;}
// 		// 	if (playProps.offset == null) {playProps.offset = instance.position;}
// 		// 	if (playProps.loop == null) {playProps.loop = instance.loop;}
// 		// 	if (playProps.volume == null) {playProps.volume = instance.volume;}
// 		// 	if (playProps.pan == null) {playProps.pan = instance.pan;}

// 		// 	if (playProps.delay == 0) {
// 		// 		var ok = createjs.Sound._beginPlaying(instance, playProps);
// 		// 		if (!ok) {return false;}
// 		// 	} else {
// 		// 		//Note that we can't pass arguments to proxy OR setTimeout (IE only), so just wrap the function call.
// 		// 		// OJR WebAudio may want to handle this differently, so it might make sense to move this functionality into the plugins in the future
// 		// 		var delayTimeoutId = setTimeout(function () {
// 		// 			createjs.Sound._beginPlaying(instance, playProps);
// 		// 		}, playProps.delay);
// 		// 		instance.delayTimeoutId = delayTimeoutId;
// 		// 	}
// 		// 	// adding _stoppedTimeOverlap value for looping sounds
// 		// 	// if null or zero then sets to null
// 		// 	if (playProps.stoppedTimeOverlap)
// 		// 		instance._stoppedTimeOverlap = Math.max(0, Math.min(playProps.stoppedTimeOverlap * 0.01, 100));
// 		// 	else
// 		// 		instance._stoppedTimeOverlap = null;

// 		// 	this._instances.push(instance);

// 		// 	return true;
// 		// };

// 		// BEGIN code to support hidden tag assets
// 		// SoundLoader need to rewrite constructor to fix _tag not assigning correctly
// 		// and reassign old proto and statics
// 		var oldProto = createjs.SoundLoader.prototype;
// 		createjs.SoundLoader = function(loadItem, preferXHR) {
// 			this.AbstractMediaLoader_constructor(loadItem, preferXHR, createjs.Types.SOUND);

// 			// protected properties
// 			if (createjs.DomUtils.isAudioTag(loadItem)) {
// 				this._tag = loadItem;
// 			} else if (createjs.DomUtils.isAudioTag(loadItem.src)) {
// 				this._tag = loadItem.src;
// 			} else if (createjs.DomUtils.isAudioTag(loadItem.tag)) {
// 				this._tag = loadItem.tag;
// 			}
	 
// 			if (this._tag != null) {
// 				this._preferXHR = false;
// 			}
// 		};
// 		createjs.SoundLoader.prototype = oldProto;
// 		createjs.SoundLoader.prototype.constructor = createjs.SoundLoader;
// 		createjs.SoundLoader.canLoadItem = function (item) {
// 			return item.type == createjs.Types.SOUND;
// 		};
	
// 		// adding playEmptySound() to HTMLAudio
// 		createjs.HTMLAudioPlugin.playEmptySound  = function () {
// 			var playbackResource = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
// 			return playbackResource.play().then(() => { return playbackResource; }, () => { return playbackResource; });
// 		};
	
// 		// fix so hidden tag is our base tag in the HTMLAudioTagPool
// 		createjs.HTMLAudioPlugin.prototype.register = function (loadItem) {
// 			createjs.HTMLAudioTagPool._tags[loadItem.src] = createjs.HTMLAudioTagPool._tags[loadItem.src] || loadItem.tag;
// 			var tag = createjs.HTMLAudioTagPool.get(loadItem.src);
// 			var loader = this.AbstractPlugin_register(loadItem);
// 			loader.setTag(tag);
	 
// 			return loader;
// 		};	
	
// 		// fixing this._request may be unassigned when using tags with ImageLoader
// 		createjs.ImageLoader.prototype.load = function () {
// 			if(this._tag.src != "" && this._tag.complete) {
// 				if(!this._request) this.AbstractLoader_load();
// 				this._request._handleTagComplete();
// 				this._sendComplete();
// 				return;
// 			}
	 
// 			var crossOrigin = this._item.crossOrigin;
// 			if (crossOrigin == true) { crossOrigin = "Anonymous"; }
// 			if (crossOrigin != null && !createjs.URLUtils.isLocal(this._item)) {
// 				this._tag.crossOrigin = crossOrigin;
// 			}
	 
// 			this.AbstractLoader_load();
// 		};
	
// 		// modifyying so it does not overwrite src attribute if coming from a tag property
// 		// otherwise it may overwrite dataURI source in hidden tags
// 		createjs.MediaTagRequest.prototype.TagRequest_load = createjs.TagRequest.prototype.load = function () {
// 			this._tag.onload = createjs.proxy(this._handleTagComplete, this);
// 			this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
// 			this._tag.onerror = createjs.proxy(this._handleError, this);
	 
// 			var evt = new createjs.Event("initialize");
// 			evt.loader = this._tag;
	 
// 			this.dispatchEvent(evt);
	 
// 			this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
	 
// 			// if it this._item.dataURI exists this request is never made, we don't need to set dataURI to src
// 			// if this._item.tag exists then src is never changed
// 			if(!this._item.tag || this._item.tag !== this._tag) this._tag[this._tagSrcAttribute] = this._item.src;
	 
// 			// wdg:: Append the tag AFTER setting the src, or SVG loading on iOS will fail.
// 			if (this._tag.parentNode == null) {
// 				createjs.DomUtils.appendToBody(this._tag);
// 				this._addedToDOM = true;
// 			}
// 		};
// 		// END code to support Hidden Tags
	
// 		// BEGIN code to support Data URI assets usage in preloading
// 		// this class used in Soundloader and WebAudioLoader
// 		class dataURIRequest extends createjs.AbstractRequest {
// 			constructor(loadItem, convertToArrayBuffer = false) {
// 				super(loadItem);
// 				this._convertToArrayBuffer = convertToArrayBuffer;
// 			}
	
// 			load() {
// 				super.load();
// 				var dataURI = this._item.dataURI || this._item.tag.src;
// 				var baseData = dataURI.split(',')[1];
// 				this._response = this._convertToArrayBuffer ? base64ToArrayBuffer(baseData) : baseData;
// 				this.dispatchEvent("complete");
// 			}
// 		}
	
// 		// used in Imageloader
// 		class dataURITagRequest extends createjs.TagRequest {
// 			constructor(loadItem, tag, srcAttribute) {
// 				super(loadItem, tag, srcAttribute);
// 			}
	
// 			load() {
// 				this._tag.onload = createjs.proxy(this._handleTagComplete, this);
// 				this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
// 				this._tag.onerror = createjs.proxy(this._handleError, this);
	
// 				var evt = new createjs.Event("initialize");
// 				evt.loader = this._tag;
	
// 				this.dispatchEvent(evt);
	
// 				this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout);
// 				this._tag[this._tagSrcAttribute] = this._item.dataURI;
	
// 				// wdg:: Append the tag AFTER setting the src, or SVG loading on iOS will fail.
// 				if (this._tag.parentNode == null) {
// 					createjs.DomUtils.appendToBody(this._tag);
// 					this._addedToDOM = true;
// 				}
// 			}
// 		}
	
// 		// overriding to add datatURI option for WebAudio
// 		createjs.WebAudioLoader.prototype._createRequest = function() {
// 			if(this._item.dataURI || this._item.tag && this._item.tag.src.startsWith('data:'))
// 				this._request = new dataURIRequest(this._item, true);
// 			else {
// 				this._request = new createjs.XHRRequest(this._item, false);
// 				this._request.setResponseType("arraybuffer");			
// 			}
// 		};
	
// 		// overriding to add datatURI option for images
// 		createjs.ImageLoader.prototype._createRequest = function() {
// 			if(this._item.dataURI) {
// 				this._request = new dataURITagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
// 			} else if(!this._preferXHR) {
// 				this._request = new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
// 			} else {
// 				this._request = new createjs.XHRRequest(this._item);
// 			}
// 		};

// 		// _formatImage still gets called by both tag and XHR requests so mod createObjectURL here
// 		createjs.ImageLoader.prototype._formatImage = function (successCallback, errorCallback) {
// 			var tag = this._tag;
// 			var URL = window.URL || window.webkitURL;
	 
// 			if (!this._preferXHR) {
// 				//document.body.removeChild(tag);
// 			} else if (URL) {
// 				var objURL = URL.createObjectURL(this._item.dataURI ? dataURItoBlob(this._item.dataURI) : this.getResult(true));
// 				tag.src = objURL;
	 
// 				tag.addEventListener("load", this._cleanUpURL, false);
// 				tag.addEventListener("error", this._cleanUpURL, false);
// 			} else {
// 				tag.src = this._item.dataURI || this._item.src;
// 			}
	 
// 			if (tag.complete) {
// 				successCallback(tag);
// 			} else {
// 				tag.onload = createjs.proxy(function() {
// 					successCallback(this._tag);
// 					tag.onload = tag.onerror = null;
// 				}, this);
	 
// 				tag.onerror = createjs.proxy(function(event) {
// 					errorCallback(new createjs.ErrorEvent('IMAGE_FORMAT', null, event));
// 					tag.onload = tag.onerror = null;
// 				}, this);
// 			}
// 		};
	
// 		// SoundLoader modifications
// 		// overriding to add datatURI option for html audio
// 		createjs.SoundLoader.prototype._createRequest = function() {
// 			if(this._item.dataURI)
// 				this._request = new dataURIRequest(this._item, false);
// 			else if (!this._preferXHR) {
// 				this._request = new createjs.MediaTagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
// 			} else {
// 				this._request = new createjs.XHRRequest(this._item);
// 			}
// 		};
	
// 		// unlike other loaders in Adobe Animate, sounds are normally loaded by a register call and this does not set preferXHR
// 		// look in AbstractPlugin.register() to verify this
// 		// but we modify this as Soundloader may be called by another type of preload or in situations explicitly by the user
// 		createjs.SoundLoader.prototype._formatResult = function (loader) {
// 			this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler);
// 			this._tag.onstalled = null;
// 			if (this._preferXHR) {
// 				var URL = window.URL || window.webkitURL;
// 				var result = loader.getResult(true);s
// 				loader.getTag().src = URL.createObjectURL(loader._item.dataURI ? dataURItoBlob(result) : result);
// 			}
// 			return loader.getTag();
// 		};
	
// 		// adding handleEvent to override the AbstactMediaLoader class handleEvent to assign dataURI - needed
// 		createjs.SoundLoader.prototype.handleEvent = function (event) {
// 			switch (event.type) {
// 				case "complete":
// 					this._rawResult = event.target._response;
// 					var result = this.resultFormatter && this.resultFormatter(this);
// 					// The resultFormatter is asynchronous
// 					if (result instanceof Function) {
// 						result.call(this,
// 								createjs.proxy(this._resultFormatSuccess, this),
// 								createjs.proxy(this._resultFormatFailed, this)
// 						);
// 					// The result formatter is synchronous
// 					} else {
// 						this._result =  result || this._rawResult;
// 						if(this._item.dataURI) this._result.src = this._item.dataURI; // important
	
// 						this._sendComplete();
// 					}
// 					break;
// 				case "progress":
// 					this._sendProgress(event);
// 					break;
// 				case "error":
// 					this._sendError(event);
// 					break;
// 				case "loadstart":
// 					this._sendLoadStart();
// 					break;
// 				case "abort":
// 				case "timeout":
// 					if (!this._isCanceled()) {
// 						this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + event.type.toUpperCase() + "_ERROR"));
// 					}
// 					break;
// 			}
// 		};
		 
// 		// adding handleEvent to override the AbstactMediaLoader class handleEvent to assign dataURI - needed
// 		createjs.HTMLAudioTagPool.get = function (src) {
// 			var t = createjs.HTMLAudioTagPool._tags[src];
// 			if (t == null) {
// 				// create new base tag
// 				t = createjs.HTMLAudioTagPool._tags[src] = createjs.HTMLAudioTagPool._tagPool.get();
// 				t.src = src;
// 			} else {
// 				// get base or pool
// 				if (createjs.HTMLAudioTagPool._tagUsed[src]) {
// 					var dataURI = t.src && t.src.startsWith('data:') ? t.src :  null;
// 					t = createjs.HTMLAudioTagPool._tagPool.get();
// 					t.src = dataURI || src;
// 				} else {
// 					createjs.HTMLAudioTagPool._tagUsed[src] = true;
// 				}
// 			}
// 			return t;
// 		};
// 		// END code to support Data URI assets usage in preloading
	
// 		// enables the ability for returning a promise when creating eventHandlers
// 		createjs.EventDispatcher.prototype.addEventListenerPromise = function(eventType, inCallback) {
// 			return new Promise(res => {
// 				this.addEventListener(eventType, inCallback(res));
// 			});
// 		};
	
// 		// this is a fix for rotation
// 		createjs.Matrix2D.prototype.decompose = function(target) {
// 			// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
// 			if (target == null) { target = {}; }
// 			target.x = this.tx;
// 			target.y = this.ty;
// 			target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
// 			target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
	
// 			var skewX = Math.atan2(-this.c, this.d);
// 			var skewY = Math.atan2(this.b, this.a);
	
// 			var delta = Math.abs(1-skewX/skewY);
// 			if (delta < 0.00001) { // effectively identical, can use rotation:
// 				target.rotation = skewY/createjs.Matrix2D.DEG_TO_RAD;
// 				if (this.a < 0 && this.d >= 0) {
// 					target.rotation += (target.rotation <= 0) ? 180 : -180;
// 				}
// 				target.skewX = target.skewY = 0;
// 			} else {
// 				target.rotation = 0; // fix
// 				target.skewX = skewX/createjs.Matrix2D.DEG_TO_RAD;
// 				target.skewY = skewY/createjs.Matrix2D.DEG_TO_RAD;
// 			}
// 			return target;
// 		};
	
// 		// this is a fix for createjs 1.0.0 missing BitmapCache.getBounds which is also incorrect in 1.0.1 and above
// 		// fix has not been implemented and was due to be release in 2.0 version which has not been released
// 		createjs.DisplayObject.prototype.getBounds = function() {
// 			if (this._bounds) { return this._rectangle.copy(this._bounds); }
// 			var cache = this.bitmapCache;
// 			if (cache) {
// 				return cache.getBounds();
// 			}
// 			return null;
// 		};
	
// 		createjs.BitmapCache.prototype.getBounds = createjs.BitmapCache.prototype.getBounds || function() {
// 			this._boundRect = this._boundRect || new createjs.Rectangle();
// 			var scale = this.scale;
// 			return this._boundRect.setValues(
// 				this.x,		this.y,
// 				this.width/scale,			this.height/scale
// 			);
// 		};
// 		Object.values(createjs).forEach(prop => ( (prop.prototype instanceof createjs.DisplayObject) && (prop.prototype.getBounds && prop.prototype.getBounds.toString().includes("this.DisplayObject_getBounds") || prop.prototype._getBounds && prop.prototype._getBounds.toString().includes("this.DisplayObject_getBounds")) ) && (prop.prototype.DisplayObject_getBounds = createjs.DisplayObject.prototype.getBounds));

// 		// add mod to support Cache warning shader
// 		createjs.BitmapCache.prototype.draw = function(ctx) {
// 			if(!this.target) { return false; }
// 			if(createjs[SYMBOLS.WARNING_COLORS] & 4) {
// 				ctx.fillStyle = createjs[SYMBOLS.CACHE_COLOR];
// 				ctx.fillRect(
// 					this.x + (this._filterOffX/this.scale),		this.y + (this._filterOffY/this.scale),
// 					this._drawWidth/this.scale,					this._drawHeight/this.scale
// 				);
// 			}
// 			else {
// 				ctx.drawImage(this.target.cacheCanvas,
// 					this.x + (this._filterOffX/this.scale),		this.y + (this._filterOffY/this.scale),
// 					this._drawWidth/this.scale,					this._drawHeight/this.scale
// 				);
// 			}
// 			return true;
// 		};

// 		// add mod to support Cache warning shader for StageGL
// 		createjs.BitmapCache.prototype._drawToCache = function(compositeOperation) {
// 			var surface = this.target.cacheCanvas;
// 			var target = this.target;
// 			var webGL = this._webGLCache;
	 
// 			if (webGL){
// 				webGL.cacheDraw(target, target.filters, this);
	 
// 				// we may of swapped around which element the surface is, so we re-fetch it
// 				surface = this.target.cacheCanvas;
	 
// 				surface.width = this._drawWidth;
// 				surface.height = this._drawHeight;
// 			} else {
// 				var ctx = surface.getContext("2d");
	 
// 				if (!compositeOperation) {
// 					ctx.clearRect(0, 0, this._drawWidth+1, this._drawHeight+1);
// 				}
	 
// 				ctx.save();
			
// 				if(createjs[SYMBOLS.WARNING_COLORS] & 4) {
// 					ctx.setTransform(this.scale,0,0,this.scale, -this._filterOffX,-this._filterOffY);
// 					ctx.translate(-this.x, -this.y);
// 					ctx.fillStyle = createjs[SYMBOLS.CACHE_COLOR];
// 					ctx.fillRect(0, 0, this._drawWidth+1, this._drawHeight+1);
// 				}
// 				else {
// 					ctx.globalCompositeOperation = compositeOperation;
// 					ctx.setTransform(this.scale,0,0,this.scale, -this._filterOffX,-this._filterOffY);
// 					ctx.translate(-this.x, -this.y);
// 					target.draw(ctx, true);
// 				}
			
// 				ctx.restore();
	 
// 				 if (target.filters && target.filters.length) {
// 					this._applyFilters(ctx);
// 				}
// 			}
// 			surface._invalid = true;
// 		};
		
// 		// this is a patch for a fix found in createjs 1.0.1
// 		// plus a modification to allow the useGL: StageGL to render properly
// 		createjs.BitmapCache.prototype._updateSurface = function() {
// 			var surface;
	
// 			if (!this._options || !this._options.useGL) {
// 				surface = this.target.cacheCanvas;
	
// 				// create it if it's missing
// 				if(!surface) {
// 					surface = this.target.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
// 				}
	
// 				// now size it
// 				surface.width = this._drawWidth;
// 				surface.height = this._drawHeight;
// 				return;
// 			}
	
// 			// create it if it's missing
// 			if (!this._webGLCache) {
// 				if (this._options.useGL === "stage") {
// 					if(!(this.target.stage && this.target.stage.isWebGL)){
// 						var error = "Cannot use 'stage' for cache because the object's parent stage is ";
// 						error += this.target.stage ? "non WebGL." : "not set, please addChild to the correct stage.";
// 						throw error;
// 					}
// 					this.target.cacheCanvas = true; // will be replaced with RenderTexture, temporary positive value for old "isCached" checks
// 					this._webGLCache = this.target.stage;
	
// 				} else if(this._options.useGL === "new") {
// 					this.target.cacheCanvas = document.createElement("canvas"); // we can turn off autopurge because we wont be making textures here
// 					this._webGLCache = new createjs.StageGL(this.target.cacheCanvas, {antialias: true, transparent: true, autoPurge: -1});
// 					this._webGLCache.isCacheControlled = true;	// use this flag to control stage sizing and final output
	
// 				} else if(this._options.useGL instanceof createjs.StageGL) {
// 					this.target.cacheCanvas = true; // will be replaced with RenderTexture, temporary positive value for old "isCached" checks
// 					this._webGLCache = this._options.useGL;
// 					// actually we do not want cacheControlled for useGL: StageGL
// //					this._webGLCache.isCacheControlled = true;	// use this flag to control stage sizing and final output
	
// 				} else {
// 					throw "Invalid option provided to useGL, expected ['stage', 'new', StageGL, undefined], got "+ this._options.useGL;
// 				}
// 			}
	
// 			// now size render surfaces
// 			surface = this.target.cacheCanvas;
// 			var stageGL = this._webGLCache;
	
// 			// if we have a dedicated stage we've gotta size it
// 			if (stageGL.isCacheControlled) {
// 				surface.width = this._drawWidth;
// 				surface.height = this._drawHeight;
// 				stageGL.updateViewport(this._drawWidth, this._drawHeight);
// 			}
// 			if (this.target.filters) {
// 				// with filters we can't tell how many we'll need but the most we'll ever need is two, so make them now
// 				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
// 				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
// 			} else {
// 				// without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
// 				if (!stageGL.isCacheControlled) {
// 					stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
// 				}
// 			}
// 		};

// 		// BEGIN modifications to fix MCs getting paused when timeline completes and to be paused on single frame MCs
// 		// below is part of a fix to make sure that MC gets paused when timeline completes
// 		// and modification to fix getBounds returning error if nominal bounds is null and causes
// 		// first frame of frameBounds to be null getting through and causing error
// 		createjs.Timeline.prototype.setPosition = function(rawPosition, ignoreActions, jump, callback) {
// 			var d=this.duration, loopCount=this.loop, prevRawPos = this.rawPosition;
// 			var loop=0, t=0, end=false;
			
// 			// normalize position:
// 			if (rawPosition < 0) { rawPosition = 0; }
			
// 			if (d === 0) {
// 				// deal with 0 length tweens.
// 				end = true;
// 				if (prevRawPos !== -1) { return end; } // we can avoid doing anything else if we're already at 0.
// 			} else {
// 				loop = rawPosition/d|0;
// 				t = rawPosition-loop*d;
				
// 				end = (loopCount !== -1 && rawPosition >= loopCount*d+d);
// 				if (end) { rawPosition = (t=d)*(loop=loopCount)+d; }
// 				if (rawPosition === prevRawPos) { return end; } // no need to update
				
// 				var rev = !this.reversed !== !(this.bounce && loop%2); // current loop is reversed
// 				if (rev) { t = d-t; }
// 			}
			
// 			// set this in advance in case an action modifies position:
// 			this.position = t;
// 			this.rawPosition = rawPosition;
			
// 			this._updatePosition(jump, end);

// 			// add _end flag to signify to MC during the callback to set paused
// 			if (end) {
// 				this.paused = true; 
// 				this._end = true;
// 			}
// 			else
// 				this._end = undefined;

// 			callback&&callback(this);
			
// 			if (!ignoreActions) { this._runActions(prevRawPos, rawPosition, jump, !jump && prevRawPos === -1); }
			
// 			this.dispatchEvent("change");
// 			if (end) { this.dispatchEvent("complete"); }
// 		};

// 		// this continues a fix for setting paused when timeline completes
// 		// also fix for restoring paused state after _addManagedChild()
// 		createjs.MovieClip.prototype._resolveState = function(end) {
// 			var tl = this.timeline;
// 			this.currentFrame = tl.position;
			
// 			for (var n in this._managed) { this._managed[n] = 1; }
	
// 			var tweens = tl.tweens;
// 			for (var i=0, l=tweens.length; i<l; i++) {
// 				var tween = tweens[i],  target = tween.target;
// 				if (target === this || tween.passive) { continue; } // TODO: this assumes the actions tween from Animate has 'this' as the target. There's likely a better approach.
// 				var offset = tween._stepPosition;
	
// 				if (target instanceof createjs.DisplayObject) {
// 					// motion tween.
// 					if(target instanceof createjs.MovieClip) {
// 						var paused = target.paused;
// 						this._addManagedChild(target, offset);
// 						target.paused = paused;
// 					}
// 					else
// 						this._addManagedChild(target, offset);
// 				} else {
// 					// state tween.
// 					this._setState(target.state, offset);
// 				}
// 			}
	
// 			var kids = this.children;
// 			for (i=kids.length-1; i>=0; i--) {
// 				var id = kids[i].id;
// 				if (this._managed[id] === 1) {
// 					this.removeChildAt(i);
// 					delete(this._managed[id]);
// 				}
// 			}

// 			// if timeline complete then set paused according to timeline
// 			if(tl._end) {
// 				this.paused = true;
// 				tl._end = undefined;
// 			}
// 		};

// 		// this is a fix to force clips that are 1 frame or less to pause upon instantiation
// 		// for single frame clips one may assume they are paused but this was not true
// 		// and may cause a slow down in graphically heavy clips
// 		// caused by _tick() calling MovieClip.advance() propagating numerous calls to addManagedChild()
// 		// this fix will set paused on such clips upon instantiation
// 		// NOTE: my understanding is that _renderFirstFrame runs only on instantiation
// 		createjs.MovieClip.prototype._renderFirstFrame = function() {
// 			var tl = this.timeline, pos = tl.rawPosition;

// 			// if clip is 1 frame or less then pause it
// 			var d=tl.duration;
// 			if (!d || (tl.useTicks ? d === 1 : d <= 1000/this.framerate)) this.paused = true;

// 			tl.setPosition(0, true, true, this._bound_resolveState);
// 			tl.rawPosition = pos;
// 		};

// 		// this is a fix for stage.update() causing MovieClips to stop playing if framerate is set in its hierarchy
// 		// as stage.update propagates a tick event with no delta property which is undefined
// 		// as well as a fix for timeline paused not reflecting play state
// 		createjs.MovieClip.prototype.advance = function(time) {
// 			var independent = createjs.MovieClip.INDEPENDENT;
// 			if (this.mode !== independent) { return; } // update happens in draw for synched clips
			
// 			// if this MC doesn't have a framerate, hunt ancestors for one:
// 			var o=this, fps = o.framerate;
// 			while ((o = o.parent) && fps === null) { if (o.mode === independent) { fps = o._framerate; } }
// 			this._framerate = fps;

// 			// block advance from proceeding further if MovieClip is paused
// 			// this can increase performance in heavily nested MovieClips
// 			if (this.paused) { return; }
				
// 			// calculate how many frames to advance:
// 			// changed "time !== null" to "time != null" to fix undefined time bug
// 			var t = (fps !== null && fps !== -1 && time != null) ? time/(1000/fps) + this._t : 1;
// 			var frames = t|0;
// 			this._t = t-frames; // leftover time, save to add to next advance.
			
// 			while (frames--) { this._updateTimeline(this._rawPosition+1, false); }
// 		};

// 		// if frameBounds returns a null instead of a rectangle which is the case if the frame is empty
// 		// then MovieClip._getBounds may throw error thrown by Rectangle.copy()
// 		// Fix _getBounds() to return a null instead of throwing an error
// 		createjs.MovieClip.prototype._getBounds = function(matrix, ignoreTransform) {
// 			var bounds = this.DisplayObject_getBounds();
// 			if (!bounds) {
// 				if (this.frameBounds) {
// 					var frameRect = this.frameBounds[this.currentFrame];
// 					if(frameRect) bounds = this._rectangle.copy(frameRect);
// 				}
// 			}
// 			if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }
// 			return this.Container__getBounds(matrix, ignoreTransform);
// 		};

// 		// BEGIN modifications to fix error with VideoBuffer sometimes returning empty canvas
// 		// videoWidth or videoHeight not always set after loadedmetadata event as it is sometimes is set after playback
// 		// this may cause a "Passed-in canvas is empty" error 
// 		// Also modifying to allow rendering of video psoter when not ready
// 		// usePoster: enables using the poster attribute to retrieve an image - only valid if a poster attribute is set and the readystate < 2
// 		//			if usePoster is a callback function then it will call it with the canvas and poster image as args
// 		//			this is used mainly in the VideoObject with copyCanvas for StageGL compatibility
// 		createjs.VideoBuffer.prototype.getImage = function(posterCallback) {
// 			var canvas=this._canvas, video = this._video;
// 			if (this.readyState < 2 && !(this.usePoster && video.poster)) { return; }

// 			if (!canvas || canvas.width == 0 || canvas.height == 0) {
// 				canvas = this._canvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
// 				canvas.width = video.videoWidth;
// 				canvas.height = video.videoHeight;
// 			}

// 			if (video.readyState >= 2) {
// 				// update buffer otherwise do not update
// 				if(this._disableSeekBuffering || video.currentTime !== this._lastTime) {
// 					var ctx = canvas.getContext("2d");
// 					ctx.clearRect(0,0,canvas.width,canvas.height);
// 					ctx.drawImage(video,0,0,canvas.width,canvas.height);

// 					this._lastTime = video.currentTime;
// 				}
// 			}
// 			else if(this.usePoster && video.poster) { // update buffer with a poster image - should always be true if video.readyState < 2
// 				var img = new Image();
// 				img.onload = function() {
// 					var ctx = canvas.getContext("2d");
// 					ctx.clearRect(0,0,canvas.width,canvas.height);
// 					ctx.drawImage(img,0,0,canvas.width,canvas.height);

// 					if(posterCallback) posterCallback(canvas, img);
// 				};
// 				img.src = video.poster;
// 			}
// 			return canvas;
// 		};

// 		// further modifications to fix error with VideoBuffer returning empty canvas
// 		// drawImage put inside try block to catch errors from empty canvases
// 		// thrown errors are caught and discarded
// 		createjs.Bitmap.prototype.draw = function(ctx, ignoreCache) {
// 			if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
// 			var img = this.image, rect = this.sourceRect;
// 			var video;
// 			if (img.getImage) {
// 				video = img._video;
// 				img = img.getImage();
// 			}
// 			if (!img) { return true; }
// 			if (rect) {
// 				// some browsers choke on out of bound values, so we'll fix them:
// 				var x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
// 				if (x1 < 0) { x -= x1; x1 = 0; }
// 				if (x2 > w) { x2 = w; }
// 				if (y1 < 0) { y -= y1; y1 = 0; }
// 				if (y2 > h) { y2 = h; }
// 				try { ctx.drawImage(img, x1, y1, x2-x1, y2-y1, x, y, x2-x1, y2-y1); }
// 				catch(err) {}
// 			} else {
// 				try { 
// 					if (video) ctx.drawImage(img, 0, 0, video.videoWidth, video.videoHeight); 
// 					else ctx.drawImage(img, 0, 0);
// 				}
// 				catch(err) {}
// 			}
// 			return true;
// 		};

// 		// BEGIN CODE to support SpriteSheet rotated property and preserveRegistration for swapped sprite
// 		// further modifications in override of _appendToBatchGroup below
// 		// and modification to addMovie to block frameBounds from overriding supplied sourceRect
// 		// add mod to fill with Sprite warning shader
// 		createjs.Sprite.prototype.draw = function(ctx, ignoreCache) {
// 			if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
// 			this._normalizeFrame();
// 			var o = this.spriteSheet.getFrame(this._currentFrame|0);
// 			if (!o) { return false; }
// 			var rect = o.rect;
// 			if (rect.width && rect.height) {
// 				if(o.rotated) {					
// 					ctx.rotate(-90*Math.PI/180);
// 					ctx.translate(-rect.width, 0);
// 				}

// 				// createjs[SYMBOLS.WARNING_COLORS] can be set from 0 to 7
// 				if(createjs[SYMBOLS.WARNING_COLORS] & 1) {
// 					ctx.fillStyle = createjs[SYMBOLS.SPRITE_COLOR];
// 					ctx.fillRect(-o.regX, -o.regY, rect.width, rect.height);
// 				}
// 				else
// 					ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
// 			}
// 			return true;
// 		};

// 		// called from constructor and parses data to find rotated property and makes sure it is recorded in the entries of _frames array
// 		createjs.SpriteSheet.prototype._parseData = function(data) {
// 			var i,l,o,a;
// 			if (data == null) { return; }
	 
// 			this.framerate = data.framerate||0;
	 
// 			// parse images:
// 			if (data.images && (l=data.images.length) > 0) {
// 				a = this._images = [];
// 				for (i=0; i<l; i++) {
// 					var img = data.images[i];
// 					if (typeof img == "string") {
// 						var src = img;
// 						img = document.createElement("img");
// 						img.src = src;
// 					}
// 					a.push(img);
// 					if (!img.getContext && !img.naturalWidth) {
// 						this._loadCount++;
// 						this.complete = false;
// 						(function(o, src) { img.onload = function() { o._handleImageLoad(src); } })(this, src);
// 						(function(o, src) { img.onerror = function() { o._handleImageError(src); } })(this, src);
// 					}
// 				}
// 			}
	 
// 			// parse frames:
// 			if (data.frames == null) { // nothing
// 			} else if (Array.isArray(data.frames)) {
// 				this._frames = [];
// 				a = data.frames;
// 				for (i=0,l=a.length;i<l;i++) {
// 					var arr = a[i];
// 					this._frames.push({image:this._images[arr[4]?arr[4]:0], rect:new createjs.Rectangle(arr[0],arr[1],arr[2],arr[3]), regX:arr[5]||0, regY:arr[6]||0, oRegX:arr[8]||arr[5]||0, oRegY:arr[9]||arr[6]||0, rotated:!!arr[7], scale:arr[10] }); // inject the rotated and oReg properties
// 				}
// 			} else {
// 				o = data.frames;
// 				this._frameWidth = o.width;
// 				this._frameHeight = o.height;
// 				this._regX = o.regX||0;
// 				this._regY = o.regY||0;
// 				this._oRegX = o.oRegX||o.regX||0; // records the oRegX property as _oRegX
// 				this._oRegY = o.oRegY||o.regY||0; // records the oRegY property as _oRegY
// 				this._rotated = !!o.rotated; // records the rotated property
// 				this._scale = o.scale||1; // records the scale property
// 				this._spacing = o.spacing||0;
// 				this._margin = o.margin||0;
// 				this._numFrames = o.count;
// 				if (this._loadCount == 0) { this._calculateFrames(); }
// 			}
	 
// 			// parse animations:
// 			this._animations = [];
// 			if ((o=data.animations) != null) {
// 				this._data = {};
// 				var name;
// 				for (name in o) {
// 					var anim = {name:name};
// 					var obj = o[name];
// 					if (typeof obj == "number") { // single frame
// 						a = anim.frames = [obj];
// 					} else if (Array.isArray(obj)) { // simple
// 						if (obj.length == 1) { anim.frames = [obj[0]]; }
// 						else {
// 							anim.speed = obj[3];
// 							anim.next = obj[2];
// 							a = anim.frames = [];
// 							for (i=obj[0];i<=obj[1];i++) {
// 								a.push(i);
// 							}
// 						}
// 					} else { // complex
// 						anim.speed = obj.speed;
// 						anim.next = obj.next;
// 						var frames = obj.frames;
// 						a = anim.frames = (typeof frames == "number") ? [frames] : frames.slice(0);
// 					}
// 					if (anim.next === true || anim.next === undefined) { anim.next = name; } // loop
// 					if (anim.next === false || (a.length < 2 && anim.next == name)) { anim.next = null; } // stop
// 					if (!anim.speed) { anim.speed = 1; }
// 					this._animations.push(name);
// 					this._data[name] = anim;
// 				}
// 			}
// 		};

// 		// called from parseData and is used to set up frames if a single frame data object is given instead of array above
// 		createjs.SpriteSheet.prototype._calculateFrames = function() {
// 			if (this._frames || this._frameWidth == 0) { return; }

// 			this._frames = [];

// 			var maxFrames = this._numFrames || 100000; // if we go over this, something is wrong.
// 			var frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
// 			var spacing = this._spacing, margin = this._margin;
			
// 			imgLoop:
// 			for (var i=0, imgs=this._images; i<imgs.length; i++) {
// 				var img = imgs[i], imgW = (img.width||img.naturalWidth), imgH = (img.height||img.naturalHeight);

// 				var y = margin;
// 				while (y <= imgH-margin-frameHeight) {
// 					var x = margin;
// 					while (x <= imgW-margin-frameWidth) {
// 						if (frameCount >= maxFrames) { break imgLoop; }
// 						frameCount++;
// 						// records the rotated and oReg properties
// 						this._frames.push({
// 								image: img,
// 								rect: new createjs.Rectangle(x, y, frameWidth, frameHeight),
// 								regX: this._regX,
// 								regY: this._regY,
// 								oRegX: this._oRegX, // oRegX and oRegY assigned in _parseData 
// 								oRegY: this._oRegY,
// 								rotated: this._rotated,
// 								scale: this._scale
// 							});
// 						x += frameWidth+spacing;
// 					}
// 					y += frameHeight+spacing;
// 				}
// 			}
// 			this._numFrames = frameCount;
// 		};
	
// 		// called from _startBuild and generates dataFrames which is passed into _parseData on spriteSheet instantiation
// 		createjs.SpriteSheetBuilder.prototype._fillRow = function(frames, y, img, dataFrames, pad) {
// 			var w = this.maxWidth;
// 			var maxH = this.maxHeight;
// 			y += pad;
// 			var h = maxH-y;
// 			var x = pad;
// 			var height = 0;
// 			for (var i=frames.length-1; i>=0; i--) {
// 				var frame = frames[i];
// 				var sc = this._scale*frame.scale;
// 				var rect = frame.sourceRect;
// 				var source = frame.source;
// 				var rx = Math.floor(sc*rect.x-pad);
// 				var ry = Math.floor(sc*rect.y-pad);
// 				var _rx = Math.floor(rect.x-pad);
// 				var _ry = Math.floor(rect.y-pad);
// 				var rh = Math.ceil(sc*rect.height+pad*2);
// 				var rw = Math.ceil(sc*rect.width+pad*2);
// 				if (rw > w) { throw createjs.SpriteSheetBuilder.ERR_DIMENSIONS; }
// 				if (rh > h || x+rw > w) { continue; }
// 				frame.img = img;
// 				frame.rect = new createjs.Rectangle(x,y,rw,rh);
// 				height = height || rh;
// 				frames.splice(i,1);
// 				// added indices 8 and 9 to support _regX and _regY assigned later
// 				// added index 7 as null because we use it for rotated property
// 				dataFrames[frame.index] = [x,y,rw,rh,img,Math.round(-rx+sc*source.regX-pad),Math.round(-ry+sc*source.regY-pad),null,Math.round(-_rx+source.regX-pad),Math.round(-_ry+source.regY-pad),sc];
// 				x += rw;
// 			}
// 			return {w:x, h:height};
// 		};			

// 		// adding parameter preferSourceRect to block frameBounds from overriding a supplied sourceRect
// 		createjs.SpriteSheetBuilder.prototype.addMovieClip = function(source, sourceRect, scale, setupFunction, setupData, labelFunction, preferSourceRect) {
// 			if (this._data) { throw createjs.SpriteSheetBuilder.ERR_RUNNING; }
// 			var rects = source.frameBounds;
// 			var rect = sourceRect||source.bounds||source.nominalBounds;
// 			if (!rect&&source.getBounds) { rect = source.getBounds(); }
// 			if (!rect && !rects) { return; }
	 
// 			var i, l, baseFrameIndex = this._frames.length;
// 			var duration = source.timeline.duration;
// 			for (i=0; i<duration; i++) {
// 				var r = !preferSourceRect || !sourceRect ? (rects&&rects[i]) ? rects[i] : rect : sourceRect;
// 				this.addFrame(source, r, scale, this._setupMovieClipFrame, {i:i, f:setupFunction, d:setupData});
// 			}
// 			var labels = source.timeline._labels;
// 			var lbls = [];
// 			for (var n in labels) {
// 				lbls.push({index:labels[n], label:n});
// 			}
// 			if (lbls.length) {
// 				lbls.sort(function(a,b){ return a.index-b.index; });
// 				for (i=0,l=lbls.length; i<l; i++) {
// 					var label = lbls[i].label;
// 					var start = baseFrameIndex+lbls[i].index;
// 					var end = baseFrameIndex+((i == l-1) ? duration : lbls[i+1].index);
// 					var frames = [];
// 					for (var j=start; j<end; j++) { frames.push(j); }
// 					if (labelFunction) {
// 						label = labelFunction(label, source, start, end);
// 						if (!label) { continue; }
// 					}
// 					this.addAnimation(label, frames, true); // for now, this loops all animations.
// 				}
// 			}
// 		};

// 		// BEGIN modifications to StageGL to support webgl2
// 		var oldStage = createjs.StageGL;
// 		createjs.StageGL = function(canvas, options) {
// 			this.Stage_constructor(canvas);
	 
// 			if (options !== undefined) {
// 				if (typeof options !== "object"){ throw("Invalid options object"); }
// 				var premultiply = options.premultiply;
// 				var transparent = options.transparent;
// 				var antialias = options.antialias;
// 				var preserveBuffer = options.preserveBuffer;
// 				var autoPurge = options.autoPurge;
// 				var webgl2 = options.webgl2;
// 			}

// 			this.vocalDebug = false;
//  			this._preserveBuffer = preserveBuffer||false;
// 			this._antialias = antialias||false;
// 			this._transparent = transparent||false;
// 			this._premultiply = premultiply||false;
// 			this._autoPurge = undefined;
// 			this.autoPurge = autoPurge;	//getter/setter handles setting the real value and validating
// 			this._viewportWidth = 0;
// 			this._viewportHeight = 0;
// 			this._projectionMatrix = null;
// 			this._webGLContext = null;
// 			this._clearColor = {r: 0.50, g: 0.50, b: 0.50, a: 0.00};
// 			this._maxCardsPerBatch = createjs.StageGL.DEFAULT_MAX_BATCH_SIZE;														//TODO: write getter/setters for this
// 			this._activeShader = null;
// 			this._vertices = null;
// 			this._vertexPositionBuffer = null;
// 			this._uvs = null;
// 			this._uvPositionBuffer = null;
// 			this._indices = null;
// 			this._textureIndexBuffer = null;
// 			this._alphas = null;
// 			this._alphaBuffer = null;
// 			this._textureDictionary = [];
// 			this._textureIDs = {};
// 			this._batchTextures = [];
// 			this._baseTextures = [];
// 			this._batchTextureCount = 8;
// 			this._lastTextureInsert = -1;
// 			this._batchID = 0;
// 			this._drawID = 0;
// 			this._slotBlacklist = [];
// 			this._isDrawing = 0;
// 			this._lastTrackedCanvas = -1;
// 			this.isCacheControlled = false;
// 			this._cacheContainer = new createjs.Container();
// 			this._webgl2 = webgl2;
// 			this._initializeWebGL();
// 		}
// 		Object.assign(createjs.StageGL, oldStage); // copy statics from old StageGL
// 		createjs.StageGL.prototype = oldStage.prototype;
// 		createjs.StageGL.prototype.constructor = createjs.StageGL;

// 		createjs.StageGL.isWebGLActive = function (ctx) {
// 			return ctx &&
// 				( ctx instanceof WebGLRenderingContext &&
// 				typeof WebGLRenderingContext !== 'undefined' && "webgl" ||
// 				ctx instanceof WebGL2RenderingContext &&
// 				typeof WebGL2RenderingContext !== 'undefined' && "webgl2" );
// 		};

// 		createjs.StageGL.prototype._fetchWebGLContext = function (canvas, options) {
// 			var gl;
		
// 			try {
// 				gl = canvas.getContext(this._webgl2 ? "webgl2" : "webgl", options) || canvas.getContext("experimental-webgl", options);
// 			} catch (e) {
// 				// don't do anything in catch, null check will handle it
// 			}
		
// 			if (!gl) {
// 				var msg = "Could not initialize WebGL";
// 				console.error?console.error(msg):console.log(msg);
// 			} else {
// 				gl.viewportWidth = canvas.width;
// 				gl.viewportHeight = canvas.height;
// 			}
		
// 			return gl;
// 		};
		
// 		// need to redefine because isWebGLActive() is redefined
// 		createjs.StageGL.prototype.clear = function () {
// 			if (!this.canvas) { return; }
// 			if (createjs.StageGL.isWebGLActive(this._webGLContext)) {
// 				var gl = this._webGLContext;
// 				var cc = this._clearColor;
// 				var adjust = this._transparent ? cc.a : 1.0;
// 				// Use WebGL settings; adjust for pre multiplied alpha appropriate to scenario
// 				this._webGLContext.clearColor(cc.r * adjust, cc.g * adjust, cc.b * adjust, adjust);
// 				gl.clear(gl.COLOR_BUFFER_BIT);
// 				this._webGLContext.clearColor(cc.r, cc.g, cc.b, cc.a);
// 			} else {
// 				// Use 2D.
// 				this.Stage_clear();
// 			}
// 		};

// 		// need to redefine because isWebGLActive() is redefined
// 		createjs.StageGL.prototype.draw = function (context, ignoreCache) {
// 			if (context === this._webGLContext && createjs.StageGL.isWebGLActive(this._webGLContext)) {
// 				var gl = this._webGLContext;
// 				this._batchDraw(this, gl, ignoreCache);
// 				return true;
// 			} else {
// 				return this.Stage_draw(context, ignoreCache);
// 			}
// 		};

// 		// need to redefine because isWebGLActive() is redefined
// 		createjs.StageGL.prototype.cacheDraw = function (target, filters, manager) {
// 			if (createjs.StageGL.isWebGLActive(this._webGLContext)) {
// 				var gl = this._webGLContext;
// 				this._cacheDraw(gl, target, filters, manager);
// 				return true;
// 			} else {
// 				return false;
// 			}
// 		};

// 		// BEGIN modifications to properly support swapped sprites in StageGL
// 		// cacheDraw is called in StageGL will call the default spriteSheet.getFrame()
// 		// if is regular draw it will call the modded spriteSheet.getFrame_swapped()
// 		// also modified to support useGL: StageGL option in BitmapCache define
// 		createjs.StageGL.prototype._cacheDraw = function (gl, target, filters, manager) {
// 			var renderTexture;
// 			var shaderBackup = this._activeShader;
// 			var blackListBackup = this._slotBlacklist;
// 			var lastTextureSlot = this._maxTextureSlots-1;
// 			var wBackup = this._viewportWidth, hBackup = this._viewportHeight;
	 
// 			// protect the last slot so that we have somewhere to bind the renderTextures so it doesn't get upset
// 			this.protectTextureSlot(lastTextureSlot, true);
	 
// 			// create offset container for drawing item
// 			var mtx = target.getMatrix();
// 			mtx = mtx.clone();
// 			mtx.scale(1/manager.scale, 1/manager.scale);
// 			mtx = mtx.invert();
// 			mtx.translate(-manager.offX/manager.scale*target.scaleX, -manager.offY/manager.scale*target.scaleY);
// 			var container = this._cacheContainer;
// 			container.children = [target];
// 			container.transformMatrix = mtx;
	 
// 			this._backupBatchTextures(false);
	 
// 			if (filters && filters.length) {
// 				this._drawFilters(target, filters, manager);
// 			} else {
// 				// Fixing below for use of different StageGL for target.cacheCanvas needs
// 				// to fill renderTexture and render to StageGL
// 				// is this for another stage or mine?
// 				if (this.isCacheControlled) {
// 					// draw item to canvas				I -> C
// 					gl.clear(gl.COLOR_BUFFER_BIT);
// 					if(target.bitmapCache && target.bitmapCache._options.useGL && target.bitmapCache._options.useGL)
// 						this._batchDraw(container, gl, true, true, target.bitmapCache._options.useGL);
// 					else
// 						this._batchDraw(container, gl, true, true);
// 				} else {
// 					gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
// 					target.cacheCanvas = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
// 					renderTexture = target.cacheCanvas;
	 
// 					// draw item to render texture		I -> T
// 					gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
// 					this.updateViewport(manager._drawWidth, manager._drawHeight);
// 					this._projectionMatrix = this._projectionMatrixFlip;
// 					gl.clear(gl.COLOR_BUFFER_BIT);
// 					if(target.bitmapCache && target.bitmapCache._options.useGL && target.bitmapCache._options.useGL)
// 						this._batchDraw(container, gl, true, true, target.bitmapCache._options.useGL);
// 					else
// 						this._batchDraw(container, gl, true, true);
	 
// 					gl.bindFramebuffer(gl.FRAMEBUFFER, null);
// 					this.updateViewport(wBackup, hBackup);
// 				}
// 			}
	 
// 			this._backupBatchTextures(true);
	 
// 			this.protectTextureSlot(lastTextureSlot, false);
// 			this._activeShader = shaderBackup;
// 			this._slotBlacklist = blackListBackup;
// 		};
	 
// 		// batchDraws called from cacheDraw will get fromeCacheDraw
// 		createjs.StageGL.prototype._batchDraw = function (sceneGraph, gl, ignoreCache, fromCacheDraw, useGL) {
// 			if (this._isDrawing > 0) {
// 				this._drawBuffers(gl);
// 			}
// 			this._isDrawing++;
// 			this._drawID++;
	 
// 			this.batchCardCount = 0;
// 			this.depth = 0;
	 
// 			this._appendToBatchGroup(sceneGraph, gl, new createjs.Matrix2D(), this.alpha, ignoreCache, fromCacheDraw, useGL);
	 
// 			this.batchReason = "drawFinish";
// 			this._drawBuffers(gl);								// <--------------------------------------------------------
// 			this._isDrawing--;
// 		};
	
// 		// _appendToBatchGroup called from _batchDraw
// 		// if fromCacheDraw swapped sprites will call regular getFrame() otherwise calls getFrame_swapped()
// 		createjs.StageGL.prototype._appendToBatchGroup = function (container, gl, concatMtx, concatAlpha, ignoreCache, fromCacheDraw, useGL, knockoff) {
// 			// sort out shared properties
// 			if (!container._glMtx) { container._glMtx = new createjs.Matrix2D(); }
// 			var cMtx = container._glMtx;
// 			cMtx.copy(concatMtx);
// 			if (container.transformMatrix) {
// 				cMtx.appendMatrix(container.transformMatrix);
// 			} else {
// 				cMtx.appendTransform(
// 					container.x, container.y,
// 					container.scaleX, container.scaleY,
// 					container.rotation, container.skewX, container.skewY,
// 					container.regX, container.regY
// 				);
// 			}
	 
// 			// sub components of figuring out the position an object holds
// 			var subL, subT, subR, subB;
	 
// 			// actually apply its data to the buffers
// //			var l = container.children.length;
// 			var knockOrContainer = knockoff || container;
// 			var l = knockOrContainer.children.length;

// 			for (var i = 0; i < l; i++) {
// //				var item = container.children[i];
// 				var item = knockOrContainer.children[i];
	 
// 				if (!(item.visible && concatAlpha)) { continue; }

// //				if (!item.cacheCanvas || ignoreCache) {
// 				if (!(item[SYMBOLS.KNOCKOFF] && item[SYMBOLS.KNOCKOFF].cacheCanvas) && (!item.cacheCanvas || ignoreCache)) {
// 					if (item._handleDrawEnd && !(SYMBOLS.BITMAPSWAP in item)) { 
// 						item.draw();
// 						continue;
// 					} // draw Adobe Animate components

// 					if (item._updateState){
// 						item._updateState();
// 					}
// 					if (item[SYMBOLS.KNOCKOFF]) {
// 						item[SYMBOLS.KNOCKOFF]._updateState && item[SYMBOLS.KNOCKOFF]._updateState();
// 						if (item[SYMBOLS.KNOCKOFF].children) {
// 							this._appendToBatchGroup(item, gl, cMtx, item.alpha * concatAlpha, ignoreCache, fromCacheDraw, useGL, item[SYMBOLS.KNOCKOFF]);
// 							continue;
// 						}
// 					}
// 					if (item.children) {
// 						this._appendToBatchGroup(item, gl, cMtx, item.alpha * concatAlpha, ignoreCache, fromCacheDraw, useGL);
// 						continue;
// 					}
// 				}
	 
// 				// check for overflowing batch, if yes then force a render
// 				// TODO: DHG: consider making this polygon count dependant for things like vector draws
// 				if (this.batchCardCount+1 > this._maxCardsPerBatch) {
// 					this.batchReason = "vertexOverflow";
// 					this._drawBuffers(gl);					// <------------------------------------------------------------
// 					this.batchCardCount = 0;
// 				}
	 
// 				// keep track of concatenated position
// 				if (!item._glMtx) { item._glMtx = new createjs.Matrix2D(); }
// 				var iMtx = item._glMtx;
// 				iMtx.copy(cMtx);
// 				if (item.transformMatrix) {
// 					iMtx.appendMatrix(item.transformMatrix);
// 				} else {
// 					iMtx.appendTransform(
// 						item.x, item.y,
// 						item.scaleX, item.scaleY,
// 						item.rotation, item.skewX, item.skewY,
// 						item.regX, item.regY
// 					);
// 				}
	 
// 				var uvRect, texIndex, image, frame, texture, src;
// 				var knockoffCached = item[SYMBOLS.KNOCKOFF] && item[SYMBOLS.KNOCKOFF].cacheCanvas;
// 				var itemCaching = item.cacheCanvas && item.bitmapCache && !ignoreCache;
// 				var useCache = itemCaching || knockoffCached ;

// 				var itemIsSpritified = false;
// 				var itemIsCached = false;
	 
// 				// item[SYMBOLS.KNOCKOFF] should always have a cacheCanvas because item[SYMBOLS.KNOCKOFF] should
// 				// always be a MovieClip and without cache it would be filtered out by this point as it should have children
// 				// and if it did not have children it would be empty and would shortcircuit out below
// 				// otherwise get the image data, or abort if not present
// 				if (!itemCaching && knockoffCached) { // if item is cached then we use that cache otherwise if knockoff cached we use that cache
// 					image = ignoreCache?false:item[SYMBOLS.KNOCKOFF].cacheCanvas;
// 					itemIsCached = true;
// 				}
// 				else if (item._webGLRenderStyle === 2 || useCache) {			// BITMAP / Cached Canvas
// 					var cacheCanvas = ignoreCache?false:item.cacheCanvas;
// 					if(cacheCanvas) itemIsCached = true;
// 					image = cacheCanvas || item.image;
// 				} else if (item._webGLRenderStyle === 1) {								// SPRITE
// 					if(!(fromCacheDraw && !useGL) && item[SYMBOLS.SPRITE] && item[SYMBOLS.SPRITE][SYMBOLS.GET_FRAME]) {
// 						frame = item[SYMBOLS.SPRITE][SYMBOLS.GET_FRAME](item.currentFrame);
// 						itemIsSpritified = true;
// 					}
// 					else
// 						frame = item.spriteSheet.getFrame(item.currentFrame);
// 					// frame = !fromCacheDraw && item[SYMBOLS.SPRITE] && item[SYMBOLS.SPRITE][SYMBOLS.GET_FRAME] ? item[SYMBOLS.SPRITE][SYMBOLS.GET_FRAME](item.currentFrame) : item.spriteSheet.getFrame(item.currentFrame);
// 					if (frame === null) { continue; }
// 					image = frame.image;
// 				} else {																// MISC (DOM objects render themselves later)
// 					continue;
// 				}
// 				if (!image) { continue; }
	 
// 				var uvs = this._uvs;
// 				var vertices = this._vertices;
// 				var texI = this._indices;
// 				var alphas = this._alphas;
	 
// 				// calculate texture
// 				if (image._storeID === undefined) { // modified to
// 					// this texture is new to us so load it and add it to the batch
// 					texture = this._loadTextureImage(gl, image);
// 				} else {
// 					// fetch the texture (render textures know how to look themselves up to simplify this logic)
// 					texture = this._textureDictionary[image._storeID];
	 
// 					if (!texture){ //TODO: this should really not occur but has due to bugs, hopefully this can be removed eventually
// 						if (this.vocalDebug){ console.log("Image source should not be lookup a non existent texture, please report a bug."); }
// 						continue;
// 					}
	 
// 					// put it in the batch if needed
// 					if (texture._batchID !== this._batchID) {
// 						this._insertTextureInBatch(gl, texture);
// 					}
// 				}
// 				if(itemIsSpritified) texture.isSpritified = true;
// 				if(itemIsCached) texture.isCached = true;
// 				texIndex = texture._activeIndex;
// 				image._drawID = this._drawID;
// 				var rotated = false; // hoisting rotated variable
	 
// 				if (item._webGLRenderStyle === 2 || useCache) {			// BITMAP / Cached Canvas / or Knockoff Cache
// 					if (!useCache && item.sourceRect) {
// 						// calculate uvs
// 						if (!item._uvRect) { item._uvRect = {}; }
// 						src = item.sourceRect;
// 						uvRect = item._uvRect;
// 						uvRect.t = (src.y)/image.height;
// 						uvRect.l = (src.x)/image.width;
// 						uvRect.b = (src.y + src.height)/image.height;
// 						uvRect.r = (src.x + src.width)/image.width;
	 
// 						// calculate vertices
// 						subL = 0;							subT = 0;
// 						subR = src.width+subL;				subB = src.height+subT;
// 					} else {
// 						// calculate uvs
// 						uvRect = createjs.StageGL.UV_RECT;
// 						// calculate vertices
// 						if (useCache) {
// 							src = itemCaching ? item.bitmapCache : item[SYMBOLS.KNOCKOFF].bitmapCache; // if item is cached use that otherwise it will be knockoff cache use that
// 							subL = src.x+(src._filterOffX/src.scale);	subT = src.y+(src._filterOffY/src.scale);
// 							subR = (src._drawWidth/src.scale)+subL;		subB = (src._drawHeight/src.scale)+subT;
// 						} else {
// 							subL = 0;						subT = 0;
// 							subR = image.width+subL;		subB = image.height+subT;
// 						}
// 					}
// 				} else if (item._webGLRenderStyle === 1) {											// SPRITE
// 					rotated = !!frame.rotated; // init rotated variable - spritified frames should not have this
// 					var rect = frame.rect;
	 
// 					// calculate uvs
// 					uvRect = frame.uvRect;
// 					if (!uvRect) {
// 						uvRect = createjs.StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false);
// 					}

// 					// non-spritified sprite frames do not have these properties so make sure you make allowance for that
// 					var preserveRegistration = frame.preserveRegistration;
// 					var preserveSize = frame.preserveSize;
// 					var trim = frame.trim || 0;
// 					var frameScale = frame.scale || 1;

// 					var width = rect.width - trim;
// 					var height = rect.height - trim;

// 					var regX = frame.regX;
// 					var regY = frame.regY;
// 					var scale = 1;

// 					// calculate vertices
// 					if(preserveSize) scale = 1/frameScale;
// 					if(preserveRegistration) {
// 						regX = frame.oRegX;
// 						regY = frame.oRegY;
// 					}

// 					width *= scale;
// 					height *= scale;
	
// 					subL = -regX;								subT = -regY;

// 					// if rotated swap width and height
// 					if(rotated) {
// 						subR = height-regX;					subB = width-regY;
// 					}
// 					else {
// 						subR = width-regX;					subB = height-regY;
// 					}
// 				}
	 
// 				// These must be calculated here else a forced draw might happen after they're set
// 				var offV1 = this.batchCardCount*createjs.StageGL.INDICIES_PER_CARD;		// offset for 1 component vectors
// 				var offV2 = offV1*2;											// offset for 2 component vectors
	 
// 				//DHG: See Matrix2D.transformPoint for why this math specifically
// 				// apply vertices
// 				// if rotated the bounding box rotates counter clockwise and the upper right becomes the upper left with that corner located where upper left corner was located
// 				if(!rotated) {
// 					vertices[offV2] =		subL *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+1] =		subL *iMtx.b + subT *iMtx.d +iMtx.ty;
// 					vertices[offV2+2] =		subL *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+3] =		subL *iMtx.b + subB *iMtx.d +iMtx.ty;
// 					vertices[offV2+4] =		subR *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+5] =		subR *iMtx.b + subT *iMtx.d +iMtx.ty;
// 					vertices[offV2+10] =	subR *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+11] =	subR *iMtx.b + subB *iMtx.d +iMtx.ty;
// 				}
// 				else {
// 					vertices[offV2] =		subL *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+1] =		subL *iMtx.b + subB *iMtx.d +iMtx.ty;
// 					vertices[offV2+2] =		subR *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+3] =		subR *iMtx.b + subB *iMtx.d +iMtx.ty;
// 					vertices[offV2+4] =		subL *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+5] =		subL *iMtx.b + subT *iMtx.d +iMtx.ty;
// 					vertices[offV2+10] =	subR *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+11] =	subR *iMtx.b + subT *iMtx.d +iMtx.ty;
// 				}
// 				vertices[offV2+6] =		vertices[offV2+2];							vertices[offV2+7] =		vertices[offV2+3];
// 				vertices[offV2+8] =		vertices[offV2+4];							vertices[offV2+9] =		vertices[offV2+5];
	 
// 				// apply uvs
// 				uvs[offV2] =	uvRect.l;			uvs[offV2+1] =	uvRect.t;
// 				uvs[offV2+2] =	uvRect.l;			uvs[offV2+3] =	uvRect.b;
// 				uvs[offV2+4] =	uvRect.r;			uvs[offV2+5] =	uvRect.t;
// 				uvs[offV2+6] =	uvRect.l;			uvs[offV2+7] =	uvRect.b;
// 				uvs[offV2+8] =	uvRect.r;			uvs[offV2+9] =	uvRect.t;
// 				uvs[offV2+10] =	uvRect.r;			uvs[offV2+11] =	uvRect.b;
	 
// 				// apply texture
// 				texI[offV1] = texI[offV1+1] = texI[offV1+2] = texI[offV1+3] = texI[offV1+4] = texI[offV1+5] = texIndex;
	 
// 				// apply alpha
// 				alphas[offV1] = alphas[offV1+1] = alphas[offV1+2] = alphas[offV1+3] = alphas[offV1+4] = alphas[offV1+5] = item.alpha * concatAlpha;
	 
// 				this.batchCardCount++;
// 			}
// 		};

// 		// to support Sprite and Cache warning colors in StageGL
// 		createjs.StageGL.prototype._drawBuffers = function (gl) {
// 			if (this.batchCardCount <= 0) { return; }	// prevents error logs on stages filled with un-renederable content.
	 
// 			if (this.vocalDebug) {
// 				console.log("Draw["+ this._drawID +":"+ this._batchID +"] : "+ this.batchReason);
// 			}
// 			var shaderProgram = this._activeShader;
// 			var vertexPositionBuffer = this._vertexPositionBuffer;
// 			var textureIndexBuffer = this._textureIndexBuffer;
// 			var uvPositionBuffer = this._uvPositionBuffer;
// 			var alphaBuffer = this._alphaBuffer;
	 
// 			gl.useProgram(shaderProgram);
	 
// 			gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
// 			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
// 			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._vertices);
	 
// 			gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
// 			gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, textureIndexBuffer.itemSize, gl.FLOAT, false, 0, 0);
// 			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._indices);
	 
// 			gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
// 			gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
// 			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._uvs);
	 
// 			gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
// 			gl.vertexAttribPointer(shaderProgram.alphaAttribute, alphaBuffer.itemSize, gl.FLOAT, false, 0, 0);
// 			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._alphas);
	 
// 			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, this._projectionMatrix);
	 
// 			var warningColor = createjs[SYMBOLS.WARNING_COLORS];
// 			if(warningColor & 7) {
// 				var importedSprites = warningColor & 1;
// 				var spritifiedSprites = warningColor & 2;
// 				var cachedClip = warningColor & 4;

// 				var spriteWarnTexture = gl.createTexture();
// 				gl.bindTexture(gl.TEXTURE_2D, spriteWarnTexture);
// 				var color = hexToRgb(createjs[SYMBOLS.SPRITE_COLOR])
// 				var spriteWarnPixel = new Uint8Array([color.r, color.g, color.b, 255]);
// 				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, 
// 							  gl.RGBA, gl.UNSIGNED_BYTE, spriteWarnPixel);

// 				var cacheWarnTexture = gl.createTexture();
// 				gl.bindTexture(gl.TEXTURE_2D, cacheWarnTexture);
// 				var color = hexToRgb(createjs[SYMBOLS.CACHE_COLOR])
// 				var cacheWarnPixel = new Uint8Array([color.r, color.g, color.b, 255]);
// 				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, 
// 							  gl.RGBA, gl.UNSIGNED_BYTE, cacheWarnPixel);

// 				for (var i = 0; i < this._batchTextureCount; i++) {
// 					var texture = this._batchTextures[i];
// 					gl.activeTexture(gl.TEXTURE0 + i);

// 					// choose warning texture or normal shader depending on WARNING_COLORS state
// 					var resolvedTexture = cachedClip && texture.isCached ? cacheWarnTexture : spritifiedSprites && texture.isSpritified || importedSprites && !texture.isSpritified ? spriteWarnTexture : texture;
// 					gl.bindTexture(gl.TEXTURE_2D, resolvedTexture);  // use the white texture			
// 					this.setTextureParams(gl, resolvedTexture.isPOT);
// 				}
// 			}
// 			else {
// 				for (var i = 0; i < this._batchTextureCount; i++) {
// 					var texture = this._batchTextures[i];
// 					gl.activeTexture(gl.TEXTURE0 + i);
// 					gl.bindTexture(gl.TEXTURE_2D, texture);
// 					this.setTextureParams(gl, texture.isPOT);
// 				}				
// 			}

// 			gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount*createjs.StageGL.INDICIES_PER_CARD);
// 			this._batchID++;
// 		};		
// 	})();
	
	// function restoreDefaultAlert() {
	// 	window.alert = window[SYMBOLS.ALERT] || window.alert;
	// 	delete window[SYMBOLS.ALERT];
	// }

	function disableTestWebAudioXHR(supportValue = true) {
		if(!(SYMBOLS.IS_FILE_XHR in createjs.WebAudioPlugin)) createjs.WebAudioPlugin[SYMBOLS.IS_FILE_XHR] = createjs.WebAudioPlugin._isFileXHRSupported;
		createjs.WebAudioPlugin._isFileXHRSupported = function() { return supportValue; };
	}
	
	function enableTestWebAudioXHR() {
		if(SYMBOLS.IS_FILE_XHR in createjs.WebAudioPlugin) {
			createjs.WebAudioPlugin._isFileXHRSupported = createjs.WebAudioPlugin[SYMBOLS.IS_FILE_XHR];
			delete createjs.WebAudioPlugin[SYMBOLS.IS_FILE_XHR];				
		}
	}

	function unlockAudio(audioTagsToUnlock) {
		const userGestureEvents = [
			'click',
			'contextmenu',
			'auxclick',
			'dblclick',
			'mousedown',
			'mouseup',
			'pointerup',
			'touchstart',
			'touchend',
			'keydown',
			'keyup'
		];
		if(createjs.Sound.activePlugin instanceof createjs.WebAudioPlugin && createjs.Sound.activePlugin.context.state == 'suspended') {
			const unlock = () => {
				createjs.WebAudioPlugin.playEmptySound(); // play sound to unlock
				createjs.Sound.activePlugin.context.resume().then(() => { // and resume to unlock
					userGestureEvents.forEach(eventName => {
						document.removeEventListener(eventName, unlock);
					});
				})
			};
			userGestureEvents.forEach(eventName => {
				document.addEventListener(eventName, unlock);
			});
		}
		else if(createjs.Sound.activePlugin instanceof createjs.HTMLAudioPlugin && audioTagsToUnlock.size > 0) {
			const unlock = () => {
				userGestureEvents.forEach(eventName => {
					document.removeEventListener(eventName, unlock);
				});

				// play all sound tags via ID that are in seqcontroltree, sound tags not in tree may not get unlocked
				audioTagsToUnlock.forEach(aud => {
					var snd = createjs.Sound.createInstance(aud);
					var playbackRes = createjs.HTMLAudioTagPool.get(snd.src);
					playbackRes.play()
					.catch(() => {})
					.finally(() => {
						playbackRes.pause();
						createjs.HTMLAudioTagPool.set(snd.src, playbackRes);
					})
				})
			};
			userGestureEvents.forEach(eventName => {
				document.addEventListener(eventName, unlock);
			});	
		}	
	}	
	// END SHIM MODIFICATIONS
	
	var mix = sc => new Mixer(sc);
	class Mixer {
		constructor(sc) {
			this.superclass = sc;
		}
		with(...mixins) {
			return mixins.reduce((c, mixin) => mixin(c), this.superclass);
		}
	}
	
	class GesturableBase extends createjs.EventDispatcher {
		constructor(inClip) {
			super();
			this.button = inClip;
			this.MAX_STACK = 5;
	
			// fractions:
			// base: multiplier for all
			// offset: how much finger movements transform
			// fade: how much fade-out tweening after releasing fingers transform
			this.fraction = { base: 1, offset: {}, fade: {} };
			this._activeFingers = 0;
	
			// finger positions
			this._fingers = new Map();
	
			// stored movements, updated on every tick
			this._stack = [];
			this._mousedown = this._mousedown.bind(this);
			this._pressmove = this._pressmove.bind(this);
			this._pressup = this._pressup.bind(this);
			this.dispatchOnPressUp = false;
		}
	
		init()
		{
			this.button.addEventListener('mousedown', this._mousedown);
			this.button.addEventListener('pressmove', this._pressmove);
			this.button.addEventListener('pressup', this._pressup);
		}
	
		remove() {
			this.removeEventListeners;
		}
	
		removeEventListeners() {
			this.button.removeEventListener('mousedown', this._mousedown);
			this.button.removeEventListener('pressmove', this._pressmove);
			this.button.removeEventListener('pressup', this._pressup);
		}
	
		// store initial touchpoint-position
		_mousedown(event)
		{
			if(!event.pointerID)
				event.pointerID = -1;
	
			if(this.button.parent) {
				var fingerPos = this.button.parent.globalToLocal(event.stageX, event.stageY);
				this._fingers.set(event.pointerID, {
					start: { x: fingerPos.x, y: fingerPos.y },
					current: { x: fingerPos.x, y: fingerPos.y },
					old: { x: fingerPos.x, y: fingerPos.y }
				});
		
				this._calculateActiveFingers();
				this.dispatchEvent('start');
			}
		}
	
		// update touchpoint-positions
		_pressmove(event)
		{
			if(!event.pointerID)
				event.pointerID = -1;
	
			if(this.button.parent) {
				this.button.parent.globalToLocal(event.stageX, event.stageY, this._fingers.get(event.pointerID).current);
				this._calculateActiveFingers();
				this._registerChange(event.pointerID);
			}
		}
	
		_registerChange(pointerID) {
			this.dispatchEvent('update');
	
			var pointerID = this._fingers.get(pointerID)
			pointerID.old.x = pointerID.current.x;
			pointerID.old.y = pointerID.current.y;
	
			var stack = {};
			stack.x = this.button.x;
			stack.y = this.button.y;
			stack.scaleX = this.button.scaleX;
			stack.scaleY = this.button.scaleY;
			stack.rotation = this.button.rotation;
	
			// auto-stack container-properties regardless of use in subclasses
			if(this._stack.length > this.MAX_STACK)
				this._stack.shift();
			this._stack.push(stack);
		}
	
		// delete old and unused finger-positions
		_pressup(event)
		{
			if(!event.pointerID)
				event.pointerID = -1;
	
			if(this._fingers.has(event.pointerID))
				this._fingers.delete(event.pointerID)
	
			this._calculateActiveFingers();
		}
	
		// calculates currently active fingers, can be used later in subclasses
		_calculateActiveFingers()
		{
			this._activeFingers = this._fingers.size;
		}
	}
	
	//class GestureMove extends createjs.EventDispatcher {
	var GestureMove = superclass => class extends superclass {
		constructor(inClip) {
			super(inClip);
			// stored fade-out-tween
			this._moveTween = null;
	
			this._dispatchMoveComplete = this._dispatchMoveComplete.bind(this);
			this._dispatchTweenMoveUpdate = this._dispatchTweenMoveUpdate.bind(this);
			this._moveStartTransform = this._moveStartTransform.bind(this);
			this._moveUpdate = this._moveUpdate.bind(this);
			this._moveStopTransform = this._moveStopTransform.bind(this);
	
			this.move = false;
			this.initialPosition = {x:0, y:0};
			this.moveLimit = {x:1, y:1};
			this._moveHasPressUpListener = false;
			this._isBeingMoved = false;
		}
	
		get isBeingMoved() {
			return this._isBeingMoved;
		}
	
		get isMoveDrifting() {
			return !!this._moveTween;
		}
	
		get isMoving() {
			return this.isBeingMoved || this.isMoveDrifting;
		}
	
		set moveLimit(inPoint) {
			this._moveLimit = {x: inPoint.x, y: inPoint.y};
		}
	
		get moveLimit() {
			return {x: this._moveLimit.x, y: this._moveLimit.y};
		}
	
		moveInit() {
			if(this.move) {
				this.fraction.offset.x = 1;
				this.fraction.offset.y = 1;
	
				this.fraction.fade.x = 1;
				this.fraction.fade.y = 1;
	
				this.initialPosition = {x:0, y:0};
	
				this.addEventListener('start', this._moveStartTransform);
				this.addEventListener('update', this._moveUpdate);
				this._moveHasPressUpListener = false;
				this._isBeingMoved = false;
			}
		}
	
		moveReset() {
			this.moveRemoveEventListeners();
			this.moveDispatchRemoveEventListners();
		}
	
		moveRemoveEventListeners() {
			this.removeEventListener('start', this._moveStartTransform);
			this.removeEventListener('update', this._moveUpdate);
			this.button.removeEventListener('pressup', this._moveStopTransform);
			this._moveHasPressUpListener = false;
			this._isBeingMoved = false;
		}
	
		moveDispatchRemoveEventListners() {
			if(this._moveTween)
				this._moveTween.removeAllEventListeners();
		}
	
		moveStopTween() {
			if(this._moveTween) {
				this._moveTween.removeAllEventListeners();
				this._moveTween.paused = true;
				this._moveTween = null;
			}
		}
	
		_dispatchTweenMoveUpdate() {
			this.dispatchEvent('move');
		}
	
		_dispatchMoveComplete(e) {
			if(!this.dispatchOnPressUp) this.dispatchEvent('moveComplete');
			this.moveDispatchRemoveEventListners();
		}
	
		_moveStartTransform(event) {
			this.moveStopTween();
			this.initialPosition.x = this.button.x;
			this.initialPosition.y = this.button.y;
			this._isBeingMoved = true;
		}
	
		_moveUpdate(event) {
			// caluclate average movement between all points
			var average = {x: 0, y: 0};
	
			this._fingers.forEach( pointerID => {
				if(pointerID.start) {
					average.x += (pointerID.current.x - pointerID.old.x);
					average.y += (pointerID.current.y - pointerID.old.y);
				}
			});
	
			average.x /= Math.max(1, this._activeFingers);
			average.y /= Math.max(1, this._activeFingers);
	
			this.button.x += average.x * this.fraction.offset.x * this.fraction.base;
			this.button.y += average.y * this.fraction.offset.y * this.fraction.base;
	
			if( !this._moveHasPressUpListener && ( (Math.abs(this.button.x - this.initialPosition.x) > this.moveLimit.x) || (Math.abs(this.button.y - this.initialPosition.y) > this.moveLimit.y)) ) {
				this.button.addEventListener('pressup', this._moveStopTransform);
				this._moveHasPressUpListener = true;
			}
			this.dispatchEvent('move');
		}
	
		_moveStopTransform(event) {
			if(this.dispatchOnPressUp)
				this.dispatchEvent('moveComplete');
			this._isBeingMoved = false;
	
			this.button.removeEventListener('pressup', this._moveStopTransform);
			this._moveHasPressUpListener = false;
	
			var speed = 1000 * ((this.fraction.fade.x + this.fraction.fade.y) / 2) * this.fraction.base;
	
			if((speed == 0) || (this._stack.length == 0))
				this._dispatchMoveComplete();
			else {
				var options = {};
				var average = {x: 0, y: 0};
				var newPosition = {x: 0, y: 0};
	
				for(var i = 1, _len = this._stack.length; i < _len; i++) {
					average.x += this._stack[i].x - this._stack[i-1].x;
					average.y += this._stack[i].y - this._stack[i-1].y;
				}
	
				average.x = average.x / this._stack.length;
				average.y = average.y / this._stack.length;
	
				// the 10 at the end seems to be a multiplier to normalize a bit
				options.x = this.button.x + average.x * this.fraction.fade.x * this.fraction.base * 10;
				options.y = this.button.y + average.y * this.fraction.fade.y * this.fraction.base * 10;
	
				this.moveStopTween();
				this._moveTween = createjs.Tween.get(this.button, {override:false}).to(options, speed, createjs.Ease.cubicOut);
				this._moveTween.addEventListener('complete', this._dispatchMoveComplete);
				this._moveTween.addEventListener('change', this._dispatchTweenMoveUpdate);
			}
		}
	}
	
	var GestureRotate = superclass => class extends superclass {
		constructor(inClip) {
			super(inClip);
			this._rotateTween = null;
	
			this._dispatchRotationComplete = this._dispatchRotationComplete.bind(this);
			this._dispatchTweenRotateUpdate = this._dispatchTweenRotateUpdate .bind(this);
			this._rotateStartTransform = this._rotateStartTransform.bind(this);
			this._rotateUpdate = this._rotateUpdate.bind(this);
			this._rotateStopTransform = this._rotateStopTransform.bind(this);
	
			this.rotate = false;
			this.initialRotation = 0;
			this.rotateLimit = 1;
			this._rotateHasPressUpListener = false;
			this._isBeingRotated = false;
		}
	
		get isBeingRotated() {
			return this._isBeingRotated;
		}
	
		get isRotateDrifting() {
			return !!this._rotateTween;
		}
	
		get isRotating() {
			return this.isBeingRotated || this.isRotateDrifting;
		}
	
		set rotateLimit(inRotation) {
			this._rotateLimit = inRotation;
		}
	
		get rotateLimit() {
			return this._rotateLimit;
		}
	
		// constructor
		rotateInit() {
			if(this.rotate) {
				this.fraction.offset.rotation = 1;
				this.fraction.fade.rotation = 1;
	
				this.initialRotation = 0;
	
				this.addEventListener('start', this._rotateStartTransform);
				this.addEventListener('update', this._rotateUpdate);
	
				this._rotateHasPressUpListener = false;
				this._isBeingRotated = false;
			}
		}
	
		rotateReset() {
			this.rotateRemoveEventListeners();
			this.rotateDispatchRemoveEventListners();
		}
	
		rotateRemoveEventListeners() {
			this.removeEventListener('start', this._rotateStartTransform);
			this.removeEventListener('update', this._rotateUpdate);
			this.button.removeEventListener('pressup', this._rotateStopTransform);
			this._rotateHasPressUpListener = false;
			this._isBeingRotated = false;
		}
	
		rotateDispatchRemoveEventListners() {
			if(this._rotateTween)
				this._rotateTween.removeAllEventListeners();
		}
	
		rotateStopTween() {
			if(this._rotateTween) {
				this._rotateTween.removeAllEventListeners();
				this._rotateTween.paused = true;
				this._rotateTween = null;
			}
		}
	
		_dispatchTweenRotateUpdate() {
			this.dispatchEvent('rotate');
		}
	
		_rotateStartTransform(event) {
			if(this._activeFingers > 1) {
				this.rotateStopTween();
				this.initialRotation = this.button.rotation;
				this._isBeingRotated = true;
			}
		}
	
		_dispatchRotationComplete() {
			if(!this.dispatchOnPressUp) this.dispatchEvent('rotateComplete');
			this.rotateDispatchRemoveEventListners();
		}
	
		_rotateUpdate(event) {
			if(this._activeFingers > 1) {
				var points = [];
	
				var it = this._fingers.values();
	
				var result;
				do {
					result = it.next();
					if(!result.done) {
						if(result.value.current) {
							points.push(result.value);
							if(points.length >= 2)
								result.done=true;
						}
					}
				}
				while(!result.done);
	
				// calculate initial angle
				var point1 = points[0].old;
				var point2 = points[1].old;
				var startAngle = Math.atan2((point1.y - point2.y), (point1.x - point2.x)) * (180/Math.PI);
	
				// calculate new angle
				var point1 = points[0].current;
				var point2 = points[1].current;
				var currentAngle = Math.atan2((point1.y - point2.y), (point1.x - point2.x)) * (180/Math.PI);
	
				// set rotation based on difference between the two angles
				this.button.rotation += (currentAngle - startAngle) * this.fraction.offset.rotation * this.fraction.base;
	
				if( !this._rotateHasPressUpListener && (Math.abs(this.button.x - this.initialRotation) > this.rotateLimit)) {
					this.button.addEventListener('pressup', this._rotateStopTransform);
					this._rotateHasPressUpListener = true;
				}
				this.dispatchEvent('rotate');
			}
		}
	
		_rotateStopTransform() {
			if(this.dispatchOnPressUp)
				this.dispatchEvent('rotateComplete');
			this._isBeingRotated = false;
	
			this.button.removeEventListener('pressup', this._rotateStopTransform);
			this._rotateHasPressUpListener = false;
	
			var speed = 1000 * this.fraction.fade.rotation * this.fraction.base;
	
			if((speed == 0) || (this._stack.length == 0))
				this._dispatchRotationComplete();
			else {
				var options = {};
				var average = {rotation: 0};
				var newPosition = {rotation: 0};
	
				for(var i = 1, _len = this._stack.length; i < _len; i++)
					average.rotation += this._stack[i].rotation - this._stack[i-1].rotation;
	
				average.rotation = average.rotation/this._stack.length;
	
				// the 10 at the end seems to be a multiplier to normalize a bit
				options.rotation = this.button.rotation + average.rotation * this.fraction.fade.rotation * this.fraction.base * 10;
	
				this.rotateStopTween();
				this._rotateTween = createjs.Tween.get(this.button, {override:false}).to(options, speed, createjs.Ease.cubicOut);
				this._rotateTween.addEventListener('complete', this._dispatchRotationComplete);
				this._rotateTween.addEventListener('change', this._dispatchTweenRotateUpdate);
			}
		}
	}
	
	var GestureScale = superclass => class extends superclass {
		constructor(inClip) {
			super(inClip);
			this._scaleTween = null;
	
			this._dispatchScaleComplete = this._dispatchScaleComplete.bind(this);
			this._dispatchTweenScaleUpdate = this._dispatchTweenScaleUpdate.bind(this);
			this._scaleStartTransform = this._scaleStartTransform.bind(this);
			this._scaleUpdate = this._scaleUpdate.bind(this);
			this._scaleStopTransform = this._scaleStopTransform.bind(this);
	
			this.scale = false;
			this.initialScale = {x:1, y:1};
			this.scaleLimit = {x:0.01, y:0.01};
			this._scaleHasPressUpListener = false;
			this._isBeingScaled = false;
		}
	
		get isBeingScaled() {
			return this._isBeingScaled;
		}
	
		get isScaleDrifting() {
			return !!this._scaleTween;
		}
	
		get isScaling() {
			return this.isBeingScaled || this.isScaleDrifting;
		}
	
		set scaleLimit(inScale) {
			this._scaleLimit = {x: inScale.x, y: inScale.y};
		}
	
		get scaleLimit() {
			return {x: this._scaleLimit.x, y: this._scaleLimit.y};
		}
	
		scaleInit() {
			if(this.scale) {
				this.fraction.offset.scale = 1;
				this.fraction.fade.scale = 1;
	
				this.initialScale = {x:1, y:1};
	
				this.addEventListener('start', this._scaleStartTransform);
				this.addEventListener('update', this._scaleUpdate);
	
				this._scaleHasPressUpListener = false;
				this._isBeingScaled = false;
			}
		}
	
		scaleReset() {
			this.scaleRemoveEventListeners();
			this.scaleDispatchRemoveEventListners();
		}
	
		scaleRemoveEventListeners() {
			this.removeEventListener('start', this._scaleStartTransform);
			this.removeEventListener('update', this._scaleUpdate);
			this.button.removeEventListener('pressup', this._scaleStopTransform);
			this._scaleHasPressUpListener = false;
			this._isBeingScaled = false;
		}
	
		scaleDispatchRemoveEventListners() {
			if(this._scaleTween)
				this._scaleTween.removeAllEventListeners();
		}
	
		scaleStopTween() {
			if(this._scaleTween) {
				this._scaleTween.removeAllEventListeners();
				this._scaleTween.paused = true;
				this._scaleTween = null;
			}
		}
	
		_dispatchTweenScaleUpdate() {
			this.dispatchEvent('scale');
		}
	
		_scaleStartTransform(event) {
			if(this._activeFingers > 1) {
				this.scaleStopTween();
				this.initialScale = {x: this.button.scaleX != 0 ? this.button.scaleX : 0.0001, y: this.button.scaleY != 0 ? this.button.scaleY : 0.0001};
				this._isBeingScaled = true;
			}
		}
	
		_dispatchScaleComplete() {
			if(!this.dispatchOnPressUp) this.dispatchEvent('scaleComplete');
			this.scaleDispatchRemoveEventListners();
		}
	
		_getDistance(p1, p2) {
			var x = p2.x - p1.x;
			var y = p2.y - p1.y;
	
			return Math.sqrt((x * x) + (y * y));
		}
	
		_scaleUpdate(event) {
			if(this._activeFingers > 1) {
				var points = [];
	
				var it = this._fingers.values();
				var result;
				do {
					result = it.next();
					if(!result.done) {
						if(result.value.current) {
							points.push(result.value);
							if(points.length >= 2)
								result.done=true;
						}
					}
				}
				while(!result.done);
	
				var scale = this._getDistance(points[0].current, points[1].current) / this._getDistance(points[0].old, points[1].old);
	
				this.button.scaleX += (scale - 1) * this.fraction.offset.scale * this.fraction.base;
				this.button.scaleY = this.button.scaleX;
	
				if( !this._scaleHasPressUpListener && ( (Math.abs(this.button.scaleX - this.initialScale.x) > this.scaleLimit.x) || (Math.abs(this.button.scaleY - this.initialScale.y) > this.scaleLimit.y)) ) {
					this.button.addEventListener('pressup', this._scaleStopTransform);
					this._scaleHasPressUpListener = true;
				}
				this.dispatchEvent('scale');
			}
		}
	
		_scaleStopTransform() {
			if(this.dispatchOnPressUp)
				this.dispatchEvent('scaleComplete');
			this._isBeingScaled = false;
	
			this.button.removeEventListener('pressup', this._scaleStopTransform);
			this._scaleHasPressUpListener = false;
	
			var speed = 1000 * this.fraction.fade.scale * this.fraction.base;
	
			if((speed == 0) || (this._stack.length == 0))
				this._dispatchScaleComplete();
			else {
				var options = {};
				var average = {scaleX: 0, scaleY: 0};
				var newPosition = {scaleX: 0, scaleY: 0};
	
				for(var i = 1, _len = this._stack.length; i < _len; i++) {
					average.scaleX += this._stack[i].scaleX - this._stack[i-1].scaleX;
					average.scaleY += this._stack[i].scaleY - this._stack[i-1].scaleY;
				}
	
				average.scaleX = average.scaleX / this._stack.length;
				average.scaleY = average.scaleY / this._stack.length;
	
				// the 10 at the end seems to be a multiplier to normalize a bit
				options.scaleX = this.button.scaleX + average.scaleX * this.fraction.fade.scale * this.fraction.base * 10;
				options.scaleY = this.button.scaleY + average.scaleY * this.fraction.fade.scale * this.fraction.base * 10;
	
				this.scaleStopTween();
				this._scaleTween = createjs.Tween.get(this.button, {override:false}).to(options, speed, createjs.Ease.cubicOut);
				this._scaleTween.addEventListener('complete', this._dispatchScaleComplete);
				this._scaleTween.addEventListener('change', this._dispatchTweenScaleUpdate);
			}
		}
	}
	
	class GestureHelper extends mix(GesturableBase).with(GestureMove, GestureRotate, GestureScale) {
		constructor(inClip, inOptions) {
			super(inClip);
	
			this.move = inOptions && "move" in inOptions ? inOptions.move : true; // enough move gesture otherwise no drag
			this.moveLimitX = inOptions && "moveLimitX" in inOptions ? inOptions.moveLimitX : 1;
			this.moveLimitY = inOptions && "moveLimitY" in inOptions ? inOptions.moveLimitY : 1;
			this.moveLimit = {x:this.moveLimitX, y:this.moveLimitY}; // amount large enough to register for aftertouch
			this.moveOffset = inOptions && "moveOffset" in inOptions ? inOptions.moveOffset : 1;
			this.moveFade = inOptions && "moveFade" in inOptions ? inOptions.moveFade : 1;
	
			this.rotate = inOptions && "rotate" in inOptions ? inOptions.rotate : true;
			this.rotateLimit = inOptions && "rotateLimit" in inOptions ? inOptions.rotateLimit : 1;
			this.rotateOffset = inOptions && "rotateOffset" in inOptions ? inOptions.rotateOffset : 1;
			this.rotateFade = inOptions && "rotateFade" in inOptions ? inOptions.rotateFade : 1;
	
			this.scale = inOptions && "scale" in inOptions ? inOptions.scale : true;
			this.scaleLimitX = inOptions && "scaleLimitX" in inOptions ? inOptions.scaleLimitX : 0.01;
			this.scaleLimitY = inOptions && "scaleLimitY" in inOptions ? inOptions.scaleLimitY : 0.01;
			this.scaleLimit = {x:this.scaleLimitX, y:this.scaleLimitY};
			this.scaleOffset = inOptions && "scaleOffset" in inOptions ? inOptions.scaleOffset : 1;
			this.scaleFade = inOptions && "scaleFade" in inOptions ? inOptions.scaleFade : 1;
			this.transformMultiplier = inOptions && "transformMultiplier" in inOptions ? inOptions.transformMultiplier : 1;
	
			this.dispatchOnPressUp = inOptions && "dispatchOnPressUp" in inOptions ? inOptions.dispatchOnPressUp : false;
	
			this._dispatchComplete = this._dispatchComplete.bind(this);
			this._dispatchUpdate = this._dispatchUpdate.bind(this);
			this._enterFrame = this._enterFrame.bind(this);
	
			this.name = inClip.name + "_gestureHelper";
			this._changed = false;
		}
	
		get fingers() {
			return this._fingers;
		}
	
		get numActiveFingers() {
			return this._activeFingers;
		}
	
		init() {
			super.init();
	
			if(this.move) {
				this.moveInit();
				this.addEventListener('move', this._dispatchUpdate);
				this.addEventListener('moveComplete', this._dispatchComplete);
			}
	
			if(this.rotate) {
				this.rotateInit();
				this.addEventListener('rotate', this._dispatchUpdate);
				this.addEventListener('rotateComplete', this._dispatchComplete);
			}
	
			if(this.scale) {
				this.scaleInit();
				this.addEventListener('scale', this._dispatchUpdate);
				this.addEventListener('scaleComplete', this._dispatchComplete);
			}
	
			this.initFractionParams();
	
			this.button.addEventListener('tick', this._enterFrame);
			this._changed = false;
		}
	
		initFractionParams() {
			this.fraction.base = this.transformMultiplier;
			this.fraction.offset.x = this.moveOffset;
			this.fraction.offset.y = this.moveOffset;
			this.fraction.fade.x = this.moveFade;
			this.fraction.fade.y = this.moveFade;
			this.fraction.offset.rotation = this.rotateOffset;
			this.fraction.fade.rotation = this.rotateFade;
			this.fraction.offset.scale = this.scaleOffset;
			this.fraction.fade.scale = this.scaleFade;
		}
	
		reset() {
			this.stopAllTweens();
			this.removeEventListener('move', this._dispatchUpdate);
			this.removeEventListener('moveComplete', this._dispatchComplete);
			this.removeEventListener('rotate', this._dispatchUpdate);
			this.removeEventListener('rotateComplete', this._dispatchComplete);
			this.removeEventListener('scale', this._dispatchUpdate);
			this.removeEventListener('scaleComplete', this._dispatchComplete);
			this.button.removeEventListener('tick', this._enterFrame);
			this.moveReset();
			this.rotateReset();
			this.scaleReset();
			this._changed = false;
		}
	
		_registerChange(pointerID) {
			super._registerChange(pointerID);
			this._changed = true;
		}
	
		_enterFrame() {
			if(this._changed) {
				this._changed = false;
				var newEvt = new createjs.Event('change');
				newEvt.relatedTarget = this;
				this.button.dispatchEvent(newEvt);
			}
		}
	
		_dispatchUpdate(event) {
			this._changed = true;
		}
	
		_dispatchComplete(event) {
			var shouldDispatch = false;
			var transformFlags = 0;
			if(event.type == 'moveComplete') {
				shouldDispatch = true;
				transformFlags = 1;
			}
	
			if(event.type == 'rotateComplete') {
				shouldDispatch = true;
				transformFlags = 2;
			}
	
			if(event.type == 'scaleComplete') {
				shouldDispatch = true;
				transformFlags = 4;
			}
	
			if(shouldDispatch) {
				var newEvt = new createjs.Event('complete');
				newEvt.transformFlags = transformFlags;
				newEvt.relatedTarget = this;
				this.button.dispatchEvent(newEvt);
			}
		}
	
		stopAllTweens() {
			this.moveStopTween();
			this.rotateStopTween();
			this.scaleStopTween();
		}
	}

	// construct for determining if button collides with a collisionarea
	// buttons in Animate that only have a hitArea do not have bounds set but their hitArea does have bounds
	class CollisionHelper  {
		constructor(inClip, inOptions) {
			this.target = inClip;
	
			// must come before collider is set
			this.useColliderHitArea = inOptions && "useColliderHitArea" in inOptions ? inOptions.useColliderHitArea : true;
			this.useTargetHitArea = inOptions && "useTargetHitArea" in inOptions ? inOptions.useTargetHitArea : true;
			this.collider = inOptions && "collider" in inOptions ? inOptions.collider : null;

			// these items must be last as it sets _checkCollision
			this.preciseCollision = inOptions && "preciseCollision" in inOptions ? inOptions.preciseCollision : false;
			this.boxCollision = inOptions && "boxCollision" in inOptions ? inOptions.boxCollision : false;
			this.ellipseCollision = inOptions && "ellipseCollision" in inOptions ? inOptions.ellipseCollision : false;
	
			this.checkCollision = this.checkCollision.bind(this);
		}
	
		get collider() {
			return this._collider;
		}
	
		set collider(inClip) {
			this._collider = (inClip && (inClip instanceof createjs.DisplayObject)) ? inClip : null;
		}
	
		get preciseCollision() {
			return this._preciseCollision;
		}
	
		set preciseCollision(inBool = false) {
			this._preciseCollision = inBool;
			this._setCollisionChanged();
		}
	
		get boxCollision() {
			return this._boxCollision;
		}
	
		set boxCollision(inBool = false) {
				this._boxCollision = inBool;
				this._setCollisionChanged();
		}
	
		get ellipseCollision() {
			return this._ellipseCollision;
		}
	
		set ellipseCollision(inBool = false) {
				this._ellipseCollision = inBool;
				this._setCollisionChanged();
		}
	
		static isOverlapping1D(xmin1, xmax1, xmin2, xmax2) {
			return xmax1 >= xmin2 && xmax2 >= xmin1;
		}

		static isOverlapping2D(box1, box2) {
			return 	CollisionHelper.isOverlapping1D(box1.x, box1.x + box1.width, box2.x, box2.x + box2.width) && 
					CollisionHelper.isOverlapping1D(box1.y, box1.y + box1.height, box2.y, box2.y + box2.height);
		}

		// can be used to check if a clip has valid bounds or not
		static checkIfBounds(clip, useColliderHitArea = true) {
			var result = false;
			try { result = !!(useColliderHitArea && clip.hitArea ? clip.hitArea : clip).getBounds(); }
			catch(err) {}
			return result;
		}
	
		static getClipTransformedBounds(clip, useColliderHitArea = true) {
			var result = null;
			try { result = useColliderHitArea && clip.hitArea ? clip._transformBounds(clip.hitArea.getBounds().clone()) : clip.getTransformedBounds(); }
			catch(err) {}
			return result;
		}
	
		static getClipBounds(clip, useColliderHitArea = true) {
			var result = null;
			try { result = useColliderHitArea && clip.hitArea ? clip.hitArea.getBounds() : clip.getBounds(); }
			catch(err) {}
			return result;
		}

		// will return a bounds for clips with nested MovieClips accounting for animation
		static getContainerBounds(clip, useColliderHitArea = true) {
			var result = null;
			try { result = useColliderHitArea && clip.hitArea ? clip.hitArea.Container__getBounds(null, true) : clip.Container__getBounds(null, true); }
			catch(err) {}
			return result;
		}

		// will return a transoformed bounds for clips with nested MovieClips accounting for animation
		static getContainerTransformedBounds(clip, useColliderHitArea = true) {
			var result = null;
			try { result = useColliderHitArea && clip.hitArea ? clip.hitArea.Container__getBounds() : clip.Container__getBounds(); }
			catch(err) {}
			return result;
		}
	
		// return bounding box in targetClip coords
		static getBoundingBox(clip, targetClip, useHitArea = true) {
			var rect = CollisionHelper.getClipBounds(clip, useHitArea);
			if(!rect) return null;
	
			var pt1 = clip.localToLocal(rect.x, rect.y, targetClip);
			var pt2 = clip.localToLocal(rect.x+rect.width, rect.y, targetClip);
			var pt3 = clip.localToLocal(rect.x+rect.width, rect.y+rect.height, targetClip);
			var pt4 = clip.localToLocal(rect.x, rect.y+rect.height, targetClip);
	
			// get leftmost x-coordinate
			var x = Math.min(pt1.x, pt2.x, pt3.x, pt4.x);
			var y = Math.min(pt1.y, pt2.y, pt3.y, pt4.y);
			var width = Math.max(pt1.x, pt2.x, pt3.x, pt4.x) - x;
			var height = Math.max(pt1.y, pt2.y, pt3.y, pt4.y) - y;
	
			return new createjs.Rectangle(x,y,width,height);
		}

		// tests point against alpha on sample point of clip2
		static hitAreaHitTest(clip2, x, y) {
			var ctx = createjs.DisplayObject._hitTestContext;
			ctx.setTransform(1, 0, 0, 1, -x, -y);
			clip2.hitArea.draw(ctx);
	
			var hit = clip2.hitArea._testHit(ctx);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, 2, 2);

			return hit;
		}

		// returns whether reg point of clip1 is within bbox of clip2
		static checkCollisionFast(clip1, clip2, useColliderHitArea = true) {
			var rect2 = CollisionHelper.getClipBounds(clip2, useColliderHitArea);
			if(!rect2) return false;
			var pt = clip1.parent.localToLocal(clip1.x,clip1.y,clip2);

			return 	pt.x >= rect2.x &&
					pt.x <= rect2.x + rect2.width &&
					pt.y >= rect2.y &&
					pt.y <= rect2.y + rect2.height;
		}
			
		// returns whether reg point of clip1 is within bounding ellipse of clip2
		static checkCollisionEllipseFast(clip1, clip2, useColliderHitArea = true) {
			var rect2 = CollisionHelper.getClipBounds(clip2, useColliderHitArea);
			if(!rect2) return false;
			var pt = clip1.parent.localToLocal(clip1.x,clip1.y,clip2);
			
			// test if inside bounding box and ignore if not
			var inBox =	pt.x >= rect2.x &&
						pt.x <= rect2.x + rect2.width &&
						pt.y >= rect2.y &&
						pt.y <= rect2.y + rect2.height;

			if(!inBox) return false;
			
			// is it inside ellipse
			return Math.pow(pt.x - rect2.x - rect2.width/2, 2)/Math.pow(rect2.width/2, 2) + Math.pow(pt.y - rect2.y - rect2.height/2, 2)/Math.pow(rect2.height/2, 2) <= 1;
		}

		// do bounding boxes intersect
		static checkCollisionBoxFast(clip1, clip2, useTargetHitArea = true, useColliderHitArea = true) {
			var rect1 = CollisionHelper.getBoundingBox(clip1, clip2, useTargetHitArea);
			if(!rect1) return false;
			var rect2 = CollisionHelper.getClipBounds(clip2, useColliderHitArea);
			if(!rect2) return false;

			return CollisionHelper.isOverlapping2D(rect1, rect2);
		}

		// returns whether reg point of clip1 hittests on clip2
		static checkCollisionPrecise(clip1, clip2, useColliderHitArea = true) {
			if(CollisionHelper.checkCollisionFast(clip1, clip2, useColliderHitArea)) {
				var pt = clip1.parent.localToLocal(clip1.x, clip1.y, clip2);
				return useColliderHitArea && clip2.hitArea ? CollisionHelper.hitAreaHitTest(clip2, pt.x, pt.y) : clip2.hitTest(pt.x, pt.y);
			}
		}
	
		// does bounding box of clip1 hittests on clip2
		static checkCollisionBoxPrecise(clip1, clip2, useTargetHitArea = true, useColliderHitArea = true) {
			if(CollisionHelper.checkCollisionBoxFast(clip1, clip2, useTargetHitArea, useColliderHitArea)) {
				var rect = CollisionHelper.getBoundingBox(clip1, clip2, useTargetHitArea);
				var points = [
					{x: rect.x, y: rect.y},
					{x: rect.x+rect.width, y: rect.y},
					{x: rect.x+rect.width, y: rect.y + rect.height},
					{x: rect.x, y: rect.y + rect.height}
				];

				return useColliderHitArea && clip2.hitArea ? CollisionHelper.hitAreaHitTest(clip2, points[0].x, points[0].y) || CollisionHelper.hitAreaHitTest(clip2, points[1].x, points[1].y) || CollisionHelper.hitAreaHitTest(clip2, points[2].x, points[2].y) || CollisionHelper.hitAreaHitTest(clip2, points[3].x, points[3].y) : clip2.hitTest(points[0].x, points[0].y) || clip2.hitTest(points[1].x, points[1].y) || clip2.hitTest(points[2].x, points[2].y) || clip2.hitTest(points[3].x, points[3].y);	
			}

			return false; 
		}

		_setCollisionChanged() {
			this._checkCollision = this._preciseCollision ? (this._boxCollision ? this._checkCollisionBoxPrecise : this._checkCollisionPrecise) : (this._boxCollision ? this._checkCollisionBoxFast : this.ellipseCollision ? this._checkCollisionEllipseFast : this._checkCollisionFast);
		}
	
		_checkCollisionFast(clip1, clip2) {
			return CollisionHelper.checkCollisionFast(clip1, clip2, this.useColliderHitArea);
		}

		_checkCollisionEllipseFast(clip1, clip2) {
			return CollisionHelper.checkCollisionEllipseFast(clip1, clip2, this.useColliderHitArea);
		}

		_checkCollisionBoxFast(clip1, clip2) {
			return CollisionHelper.checkCollisionBoxFast(clip1, clip2, this.useTargetHitArea, this.useColliderHitArea);
		}
	
		_checkCollisionPrecise(clip1, clip2) {
			return CollisionHelper.checkCollisionPrecise(clip1, clip2, this.useColliderHitArea);
		}
	
		_checkCollisionBoxPrecise(clip1, clip2) {
			return CollisionHelper.checkCollisionBoxPrecise(clip1, clip2, this.useTargetHitArea, this.useColliderHitArea);
		}

		checkCollision(collider = this.collider) {
			return (this.target && collider) ? this._checkCollision(this.target, collider) : false;
		}	
	}
	
	// BEGIN SHIM MODIFICATIONS
	class SequenceObject {
		constructor(inData, inNextDataObjects, meta) {
			this.data = inData;
			this.children = inNextDataObjects;
	
			this.promNodes = [];
			this.meta = meta;
	
			this.resolved = false;
		}
	
		get type() {
			return "SequenceObject";
		}
	
		get eventHandler() {
			return this._eventHandler;
		}
	
		set eventHandler(eventHandler) {
			this._eventHandler = eventHandler;
			if(this._eventHandler) this._eventHandler.seqcontrolType = this.type;
		}
	
		removeSeqcontroListeners(type, target = this._data) {
			if(target._listeners) {
				// get array of listeners of type
				var arr = target._listeners[type];
				if(arr) {
					for (var i=arr.length-1; i>=0; i--) {
						if(arr[i].seqcontrolType == this.type) {
							if(arr.length == 1) delete(target._listeners[type]);
							else arr.splice(i,1);
						}
					}	
				}	
			}
	
			if(target._captureListeners) {
				// get array of listeners of type
				var arr = target._captureListeners[type];
				if(arr) {
					for (var i=arr.length-1; i>=0; i--) {
						if(arr[i].seqcontrolType == this.type) {
							if(arr.length == 1) delete(target._captureListeners[type]);
							else arr.splice(i,1);
						}
					}	
				}
			}	
		}
	
		// Each promNode reserves a preset amount of promises called requests
		// this.promnodes is array of promNode attached as children to this seqObj
		// sendToPromNodes is called when createPromise is called
		// sendToPromNodes will go through this.promnodes and sends the promise
		// from createPromise to be saved within a request by calling the promNode's addRequest
		// when addRequest is called the promise from the seqObj gets wrapped in a promresolveHolder
		// which is referenced inside a unique request promise
		// when the promise inside the promresolveHolder resolves
		// it will resolve the request promise
		// the request promise can be referenced inside a Promise.all or Promise.race etc.
		// to be the resolve for the promNode
		sendToPromNodes(prom) {
			this.promNodes.forEach(item => item.addRequest(prom));
		}
	
		createPromise() {
			return null;
		}
	
		reset() {
			this.resolved = false;
			this.passValue = undefined;
			return this;
		}
	
		init() {
//			this.resolved = false;
			return this;
		}
		
		set data(inData) {
			this._data = inData;
		}
	
		get data() {
			return this._data;
		}
	
		set resolved(inBool) {
			// if(inBool) this._passValue = undefined;
			this._resolved = inBool;
		}
	
		get resolved() {
			return this._resolved;
		}
	
		set passValue(inPassValue) {
			this._passValue = inPassValue;
		}
	
		get passValue() {
			return this._passValue;
		}

		set meta(inMeta) {
			this._meta = inMeta;
		}
	
		get meta() {
			return this._meta;
		}

		set children(inNextDataObjects) {
			this._nextDataObjectsArray = inNextDataObjects ? (Array.isArray(inNextDataObjects) ? [...inNextDataObjects] : [inNextDataObjects]) : [];
		}

		get children() {
			return this._nextDataObjectsArray;
		}
	}
	// END SHIM MODIFICATIONS
	
	class AnimationObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			this.doNotPlay = inOptions && "doNotPlay" in inOptions ? inOptions.doNotPlay : false;
			this.resolveImmediate = inOptions && "resolveImmediate" in inOptions ? inOptions.resolveImmediate : false; // resolves promise immediately in doNotPlay enabled
			this.resume = inOptions && "resume" in inOptions ? inOptions.resume : false;
			this.rewindOnPrerun = inOptions && "rewindOnPrerun" in inOptions ? inOptions.rewindOnPrerun : true;
	
			this.setVisibility = inOptions && "setVisibility" in inOptions ? inOptions.setVisibility : true;
			this.startVisible = inOptions && "startVisible" in inOptions ? inOptions.startVisible : true;
			this.endVisible = inOptions && "endVisible" in inOptions ? inOptions.endVisible : true;
			this.endVisibleNextTick = inOptions && "endVisibleNextTick" in inOptions ? inOptions.endVisibleNextTick : true;
	
			this.loopCount = inOptions && "loopCount" in inOptions ? inOptions.loopCount : -1;
			this.loop = inOptions && "loop" in inOptions ? inOptions.loop : false;
			this.bounce = inOptions && "bounce" in inOptions ? inOptions.bounce : false;
	
			this.reversed = inOptions && "reversed" in inOptions ? inOptions.reversed : false;
			this.label = inOptions && "label" in inOptions ? inOptions.label : null;
			this.noStopLabel = inOptions && "noStopLabel" in inOptions ? inOptions.noStopLabel : false;
			this.returnLabel = inOptions && "returnLabel" in inOptions ? inOptions.returnLabel : null;
			this.playFromLabel = inOptions && "playFromLabel" in inOptions ? inOptions.playFromLabel : null;
			this.enableOvershoot = inOptions && "enableOvershoot" in inOptions ? inOptions.enableOvershoot : false;
			this.snapToLabel = inOptions && "snapToLabel" in inOptions ? inOptions.snapToLabel : true;
			this.restoreActionsStateNextTick = inOptions && "restoreActionsStateNextTick" in inOptions ? inOptions.restoreActionsStateNextTick : true;
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.runtimeCallback = inOptions && "runtimeCallback" in inOptions ? inOptions.runtimeCallback : null;
			this.preRunCallback = inOptions && "preRunCallback" in inOptions ? inOptions.preRunCallback : null;
			this.fpsScale = inOptions && "fpsScale" in inOptions ? inOptions.fpsScale : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this.resolveOnCallbackEnds = inOptions && "resolveOnCallbackEnds" in inOptions ? inOptions.resolveOnCallbackEnds : true;
			this.resolveOnLoopCount = inOptions && "resolveOnLoopCount" in inOptions ? inOptions.resolveOnLoopCount : true;

			this.removeEventListenersOnPlay = inOptions && "removeEventListenersOnPlay" in inOptions ? inOptions.removeEventListenersOnPlay : true;
	
			this._originalFramerate = null;
			this._originalTimelineReversed = null;
			this._originalLoop = null;
			this._loopCounter = this.loopCount;
	
			// this holder will hold the resolve from eventHandler to be used inside the startCallback
			// this ensures that startCallback can still resolve AFTER the animation has started to play
			// for example we insert the startCallback resolve inside a setTimeout
			this._startCallbackResolveHolder = null;
		}

		get type() {
			return "AnimationObject";
		}

		get loop() {
			return this._loop;
		}

		set loop(inBool = false) {
			this._loop = this.loopCount === 0 ? false : inBool;
		}
	
		// returns tweenStep by index
		// tweenStep holds ease function, duration, etc.
		// allowing you to inspect, modify or replace properties such as ease function
		// USAGE: getTweenStep(target, index)
		// target: the instance which is being animated on a parent's timeline
		// index: index of the tweenStep to search for
		//   for Adobe Animate this index usually starts at 1
		//   try identifying the correct tweenStep by setting a uniqe Tween in Animate and console.logging through the indices
		// take care with changes to properties which affect seqcontrol event handling and timing
		static getTweenStep(target, index) {
			var tweens = target.parent.timeline.tweens.filter(i => i.target === target);
			if(tweens.length > 0) {
				var step = tweens[0]._stepHead;
				while(!!step) {
					if(step.index == index) return step;
					step = step.next;
				}
			}
			return null;
		}
	
		// reverses the order of MovieClip tweens that interpolate a 'state' property
		// such a 'state' property is usually added by Adobe Animate authored MovieClips
		// this can be useful with MovieClips containing shape objects with fills and strokes
		// whereby the default of such shapes is to render strokes over fills
		// this method can be used to instead render fills over strokes
		// NOTE: displayList children order from 'state' property is evaluated before the first frame action is called
		// For singleFrame MovieClips this means that the updated displayList may not render
		// In such instances, in order to support caching, it is recommended to call this function from a parenting MovieClip
		// And call updateCache() on a following tick event
		// Example:
		//     if(!this.nested.init) {
		//         seqcontrol.reverseTweensState(this.nested);
		//         if(this.nested.cacheCanvas) createjs.Ticker.on('tick', () => this.nested.updateCache(), undefined, true);	
		//         this.nested.init = true;
		//     }
		// USAGE: reverseTweensState(target)
		// target: the instance with tweens that interpolate a 'state' property
		static reverseTweensState(target) {
			var result = null;
	
			target.timeline.tweens.forEach(tw => {
				var step = tw._stepHead;
				while(step) {
					var twStateExists = step.props && step.props.state && Array.isArray(step.props.state) && step.props.state.length > 1;
					if(twStateExists) {
						step.props.state.reverse();
						result = target;
					}
					step = step.next;
				}
	
				var tail = tw._stepTail;
				if(tail) {
					var twStateExists = tail.props && tail.props.state && Array.isArray(tail.props.state) && tail.props.state.length > 1;
					if(twStateExists) {
						tail.props.state.reverse();
						result = target;
					}
				}
			})
	
			return result;
		}

		// changes frame number to matching frame number if timeline was reversed and vice versa
		// note that timeline.resolve() returns undefined BUT timeline.resolve(null) returns 0
		// this function is used to replace labels so we need to respect the null!
		// this function will take a frame or label and return the corrected frame number when using gotoAndPlay and gotoAndStop
		static reverseFrame(target, inLabel) {
			return inLabel != null ? target.totalFrames - target.timeline.resolve(inLabel) : null;
		}
	
		// this is a mod to block actions from playing when using stop frames in AnimationObject
		// MovieClips may overshoot although you are using a stop frame especially during slower LPM
		// if a MovieClip overshoots its stop frame, it may continue playing actions on that
		// MovieClip's timeline which may cause unexpected behaviors
		// this mod will disable actions that are not within specified frames set by AnimationObject
		static injectUpdateTimeline(target, startFrame = 0, endFrame, playFrame = 0) {
			if(!!(target[SYMBOLS.UPDATETIMELINE])) return false;

			var startPosition = target.timeline.resolve(startFrame);
			var endPosition = target.timeline.resolve(endFrame);

			if(startPosition == null || endPosition == null || (startPosition == endPosition)) return false;
			if(startPosition > endPosition) [startPosition, endPosition] = [endPosition, startPosition];

			var playFrameSet = playFrame < startPosition || playFrame > endPosition;

			target[SYMBOLS.UPDATETIMELINE] = target._updateTimeline;
			target._updateTimeline = function(rawPosition, jump) {
				var synced = this.mode !== createjs.MovieClip.INDEPENDENT, tl = this.timeline;
				if (synced) { rawPosition = this.startPosition + (this.mode===createjs.MovieClip.SINGLE_FRAME?0:this._synchOffset); }
				if (rawPosition < 0) { rawPosition = 0; }
				if (this._rawPosition === rawPosition && !synced) { return; }
				this._rawPosition = rawPosition;
				
				// ignore actions between frames
				var actionsEnabled = this.actionsEnabled;

				if(rawPosition < startPosition || rawPosition > endPosition) {
					if(!playFrameSet) actionsEnabled = false;
				}
				else if(playFrameSet)
					playFrameSet = false;

				// update timeline position, ignoring actions if this is a graphic.
				tl.loop = this.loop; // TODO: should we maintain this on MovieClip, or just have it on timeline?
				tl.setPosition(rawPosition, synced || !actionsEnabled, jump, this._bound_resolveState);
			};

			return true;
		}

		static removeUpdateTimeline(target) {
			if(SYMBOLS.UPDATETIMELINE in target) {
				target._updateTimeline = target[SYMBOLS.UPDATETIMELINE];
				delete target[SYMBOLS.UPDATETIMELINE];
				return true;
			}

			return false;
		}

		init() {
			super.init();

			var animInstance = this.data;
			if(animInstance) {
				if(this.rewindOnPrerun) animInstance.gotoAndStop(0);
				else animInstance.stop();
			}
			if(this.preRunCallback) this.preRunCallback(this);

			return this;
		}

		removeAllEventListeners(type) {
			if(!type || type == 'change') this.removeSeqcontroListeners('change', this._data.timeline);
			if(!type || type == 'complete') this.removeSeqcontroListeners('complete', this._data.timeline);
			if(!type || type == 'tick') this.removeSeqcontroListeners('tick', this._data); // removes these tertiary eventHandlers corresponding to endVisible or snapLabel tick handlers
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			var instance = this._data;
			if(this.setVisibility) instance.visible = this.startVisible;
	
			// if instance.timeline has eventListeners still then override them
			// be aware any callbacks from those eventListeners will NOT be called
			if(this.removeEventListenersOnPlay)
				this.removeAllEventListeners();
	
			if(this._originalFramerate == null) this._originalFramerate = this._data.framerate;
			if(this.fpsScale && this.fpsScale != 1) instance.framerate = (this._originalFramerate ? this._originalFramerate : createjs.Ticker.framerate) * (this.fpsScale > 0 ? this.fpsScale : 0);

			if(this._originalTimelineReversed == null) this._originalTimelineReversed = this._data.timeline.reversed;
			if(this.reversed) instance.timeline.reversed = true;

			if(this._originalLoop == null) this._originalLoop = this._data.loop;
			instance.loop = 0;
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
	
			if(!this.doNotPlay) {
				if(this.resume) {
					// unlike Sprites, MovieClip's timeline will not dispatch an event if play is called and at end of timeline, therefore loop will not happen
					if(this.loop && (this.reversed ? instance.timeline.position <= 0 : instance.timeline.position >= instance.timeline.duration))
						instance.gotoAndPlay(0);
					else
						instance.play();
				}
				else if(this.playFromLabel)
					instance.gotoAndPlay(!this.reversed ? this.playFromLabel : AnimationObject.reverseFrame(instance, this.playFromLabel));
				else
					instance.gotoAndPlay(0);
			}
			else if(this.resolveImmediate) {
				instance.stop();
				this.resolved = true;
				prom = Promise.resolve({passValue: this._passValue});
				this.passValue = undefined;
			}
	
			if(!prom) {
				// if labeled
				if(this.label) {
					if(!this.enableOvershoot && !this.noStopLabel) AnimationObject.injectUpdateTimeline(instance, this.returnLabel, this.label, this.playFromLabel);

					if(this.loop) {
						if(this.reversed) {
							if(this.bounce)
								prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance, this.label, this.returnLabel, this.runtimeCallback, this.endCallback));
							else
								prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteLoopAtFrame.call(this, instance, this.label, this.returnLabel, this.runtimeCallback, this.endCallback));
						}
						else {
							if(this.bounce)
								prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance, this.label, this.returnLabel, this.runtimeCallback, this.endCallback));
							else
								prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteLoopAtFrame.call(this, instance, this.label, this.returnLabel, this.runtimeCallback, this.endCallback));
						}
					}
					else
						prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteStopAtFrame.call(this, instance, this.label, this.runtimeCallback, this.endCallback)); // return label is irrelevant
				}
				else { // unlabeled
					if(this.endCallback || this.runtimeCallback) {
						// if looping
						if(this.loop) {
							if(this.reversed) {
								if(this.bounce)
									prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance, null, this.returnLabel, this.runtimeCallback, this.endCallback));
								else
									prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteLoopAtFrame.call(this, instance, null, this.returnLabel, this.runtimeCallback, this.endCallback));
							}
							else {
								if(this.bounce)
									prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance, null, this.returnLabel, this.runtimeCallback, this.endCallback));
								else
									prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteLoopAndCall.call(this, instance, this.returnLabel, this.runtimeCallback, this.endCallback));
							}
						}
						else
							prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteCallbacks.call(this, instance, this.runtimeCallback, this.endCallback)); // return label is irrelevant
					}
					else { // no callbnacks
						// if looping
						if(this.loop) {
							 if(this.returnLabel) {
								if(this.reversed) {
									if(this.bounce)
										prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance, null, this.returnLabel));
									else
										prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteLoopAtFrame.call(this, instance, null, this.returnLabel));
								}
								else {
									if(this.bounce)
										prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance, null, this.returnLabel));
									else
										prom = instance.timeline.addEventListenerPromise('complete', this.onMCCompleteLoopReturnLabel.call(this, instance, this.returnLabel));
								}
							}
							else {
								if(this.reversed) {
									if(this.bounce)
										prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteBounceAtFrame.call(this, instance));
									else
										prom = instance.timeline.addEventListenerPromise('change', this.onMCCompleteLoopReverse.call(this, instance)); // both bounce and non-bounce
								}
								else
									prom = instance.timeline.addEventListenerPromise('complete', this.onMCCompleteLoop.call(this, instance)); // both bounce and non-bounce
							}
						}
						else
							prom = instance.timeline.addEventListenerPromise('complete', this.onMCComplete.call(this, instance));
					}
				}
			}
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();

			this._data.timeline.removeEventListener('change', this.eventHandler);
			this._data.timeline.removeEventListener('complete', this.eventHandler);

			// reenable default actions response
			AnimationObject.removeUpdateTimeline(this._data);

			this._data.framerate = this._originalFramerate; // normally dont reset all the params user should be aware but this one is obscure
			this._data.timeline.reversed = this._originalTimelineReversed;
			this._data.loop = this._originalLoop;
	
			this.eventHandler = null;
			this._loopCounter = this.loopCount;
	
			this._startCallbackResolveHolder = null;
	
			return this;
		}
	
		onMCComplete(instance) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					event.currentTarget.removeEventListener('complete', this.eventHandler);

					// allows overshoot otherwise force to last frame
					if(this.enableOvershoot) instance.stop();
					else instance.gotoAndStop(instance.totalFrames-1);
					
					if(this.setVisibility) {
						if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
						else instance.visible = this.endVisible;
					}
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoop(instance) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					if(this.loopCount > 0 && this._loopCounter-- <= 0) {
						event.currentTarget.removeEventListener('complete', this.eventHandler);

						// allows overshoot otherwise force to last frame
						if(this.enableOvershoot) instance.stop();
						else instance.gotoAndStop(instance.totalFrames-1);
	
						if(this.setVisibility) {
							if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else instance.visible = this.endVisible;
						}
					}
					else {
						if(this.bounce) instance.timeline.reversed = !instance.timeline.reversed;
						instance.gotoAndPlay(0);
					}
	
					if(!this.resolved && !this.resolveOnCallbackOnly && (this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0)) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoopReverse(instance) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skip = false;
				this.eventHandler = function(event) {
					if(event.currentTarget.position <= 1) {
						if(this.loopCount > 0 && this._loopCounter-- <= 0) {
							event.currentTarget.removeEventListener('change', this.eventHandler);
							instance.stop();
							if(this.setVisibility) {
								if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
								else instance.visible = this.endVisible;
							}
							}
						else if(skip) {
							var frameToGo = AnimationObject.reverseFrame(instance, 0);
							instance.gotoAndPlay(frameToGo);
							skip = false;
						}
						else {
							if(this.bounce) instance.timeline.reversed = !instance.timeline.reversed;
							skip = true;
							this._data.on('tick', () => instance.gotoAndPlay(0), undefined, true).seqcontrolType = this.type;
						}
	
						if(!this.resolved && !this.resolveOnCallbackOnly && (this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0)) {
							this.resolved = true;
							resolve({passValue: this._passValue});
							this.passValue = undefined;
						}
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		// not for reverse or bounce
		onMCCompleteLoopReturnLabel(instance, inReturnLabel) {
			var returnPosition = instance.timeline.resolve(inReturnLabel);
			var returnFrame = returnPosition;
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					if(this.loopCount > 0 && this._loopCounter-- <= 0) {
						event.currentTarget.removeEventListener('complete', this.eventHandler);
						instance.stop();
						if(this.setVisibility) {
							if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else instance.visible = this.endVisible;
						}
					}
					else
						instance.gotoAndPlay(returnFrame);
	
					if(!this.resolved && !this.resolveOnCallbackOnly && (this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0)) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteCallbacks(instance, runtimeCallback, endCallback) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					if(instance.currentFrame >= instance.totalFrames-1) {
						event.currentTarget.removeEventListener('change', this.eventHandler);

						// allows overshoot otherwise force to last frame
						if(this.enableOvershoot) instance.stop();
						else instance.gotoAndStop(instance.totalFrames-1);

						if(this.setVisibility) {
							if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else instance.visible = this.endVisible;
						}
	
						if(endCallback) {
							endCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
	
						if(!this.resolved && !this.resolveOnCallbackOnly) {
							this.resolved = true;
							resolve({passValue: this._passValue});
							this.passValue = undefined;
						}
					}
	
					if(runtimeCallback) {
						runtimeCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								if(this.resolveOnCallbackEnds) {
									event.currentTarget.removeEventListener('change', this.eventHandler);
									instance.stop();
									if(this.setVisibility) {
										if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
										else instance.visible = this.endVisible;
									}
								}
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this._data, this._passValue, event);
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		// not used for reversed or bounce
		onMCCompleteLoopAndCall(instance, inReturnLabel, runtimeCallback, endCallback) {
			var returnPosition = instance.timeline.resolve(inReturnLabel);
			var returnFrame = returnPosition;
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skipRuntimeCallback = false; // this is a hack to avoid callback running extra times
				this.eventHandler = function(event) {
					if(instance.currentFrame >= instance.totalFrames) {
						if(this.loopCount <= 0 || this._loopCounter-- > 0) {
							instance.gotoAndPlay(returnFrame);
							skipRuntimeCallback = true;
						}
						else {
							event.currentTarget.removeEventListener('change', this.eventHandler);

							// allows overshoot otherwise force to last frame
							if(this.enableOvershoot) instance.stop();
							else instance.gotoAndStop(instance.totalFrames-1);
	
							if(this.setVisibility) {
								if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
								else instance.visible = this.endVisible;
							}
						}
	
						if(this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0) {
							if(this.loopCount > 0 && this.resolveOnLoopCount && endCallback) {
								endCallback((node, passValue) => {
									if(!this.resolved) {
										this.resolved = true;
										resolve({node, passValue});
										this.passValue = undefined;
									}
								}, this._data, this._passValue, event);
							}
							else if(!this.resolved && !this.resolveOnCallbackOnly) {
								this.resolved = true;
								resolve({passValue: this._passValue});
								this.passValue = undefined;
							}
						}
					}
	
					if(!skipRuntimeCallback) {
						if(runtimeCallback) {
							runtimeCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.resolveOnCallbackEnds) {
										event.currentTarget.removeEventListener('change', this.eventHandler);
										instance.stop();
										if(this.setVisibility) {
											if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
											else instance.visible = this.endVisible;
										}
									}
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
					}
					else
						skipRuntimeCallback = false;
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoopAtFrame(instance, inFrame, inReturnLabel, runtimeCallback, endCallback) {
			var frame = inFrame == null ? instance.totalFrames-1 : inFrame;
			var returnLabel = inReturnLabel || 0;
			if(this.reversed) [frame, returnLabel] = [returnLabel, frame];
	
			var labelPosition = frame != null ? instance.timeline.resolve(frame) : frame;
			var returnPosition = instance.timeline.resolve(returnLabel);
			var returnFrame = !this.reversed ? returnPosition : AnimationObject.reverseFrame(instance, returnPosition + (inFrame != null && inReturnLabel == null ? 1 : 0));
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skipRuntimeCallback = false; // this is a hack to avoid callback running extra times
				var loopBackToReturnFrame = false;
				this.eventHandler = function(event) {
					if(!this.resume || (this.reversed ? event.currentTarget.position >= labelPosition : event.currentTarget.position <= labelPosition)) {
						if(labelPosition != null && this.reversed ? (labelPosition == 0 ? event.currentTarget.position <= 1 : event.currentTarget.position < labelPosition) : event.currentTarget.position > labelPosition) {
							if(this.loopCount <= 0 || this._loopCounter-- > 0) {
								if(this.reversed && labelPosition == 0 && event.currentTarget.position <= 1) {
									this._data.on('tick', e => (instance.gotoAndPlay(returnFrame+1), e.remove())).seqcontrolType = this.type;
									skipRuntimeCallback = true;
									loopBackToReturnFrame = true;
								}
								else {
									if(!loopBackToReturnFrame) instance.gotoAndPlay(returnFrame);
									if(this.reversed && labelPosition) skipRuntimeCallback = true;
								}
							}
							else {
								event.currentTarget.removeEventListener('change', this.eventHandler);

								if(this.reversed)
									instance.stop();
								else {
									if(this.enableOvershoot) instance.stop();
									else if(event.currentTarget.position > labelPosition) instance.gotoAndStop(labelPosition);
								}

								if(this.setVisibility) {
									if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
									else instance.visible = this.endVisible;
								}
							}
	
							if(this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0) {
								if(this.loopCount > 0 && this.resolveOnLoopCount && endCallback) { // this._loopCounter < 0 and also endCB
									if(!this.resolved && !this.resolveOnCallbackOnly) {
										this.resolved = true;
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
										resolve({passValue: this._passValue});
										this.passValue = undefined;
									}

									endCallback((node, passValue) => {
										if(!this.resolved) {
											this.resolved = true;
											if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
											resolve({node, passValue});
											this.passValue = undefined;
										}
									}, this._data, this._passValue, event);
								}
								else if(!this.resolved && !this.resolveOnCallbackOnly) { // either (no endCB BUT resolveOnLoopCount or no loopCount) or (endCB and no resolveOnLoopCount or loopCount not used)
									// because resolveOnLoopCount may not be used and/or loopCount not used (in which case we never call endCB) or endCB is not even present then we resolve but never call endCB
									this.resolved = true;
									// if there is a loopCount but no resolveOnLoopCount we still resolve, is it still looping?
									if(this.loopCount > 0 && this._loopCounter < 0) {
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
									}
									resolve({passValue: this._passValue});
									this.passValue = undefined;
								}
							}
						}
						else if(loopBackToReturnFrame) {
							instance.gotoAndPlay(returnFrame);
							loopBackToReturnFrame = false;
						}
					}
	
					if(!skipRuntimeCallback) {
						if(runtimeCallback) {
							runtimeCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.resolveOnCallbackEnds) { // if resolveOnCallbackEnds is disabled this may cause the eventHandler injectUpdateTimeline and to persist, must use reset to removeUpdateTimeline
										event.currentTarget.removeEventListener('change', this.eventHandler);
										
										if(this.reversed)
											instance.stop();
										else {
											if(!this.enableOvershoot && event.currentTarget.position > labelPosition) instance.gotoAndStop(labelPosition);
											else instance.stop();
										}
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
										
										if(this.setVisibility) {
											if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
											else instance.visible = this.endVisible;
										}
									}
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
					}
					else
						skipRuntimeCallback = false;
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteBounceAtFrame(instance, inFrame, inReturnLabel, runtimeCallback, endCallback) {
			var frame = inFrame == null ? instance.totalFrames-1 : inFrame;
			var returnLabel = inReturnLabel || 0;
	
			var labelPosition = frame != null ? instance.timeline.resolve(frame) : frame;
			var labelFrame = labelPosition;
			var returnPosition = instance.timeline.resolve(returnLabel);
			var returnFrame = returnPosition;
			if(this.reversed) [labelFrame, returnFrame, labelPosition, returnPosition] = [returnFrame, labelFrame, returnPosition, labelPosition];
	
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skipRuntimeCallback = false; // this is a hack to avoid callback running extra times
				this.eventHandler = function(event) {
					if(!this.resume || (instance.timeline.reversed ? event.currentTarget.position >= labelPosition : event.currentTarget.position <= labelPosition)) {
						if(labelPosition != null && (instance.timeline.reversed ? (labelPosition == 0 ? event.currentTarget.position <= 0 : event.currentTarget.position <= labelPosition) : event.currentTarget.position > labelPosition)) {
							if(this.loopCount <= 0 || this._loopCounter-- > 0) {
								if(this.bounce) {
									instance.timeline.reversed = !instance.timeline.reversed;
									var frameToGo = !instance.timeline.reversed ? labelFrame : AnimationObject.reverseFrame(instance, labelFrame-1);
									[labelFrame, returnFrame, labelPosition, returnPosition] = [returnFrame, labelFrame, returnPosition, labelPosition];
									instance.gotoAndPlay(frameToGo);
								}
								else {
									var frameToGo = !instance.timeline.reversed ? returnFrame : AnimationObject.reverseFrame(instance, returnFrame-1);
									instance.gotoAndPlay(frameToGo);
								}
								skipRuntimeCallback = true;
							}
							else {
								event.currentTarget.removeEventListener('change', this.eventHandler);

								if(instance.timeline.reversed)
									instance.stop();
								else {
									if(this.enableOvershoot) instance.stop();
									else if(event.currentTarget.position > labelPosition) instance.gotoAndStop(labelPosition);
								}

								if(this.setVisibility) {
									if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
									else instance.visible = this.endVisible;
								}
							}
	
							if(this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0) {
								if(this.loopCount > 0 && this.resolveOnLoopCount && endCallback) { // this._loopCounter < 0 and also endCB
									if(!this.resolved && !this.resolveOnCallbackOnly) {
										this.resolved = true;
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
										resolve({passValue: this._passValue});
										this.passValue = undefined;
									}

									endCallback((node, passValue) => {
										if(!this.resolved) {
											this.resolved = true;
											if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
											resolve({node, passValue});
											this.passValue = undefined;
										}
									}, this._data, this._passValue, event);
								}
								else if(!this.resolved && !this.resolveOnCallbackOnly) { // either (no endCB BUT resolveOnLoopCount or no loopCount) or (endCB and no resolveOnLoopCount or loopCount not used)
									// because resolveOnLoopCount may not be used and/or loopCount not used (in which case we never call endCB) or endCB is not even present then we resolve but never call endCB
									this.resolved = true;
									// if there is a loopCount but no resolveOnLoopCount we still resolve, is it still looping?
									if(this.loopCount > 0 && this._loopCounter < 0) {
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
									}
									resolve({passValue: this._passValue});
									this.passValue = undefined;
								}
							}
						}
					}
	
					if(!skipRuntimeCallback) {
						if(runtimeCallback) {
							runtimeCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.resolveOnCallbackEnds) { // if resolveOnCallbackEnds is disabled this may cause the eventHandler injectUpdateTimeline and to persist, must use reset to removeUpdateTimeline
										event.currentTarget.removeEventListener('change', this.eventHandler);

										if(this.reversed)
											instance.stop();
										else {
											if(!this.enableOvershoot && event.currentTarget.position > labelPosition) instance.gotoAndStop(labelPosition);
											else instance.stop();
										}
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);

										if(this.setVisibility) {
											if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
											else instance.visible = this.endVisible;
										}
									}
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
					}
					else
						skipRuntimeCallback = false;
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteStopAtFrame(instance, inFrame, runtimeCallback, endCallback) {
			var labelPosition = instance.timeline.resolve(inFrame);
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					if(!this.resume || (this.reversed ? event.currentTarget.position >= labelPosition : event.currentTarget.position <= labelPosition)) {
						if(labelPosition != null  && (this.reversed ? event.currentTarget.position <= labelPosition : event.currentTarget.position >= labelPosition)) {
							event.currentTarget.removeEventListener('change', this.eventHandler);
							if(!this.noStopLabel) {
								if(this.enableOvershoot) instance.stop();
								else {
									instance.gotoAndStop(labelPosition);
									if(this.snapToLabel && !this.restoreActionsStateNextTick) this._data.on('tick', () => instance.gotoAndStop(labelPosition), undefined, true).seqcontrolType = this.type;
								}
							}
							if(this.setVisibility) {
								if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
								else instance.visible = this.endVisible;
							}
	
							if(endCallback) {
								endCallback((node, passValue) => {
									if(!this.resolved) {
										this.resolved = true;
										if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);
										resolve({node, passValue});
										this.passValue = undefined;
									}
								}, this._data, this._passValue, event);
							}
	
							if(!this.resolved && !this.resolveOnCallbackOnly) {
								this.resolved = true;
								if(!this.enableOvershoot && !this.noStopLabel) {
									if(this.restoreActionsStateNextTick) {
										if(this.snapToLabel)
											this._data.on('tick', () => { instance.gotoAndStop(labelPosition); AnimationObject.removeUpdateTimeline(instance); }, undefined, true).seqcontrolType = this.type;
										else
											this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type;
									}
									else
										AnimationObject.removeUpdateTimeline(instance);
								}
								resolve({passValue: this._passValue});
								this.passValue = undefined;
							}
						}
					}
	
					if(runtimeCallback) {
						runtimeCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								if(this.resolveOnCallbackEnds) { // if resolveOnCallbackEnds is disabled this may cause the eventHandler injectUpdateTimeline and to persist, eventually should remove at complete event or use reset to removeUpdateTimeline
									event.currentTarget.removeEventListener('change', this.eventHandler);

									if(this.reversed)
										instance.stop();
									else {
										if(!this.enableOvershoot && event.currentTarget.position > labelPosition) instance.gotoAndStop(labelPosition);
										else instance.stop();
									}
									if(!this.enableOvershoot && !this.noStopLabel) if(this.restoreActionsStateNextTick) this._data.on('tick', () => AnimationObject.removeUpdateTimeline(instance), undefined, true).seqcontrolType = this.type; else AnimationObject.removeUpdateTimeline(instance);

									if(this.setVisibility) {
										if(this.endVisibleNextTick) this._data.on('tick', () => instance.visible = this.endVisible, null, true).seqcontrolType = this.type;
										else instance.visible = this.endVisible;
									}
								}
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this._data, this._passValue, event);
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	}
	
	// BEGIN SHIM MODIFICATIONS	
	class SpritifyObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
	//		this._numDisableTicksStates = 3;
	
			this.removeSprite = inOptions && "removeSprite" in inOptions ? inOptions.removeSprite : false;

			this.singleSpriteSheet = inOptions && "singleSpriteSheet" in inOptions ? inOptions.singleSpriteSheet : false; // try use same spriteSheet for all sprites built
			this.animation = inOptions && "animation" in inOptions ? inOptions.animation : null;

			// in spritify() the priority is numFrames > buildOptions is callback > concatenatedScale
			this.concatenatedScale = inOptions && "concatenatedScale" in inOptions ? inOptions.concatenatedScale : false;
			this.numFrames = inOptions && "numFrames" in inOptions ? inOptions.numFrames : null;

			this.buildScale = inOptions && "buildScale" in inOptions ? inOptions.buildScale : null;

			this.buildOptions = inOptions && "buildOptions" in inOptions ? inOptions.buildOptions : null;
			this.useSetupMovieClipFrame = inOptions && "useSetupMovieClipFrame" in inOptions ? inOptions.useSetupMovieClipFrame : true; // if buildOptions is a callback enable useSetupMovieClipFrame to automatically advance the playhead on build

			this.rebuildSprite = inOptions && "rebuildSprite" in inOptions ? inOptions.rebuildSprite : false; // rebuilds sprite on re-run
			this.swapSprite = inOptions && "swapSprite" in inOptions ? inOptions.swapSprite : true; // when building from MC swap the original with sprite
			this.preserveRegistration = inOptions && "preserveRegistration" in inOptions ? inOptions.preserveRegistration : true; // note that spritify() will check that buildScale or buildOptions are used to enable this option 
			this.preserveSize = inOptions && "preserveSize" in inOptions ? inOptions.preserveSize : true; // note that spritify() will check that buildScale or buildOptions are used to enable this option
 
			this.trim = inOptions && "trim" in inOptions ? inOptions.trim : 0;
			this.padding = inOptions && "padding" in inOptions ? inOptions.padding : 1;
			this.maxWidth = inOptions && "maxWidth" in inOptions ? inOptions.maxWidth : 2048;
			this.maxHeight = inOptions && "maxHeight" in inOptions ? inOptions.maxHeight : 2048;
	
			this.postAction = inOptions && "postAction" in inOptions ? inOptions.postAction : SpritifyObject.REWIND; // when building from MC stop the original

			this.matchFramerate = inOptions && "matchFramerate" in inOptions ? inOptions.matchFramerate : true;

			this.disableCache = inOptions && "disableCache" in inOptions ? inOptions.disableCache : true; // disables cache temporarily in order to create sprite
			this.disableTicks = inOptions && "disableTicks" in inOptions ? inOptions.disableTicks : SpritifyObject.DISABLE_TICK_SELF;
	
			this.buildAsync = inOptions && "buildAsync" in inOptions ? inOptions.buildAsync : false;
			
			this.builderOptions = {animation: this.animation, numFrames: this.numFrames, buildOptions: this.buildOptions, buildAsync: this.buildAsync, padding: this.padding, maxWidth: this.maxWidth, maxHeight: this.maxHeight, buildScale: this.buildScale}; // these are options that will be passed to buildSprite
	
			this.spriteBuiltCallback = inOptions && "spriteBuiltCallback" in inOptions ? inOptions.spriteBuiltCallback : null;
			this.spritemap = inOptions && "spritemap" in inOptions ? inOptions.spritemap : true; // same as spritify options true for internal spritemap or string for custom spritemap
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;
			
			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this._startCallbackResolveHolder = null;
		}

		get type() {
			return "SpritifyObject";
		}
		
		// get buildScale() {
		// 	return this._buildScale;
		// }
	
		// set buildScale(inNum = null) {
		// 	this._buildScale = !this.concatenatedScale && inNum === 1 ? null : inNum;
		// }
	
		get disableTicks() {
			return this._disableTicks;
		}
	
		set disableTicks(inMode = SpritifyObject.DISABLE_TICK_SELF) {
			this._disableTicks = inMode !== null && inMode !== "" && inMode >= 0 && inMode < SpritifyObject.NUM_DISABLE_TICK_STATES ? inMode : SpritifyObject.DISABLE_TICK_SELF;
		}
	
		set data(inData) {
			this._data = Array.isArray(inData) ? [...inData] : [inData];
		}
	
		get data() {
			return this._data;
		}
	
		static get SPRITES() {
			return (SpritifyObject._SPRITES = SpritifyObject._SPRITES || new Map());
		}
	
		static clearSprites() {
			return SpritifyObject._SPRITES.clear();
		}
	
		static clearSPRITES() {
			return SpritifyObject._SPRITES.clear();
		}

		static setupMovieClipFrame(source, data) {
			var ae = source.actionsEnabled;
			source.actionsEnabled = false;
			source.gotoAndStop(data.i);
			source.actionsEnabled = ae;
			return data.f&&data.f(source, data.d, data.i);
		}
	
		// this will return a sprite with a sprite from a spriteSheetBuilder according to options given
		// if building async, you may supply a resolve callback
		// Returns a sprite normally but with deferred returns {spriteHolder, builder};
		// buildOptions is a JS Object or a callback function
		// a buildOptions object is of the form {target, sourceRect, scale, setupFunction, setupData}
		// a buildOptions callback must be of the form function(target, i) and returns a buildOptions object
		// 		target: the target of buildSprite
		//		i: the index of the frame of the sprite that will be drawn (not necessarily the current frame of the target)
		// the properties of the buildOptions object are all optional however if using a buildOptions callback
		// it must ALWAYS return at least an empty JS Object
		// buildOptions object {target, sourceRect, scale, setupFunction, setupData}
		//		target: (optional) source DisplayObject to build from
		//		sourceRect: (optional) Rectangle of source, Default uses getBounds(), bounds or nominalBounds or skips frame
		//		scale: (optional) scale to draw, Default is 1
		//		setupFunction: (optional) function to call immediately before drawing the frame of the form function(source, setupData, [index])
		// 				NOTE: index is not passed if buildOptions is callback or if numFrames is specified
		//				setupFunction must be used to advance per frame unless useSetupMovieClipFrame is enabled
		//		setupData: (optional) arbitrary setup data Object to pass to setupFunction
		static buildSprite(target, inOptions, resolve = null, builder = null, defer = false) {
			var spriteHolder = {target};
			var pausedState = target.paused;
			var originalFrame = target.currentFrame;
	
			var animation = inOptions && "animation" in inOptions ? inOptions.animation : null;
			var numFrames = inOptions && "numFrames" in inOptions ? inOptions.numFrames : null;
			var concatenatedScale = inOptions && "concatenatedScale" in inOptions ? inOptions.concatenatedScale : false;
			
			// if concatenatedScale is enabled then allow buildScale == 1
			var buildScale = inOptions && "buildScale" in inOptions ? (concatenatedScale || inOptions.buildScale != 1 ? inOptions.buildScale : null) : null;
			var buildOptions = inOptions && "buildOptions" in inOptions ? (inOptions.buildOptions || {}) : {}; // cannot be null
	
			var buildIsCallback = typeof buildOptions === 'function';
			var useSetupMovieClipFrame = inOptions && "useSetupMovieClipFrame" in inOptions ? inOptions.useSetupMovieClipFrame : true;
	
			// async, and builder events are not used in sequenceSprite's event loop but is here for static functionality
			// make sure to remove EventListeners when using the callbacks
			var buildAsync = inOptions && "buildAsync" in inOptions ? inOptions.buildAsync : false;
			var timeSlice = inOptions && "timeSlice" in inOptions ? inOptions.timeSlice : null;
			var completeCB = inOptions && "completeCB" in inOptions ? inOptions.completeCB : null;
			var progressCB = inOptions && "progressCB" in inOptions ? inOptions.progressCB : null;

			if(!builder) {
				builder = new createjs.SpriteSheetBuilder();

				 // if one or more of the following params is null then it is disregarded and undefined
				if(inOptions) {
					if("padding" in inOptions && inOptions.padding != null) builder.padding = inOptions.padding;
					if("maxWidth" in inOptions && inOptions.maxWidth != null) builder.maxWidth = inOptions.maxWidth;
					if("maxHeight" in inOptions && inOptions.maxHeight != null) builder.maxHeight = inOptions.maxHeight;
				}
			}
	
			if(!concatenatedScale && !buildIsCallback && !numFrames) {
				buildOptions.scale = buildOptions.scale || buildScale;
				if(defer) {
					var start = builder._frames.length;
					builder.addMovieClip(target, buildOptions.sourceRect, buildOptions.scale, buildOptions.setupFunction, buildOptions.setupData, buildOptions.labelFunction, true);
					var end = builder._frames.length;
					var frames = [];
					for (var j=start; j<end; j++) { frames.push(j); }
					if(animation) builder.addAnimation(animation, frames); // animation should be given from spritify below
				}
				else
					builder.addMovieClip(target, buildOptions.sourceRect, buildOptions.scale, buildOptions.setupFunction, buildOptions.setupData, buildOptions.labelFunction, true);
			}
			else {
				var frames = [];
				if(concatenatedScale) { // just concatenated scale
					var currentFrame = target.currentFrame;

					var numFramesToRender = numFrames ? Math.min(numFrames, target.totalFrames) : target.totalFrames;
					for(var i=0; i<numFramesToRender; i++) {
						let options = buildOptions || {};
						let setupFunction;
						let setupData;
						options.scale = options.scale || buildScale;
						setupFunction = options.setupFunction
						setupData = options.setupData;

						if(useSetupMovieClipFrame) {
							setupFunction = SpritifyObject.setupMovieClipFrame;
							setupData = {i, f:options.setupFunction, d:options.setupData};
						}

						// this call of setupMovieClipFrame is used to calculate the scale and sourceRect per frame
						// which caches per frame data used later in the sprite building process
						// useSetupMovieClipFrame is needed so that a callback can be used to
						// retrieve this data per frame during the build process
						// if useSetupMovieClipFrame is disabled only the currentFrame gets rendered for each frame
						var resData = SpritifyObject.setupMovieClipFrame( target, {i, f: (source) => {
							var rects = source.frameBounds;
							var rect = source.bounds||source.nominalBounds;
							if (!rect&&source.getBounds) { rect = source.getBounds(); }
						
							var r = (rect || rects) && (rects && rects[i] && rects[i] || rect);
						
							var sourceRect = r && r.clone && r.clone();
							var scale = CacheObject.getConcatenatedScale(source);

							// if buildScale set then it is used like a maxScale
							if(buildScale) scale = Math.min(buildScale, scale);
						
							return {sourceRect, scale};
						}} );
						Object.assign(options, resData);

						let index = builder.addFrame(target, options.sourceRect, options.scale, setupFunction, setupData);
						frames.push(index);
					}
					target.gotoAndStop(currentFrame);
				}
				else if(numFrames) {
					for (var i = 0; i < numFrames; i++) {
						let options = buildIsCallback ? buildOptions(target, i) : buildOptions;
						if(buildIsCallback && !options) break; // break if callback returns null
						if(options) options.scale = options.scale || buildScale; // if scale is set in buildOptions then it overrides

						let setupFunction = options.setupFunction;
						let setupData = options.setupData;
						if(useSetupMovieClipFrame) {
							setupFunction = SpritifyObject.setupMovieClipFrame;
							setupData = {i:i, f:options.setupFunction, d:options.setupData};
						}

						let index = builder.addFrame(options.target || target, options.sourceRect, options.scale, setupFunction, setupData);
						frames.push(index);
					}
				}
				else { // buildIsCallback exists
					let counter = 0;
					let options = buildOptions(target, counter);
					if(options) options.scale = options.scale || buildScale;

					while(options) {
						let setupFunction = options.setupFunction;
						let setupData = options.setupData;
						if(useSetupMovieClipFrame) {
							setupFunction = SpritifyObject.setupMovieClipFrame;
							setupData = {i:counter, f:options.setupFunction, d:options.setupData};
						}

						let index = builder.addFrame(options.target || target, options.sourceRect, options.scale, setupFunction, setupData);
						frames.push(index);

						options = buildOptions(target, ++counter);
						if(options) options.scale = options.scale || buildScale;
					}
				}

				if(frames.length > 0) {
					if(animation == null) animation = target.name || "MC";	
					builder.addAnimation(animation, frames);
				}
			}
	
			if(completeCB) builder.addEventListener('complete', completeCB);
			if(progressCB) builder.addEventListener('progress', progressCB);
			builder.on('complete', () => {
				target.currentFrame = originalFrame;
				target.paused = pausedState;
				spriteHolder.sprite = spriteHolder.sprite || new createjs.Sprite(builder.spriteSheet, animation);

				spriteHolder.sprite._defaultAnimation = animation;

				if(resolve) resolve(spriteHolder.sprite);
			}, null, true);

			if(defer) return {spriteHolder, builder};

			var targetSheet = buildAsync ? builder.buildAsync(timeSlice) : builder.build();	
			if(targetSheet) spriteHolder.sprite = spriteHolder.sprite || new createjs.Sprite(targetSheet, animation);

			return spriteHolder.sprite;
		}
	
		// will override draw method on target MovieClip and replace with function that draws sprite instead
		static injectSpriteDraw(sprite, target, {trim = 0, preserveSize = false, preserveRegistration = false}) {
			if(!sprite) return false;

			if(!!(target[SYMBOLS.PROTECTED_DRAW])) return false;

			target[SYMBOLS.PROTECTED_DRAW] = target.draw;
			target[SYMBOLS.PROTECTED_CONTAINER_DRAW] = target.Container_draw;
			target[SYMBOLS.CHILDREN] = target.children;
			target[SYMBOLS.WEBGLRENDERSTYLE] = target._webGLRenderStyle;
			target[SYMBOLS.SPRITESHEET] = target.spriteSheet;
			target[SYMBOLS.CURRENTFRAME] = target.currentFrame;
			
			target[SYMBOLS.TICKENABLED] = target.tickEnabled;
			target[SYMBOLS.TICKCHILDREN] = target.tickChildren;
	
			target.children = false; // this is necessary for stageGL
			target._webGLRenderStyle = 1;
			target.spriteSheet = sprite.spriteSheet;
	
			Object.defineProperty(target, "currentFrame", {
				get: function currentFrame() {
					return sprite.currentFrame;
				},
				set: function currentFrame(inFrame) {
					sprite.gotoAndStop(Math.min(inFrame, this.totalFrames-1));
				}
			});
	
			target[SYMBOLS.ADDCHILDAT] = target.addChildAt;
			target.addChildAt = function() {return null;};
	
			// create a modded get frame that we save on the sprite and make sure clone will propagate it
			if(!(sprite[SYMBOLS.GET_FRAME])) {
				// save out reg coords the first time that the sprite is injected
				var frameRegOffset = (({regX, regY}) => ({regX, regY}))(target);
				var defaultAnimation = sprite.spriteSheet.getAnimation(sprite._defaultAnimation);
				sprite[SYMBOLS.GET_FRAME] = function(frameIndex) {
					var clone = {};
					if(defaultAnimation) frameIndex = defaultAnimation.frames[frameIndex];
					var frame = this.spriteSheet.getFrame(frameIndex);
					clone.image = frame.image;
					clone.rect = frame.rect.clone();
					clone.regX = frame.regX - frameRegOffset.regX;
					clone.regY = frame.regY - frameRegOffset.regY;
					clone.preserveRegistration = preserveRegistration;
					clone.preserveSize = preserveSize;
					clone.trim = trim;

					clone.rotated = frame.rotated; // rotated is not an option in spritify right now so this should be undefined

					var frameScale = (frame.scale !== 0 && frame.scale) || 1;
					if(preserveSize) clone.scale = frameScale; // frame scale is not createjs default but we built it into spritify()
					if(preserveRegistration) {
						clone.oRegX = (frame.regX||0 + frameRegOffset.regX)/frameScale - frameRegOffset.regX;
						clone.oRegY = (frame.regY||0 + frameRegOffset.regY)/frameScale - frameRegOffset.regY;
					}

					if(frame.uvRect) Object.assign(clone.uvRect = {}, frame.uvRect);
					return clone;
				};
			}
	
			// rewrite draw for non StageGL call using modded getFrame from sprite as well as a trim factor we have incluided
			// also includes modifications to support rotated property although it should never be encountered because
			// the spriteSheetBuilder currently does not support it
			// I am including it here for continuity sake and for the possibility of future support
			// Also add support for Sprite warning shader
			target.draw = (ctx, ignoreCache) => {
				if (target.DisplayObject_draw(ctx, ignoreCache)) { return true; }
				if(target.mode !== createjs.MovieClip.INDEPENDENT) {
					target._updateState(); // to support Graphic Symbol Animations
					if(target.currentFrame !== target.timeline.position) target._bound_resolveState(); // for graphic symbol sprites make sure timeline is in sync
				}
				sprite._normalizeFrame();
				var o = sprite[SYMBOLS.GET_FRAME](sprite._currentFrame|0);
				if (!o) { return false; }
				var rect = o.rect;
				var width = rect.width - trim;
				var height = rect.height - trim;

				var regX = o.regX;
				var regY = o.regY;
				var scale = 1;

				if(preserveSize) scale = 1/o.scale;
				if(preserveRegistration) {
					regX = o.oRegX;
					regY = o.oRegY;
				}

				// this should not happen because rotated is not an option in the SpriteSheetBuilder
				if(o.rotated) {					
					ctx.rotate(-90*Math.PI/180);
					ctx.translate(-rect.width, 0);
				}

				if(width && height) { 
					// createjs[SYMBOLS.WARNING_COLORS] can be set from 0 to 7
					// 0: none
					// 1: sprites from imported spritesheets (AnimateCC)
					// 2: sprites from spritify()
					// 3: all sprites
					if(createjs[SYMBOLS.WARNING_COLORS] & 2) {
						ctx.fillStyle = createjs[SYMBOLS.SPRITE_COLOR];
						ctx.fillRect(-regX, -regY, width*scale, height*scale);
					}
					else
						ctx.drawImage(o.image, rect.x, rect.y, width, height, -regX, -regY, width*scale, height*scale);
				}
				return true;
			};
	
			// rewriting Container_draw to support caching of spritified MCs
			// cache will be of original MC and not Sprite
			target.Container_draw = (ctx, ignoreCache) => {
				if (target.DisplayObject_draw(ctx, ignoreCache)) { return true; }
				// this ensures we don't have issues with display list changes that occur during a draw:
				var list = target[SYMBOLS.CHILDREN].slice();
				for (var i=0,l=list.length; i<l; i++) {
					var child = list[i];
					if (!child.isVisible()) { continue; }
					
					// draw the child:
					ctx.save();
					child.updateContext(ctx);
					child.draw(ctx);
					ctx.restore();
				}
				return true;
			};
	
			target[SYMBOLS.SPRITE] = sprite;
	
			return true;
		}
	
		static removeSpriteDraw(target) {
			var targets = Array.isArray(target) ? target : [target];

			return targets.forEach(i => {
				if(SYMBOLS.SPRITE in i) {
					i.draw = i[SYMBOLS.PROTECTED_DRAW];
					delete i[SYMBOLS.PROTECTED_DRAW];
		
					i.Container_draw = i[SYMBOLS.PROTECTED_CONTAINER_DRAW];
					delete i[SYMBOLS.PROTECTED_CONTAINER_DRAW];
		
					i.children = i[SYMBOLS.CHILDREN];
					delete i[SYMBOLS.CHILDREN];
		
					i._webGLRenderStyle = i[SYMBOLS.WEBGLRENDERSTYLE];
					delete i[SYMBOLS.WEBGLRENDERSTYLE];
		
					i.spriteSheet = i[SYMBOLS.SPRITESHEET];
					delete i[SYMBOLS.SPRITESHEET];
		
					delete i.currentFrame;
					i.currentFrame = i[SYMBOLS.CURRENTFRAME];
					delete i[SYMBOLS.CURRENTFRAME];
		
					i.addChildAt = i[SYMBOLS.ADDCHILDAT];
					delete i[SYMBOLS.ADDCHILDAT];
		
					i.tickEnabled = i[SYMBOLS.TICKENABLED];
					delete i[SYMBOLS.TICKENABLED];
		
					i.tickChildren = i[SYMBOLS.TICKCHILDREN];
					delete i[SYMBOLS.TICKCHILDREN];
		
					if(SYMBOLS.GET_FRAME in i[SYMBOLS.SPRITE]) delete i[SYMBOLS.SPRITE][SYMBOLS.GET_FRAME]; // here remove mod getFrame
					if(SYMBOLS.SPRITE_TICK in i[SYMBOLS.SPRITE]) {
						createjs.Ticker.removeEventListener('tick', i[SYMBOLS.SPRITE][SYMBOLS.SPRITE_TICK]);
						delete i[SYMBOLS.SPRITE][SYMBOLS.SPRITE_TICK];
					}
					delete i[SYMBOLS.SPRITE];

					return true;
				}
				return false;
			});
		}
	
		static swapWithprite(sprite, target, {swapCallback, trim = 0, disableTicks = SpritifyObject.DISABLE_TICK_SELF, preserveSize = false, preserveRegistration = false}) {
			var curFrame = target.currentFrame;
			if(SpritifyObject.injectSpriteDraw(sprite, target, {trim, preserveSize, preserveRegistration})) {
				sprite.gotoAndStop(curFrame);
				if(swapCallback) swapCallback(target, sprite);
	
				switch(disableTicks) {
					case SpritifyObject.DISABLE_TICK_CHILDREN_SPRITE:
						sprite.tickEnabled = false;
					case SpritifyObject.DISABLE_TICK_CHILDREN:
						target[SYMBOLS.TICKCHILDREN] = target.tickChildren;
						target.tickChildren = false;
						break;
					case SpritifyObject.DISABLE_TICK_SELF_SPRITE:
						sprite.tickEnabled = false;
					case SpritifyObject.DISABLE_TICK_SELF:
						target[SYMBOLS.TICKENABLED] = target.tickEnabled;
						target.tickEnabled = false;
						break;
					default:
						break;
				}

				sprite[SYMBOLS.SPRITE_TICK] = e => sprite.tickEnabled&&sprite._tick(e);
				createjs.Ticker.addEventListener('tick', sprite[SYMBOLS.SPRITE_TICK]);
			}
		}
	
		// utility to create a sprite and save it in Sprite library
		// spritemap: Map of key-value pairs of a key (usually the MovieClip name) and a Sprite object
		//            pass in a Map to use as spritemap
		//			  true to use SpritifyObject.SPRITES as spritemap
		//            if not true or Map object then no spritemap used
		// OPTIONS:
		// includes options from buildSprite {animation, numFrames, buildOptions, buildAsync, timeSlice, completeCB, progressCB}
		// clone: creates clone of sprite if exists in spritemap, if false will use sprite if exists otherwise builds new
		// swapSprite: if building or not building, it will swap sprite
		// preserveRegistration: when swap sprite enabled and scaling is applied the registration point will change to keep the center in same position
		//                       in some cases this is not desirable. For example, you may build a sprite at smaller resolution
		//                       and draw at higher scale to maintain size. To do this you need to preserve the original regX and regY
		//                       and enable preserveSize
		// preserveSize: applies a compensatory inverse scale to maintain the perceived size of the image
		//               use in conjunction with preserveRegistration to swap with a lower or higher resolution sprite of the target clip
		// sourceName: specifiies key (string or object) to identify sprite in SpriteMap, if null or undefined uses target constructor object
		//				*important as this is used to determine if clone or create new sprite
		// NOTE: library symbol may not have name if created from constructor and spritify called inside timeline
		// also keep in mind that the spriteBuilder does not dispatch ticks
		// therefore you must use the setupFunc buildOption to manually trigger tick eventHandlers
		// such as with AdobeAn.handleFilterCache (note since this method used ticks, you will therefore need to cache the frame before during setupFunc)
		// you may use CacheObject.handleFilterCache to facillitate this
		// disableCache: disables cache temporarily in order to create sprite
		// disableTicks: sets target tickEnabled property to false
		// resolve: if callback exists it resolves an object containing {sprite, target, source, message}
		//				message can be consoled to reveal the outcome of sprite build
		static spritify(inTarget, spritemap = true, inOptions, res) {
			function swapClone(src) {
				var clone = src.clone();
				clone[SYMBOLS.GET_FRAME] = src[SYMBOLS.GET_FRAME];
				return clone;
			}

			var postAction = inOptions && "postAction" in inOptions ? inOptions.postAction : SpritifyObject.REWIND;
			var postActionCB = null;

			switch(postAction) {
				case SpritifyObject.STOP:
					postActionCB = tgt => tgt.stop();
					break;
				case SpritifyObject.REWIND:
					postActionCB = tgt => tgt.gotoAndStop(0);
					break;
				case SpritifyObject.PLAY:
					postActionCB = tgt => tgt.play();
					break;
				default:
					break;
			}

			var processTarget = function (target, sourceName, options, resolve, builder = null, defer = false) {
				var sprite = null;

				if(target[SYMBOLS.SPRITE]) {
					sprite = target[SYMBOLS.SPRITE];
					if(spritemap && !spritemap.has(sourceName)) spritemap.set(sourceName, sprite); 
		
					// if sprite is null and source is null then target already had a sprite
					if(resolve) resolve({sprite: null, target, source: null, message: "sprite not generated"});
				}
				else {
					var tempBitmapCache;
					if(disableCache && target.bitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];

					// if it is a graphic symbol then must set as independent to build sprite and then set back to synched
					var mode = target.mode;
					if(target.mode !== createjs.MovieClip.INDEPENDENT) target.mode = createjs.MovieClip.INDEPENDENT;

					if(buildAsync) {
						if(spritemap && spritemap.has(sourceName)) {
							var sourceSprite = spritemap.get(sourceName);
							sprite = clone ? swapClone(sourceSprite) : sourceSprite;
							if(swapSprite) SpritifyObject.swapWithprite(sprite, target, {swapCallback: postActionCB, trim, disableTicks, preserveSize, preserveRegistration});
		
							if(disableCache && tempBitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];
							if(mode !== createjs.MovieClip.INDEPENDENT) target.mode = mode; // set back to synched
							
							// if sourceSpite exists and is same as sprite then sprite is reference to a sprite, i.e. it is same exact sprite
							// otherwise it is is not same as sprite and it is clone
							if(resolve) resolve({sprite, target, source: sourceSprite, message: sprite==sourceSprite?"sprite is referenced":"sprite is cloned"});
						}
						else {
							if(!defer) {
								SpritifyObject.buildSprite(target, options, spr => {
									// sprite = spriteHolder.sprite;
									if(swapSprite) SpritifyObject.swapWithprite(spr, target, {swapCallback: postActionCB, trim, disableTicks, preserveSize, preserveRegistration});
									if(spritemap && sourceName) spritemap.set(sourceName, spr);
									if(matchFramerate) spr.framerate = createjs.Ticker.framerate;

									if(disableCache && tempBitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];
									if(mode !== createjs.MovieClip.INDEPENDENT) target.mode = mode; // set back to synched
			
									// sourceSprite does not exists then sprite is not clone or a reference, it is newly generated original
									if(resolve) resolve({sprite: spr, target, source: null, message: "sprite generated"});
								});
							}
							else {
								// returns object {spriteHolder, builder}
								// sprite is NOT sprite but above object
								sprite = SpritifyObject.buildSprite(target, options, spr => {
									if(disableCache && tempBitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];
									if(mode !== createjs.MovieClip.INDEPENDENT) target.mode = mode; // set back to synched

									if(resolve) resolve({sprite: spr, target, source: null, message: "sprite generated"});
								}, builder, defer);
							}
						}
					}
					else {
						if(spritemap && spritemap.has(sourceName)) {
							var sourceSprite = spritemap.get(sourceName);
							sprite = clone ? swapClone(sourceSprite) : sourceSprite;
							if(swapSprite) SpritifyObject.swapWithprite(sprite, target, {swapCallback: postActionCB, trim, disableTicks, preserveSize, preserveRegistration});
		
							if(disableCache && tempBitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];
							if(mode !== createjs.MovieClip.INDEPENDENT) target.mode = mode; // set back to synched

							// if sourceSpite exists and is same as sprite then sprite is reference to a sprite, i.e. it is same exact sprite
							// otherwise it is is not same as sprite and it is clone
							if(resolve) resolve({sprite, target, source: sourceSprite, message: sprite==sourceSprite?"sprite is referenced":"sprite is cloned"});
						}
						else {
							if(!defer) {
								sprite = SpritifyObject.buildSprite(target, options, undefined, builder, defer);
								if(swapSprite) SpritifyObject.swapWithprite(sprite, target, {swapCallback: postActionCB, trim, disableTicks, preserveSize, preserveRegistration});
								if(spritemap && sourceName) spritemap.set(sourceName, sprite);
								if(matchFramerate) sprite.framerate = createjs.Ticker.framerate;
	
								if(disableCache && tempBitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];
								if(mode !== createjs.MovieClip.INDEPENDENT) target.mode = mode; // set back to synched

								// sourceSprite does not exists then sprite is not clone or a reference, it is newly generated original
								if(resolve) resolve({sprite, target, source: null, message: "sprite generated"});
							}
							else {
								// returns object {spriteHolder, builder}
								// sprite is NOT sprite but above object
								sprite = SpritifyObject.buildSprite(target, options, spr => {
									if(disableCache && tempBitmapCache) [tempBitmapCache, target.bitmapCache] = [target.bitmapCache, tempBitmapCache];
									if(mode !== createjs.MovieClip.INDEPENDENT) target.mode = mode; // set back to synched

									if(resolve) resolve({sprite: spr, target, source: null, message: "sprite generated"});
								}, builder, defer);
							}
						}
					}
				}
		
				return sprite;
			}.bind(this);

			if(spritemap === true)
				spritemap = SpritifyObject.SPRITES;
			else if(!(spritemap instanceof Map))
				spritemap = null;
	
			var buildAsync = inOptions && "buildAsync" in inOptions ? inOptions.buildAsync : false;
			var timeSlice = inOptions && "timeSlice" in inOptions ? inOptions.timeSlice : null;

			var clone = inOptions && "clone" in inOptions ? inOptions.clone : true;
			var swapSprite = inOptions && "swapSprite" in inOptions ? inOptions.swapSprite : true;

			var concatenatedScale = inOptions && "concatenatedScale" in inOptions ? inOptions.concatenatedScale : false;

			// these essentially convert null or undefined to true plus buildScale or buildOptions must be implemented otherwise false
			// spritify() signature defaults to true and forces to false if buildScale or buildOptions are not used
			// note swapWithSprite() defaults preserveRegistration and preserveSize as false in function signature
			var buildScale = inOptions && "buildScale" in inOptions ? concatenatedScale || inOptions.buildScale != 1 ? inOptions.buildScale : null : null;
			var buildOptions = inOptions && "buildOptions" in inOptions ? inOptions.buildOptions : null;
			
			var preserveRegistration = inOptions && "preserveRegistration" in inOptions ? inOptions.preserveRegistration : null;
			preserveRegistration = !!( (preserveRegistration == null || preserveRegistration) && (buildScale || buildOptions || concatenatedScale) );
			var preserveSize = inOptions && "preserveSize" in inOptions ? inOptions.preserveSize : null;
			preserveSize = !!( (preserveSize == null || preserveSize) && (buildScale || buildOptions || concatenatedScale) );
			
			var trim = inOptions && "trim" in inOptions ? inOptions.trim : 0;

			var disableCache = inOptions && "disableCache" in inOptions ? inOptions.disableCache : true;
			var disableTicks = inOptions && "disableTicks" in inOptions ? inOptions.disableTicks : SpritifyObject.DISABLE_TICK_SELF;

			var matchFramerate = inOptions && "matchFramerate" in inOptions ? inOptions.matchFramerate : true;
			var sourceNm = inOptions && "sourceName" in inOptions ? inOptions.sourceName : null;

			if(Array.isArray(inTarget)) {
				function cloneObject(obj) {
					var clone = {};
					for(var i in obj) {
						if(obj[i] != null &&  typeof(obj[i])=="object")
							clone[i] = cloneObject(obj[i]);
						else
							clone[i] = obj[i];
					}
					return clone;
				}

				function getUniqueName(name) {
					var nm = name.trim();
					var index = 1;
					
					if(nm == "") nm = "animation";
					var basename = nm;

					while(animationNames.includes(nm)) {
						nm = basename + index;
						index++;
					}

					return nm;
				}

				var spritesArr = null;
				var animationNames = [];
				if(buildAsync) {
					// acc is builder that gets created and same builder passed to targets
					// since it is defered builder is ultimately returned by reduce
					// use builder to build singleSpriteSheet
					var sprHolderArrBuilder = inTarget.reduce((acc, cur) => {
						var opts = cloneObject(inOptions);
						var animationName = getUniqueName(cur.name);
						animationNames.push(animationName);
						opts.animation = animationName;

						var spritePromRes = {};
						var spriteProm = new Promise(res => spritePromRes.res = res);
						acc.promises.push(spriteProm);

						var srcName = sourceNm || Object.getPrototypeOf(cur);

						var spriteHolderBuilderObj = processTarget(cur, srcName, opts, value => {
							// value will be of type example {sprite: spr, target, source: null, message: "sprite generated"}
							var spriteAsync = value.sprite;
							var targetAsync = value.target;
							
							if(swapSprite) SpritifyObject.swapWithprite(spriteAsync, targetAsync, {swapCallback: postActionCB, trim, disableTicks, preserveSize, preserveRegistration});
							if(spritemap && srcName) spritemap.set(srcName, spriteAsync);
							if(matchFramerate) spriteAsync.framerate = createjs.Ticker.framerate;
	
							spritePromRes.res && spritePromRes.res(value);
						}, acc.builder, true);

						acc.spriteHolders.push(spriteHolderBuilderObj.spriteHolder);
						acc.builder = spriteHolderBuilderObj.builder;
						return acc;
					}, {spriteHolders: [], promises: []});

					var builder = sprHolderArrBuilder.builder;
					var spriteProms = sprHolderArrBuilder.promises;

					var spriteHoldersArr = sprHolderArrBuilder.spriteHolders;
					builder.buildAsync(timeSlice);	
					Promise.all(spriteProms).then(values => res && res(values));
				}
				else {
					// acc is builder that gets created and same builder passed to targets
					// since it is defered builder is ultimately returned by reduce
					// use builder to build singleSpriteSheet
					var sprHolderArrBuilder = inTarget.reduce((acc, cur) => {
						var opts = cloneObject(inOptions);
						var animationName = getUniqueName(cur.name);
						animationNames.push(animationName);
						opts.animation = animationName;

						var spriteHolderBuilderObj = processTarget(cur, sourceNm || Object.getPrototypeOf(cur), opts, value => {
							acc.resolveValues.push(value);
						}, acc.builder, true);
						acc.spriteHolders.push(spriteHolderBuilderObj.spriteHolder);
						acc.builder = spriteHolderBuilderObj.builder;
						return acc;
					}, {spriteHolders: [], resolveValues: []});

					var builder = sprHolderArrBuilder.builder;

					var spriteHoldersArr = sprHolderArrBuilder.spriteHolders;
					var targetSheet = builder.build();
					if(targetSheet) {
						spritesArr = spriteHoldersArr.map(i => {
							var sprt = i.sprite;
							var trgt = i.target;
							var srcName = sourceNm || Object.getPrototypeOf(trgt);

							if(swapSprite) SpritifyObject.swapWithprite(sprt, trgt, {swapCallback: postActionCB, trim, disableTicks, preserveSize, preserveRegistration});
							if(spritemap && srcName) spritemap.set(srcName, sprt);
							if(matchFramerate) sprt.framerate = createjs.Ticker.framerate;

							return i.sprite;
						});
					}

					if(res) res(sprHolderArrBuilder.resolveValues);
				}

				return spritesArr;
			}
			else
				return processTarget(inTarget, sourceNm || Object.getPrototypeOf(inTarget), inOptions, res)
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
	
			// if spritified already it will skip
			prom = (!this.removeSprite && this.buildAsync ? ( this.singleSpriteSheet ? new Promise(resolveAsync => { // async start single SpriteSheet
					this._startCallbackResolveHolder = resolveAsync;
					SpritifyObject.spritify(this._data.filter(i => !i[SYMBOLS.SPRITE]), this.spritemap, {...this.builderOptions, matchFramerate: this.matchFramerate, disableCache: this.disableCache, disableTicks: this.disableTicks, swapSprite: this.swapSprite, concatenatedScale: this.concatenatedScale, preserveSize: this.preserveSize, preserveRegistration: this.preserveRegistration, postAction: this.postAction, trim: this.trim}, values => {
						this._spriteHolder = values.map(i => { return {sprite: i.sprite}; })
						if(this.spriteBuiltCallback) this.spriteBuiltCallback(values);
						resolveAsync();
					});
				}) : ( // end async single SpriteSheet
				new Promise((resolveAsync, rejectAsync) => { // start async separate SpriteSheets
					this._startCallbackResolveHolder = resolveAsync;
					Promise.all(this._data.reduce((acc, cur) => {
						if(!cur[SYMBOLS.SPRITE]) {
							acc.push( new Promise(res => {
								SpritifyObject.spritify(cur, this.spritemap, {...this.builderOptions, matchFramerate: this.matchFramerate, disableCache: this.disableCache, disableTicks: this.disableTicks, swapSprite: this.swapSprite, concatenatedScale: this.concatenatedScale, preserveSize: this.preserveSize, preserveRegistration: this.preserveRegistration, postAction: this.postAction, trim: this.trim}, value => {
									this._spriteHolder = {sprite: value.sprite};
									if(this.spriteBuiltCallback) this.spriteBuiltCallback(value);
									res();
								});
							}) );
						}
						return acc;
					}, []))
					.then(() => resolveAsync()).catch(err => rejectAsync(err));
				}) )  ) : ( // end async separate SpriteSheets
					new Promise(resolveSync => { // start sync SpriteSheets
						this._startCallbackResolveHolder = resolveSync;
						if(this.removeSprite)
							this._data.forEach(i => SpritifyObject.removeSpriteDraw(i));
						else {
							if(this.singleSpriteSheet) {
								SpritifyObject.spritify(this._data.filter(i => !i[SYMBOLS.SPRITE]), this.spritemap, {...this.builderOptions, matchFramerate: this.matchFramerate, disableCache: this.disableCache, disableTicks: this.disableTicks, swapSprite: this.swapSprite, concatenatedScale: this.concatenatedScale, preserveSize: this.preserveSize, preserveRegistration: this.preserveRegistration, postAction: this.postAction, trim: this.trim}, values => {
									this._spriteHolder = values.map(i => { return {sprite: i.sprite}; })
									if(this.spriteBuiltCallback) this.spriteBuiltCallback(values);
								});
							}
							else {
								this._data.filter(i => !i[SYMBOLS.SPRITE]).forEach(i => {
									SpritifyObject.spritify(i, this.spritemap, {...this.builderOptions, matchFramerate: this.matchFramerate, disableCache: this.disableCache, disableTicks: this.disableTicks, swapSprite: this.swapSprite, concatenatedScale: this.concatenatedScale, preserveSize: this.preserveSize, preserveRegistration: this.preserveRegistration, postAction: this.postAction, trim: this.trim}, value => {
										this._spriteHolder = {sprite: value.sprite};
										if(this.spriteBuiltCallback) this.spriteBuiltCallback(value);
									});
								});
							}
						}
						resolveSync();
					})
				) // end sync SpriteSheets
			).then(() => new Promise(resolve => { // post spritify callbacks
				if(this.endCallback) {
					this.endCallback((node, passValue) => {
						if(!this.resolved) {
							this.resolved = true;
							resolve({node, passValue});
							this.passValue = undefined;
						}
					}, this._data, this._passValue);
				}
	
				if(!this.resolved && !this.resolveOnCallbackOnly) {
					this.resolved = true;
					resolve({passValue: this._passValue});
					this.passValue = undefined;
				}
			})); // end post spritify callbacks
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	SpritifyObject.IGNORE = 0;
	SpritifyObject.DISABLE_TICK_SELF = 1;
	SpritifyObject.DISABLE_TICK_CHILDREN = 2;
	SpritifyObject.DISABLE_TICK_SPRITE = 3;
	SpritifyObject.DISABLE_TICK_SELF_SPRITE = 4;
	SpritifyObject.DISABLE_TICK_CHILDREN_SPRITE = 5;
	SpritifyObject.NUM_DISABLE_TICK_STATES = 6;
	SpritifyObject.STOP = 0;
	SpritifyObject.PLAY = 1;
	SpritifyObject.REWIND = 2;
	// END SHIM MODIFICATIONS	
	
	class SpriteObject extends SequenceObject {
		constructor(inData, inAnimation, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions); // inData can be a DisplayObject or a Sprite!
			this.animation = inAnimation;
			// this._numDisableTicksStates = 3;
	
			this.doNotPlay = inOptions && "doNotPlay" in inOptions ? inOptions.doNotPlay : false;
			this.resolveImmediate = inOptions && "resolveImmediate" in inOptions ? inOptions.resolveImmediate : false; // resolves promise immediately in doNotPlay enabled
			this.resume = inOptions && "resume" in inOptions ? inOptions.resume : false;
			this.rewindOnPrerun = inOptions && "rewindOnPrerun" in inOptions ? inOptions.rewindOnPrerun : true;
	
			this.setVisibility = inOptions && "setVisibility" in inOptions ? inOptions.setVisibility : true;
			this.startVisible = inOptions && "startVisible" in inOptions ? inOptions.startVisible : true;
			this.endVisible = inOptions && "endVisible" in inOptions ? inOptions.endVisible : true;
			this.endVisibleNextTick = inOptions && "endVisibleNextTick" in inOptions ? inOptions.endVisibleNextTick : true;
			this.setVisibilityOnTarget = inOptions && "setVisibilityOnTarget" in inOptions ? inOptions.setVisibilityOnTarget : true;
	
			this.loopCount = inOptions && "loopCount" in inOptions ? inOptions.loopCount : -1;
			this.loop = inOptions && "loop" in inOptions ? inOptions.loop : false; // Cannot support reverse with sprite so no reversed and no bounce
	
			this.frame = inOptions && "frame" in inOptions ? inOptions.frame : null;
			this.noStopFrame = inOptions && "noStopFrame" in inOptions ? inOptions.noStopFrame : false;
			this.returnFrame = inOptions && "returnFrame" in inOptions ? inOptions.returnFrame : null;
			this.playFromFrame = inOptions && "playFromFrame" in inOptions ? inOptions.playFromFrame : null;

			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.runtimeCallback = inOptions && "runtimeCallback" in inOptions ? inOptions.runtimeCallback : null;
			this.preRunCallback = inOptions && "preRunCallback" in inOptions ? inOptions.preRunCallback : null;

			this.matchFramerate = inOptions && "matchFramerate" in inOptions ? inOptions.matchFramerate : true;
			this.fpsScale = inOptions && "fpsScale" in inOptions ? inOptions.fpsScale : null;
			
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this.resolveOnCallbackEnds = inOptions && "resolveOnCallbackEnds" in inOptions ? inOptions.resolveOnCallbackEnds : true;
			this.resolveOnLoopCount = inOptions && "resolveOnLoopCount" in inOptions ? inOptions.resolveOnLoopCount : true;
			this.removeEventListenersOnPlay = inOptions && "removeEventListenersOnPlay" in inOptions ? inOptions.removeEventListenersOnPlay : true;
	
			this.buildSpriteOnRun = inOptions && "buildSpriteOnRun" in inOptions ? inOptions.buildSpriteOnRun : true;

			// in spritify() the priority is numFrames > buildOptions is callback > concatenatedScale
			this.concatenatedScale = inOptions && "concatenatedScale" in inOptions ? inOptions.concatenatedScale : false;
			this.numFrames = inOptions && "numFrames" in inOptions ? inOptions.numFrames : null;
			this.buildScale = inOptions && "buildScale" in inOptions ? inOptions.buildScale : null;
			this.buildOptions = inOptions && "buildOptions" in inOptions ? inOptions.buildOptions : null;
			this.useSetupMovieClipFrame = inOptions && "useSetupMovieClipFrame" in inOptions ? inOptions.useSetupMovieClipFrame : true; // if buildOptions is a callback enable useSetupMovieClipFrame to automatically advance the playhead on build

			this.rebuildSprite = inOptions && "rebuildSprite" in inOptions ? inOptions.rebuildSprite : false; // rebuilds sprite on re-run
			this.swapSprite = inOptions && "swapSprite" in inOptions ? inOptions.swapSprite : true; // when building from MC swap the original with sprite
			this.preserveRegistration = inOptions && "preserveRegistration" in inOptions ? inOptions.preserveRegistration : true; // spritify will check that buildScale or buildOptions are used to enable this option 
			this.preserveSize = inOptions && "preserveSize" in inOptions ? inOptions.preserveSize : true; // spritify will check that buildScale or buildOptions are used to enable this option

			this.trim = inOptions && "trim" in inOptions ? inOptions.trim : 0;
			this.padding = inOptions && "padding" in inOptions ? inOptions.padding : 1;
			this.maxWidth = inOptions && "maxWidth" in inOptions ? inOptions.maxWidth : 2048;
			this.maxHeight = inOptions && "maxHeight" in inOptions ? inOptions.maxHeight : 2048;
	
			this.postAction = inOptions && "postAction" in inOptions ? inOptions.postAction : SpritifyObject.REWIND; // when building from MC stop the original
	
			this.disableCache = inOptions && "disableCache" in inOptions ? inOptions.disableCache : true; // disables cache temporarily in order to create sprite
			this.disableTicks = inOptions && "disableTicks" in inOptions ? inOptions.disableTicks : SpritifyObject.DISABLE_TICK_SELF;
	
			this.buildAsync = inOptions && "buildAsync" in inOptions ? inOptions.buildAsync : false;
			this.builderOptions = {animation: this.animation, numFrames: this.numFrames, buildOptions: this.buildOptions, buildAsync: this.buildAsync, padding: this.padding, maxWidth: this.maxWidth, maxHeight: this.maxHeight, buildScale: this.buildScale}; // these are options that will be passed to buildSprite
	
			this.spriteBuiltCallback = inOptions && "spriteBuiltCallback" in inOptions ? inOptions.spriteBuiltCallback : null;
			this.spritemap = inOptions && "spritemap" in inOptions ? inOptions.spritemap : true; // same as spritify options true for internal spritemap or string for custom spritemap
	
			// this is needed to support async sprite build from buildSpriteOnRun
			this.createSpriteProm = this.createSpriteProm.bind(this);
	
			this._originalFramerate = null; // set at createPromise in case data is set in post
			this._loopCounter = this.loopCount;
	
			// spriteholder is object to hold sprite, used because build can be asynch so need to be able to set sprite during async
			// therefore cannot set sprite directly, must use this._spriteHolder.sprite
			this._spriteHolder = null;
			this._asyncPromHolder = null;
			this._startCallbackResolveHolder = null;
		}
	
		get type() {
			return "SpriteObject";
		}
	
		// get buildScale() {
		// 	return this._buildScale;
		// }
	
		// set buildScale(inNum = null) {
		// 	this._buildScale = !this.concatenatedScale && inNum === 1 ? null : inNum;
		// }
	
		get disableTicks() {
			return this._disableTicks;
		}
	
		set disableTicks(inMode = SpritifyObject.DISABLE_TICK_SELF) {
			this._disableTicks = inMode !== null && inMode !== "" && inMode >= 0 && inMode < SpritifyObject.NUM_DISABLE_TICK_STATES ? inMode : SpritifyObject.DISABLE_TICK_SELF;
		}
	
		// spriteHolder is object for holding sprite used for asyncs
		// cannot set sprite directly, must use this._spriteHolder.sprite
		get sprite() {
			return this._spriteHolder ? this._spriteHolder.sprite : null;
		}

		init() {
			super.init();

			// during rerun it will rebuild if no sprite present, which can be done during reset by with rebuildSprite enabled
			if(!this.sprite && this.buildSpriteOnRun && !(this.data instanceof createjs.Sprite) && (this.data instanceof createjs.DisplayObject)) this.fillSprite();
			if(this.sprite) {
				if(this.rewindOnPrerun) this.sprite.gotoAndStop(this.animation || 0);
				else this.sprite.stop();
			}
			if(this.preRunCallback) this.preRunCallback(this);

			return this;
		}

		removeAllEventListeners(type) {
			var target = this._data instanceof createjs.Sprite ? this._data : this._data[SYMBOLS.SPRITE] && this._data[SYMBOLS.SPRITE] instanceof createjs.Sprite ? this._data[SYMBOLS.SPRITE] : null;

			if(target) {
				if(!type || type == 'change') this.removeSeqcontroListeners('change', target);
				if(!type || type == 'animationend') this.removeSeqcontroListeners('animationend', target);
				if(!type || type == 'tick') this.removeSeqcontroListeners('tick', target);
			}
		}
	
		fillSprite() {
			this._asyncPromHolder = null;
			if(this._data instanceof createjs.Sprite)
				this._spriteHolder = {sprite: this._data};
			else if(this._data instanceof createjs.DisplayObject) {
				if(!!this._data[SYMBOLS.SPRITE]) this._spriteHolder = {sprite: this._data[SYMBOLS.SPRITE]};
				else {
					if(this.buildAsync) {
						this._asyncPromHolder = new Promise(res => {
							SpritifyObject.spritify(this._data, this.spritemap, {...this.builderOptions, matchFramerate: this.matchFramerate, disableCache: this.disableCache, disableTicks: this.disableTicks, swapSprite: this.swapSprite, concatenatedScale: this.concatenatedScale, preserveSize: this.preserveSize, preserveRegistration: this.preserveRegistration, postAction: this.postAction, trim: this.trim}, value => {
								this._spriteHolder = {sprite: value.sprite};
								if(this.spriteBuiltCallback) this.spriteBuiltCallback(value);
								res();
							});
						});
					}
					else {
						SpritifyObject.spritify(this._data, this.spritemap, {...this.builderOptions, matchFramerate: this.matchFramerate, disableCache: this.disableCache, disableTicks: this.disableTicks, swapSprite: this.swapSprite, concatenatedScale: this.concatenatedScale, preserveSize: this.preserveSize, preserveRegistration: this.preserveRegistration, postAction: this.postAction, trim: this.trim}, value => {
							this._spriteHolder = {sprite: value.sprite};
							if(this.spriteBuiltCallback) this.spriteBuiltCallback(value);
						});
					}
				}
			}
			return this.sprite;
		}
	
		createSpriteProm() {
			if(this.setVisibility) {
				var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : this.sprite;
				target.visible = this.startVisible;
			}
	
			// if instance.timeline has eventListeners still then override them
			// be aware any callbacks from those eventListeners will NOT be called
			if(this.removeEventListenersOnPlay)
				this.removeAllEventListeners();
	
			if(this._originalFramerate == null) this._originalFramerate = this.sprite.framerate;
			if(this.fpsScale && (this.fpsScale != 1)) this.sprite.framerate = (this._originalFramerate || createjs.Ticker.framerate) * (this.fpsScale > 0 ? this.fpsScale : 0);
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}
			
			var prom = null;
			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.doNotPlay) {
				if(this.resume)
					this.sprite.play();
				else if(this.playFromFrame)
					this.sprite.gotoAndPlay(this.playFromFrame);
				else
					this.sprite.gotoAndPlay(this.animation || 0);
			}
			else if(this.resolveImmediate) {
				this.sprite.stop();
				this.resolved = true;
				prom = Promise.resolve({passValue: this._passValue});
				this.passValue = undefined;
			}
	
			var doubleAddEventListenerPromise = function(eventType1, eventType2, inCallback) {
				return new Promise(resolve => {
					var eventHandler = inCallback(resolve);
					this.addEventListener(eventType1, eventHandler);
					this.addEventListener(eventType2, eventHandler);
				});
			}.bind(this.sprite);
	
			if(!prom) {
				// if labeled
				if(this.frame) {
					if(this.loop)
						prom = this.sprite.addEventListenerPromise('change', this.onMCCompleteLoopAtFrame.call(this, this.frame, this.returnFrame, this.runtimeCallback));
					else
						prom = this.sprite.addEventListenerPromise('change', this.onMCCompleteStopAtFrame.call(this, this.frame, this.runtimeCallback, this.endCallback));
				}
				else { // unlabeled
					if(this.endCallback || this.runtimeCallback) {
						// if looping
						if(this.loop)
							prom = doubleAddEventListenerPromise('animationend', 'change', this.onMCCompleteLoopAndCall.call(this, this.returnFrame, this.runtimeCallback, this.endCallback));
						else
							prom = doubleAddEventListenerPromise('animationend', 'change', this.onMCCompleteCallbacks.call(this, this.runtimeCallback, this.endCallback));
					}
					else { // no callbnacks
						// if looping
						if(this.loop) {
							if(this.returnFrame)
								prom = this.sprite.addEventListenerPromise('animationend', this.onMCCompleteLoopReturnLabel.call(this, this.returnFrame));
							else
								prom = this.sprite.addEventListenerPromise('animationend', this.onMCCompleteLoop());
						}
						else
							prom = this.sprite.addEventListenerPromise('animationend', this.onMCComplete());
					}
				}
			}
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;
	
			if(!this.sprite) {
				if(this._asyncPromHolder) prom = this._asyncPromHolder.then(this.createSpriteProm); // while it is filling
				else if(!this.fillSprite()) prom = this._asyncPromHolder ? this._asyncPromHolder.then(this.createSpriteProm) :  Promise.reject();
			}
	
			return prom || this.createSpriteProm();
		}
	
		reset() {
			super.reset();
	
			if(this.sprite) {
				this.sprite.removeEventListener('change', this.eventHandler);
				this.sprite.removeEventListener('animationend', this.eventHandler);
				this.sprite.framerate = this._originalFramerate; // normally dont reset all the params user should be aware but this one is obscure
	
				if(this.rebuildSprite) {
					if(!(this._data instanceof createjs.Sprite)) SpritifyObject.removeSpriteDraw(this._data);
					this._spriteHolder = null;
				}
			}
	
			this._asyncPromHolder = null;
			this.eventHandler = null;
	
			this._loopCounter = this.loopCount;
	
			this._startCallbackResolveHolder = null;
	
			return this;
		}

		// private method used to snap to the end frame of an animation
		static gotoAndStopAtEnd(target, animation = null) {
			var numFrames = target.spriteSheet.getNumFrames(animation);
			target.paused = true;
			if(animation)
				target._goto(animation, numFrames-1);
			else
				target.gotoAndStop(numFrames-1);
		}
	
		// Single addEvents
		onMCComplete() {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					currentTarget.removeEventListener('animationend', this.eventHandler);
					// for some reason sprite wants to "auto-rewind" after ending. this hack forces it to stop at end frame
//					event.currentTarget.gotoAndStop(event.currentTarget.currentFrame);

					// will use gotoAndStop to snap to actual end frame instead of event.currentTarget.currentFrame
					SpriteObject.gotoAndStopAtEnd(currentTarget, this.animation);

					if(this.setVisibility) {
						var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
						if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
						else target.visible = this.endVisible;
					}
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoop() {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					if(this.loopCount > 0 && this._loopCounter-- <= 0) {
						currentTarget.removeEventListener('animationend', this.eventHandler);
						// for some reason sprite wants to "auto-rewind" after ending. this hack forces it to stop at end frame
//						event.currentTarget.gotoAndStop(event.currentTarget.currentFrame);

						// will use gotoAndStop to snap to actual end frame instead of event.currentTarget.currentFrame
						SpriteObject.gotoAndStopAtEnd(currentTarget, this.animation);

						if(this.setVisibility) {
							var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
							if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else target.visible = this.endVisible;
						}
					}
					else
						currentTarget.gotoAndPlay(0);
	
					if(!this.resolved && !this.resolveOnCallbackOnly && (this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0)) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoopReturnLabel(inReturnFrame) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					if(this.loopCount > 0 && this._loopCounter-- <= 0) {
						currentTarget.removeEventListener('animationend', this.eventHandler);
						// for some reason sprite wants to "auto-rewind" after ending. this hack forces it to stop at end frame
//						event.currentTarget.gotoAndStop(event.currentTarget.currentFrame);

						// will use gotoAndStop to snap to actual end frame instead of event.currentTarget.currentFrame
						SpriteObject.gotoAndStopAtEnd(currentTarget, this.animation);

						if(this.setVisibility) {
							var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
							if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else target.visible = this.endVisible;
						}
					}
					else
						currentTarget.gotoAndPlay(inReturnFrame);
	
					if(!this.resolved && !this.resolveOnCallbackOnly && (this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0)) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		// Double addEvents
		onMCCompleteCallbacks(runtimeCallback, endCallback) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skipRuntimeCallback = false; // this is a hack to avoid callback running extra times
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					if(event.type == 'animationend') {
						currentTarget.removeEventListener('change', this.eventHandler);
						currentTarget.removeEventListener('animationend', this.eventHandler);
						// for some reason sprite wants to "auto-rewind" after ending. this hack forces it to stop at end frame
//						event.currentTarget.gotoAndStop(event.currentTarget.currentFrame);

						// will use gotoAndStop to snap to actual end frame instead of event.currentTarget.currentFrame
						SpriteObject.gotoAndStopAtEnd(currentTarget, this.animation);

						if(this.setVisibility) {
							var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
							if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else target.visible = this.endVisible;
						}
	
						if(endCallback) {
							endCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
	
						if(!this.resolved && !this.resolveOnCallbackOnly) {
							this.resolved = true;
							resolve({passValue: this._passValue});
							this.passValue = undefined;
						}
						skipRuntimeCallback = true;
					}
	
					if(!skipRuntimeCallback) {
						if(runtimeCallback) {
							runtimeCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.resolveOnCallbackEnds) {
										currentTarget.removeEventListener('change', this.eventHandler);
										currentTarget.removeEventListener('animationend', this.eventHandler);

										// for some reason sprite wants to "auto-rewind" after ending.
										// this hack stays as forces it to stop but not necessarily at end frame
										currentTarget.gotoAndStop(currentTarget.currentFrame);

										if(this.setVisibility) {
											var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
											if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
											else target.visible = this.endVisible;
										}
									}
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
					}
					else
						skipRuntimeCallback = false;
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoopAndCall(inReturnFrame = 0, runtimeCallback, endCallback) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skipRuntimeCallback = false; // this is a hack to avoid callback running extra times
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					if(event.type == 'animationend') {
						if(this.loopCount <= 0 || this._loopCounter-- > 0)
							currentTarget.gotoAndPlay(inReturnFrame);
						else {
							currentTarget.removeEventListener('change', this.eventHandler);
							currentTarget.removeEventListener('animationend', this.eventHandler);
							// for some reason sprite wants to "auto-rewind" after ending. this hack forces it to stop at end frame
//							event.currentTarget.gotoAndStop(event.currentTarget.currentFrame);

							// will use gotoAndStop to snap to actual end frame instead of event.currentTarget.currentFrame
							SpriteObject.gotoAndStopAtEnd(currentTarget, this.animation);

							if(this.setVisibility) {
								var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
								if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
								else target.visible = this.endVisible;
							}
						}
	
						if(this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0) {
							if(this.loopCount > 0 && this.resolveOnLoopCount && endCallback) {
								endCallback((node, passValue) => {
									if(!this.resolved) {
										this.resolved = true;
										resolve({node, passValue});
										this.passValue = undefined;
									}
								}, this._data, this._passValue, event);
							}
							else if(!this.resolved && !this.resolveOnCallbackOnly) {
								this.resolved = true;
								resolve({passValue: this._passValue});
								this.passValue = undefined;
							}
						}
						skipRuntimeCallback = true;
					}
	
					if(!skipRuntimeCallback) {
						if(runtimeCallback) {
							runtimeCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.resolveOnCallbackEnds) {
										currentTarget.removeEventListener('change', this.eventHandler);
										currentTarget.removeEventListener('animationend', this.eventHandler);

										// for some reason sprite wants to "auto-rewind" after ending.
										// this hack stays as forces it to stop but not necessarily at end frame
										currentTarget.gotoAndStop(currentTarget.currentFrame);

										if(this.setVisibility) {
											var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
											if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
											else target.visible = this.endVisible;
										}
									}
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
					}
					else
						skipRuntimeCallback = false;
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteLoopAtFrame(inFrame, inReturnFrame = 0, runtimeCallback, endCallback) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				var skipRuntimeCallback = false; // this is a hack to avoid callback running extra times
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					if(!this.resume || currentTarget.currentFrame <= inFrame + 1) {
						if(inFrame && currentTarget.currentFrame > inFrame) {
							if(this.loopCount <= 0 || this._loopCounter-- > 0)
								currentTarget.gotoAndPlay(inReturnFrame);
							else {
								currentTarget.removeEventListener('change', this.eventHandler);

								// for some reason sprite wants to "auto-rewind" after ending.
								// this hack stays as forces it to stop but not necessarily at end frame
								currentTarget.gotoAndStop(currentTarget.currentFrame);

								if(this.setVisibility) {
									var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
									if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
									else target.visible = this.endVisible;
								}
							}
	
							if(this.loopCount <= 0 || !this.resolveOnLoopCount || this._loopCounter < 0) {
								if(this.loopCount > 0 && this.resolveOnLoopCount && endCallback) {
									endCallback((node, passValue) => {
										if(!this.resolved) {
											this.resolved = true;
											resolve({node, passValue});
											this.passValue = undefined;
										}
									}, this._data, this._passValue, event);
								}
								else if(!this.resolved && !this.resolveOnCallbackOnly) {
									this.resolved = true;
									resolve({passValue: this._passValue});
									this.passValue = undefined;
								}
							}
							skipRuntimeCallback = true;
						}
					}
	
					if(!skipRuntimeCallback) {
						if(runtimeCallback) {
							runtimeCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.resolveOnCallbackEnds) {
										currentTarget.removeEventListener('change', this.eventHandler);

										// for some reason sprite wants to "auto-rewind" after ending.
										// this hack stays as forces it to stop but not necessarily at end frame
										currentTarget.gotoAndStop(currentTarget.currentFrame);
										
										if(this.setVisibility) {
											var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
											if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
											else target.visible = this.endVisible;
										}
									}
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
					}
					else
						skipRuntimeCallback = false;
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	
		onMCCompleteStopAtFrame(inFrame, runtimeCallback, endCallback) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					var currentTarget = event.currentTarget;
					if(currentTarget.currentFrame >= inFrame) {
						currentTarget.removeEventListener('change', this.eventHandler);

						// for some reason sprite wants to "auto-rewind" after ending.
						// this hack stays as forces it to stop but not necessarily at end frame
						if(!this.noStopFrame) currentTarget.gotoAndStop(currentTarget.currentFrame);

						if(this.setVisibility) {
							var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
							if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
							else target.visible = this.endVisible;
						}
	
						if(endCallback) {
							endCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
	
						if(!this.resolved && !this.resolveOnCallbackOnly) {
							this.resolved = true;
							resolve({passValue: this._passValue});
							this.passValue = undefined;
						}
					}
	
					if(runtimeCallback) {
						runtimeCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								if(this.resolveOnCallbackEnds) {
									currentTarget.removeEventListener('change', this.eventHandler);

									// for some reason sprite wants to "auto-rewind" after ending.
									// this hack stays as forces it to stop but not necessarily at end frame
									currentTarget.gotoAndStop(currentTarget.currentFrame);
									
									if(this.setVisibility) {
										var target = this.setVisibilityOnTarget && (this._data instanceof createjs.DisplayObject) ? this._data : currentTarget;
										if(this.endVisibleNextTick) currentTarget.on('tick', () => target.visible = this.endVisible, null, true).seqcontrolType = this.type;
										else target.visible = this.endVisible;
									}
								}
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this._data, this._passValue, event);
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	}
	
	class ButtonObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			this.setMouseAbility = inOptions && "setMouseAbility" in inOptions ? inOptions.setMouseAbility : true;
			this.startMouseEnabled = inOptions && "startMouseEnabled" in inOptions ? inOptions.startMouseEnabled : false;
			this.endMouseEnabled = inOptions && "endMouseEnabled" in inOptions ? inOptions.endMouseEnabled : false;
	
			this.setVisibility = inOptions && "setVisibility" in inOptions ? inOptions.setVisibility : true;
			this.startVisible = inOptions && "startVisible" in inOptions ? inOptions.startVisible : true;
			this.endVisible = inOptions && "endVisible" in inOptions ? inOptions.endVisible : true;
			this.endVisibleNextTick = inOptions && "endVisibleNextTick" in inOptions ? inOptions.endVisibleNextTick : true;
			this.mousedown = inOptions && "mousedown" in inOptions ? inOptions.mousedown : false;

			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.preRunCallback = inOptions && "preRunCallback" in inOptions ? inOptions.preRunCallback : null;
			
			this.removeEventListenersOnStart = inOptions && "removeEventListenersOnStart" in inOptions ? inOptions.removeEventListenersOnStart : true;

			this.btnMouseClickHandler = this.btnMouseClickHandler.bind(this);
	
			this._preferredMouseEvent = this.mousedown ? 'mousedown' : 'click';
			this._startCallbackResolveHolder = null;
		}
	
		get type() {
			return "ButtonObject";
		}

		init() {
			super.init();

			var btnInstance = this.data;
			if(btnInstance && this.setMouseAbility) btnInstance.mouseEnabled = this.startMouseEnabled; // set before eval
			if(this.preRunCallback) this.preRunCallback(this);

			return this;
		}
	
		removeAllEventListeners(type) {
			if(!type || type == 'click') this.removeSeqcontroListeners('click', this._data);
			if(!type || type == 'mousedown') this.removeSeqcontroListeners('mousedown', this._data);
			if(!type || type == 'tick') this.removeSeqcontroListeners('tick', this._data); // removes these tertiary eventHandlers corresponding to endVisible or snapLabel tick handlers
		}
		
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			if(this.setVisibility) this._data.visible = this.startVisible;
			if(this.setMouseAbility) this._data.mouseEnabled = true;
	
			if(this.removeEventListenersOnStart)
				this.removeAllEventListeners();

			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode); // later on this._startCallbackResolveHolder gets assigned by eventHandler assignment so that if this resolve function can still get called after eventHandling starts, if not assigned this will fail but should never happen as eventHandler should get assigned immediately
					}
				}, this._data, this._passValue);
			}

			// if startCallback immediately resolved then resolve
			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
	
			prom = this._data.addEventListenerPromise(this._preferredMouseEvent, this.btnMouseClickHandler);
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();
			this._data.removeEventListener(this._preferredMouseEvent, this.eventHandler);
			this.eventHandler = null;
			this._startCallbackResolveHolder = null;
	
			return this;
		}

		btnMouseClickHandler(resolve)
		{
			this._startCallbackResolveHolder = resolve;

			function endCall(evt) {
				var currentTarget = evt.currentTarget;
				return (node, passValue) => {
					currentTarget.removeEventListener(this._preferredMouseEvent, this.eventHandler);
					if(this.setMouseAbility) currentTarget.mouseEnabled = this.endMouseEnabled;
	
					if(this.setVisibility) {
						if(this.endVisibleNextTick)
							currentTarget.on('tick', () => currentTarget.visible = this.endVisible, null, true).seqcontrolType = this.type;
						else 
							currentTarget.visible = this.endVisible;
					}
					this.resolved = true;
					resolve({node, passValue});
					this.passValue = undefined;
				};
			};
	
			this.eventHandler = function(event) {
				if(!this.resolved) {
					if(this.resolveOnCallbackOnly) {
						if(this.endCallback)
							this.endCallback(endCall.call(this, event), this._data, this._passValue, event);
					}
					else {
						if(this.endCallback)
							this.endCallback(endCall.call(this, event), this._data, this._passValue, event);
						
						if(!this.resolved) {}
							endCall.call(this, event)(undefined, this._passValue); // essentialling calling the callback resolve
					}
				}
			}.bind(this);
	
			return this.eventHandler;
		}
	}
	
	class DraggableObject extends ButtonObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			this.snapToCenter = inOptions && "snapToCenter" in inOptions ? inOptions.snapToCenter : false;
			this.stagemousemove = inOptions && "stagemousemove" in inOptions ? inOptions.stagemousemove : false;

			this.stagemouseReleaseOnExit = inOptions && "stagemouseReleaseOnExit" in inOptions ? inOptions.stagemouseReleaseOnExit : true;
			this.stagemouseReleaseOnMouseup = inOptions && "stagemouseReleaseOnMouseup" in inOptions ? inOptions.stagemouseReleaseOnMouseup : true;

			this.suppressNullParentException = inOptions && "suppressNullParentException" in inOptions ? inOptions.suppressNullParentException : true;

			
			this.resolveOnRelease = inOptions && "resolveOnRelease" in inOptions ? inOptions.resolveOnRelease : false;
			this.resolveOnCollision = inOptions && "resolveOnCollision" in inOptions ? inOptions.resolveOnCollision : true;

			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.runtimeCallback = inOptions && "runtimeCallback" in inOptions ? inOptions.runtimeCallback : null;
	
			// this must come before setting _collider
			this.useColliderHitArea = inOptions && "useColliderHitArea" in inOptions ? inOptions.useColliderHitArea : true;
			this.useTargetHitArea = inOptions && "useTargetHitArea" in inOptions ? inOptions.useTargetHitArea : true;
	
			// this._collider = (inOptions && "collider" in inOptions) && inOptions.collider && (inOptions.collider instanceof createjs.DisplayObject) && CollisionHelper.checkIfBounds(inOptions.collider, this.useColliderHitArea) ? inOptions.collider : null;
			// remove the checkBounds call because we may want to temporarily assign a collider without bounds which will be set later
			this.collider = inOptions && "collider" in inOptions ? inOptions.collider : null;
			this.collisionTarget = inOptions && "collisionTarget" in inOptions ? inOptions.collisionTarget : null;
	
			this._ellipseCollision = inOptions && "ellipseCollision" in inOptions ? inOptions.ellipseCollision : false;
			this._preciseCollision = inOptions && "preciseCollision" in inOptions ? inOptions.preciseCollision : false;
			this._boxCollision = inOptions && "boxCollision" in inOptions ? inOptions.boxCollision : false;

			// if you change any of the options you need to update the collisionHelper!
			// we do not set up an auto update mechanism because we want to have the option to have a custom collisionHelper
			this.collisionHelper = new CollisionHelper(this.collisionTarget || this._data, {
				useColliderHitArea: this.useColliderHitArea,
				useTargetHitArea: this.useTargetHitArea,
				collider: this.collider,
				ellipseCollision: this._ellipseCollision,
				preciseCollision: this._preciseCollision,
				boxCollision: this._boxCollision
			})
	
			this.dragMouseClickHandler = this.dragMouseClickHandler.bind(this);
			this.draggableEventHandler = null; // used because button super.reset will set this.eventHandler to null
			this.dragUpEventHandler = null;
			this.initialOffset = null;
		}
	
		get type() {
			return "DraggableObject";
		}

		get collider() {
			return this._collider;
		}
	
		set collider(inClip = null) {
			this._collider = inClip && inClip instanceof createjs.DisplayObject ? inClip : null;
		}
	
		get collisionTarget() {
			return this._collisionTarget;
		}
	
		set collisionTarget(inClip = null) {
			this._collisionTarget = inClip && inClip instanceof createjs.DisplayObject ? inClip : null;
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			if(this.setMouseAbility) this._data.mouseEnabled = true;
			if(this.setVisibility) this._data.visible = this.startVisible;
	
			if(this.removeEventListenersOnStart)
				this.removeAllEventListeners();

			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			var doubleAddEventListenerPromise = function(eventType1, eventType2, inCallback) {
				return new Promise(resolve => {
					var eventHandler = inCallback(resolve);
					this.addEventListener(eventType1, eventHandler);
					this.addEventListener(eventType2, eventHandler);
				});
			}.bind(this._data);
			
			prom = this.stagemousemove ? stage.addEventListenerPromise('stagemousemove', this.dragMouseClickHandler) : this.mousedown ? doubleAddEventListenerPromise('pressmove', 'mousedown', this.dragMouseClickHandler) : this._data.addEventListenerPromise('pressmove', this.dragMouseClickHandler);
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();

			// this.draggableEventHandler is used because button super.reset will set this.eventHandler to null
			this._data.removeEventListener('pressmove', this.draggableEventHandler);
			this._data.removeEventListener('pressup', this.dragUpEventHandler);
			this._data.removeEventListener('mousedown', this.draggableEventHandler);

			if(this.stagemousemove) {
				stage.removeEventListener('stagemousemove', this.draggableEventHandler);
				stage.removeEventListener('stagemouseup', this.dragUpEventHandler);
				window.removeEventListener('mouseout', this.dragUpEventHandler);
			}

			this.eventHandler = null;
			this.draggableEventHandler = null;
			this.dragUpEventHandler = null;
			this.initialOffset = null;
	
			return this;
		}
	
		dragMouseClickHandler(resolve)
		{
			this._startCallbackResolveHolder = resolve;
			var endCall = evt => {
				return (node, passValue) => {
					// seems that removingEventListeners for regular mouseevents when stagemousemove enabled will cause a 'hiccup' when clip visible disabled
					// branching it so that these eventListeners only get removed if they are added
					// also setting to this._data instead of evt.currentTarget, dunno why but this may cause issues with stagemnousemove ?
					if(this.stagemousemove) {
						stage.removeEventListener('stagemousemove', this.eventHandler);
						stage.removeEventListener('stagemouseup', this.dragUpEventHandler);
						window.removeEventListener('mouseout', this.dragUpEventHandler);
					}
					else {
						this._data.removeEventListener('pressmove', this.eventHandler);
						this._data.removeEventListener('pressup', this.dragUpEventHandler);
						this._data.removeEventListener('mousedown', this.eventHandler);
					}
	
					if(this.setMouseAbility) this._data.mouseEnabled = this.endMouseEnabled;
	
					if(this.setVisibility) {
						if(this.endVisibleNextTick) {
							var currentTarget = this._data;
							currentTarget.on('tick', () => currentTarget.visible = this.endVisible, null, true).seqcontrolType = this.type;
						}
						else this._data.visible = this.endVisible;
					}
					this.resolved = true;
					resolve({node, passValue});
					this.passValue = undefined;
				};
			};
	
			this.dragUpEventHandler = function(ev) { 
				this.initialOffset = null; // resetting allows draggableEventHandler to reissue this release eventHandler
	
				// this gives callback ability to check if colliding
				ev.checkCollision = this.collisionHelper.checkCollision;
	
				// if resolve on callback only is set then dont resolve on anything else
				if(!this.resolved) {
					if(this.resolveOnCallbackOnly) {
						if(this.endCallback)
							this.endCallback(endCall.call(this, ev), this._data, this._passValue, ev);
					}
					else if(this.resolveOnRelease) {
						if(this.endCallback)
							this.endCallback(endCall.call(this, ev), this._data, this._passValue, ev);
						if(!this.resolved)
							endCall.call(this, ev)(undefined, this._passValue); // essentialling calling the callback resolve
					}
				}
	
				if(this.stagemousemove) {
					stage.removeEventListener('stagemouseup', this.dragUpEventHandler);
					window.removeEventListener('mouseout', this.dragUpEventHandler);
				}
				else
					this._data.removeEventListener('pressup', this.dragUpEventHandler);
			}.bind(this);

			// disabling this as it seems to part of the issue causing 'hiccup' when clip visible disabled after stagemousemove eventHandling
//			stage.addEventListener('pressup', () => {}, undefined, true); // Not sure why but this 'primes' the event to dispatch promptly

			// this.draggableEventHandler used because button super.reset will set this.eventHandler to null
			this.draggableEventHandler = this.eventHandler = function(event) {
				if(this.stagemousemove && !stage.mouseInBounds) return;

				// must have parent
				if(this._data.parent || !this.suppressNullParentException) { // if no parent and this.suppressNullParentException is false will throw error when it try to access this._data.parent
					var p = this._data.parent.globalToLocal(event.stageX, event.stageY);

					if(!this.initialOffset) {
						this.initialOffset = {x: 0, y: 0};
	
						if(!this.stagemousemove) {
							this._data.addEventListener('pressup', this.dragUpEventHandler);
	
							if(!this.snapToCenter) {
								this.initialOffset.x = event.currentTarget.x - p.x;
								this.initialOffset.y = event.currentTarget.y - p.y;
							}
						}
						else {
							if(this.stagemouseReleaseOnExit) window.addEventListener('mouseout', this.dragUpEventHandler);
							if(this.stagemouseReleaseOnMouseup) stage.addEventListener('stagemouseup', this.dragUpEventHandler);
						}
					}
	
					this._data.x = p.x + this.initialOffset.x;
					this._data.y = p.y + this.initialOffset.y;
				}

				// this gives callback ability to check if colliding
				event.checkCollision = this.collisionHelper.checkCollision;

				// will run the callback and resolve if set
				if(this.runtimeCallback)
					this.runtimeCallback(endCall.call(this, event), this._data, this._passValue, event);
	
				// checking event collisions for resolve
				// if resolve on callback only is set then dont resolve on anything else
				if(!this.resolved && !this.resolveOnCallbackOnly) {
					if(this.resolveOnCollision) {
						if(event.checkCollision()) {
							if(this.endCallback)
								this.endCallback(endCall.call(this, event), this._data, this._passValue, event);
							if(!this.resolved)
								endCall.call(this, event)(undefined, this._passValue); // essentialling calling the callback resolve
						}
					}
				}
			}.bind(this);
	
			return this.eventHandler;
		}
	}
	
	class GesturableObject extends DraggableObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
	
			// we want to lock these gestureClip so you cannot change after constructor
			this._move = inOptions && "move" in inOptions ? inOptions.move : true;
			this._moveLimitX = inOptions && "moveLimitX" in inOptions ? inOptions.moveLimitX : 1;
			this._moveLimitY = inOptions && "moveLimitY" in inOptions ? inOptions.moveLimitY : 1;
			this._moveOffset = inOptions && "moveOffset" in inOptions ? inOptions.moveOffset : 1;
			this._moveFade = inOptions && "moveFade" in inOptions ? inOptions.moveFade : 1;
	
			this._rotate = inOptions && "rotate" in inOptions ? inOptions.rotate : true;
			this._rotateLimit = inOptions && "rotateLimit" in inOptions ? inOptions.rotateLimit : 1;
			this._rotateOffset = inOptions && "rotateOffset" in inOptions ? inOptions.rotateOffset : 1;
			this._rotateFade = inOptions && "rotateFade" in inOptions ? inOptions.rotateFade : 1;
	
			this._scale = inOptions && "scale" in inOptions ? inOptions.scale : true;
			this._scaleLimitX = inOptions && "scaleLimitX" in inOptions ? inOptions.scaleLimitX : 0.01;
			this._scaleLimitY = inOptions && "scaleLimitY" in inOptions ? inOptions.scaleLimitY : 0.01;
			this._scaleOffset = inOptions && "scaleOffset" in inOptions ? inOptions.scaleOffset : 1;
			this._scaleFade = inOptions && "scaleFade" in inOptions ? inOptions.scaleFade : 1;
	
			this._transformMultiplier = inOptions && "transformMultiplier" in inOptions ? inOptions.transformMultiplier : 1;
			this._dispatchOnPressUp = inOptions && "dispatchOnPressUp" in inOptions ? inOptions.dispatchOnPressUp : false;
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.resolveOnReleaseParams = inOptions && "resolveOnReleaseParams" in inOptions ? inOptions.resolveOnReleaseParams : 7;
	
			// if you change any of the options you need to update the gestureHelper!
			// we do not set up an auto update mechanism because we want to have the option to have a custom gestureHelper
			this.gestureHelper = new GestureHelper(this._data, {
				move: this._move,
				moveLimitX: this._moveLimitX,
				moveLimitY: this._moveLimitY,
				moveOffset: this._moveOffset,
				moveFade: this._moveFade,
				rotate: this._rotate,
				rotateLimit: this._rotateLimit,
				rotateOffset: this._rotateOffset,
				rotateFade: this._rotateFade,
				scale: this._scale,
				scaleLimitX: this._scaleLimitX,
				scaleLimitY: this._scaleLimitY,
				scaleOffset: this._scaleOffset,
				scaleFade: this._scaleFade,
				transformMultiplier: this._transformMultiplier,
				dispatchOnPressUp: this._dispatchOnPressUp,
			});
		}
	
		get type() {
			return "GesturableObject";
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;
	
			this.gestureHelper.init();
	
			if(this.setMouseAbility) this._data.mouseEnabled = true;
			if(this.setVisibility) this._data.visible = this.startVisible;
	
			if(this.removeEventListenersOnStart)
				this.removeAllEventListeners();

			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			prom = new Promise(resolve => {
				var eventHandler = this.dragMouseClickHandler(resolve);
				this._data.addEventListener('change', eventHandler);
				this._data.addEventListener('complete', eventHandler);
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();
	
			this.gestureHelper.reset();
			this._data.removeEventListener('change', this.eventHandler);
			this._data.removeEventListener('complete', this.eventHandler);
	
			return this;
		}
	
		dragMouseClickHandler(resolve)
		{
			this._startCallbackResolveHolder = resolve;
			// switching to use this._data instead of evt.currentTarget for same reasons as Draggable
			var endCall = evt => {
				return (node, passValue) => {
					this._data.removeEventListener('change', this.eventHandler);
					if(this.setMouseAbility) this._data.mouseEnabled = this.endMouseEnabled;
	
					if(this.setVisibility) {
						if(this.endVisibleNextTick) {
							var currentTarget = this._data;
							currentTarget.on('tick', () => currentTarget.visible = this.endVisible, null, true).seqcontrolType = this.type;
						}
						else this._data.visible = this.endVisible;
					}
					this.resolved = true;
					resolve({node, passValue});
					this.passValue = undefined;
				};
			};
	
			this.eventHandler = function(event) {
				if(event.type == 'change') {
					// this gives callback ability to check if colliding
					event.checkCollision = this.collisionHelper.checkCollision;
	
					// will run the callback and resolve if set
					if(this.runtimeCallback)
						this.runtimeCallback(endCall.call(this, event), this._data, this._passValue, event);
	
					// if resolve on callback only is set then dont resolve on anything else
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						if(this.resolveOnCollision) {
							if(event.checkCollision()) {
								if(this.endCallback)
									this.endCallback(endCall.call(this, event), this._data, this._passValue, event);
								if(!this.resolved)
									endCall.call(this, event)(undefined, this._passValue); // essentialling calling the callback resolve
							}
						}
					}
				}
				else {
					// if resolve on callback only is set then dont resolve on anything else
					if(!this.resolved) {
						if(this.resolveOnCallbackOnly) {
							if(this.endCallback)
								this.endCallback(endCall.call(this, event), this._data, this._passValue, event);
						}
						else if(this.resolveOnRelease && (this.resolveOnReleaseParams > 0)) {
							if(!("transformFlags" in event) || ( event.transformFlags && ((this.resolveOnReleaseParams & event.transformFlags) > 0) )) {
								if(this.endCallback)
									this.endCallback(endCall.call(this, event), this._data, this._passValue, event);
								if(!this.resolved)
									endCall.call(this, event)(undefined, this._passValue); // essentialling calling the callback resolve
							}
						}
					}
				}
			}.bind(this);
	
			return this.eventHandler;
		}
	}
	
	class VideoObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
	
			this.componentID = inOptions && "componentID" in inOptions ? inOptions.componentID : null;
			this.doNotPlay = inOptions && "doNotPlay" in inOptions ? inOptions.doNotPlay : false;
			this.playThenPause = inOptions && "playThenPause" in inOptions ? inOptions.playThenPause : 0;
			this.resolveImmediate = inOptions && "resolveImmediate" in inOptions ? inOptions.resolveImmediate : false; // resolves promise immediately in doNotPlay enabled	
			this.resume = inOptions && "resume" in inOptions ? inOptions.resume : false;
			this.rewindOnPrerun = inOptions && "rewindOnPrerun" in inOptions ? inOptions.rewindOnPrerun : true;

			this.playbackRate = inOptions && "playbackRate" in inOptions ? inOptions.playbackRate : 1;
			this.setVolume = inOptions && "setVolume" in inOptions ? inOptions.setVolume : true;
			this.volume = inOptions && "volume" in inOptions ? inOptions.volume : 1;
			this.muted = inOptions && "muted" in inOptions ? inOptions.muted : false;
			this.hideNow = inOptions && "hideNow" in inOptions ? inOptions.hideNow : true;
			this.usePoster = inOptions && "usePoster" in inOptions ? inOptions.usePoster : true;
	
			this.bitmapSwap = inOptions && "bitmapSwap" in inOptions ? inOptions.bitmapSwap : false;
			this.showBitmapNow = inOptions && "showBitmapNow" in inOptions ? inOptions.showBitmapNow : true;
			this.forceCopyCanvas = inOptions && "forceCopyCanvas" in inOptions ? inOptions.forceCopyCanvas : false;
			this.copyCanvasCallback = inOptions && "copyCanvasCallback" in inOptions ? inOptions.copyCanvasCallback : null;
			this.forceVideoBufferUpdate = inOptions && "forceVideoBufferUpdate" in inOptions ? inOptions.forceVideoBufferUpdate : true;
			this.removeBitmapSwap = inOptions && "removeBitmapSwap" in inOptions ? inOptions.removeBitmapSwap : false; // remove bitmap on run or reset
	
			this.animatecc = inOptions && "animatecc" in inOptions ? inOptions.animatecc : true;
			this.disablePointerEvents = inOptions && "disablePointerEvents" in inOptions ? inOptions.disablePointerEvents : true;
			this.HTMLAttributes = inOptions && "HTMLAttributes" in inOptions ? inOptions.HTMLAttributes : "webkit-playsinline playsinline";
			this.setHTMLAttributesOnRun = inOptions && "setHTMLAttributesOnRun" in inOptions ? inOptions.setHTMLAttributesOnRun : true;
	
			this.setVisibility = inOptions && "setVisibility" in inOptions ? inOptions.setVisibility : true;
			this.startVisible = inOptions && "startVisible" in inOptions ? inOptions.startVisible : true;
			this.endVisible = inOptions && "endVisible" in inOptions ? inOptions.endVisible : true;
			this.endVisibleNextTick = inOptions && "endVisibleNextTick" in inOptions ? inOptions.endVisibleNextTick : true;
			this.keepStateAfterReset = inOptions && "keepStateAfterReset" in inOptions ? inOptions.keepStateAfterReset : true;
	
			this.loop = inOptions && "loop" in inOptions ? inOptions.loop : false;
			this.startTime = inOptions && "startTime" in inOptions ? inOptions.startTime : null;
			this.stopTime = inOptions && "stopTime" in inOptions ? inOptions.stopTime : null;
			this.disableSeekBuffering = inOptions && "disableSeekBuffering" in inOptions ? inOptions.disableSeekBuffering : true;
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.runtimeCallback = inOptions && "runtimeCallback" in inOptions ? inOptions.runtimeCallback : null;
			this.preRunCallback = inOptions && "preRunCallback" in inOptions ? inOptions.preRunCallback : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this.resolveOnCallbackEnds = inOptions && "resolveOnCallbackEnds" in inOptions ? inOptions.resolveOnCallbackEnds : true;
			this.removeEventListenersOnPlay = inOptions && "removeEventListenersOnPlay" in inOptions ? inOptions.removeEventListenersOnPlay : true;
			this.disableDetach = inOptions && "disableDetach" in inOptions ? inOptions.disableDetach : true;
			this.reenableDetach = inOptions && "reenableDetach" in inOptions ? inOptions.reenableDetach : false;
	
			// play forward handlers
			this.onVideoComplete = this.onVideoComplete.bind(this);
			this.onVideoCompleteCallbacks = this.onVideoCompleteCallbacks.call(this, this.runtimeCallback, this.endCallback);
			this.onVideoCompleteLoop = this.onVideoCompleteLoop.bind(this);
			this.onVideoCompleteLoopAndCall = this.onVideoCompleteLoopAndCall.call(this, this.runtimeCallback, this.endCallback);
			this.handleType = null;
	
			// if(this.loop) {
			// 	if(this.endCallback || this.runtimeCallback)
			// 		this.handleType = this.onVideoCompleteLoopAndCall;
			// 	else
			// 		this.handleType = this.onVideoCompleteLoop;
			// }
			// else {
			// 	if(this.endCallback || this.runtimeCallback)
			// 		this.handleType = this.onVideoCompleteCallbacks;
			// 	else
			// 		this.handleType = this.onVideoComplete;
			// }
	
			this._startCallbackResolveHolder = null;
	
			this.bitmap = null;
	
			this._visibilityToggle = null;
			this._currentTimeToggle = null;
			this._resetted = false; // this is set after the first promisify and should NEVER be reset
	
			this.createVideoProm = this.createVideoProm.bind(this);
	
			// StageGL Event Handlers
			this.updateCanvas = null;
			this.rem = null;
			this.canplay = null;
	
			this._detachFunc = null;

			// if(this.removeBitmapSwap) VideoObject.removeBitmapSwap(this._data);
			// if(this.bitmapSwap && this.animatecc) Controller.injectComponentDraw(this._data);

			// if(stage.isWebGL) this._data.draw();
		}
	
		get type() {
			return "VideoObject";
		}
	
		set HTMLAttributes(inString) {
			this._HTMLAttributes = Object.fromEntries(Array.from((a => ((a.innerHTML = "<video " + inString + "></video>"), a))(document.createElement('div')).childNodes[0].attributes).map(i => [i.name, i.value === "undefined" ? undefined : i.value]));
		}
	
		get HTMLAttributes() {
			return this._HTMLAttributes;
		}

		get playbackRate() {
			return this._playbackRate;
		}

		set playbackRate(inNum = 1) {
			this._playbackRate = inNum < 0 ? 0 : inNum;
		}

		get volume() {
			return this._volume;
		}

		set volume(inNum = 1) {
			this._volume = inNum < 0 ? 0 : inNum;
		}

		// canvas or bitmap src
		static clearStoreID(canvasImageSrc) {
			if(canvasImageSrc)
				delete canvasImageSrc._storeID;
		}

		// this utility will copy a canvas into a 2D canvas or can clone a canvas 2D or webgl
		// this can be used to copy a canvas into a Bitmap for example
		// src: the canvas source to copy from
		// dest: the canvas to copy into, if falsy then one will be created
		// cloneNode: use the cloneNode method to create a copy (if one isnt given) 
		// context: context to use, can be 2d, webgl, or webgl2, NOTE: the image from the original is drawn only for 2d
		// clearStoreID: StageGL keeps a record of textures drawn by assigning a _storeID in order to not reload textures
		//			This will delete the _storeID in order to force StageGL to reload the canvas as a texture
		//			As the canvas is usually dynamic for this utility, the default is true
		static copyCanvas(src, dest, context = '2d', clearStoreID = true, forceDimensions = true) {
			if(!src) return null;

			if(!dest || forceDimensions && (dest.width != src.width || dest.height != src.height))
				dest = src.cloneNode();

			if(clearStoreID)
				VideoObject.clearStoreID(dest); // stageGL assigns a storeID so as to not reload texure - this will force stageGL to load this texture

			// if context is 2d then we can copy the image otherwise we dont as the webgl context is more complicated and better to leave it to user
			if(context == '2d') {
				var ctx = dest.getContext('2d');
				ctx.clearRect(0,0,src.width,src.height);
				ctx.drawImage(src, 0, 0);  // Copy the image.
			}
			return dest;
		}

		static removeBitmapSwap(component, animatecc = true) {
			if(SYMBOLS.BITMAPSWAP in component) {
				if(target[SYMBOLS.BITMAPSWAP].parent) target[SYMBOLS.BITMAPSWAP].parent.removeChild(target[SYMBOLS.BITMAPSWAP]); // parent should be same as
				delete target[SYMBOLS.BITMAPSWAP];
				if(animatecc) Controller.removeComponentDraw(component);
				return true;
			}
			return false;
		}
	
		// there is a 6 max concurrent connections limit on Chrome
		// this function can be used to unload a videoElement from that count
		// animate widgets already removes video element from DOM if it is no longer visible
		// unless disableDetach is enabled with reenableDetach disabled
		static disposeVideo(component, videoElement) {
			if(component) {
				Controller.reactivateDetach(component);
				VideoObject.removeBitmapSwap(component); // if there is a bitmnap swap then must remove it
			}
			if(videoElement) {
				videoElement.pause();
				videoElement.removeAttribute('src'); // for IE and Edge cannot set src to null you must removeAttribute
				videoElement.load(); // for Firefox
				if(component) {
					var parentDiv = videoElement.parentNode;
					videoElement.remove();
					if(parentDiv) parentDiv.remove();
				}
			}
		}

		// For AnimateCC static function returns the DOM element of a MovieClip component
		get instanceDOM() {
			var element = this.animatecc ? Controller.getInstanceDOM(this._data) : null;
			return this.componentID ? document.getElementById(this.componentID) : (element ? element : document.getElementById(this._data.name));
		}
	
		// if animatecc and has this._data._element
		get component() {
			return this.animatecc && this._data._element ? this._data : null;
		}
	
		//  Returns the dimensions of a video asynchrounsly.
		static getVideoDimensionsOf(videoInstance, video) {
			return new Promise(function(res) {
				// create the video element
				// place a listener on it
	
				var pRatio = window.devicePixelRatio || 1;
				function getMetaData(event) {
					// retrieve dimensions
					var videoWidth = videoInstance.videoWidth || video.videoWidth;
					var videoHeight = videoInstance.videoHeight || video.videoHeight;
					var width = video.width > 0 ? video.width : parseInt(video.style.width, 10);
					var height = video.height > 0 ? video.height : parseInt(video.style.height, 10);
					width /= pRatio;
					height /= pRatio;

					if((videoHeight > 0) && (videoWidth > 0)) {
						// loadedmetadata may not get called again and video may try to play without valid video dimensions
						// therefore store a copy of video dimensions in the video instance for future use
						videoInstance.videoWidth = videoWidth,
						videoInstance.videoHeight = videoHeight,

						// send back result
						res({
							video : video,
							videoInstance : videoInstance,
							videoWidth : videoWidth,
							videoHeight : videoHeight,
							width: width,
							height: height
						});
		
						if(event)
							event.target.removeEventListener('loadedmetadata', getMetaData);
					}
				}
	
				if( (video.videoHeight > 0 && video.videoWidth > 0) || (videoInstance.videoHeight > 0 && videoInstance.videoWidth > 0 && video.readyState >= 1) )
					getMetaData();
				else
					video.addEventListener('loadedmetadata', getMetaData);
			});
		}

		init(compsToDeactivateDetach) {
			super.init();

			var domVideoObj = this.instanceDOM;
			var vidInstance = this.data;

			// you can avoid remaking bitmapSwap by setting removeBitmapSwap false
			// this is also checked in reset();
			if(this.removeBitmapSwap) VideoObject.removeBitmapSwap(vidInstance);
			if(this.bitmapSwap && this.animatecc) Controller.injectComponentDraw(vidInstance); // injectComponentDraw() already checks if componentDraw already overriden
			if(stage.isWebGL && !vidInstance[SYMBOLS.BITMAPSWAP]) vidInstance.draw();

			if(compsToDeactivateDetach && this.disableDetach && this.animatecc) compsToDeactivateDetach.add(this.component);

			if(this.hideNow) {
				if(vidInstance) vidInstance.visible = false;
				if(domVideoObj) domVideoObj.hidden = true;
				if(vidInstance[SYMBOLS.BITMAPSWAP]) {
					vidInstance[SYMBOLS.BITMAPSWAP].visible = false;
				}
				else if(domVideoObj) {
					// not already swapped so go ahead and do it now
					// this is just so we do the swapping in advance
					// there are other things going on in promisifyVideo() so it needs to run eventually
					// whether we bitmapSwap or not
					if(this.bitmapSwap && this.showBitmapNow) {
						this.promisifyVideo().then(() => {
							domVideoObj.hidden = true;
							if(vidInstance[SYMBOLS.BITMAPSWAP]) vidInstance[SYMBOLS.BITMAPSWAP].visible = false;
							else if(stage.isWebGL) vidInstance.draw();
						})
					}
				}
			}
			else {
				if(vidInstance) vidInstance.visible = true;
				if(vidInstance[SYMBOLS.BITMAPSWAP]) {
					vidInstance[SYMBOLS.BITMAPSWAP].visible = true;
					if(domVideoObj) domVideoObj.hidden = true;
				}
				else if(domVideoObj) {
					domVideoObj.hidden = false;

					// not already swapped so go ahead and do it now
					// this is just so we do the swapping in advance
					// there are other things going on in promisifyVideo() so it needs to run eventually
					// whether we bitmapSwap or not
					if(this.bitmapSwap && this.showBitmapNow) {
						this.promisifyVideo().then(() => {
							domVideoObj.hidden = true;
							if(vidInstance[SYMBOLS.BITMAPSWAP]) vidInstance[SYMBOLS.BITMAPSWAP].visible = true;
							else if(stage.isWebGL) vidInstance.draw();
						})
					}
				}
			}
			
			if(domVideoObj) {
				if(this.rewindOnPrerun && domVideoObj.currentTime != 0)
					domVideoObj.currentTime = 0;

				domVideoObj.pause();
				if(this.animatecc && this.disablePointerEvents) domVideoObj.parentElement.style.pointerEvents = 'none';
				if(this.setHTMLAttributesOnRun && this.HTMLAttributes) Controller.setElementAttributes(domVideoObj, this.HTMLAttributes);
			}
			if(this.preRunCallback) this.preRunCallback(this);

			return this;
		}

		removeAllEventListeners() {
			var domVideoObj = this.instanceDOM;
			if(!domVideoObj)
				return null;
	
			if(domVideoObj.videoEventListeners) {
				while(domVideoObj.videoEventListeners.length > 0)
					domVideoObj.removeEventListener('timeupdate', domVideoObj.videoEventListeners.pop());
			}
		}
	
		// we want this to function before createPromise and during createPromise
		// this only is called when this.bitmap is not set or bitmapSwap is disabled
		// or during resetSequence from controller or controlObject
		promisifyVideo() {
			var domVideoObj = this.instanceDOM;
			// For some reason I can't control currentTime must always be zero from the very first run
			// when copyCanvas is in use
			var setResetted = false;
			if(this.bitmapSwap && (!this._resetted || !this.keepStateAfterReset) && (stage.isWebGL || this.forceCopyCanvas)) {
				// this can be redundant as it is called in createPromise but may be called without createPromise
				if(!this.resume && domVideoObj.currentTime != 0)
					domVideoObj.currentTime = 0;
		
				if(this.startTime && domVideoObj.currentTime != this.startTime)
					domVideoObj.currentTime = this.startTime;

				setResetted = true; // we need to set this._resetted only AFTER most of promisifyVideo is run look towards bottom
			}
	
			return VideoObject.getVideoDimensionsOf(this._data, domVideoObj).then(videoAttributes => {
				if(this.setVolume) {
					domVideoObj.volume = this.volume;
					domVideoObj.muted = this.muted;
				}

				domVideoObj.playbackRate = this.playbackRate;
				domVideoObj.autoplay = false;
				domVideoObj.controls = false;
				domVideoObj.loop = false;

				if(this.bitmapSwap) {
					// use bitmapSwap from previous
					var preSwapped = false;
					if(!!videoAttributes.videoInstance[SYMBOLS.BITMAPSWAP]) {
						this.bitmap = videoAttributes.videoInstance[SYMBOLS.BITMAPSWAP];
						preSwapped = !!this.bitmap;
					}

					// make sure we have a bitmap
					if(!preSwapped) {
						// create buffer and set it to _bitmap
						// if we are using StageGL we need to constantly update the canvas!
						// For some reason StageGL will not update the Bitmap unless the canvas is a new reference!
						var videoBuffer;
						if(stage.isWebGL || this.forceCopyCanvas) {
							this.bitmap = new createjs.Bitmap();
							videoBuffer = new createjs.VideoBuffer(domVideoObj);
							videoBuffer.usePoster = this.usePoster;
		
							this.updateCanvas = function(e) {
								this.bitmap.image = VideoObject.copyCanvas(videoBuffer.getImage(), this.bitmap.image); // send the image/canvas back so it doesnt have to recreate every time
								if(this.copyCanvasCallback) this.copyCanvasCallback(this._data, e);
								if(domVideoObj.paused)
									e&&e.remove();
							}.bind(this);
		
							// First set up the canvas source from the videoBuffer as our image source
							// This is to avoid null/CORS errors in the browser
							var bmp = this.bitmap;
							function posterCallback(imageCanvas) {
								bmp.image = VideoObject.copyCanvas(imageCanvas);
							}

							this.bitmap.image = VideoObject.copyCanvas(videoBuffer.getImage(this.usePoster ? posterCallback : false)); // return a new canvas for storing the image
							if(this.copyCanvasCallback && this.bitmap.image) this.copyCanvasCallback(this._data, {currentTarget: this.bitmap, target: this.bitmap});

							// When fully playable get the first frame renderable before playback begins
							this.rem = function(e) {
								createjs.Ticker.addEventListener('tick', this.updateCanvas);
							}.bind(this);
							domVideoObj.addEventListener('play', this.rem);

							// on refreshes this does not always fire
							this.canplay = function canPlay(e) {
								if(e.target.readyState >= 4) {
									this.bitmap.image = VideoObject.copyCanvas(videoBuffer.getImage(), this.bitmap.image); // send the image/canvas back so it doesnt have to recreate every time
									if(videoBuffer) videoBuffer._disableSeekBuffering = !!(this.disableSeekBuffering && this.stopTime); // image should be a VideoBuffer
									e.currentTarget.removeEventListener("canplaythrough", this.canplay);
								}
							}.bind(this);
							domVideoObj.addEventListener("canplaythrough", this.canplay);
		
							if(stage.isWebGL)
								stage.updateViewport(stage.canvas.width, stage.canvas.height);
						}
						else {
							videoBuffer = new createjs.VideoBuffer(domVideoObj);
							this.bitmap = new createjs.Bitmap(videoBuffer);
							videoBuffer.usePoster = this.usePoster;
						}
						
						// this.bitmap.image does not hold videoBuffer with stageGL so we save it out
						if(videoBuffer)
							videoBuffer._disableSeekBuffering = !!(this.disableSeekBuffering && this.stopTime);

						Controller.addChildToComponent(videoAttributes.videoInstance, this.bitmap, {injectComponentDraw: this.bitmapSwap, setBitmapSwap: this.bitmapSwap, domElem: videoAttributes.video, componentType: this.animatecc ? Controller.VIDEO : Controller.NONE});
					}

					videoAttributes.videoInstance[SYMBOLS.BITMAPSWAP] = this.bitmap;
				}
				if(setResetted) this._resetted = true;
	
				return Promise.resolve();
			}).catch( err => null );
		}
	
		// this is called from createPromise either from inside promisifyVideo (which waits for videoAttributes)
		// or it runs immediately if showBitmapNow is enabled and promisifyVideo has already been run.
		createVideoProm() {
			var domVideoObj = this.instanceDOM;
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
	
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			var prom = null;
			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			if(!this.setHTMLAttributesOnRun && this.HTMLAttributes) Controller.setElementAttributes(domVideoObj, this.HTMLAttributes);

			var bitmap = this._data[SYMBOLS.BITMAPSWAP];
			if(this.bitmapSwap && bitmap) {
				bitmap.visible = true; // make sure this is ready

				// videoBuffer holds a frame to avoid seek changes but this can be shown if a startTime is set
				// therefore dont set bitmap visibility till after time change
				if(this.forceVideoBufferUpdate && domVideoObj.currentTime != 0) {
					var component = this._data;
					var setVisibility = this.setVisibility;
					var startVisible = this.startVisible;

					domVideoObj.addEventListener('timeupdate', function showBitmap(e) {
						if(setVisibility) {
							component.visible = startVisible;
							domVideoObj.hidden = true;
						}
						e.currentTarget.removeEventListener('timeupdate', showBitmap);
					});
				}
				else {
					if(this.setVisibility) {
						var component = this._data;
						var setVisibility = this.setVisibility;
						var startVisible = this.startVisible;

						createjs.Ticker.on('tick', function showBitmap(e) {
							component.visible = startVisible;
							domVideoObj.hidden = true;
						}, undefined, true);
					}
				}
			}
			else { // no bitmapSwap because disabled or no bitmap
				if(this.setVisibility) {
					this._data.visible = this.startVisible;
					domVideoObj.hidden = !this.startVisible;
					if(bitmap) bitmap.visible = false;
				}
			}

			if(!this.doNotPlay)
				domVideoObj.play();
			else if(this.resolveImmediate) {
				switch(this.playThenPause) {
					case VideoObject.PLAY_THEN_PAUSE:
						var currentTime = domVideoObj.currentTime;
						var playThenPause = function(evt) {
							domVideoObj.pause();
							domVideoObj.currentTime = currentTime;
							if(evt) evt.currentTarget.removeEventListener('timeupdate', playThenPause);
						}.bind(this);
						// if you call play(), you cannot call pause() until play() resolves
						domVideoObj.addEventListener('timeupdate', playThenPause);
						domVideoObj.play();
						break;
					case VideoObject.PAUSE:
						domVideoObj.pause();
						break;
					case VideoObject.DONT_PAUSE:
					default:
						break;
				}
				this.resolved = true;
				if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
				prom = Promise.resolve({passValue: this._passValue});
				this.passValue = undefined;
			}
			else {
				switch(this.playThenPause) {
					case VideoObject.PLAY_THEN_PAUSE: // playThenPause without resolveImmediate means it will resolve on pause
						// in arrow functions this point always references the this pointer from context it was called from
						prom = new Promise(resolve => {
							var currentTime = domVideoObj.currentTime;
							var playThenPause = function(evt) {
								domVideoObj.pause();
								domVideoObj.currentTime = currentTime;
								if(!this.resolved) {
									this.resolved = true;
									if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
								}
								resolve({passValue: this._passValue});
								this.passValue = undefined;
								if(evt) evt.currentTarget.removeEventListener('timeupdate', playThenPause);
							}.bind(this);
							// if you call play(), you cannot call pause() until play() resolves
							domVideoObj.addEventListener('timeupdate', playThenPause);
							domVideoObj.play();
						});
						break;
					case VideoObject.PAUSE:
						domVideoObj.pause();
						break;
					case VideoObject.DONT_PAUSE:
					default:
						break;
				}
			}
	
			if(!prom) {
				prom = new Promise(resolve => {
					domVideoObj.addEventListener('timeupdate', this.handleType.call(this, resolve, this._data));
					domVideoObj.videoEventListeners.push(this.eventHandler);
				});
			}
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			if(this.loop) {
				if(this.endCallback || this.runtimeCallback)
					this.handleType = this.onVideoCompleteLoopAndCall;
				else
					this.handleType = this.onVideoCompleteLoop;
			}
			else {
				if(this.endCallback || this.runtimeCallback)
					this.handleType = this.onVideoCompleteCallbacks;
				else
					this.handleType = this.onVideoComplete;
			}
		
			var domVideoObj = this.instanceDOM;
	
			if(!domVideoObj) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
	
			// if a previous VideoObject is playing this video already like in a loop
			// remove any eventListener that might be attached to it
			if(!domVideoObj.videoEventListeners)
				domVideoObj.videoEventListeners = [];
	
			if(this.removeEventListenersOnPlay)
				this.removeAllEventListeners();
	
			if(!this.resume && domVideoObj.currentTime != 0)
				domVideoObj.currentTime = 0;
	
			if(this.startTime && domVideoObj.currentTime != this.startTime)
				domVideoObj.currentTime = this.startTime;

			// these are done in _prepSeqObj now
//			if(this.disableDetach && this.animatecc) Controller.deactivateDetach(this.component);
//			if(this.animatecc && this.disablePointerEvents) domVideoObj.parentElement.style.pointerEvents = 'none';

			if(!this.setHTMLAttributesOnRun && this.HTMLAttributes) Controller.setElementAttributes(domVideoObj, this.HTMLAttributes);

			// if promisified already (in _prepSeqObj) then do not promisify again just createVideoProm
			// if this has not been bitmapSwapped or bitmapSwap is disabled
			if(!this.bitmapSwap || !this.bitmap)
				prom = this.promisifyVideo().then(() => this.createVideoProm());

			return prom || this.createVideoProm();
		}
	
		reset() {
			super.reset();
	
			var domVideoObj = this.instanceDOM;
	
			Controller.reactivateDetach(this.component);
	
			if(domVideoObj) {
				this._currentTimeToggle = domVideoObj.currentTime;
	
				domVideoObj.removeEventListener('timeupdate', this.eventHandler);
				// stageGL forceCopyCanvas
				domVideoObj.removeEventListener('play', this.rem);
				domVideoObj.removeEventListener("canplaythrough", this.canplay);
	
				domVideoObj.pause();
	
				domVideoObj.volume = this.volume;
				domVideoObj.muted = this.muted;
				domVideoObj.playbackRate = this.playbackRate;
				domVideoObj.autoplay = false;
				domVideoObj.controls = false;
				domVideoObj.loop = false;
	
				if(!this.keepStateAfterReset && domVideoObj.currentTime != 0)
					domVideoObj.currentTime = 0;
	
				if(this.hideNow || this.bitmapSwap) {
					if(this._data) this._data.visible = false;
					domVideoObj.hidden = true;
				}
	
				if(this.animatecc && this.disablePointerEvents) domVideoObj.parentElement.style.pointerEvents = 'none';
			}
	
			if(this.bitmap) {
				// stageGL
				this._visibilityToggle = this.bitmap.visible;
				createjs.Ticker.removeEventListener('tick', this.updateCanvas);
				if(this.removeBitmapSwap) VideoObject.removeBitmapSwap(this._data);
				// VideoObject.removeBitmapSwap(this._data);
				// stage.update();
			}
			else
				this._visibilityToggle = !domVideoObj.hidden;
	
			this._startCallbackResolveHolder = null;
	
			this.bitmap = null;
			this.eventHandler = null;
	
			// StageGL
			this.updateCanvas = null;
			this.canplay = null;
			this.rem = null;
	
			return this;
		}
	
		// this returns a handler that runs once
		// the acutal eventHandler that is injected is returned and that is what runs asynchrounsly
		onVideoComplete(resolve, vidInstance) {
			this._startCallbackResolveHolder = resolve;
			this.eventHandler = function(event) {
				var vidElem = event.target;
				var endTime = this.stopTime ? this.stopTime : vidElem.duration;
				endTime = endTime <= 0 ? 0 : endTime >= vidElem.duration ? vidElem.duration : endTime;
	
				if(vidElem.currentTime >= endTime) {
					vidElem.currentTime = endTime;
					vidElem.pause();
	
					if(this.setVisibility) {
						if(this.bitmapSwap) {
							if(this.endVisibleNextTick) {
								var currentBitmap = this.bitmap;
								createjs.Ticker.on('tick', () => currentBitmap.visible = this.endVisible, null, true);
							}
							else this.bitmap.visible = this.endVisible;
						}
						else {
							if(this.endVisibleNextTick) createjs.Ticker.on('tick', () => {
								vidInstance.visible = this.endVisible;
								vidElem.hidden = !this.endVisible;
							}, null, true);
							else {
								vidInstance.visible = this.endVisible;
								vidElem.hidden = !this.endVisible;
							}
						}
					}
					vidElem.removeEventListener('timeupdate', this.eventHandler);
	
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						this.resolved = true;
						if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}
			}.bind(this);
	
			return this.eventHandler;
		}
	
		onVideoCompleteLoop(resolve, vidInstance) {
			this._startCallbackResolveHolder = resolve;
			this.eventHandler = function(event) {
				var vidElem = event.target;
				var beginTime = this.startTime ? this.startTime : 0;
				var endTime = this.stopTime ? this.stopTime : vidElem.duration;
				endTime = endTime <= 0 ? 0 : endTime >= vidElem.duration ? vidElem.duration : endTime;
	
				if(vidElem.currentTime >= endTime) {
					vidElem.currentTime = beginTime;
					vidElem.play();
	
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						this.resolved = true;
						if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}
			}.bind(this);
	
			return this.eventHandler;
		}
	
		onVideoCompleteCallbacks(runtimeCallback, endCallback) {
			return (resolve, vidInstance) => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					var vidElem = event.target;
					var endTime = this.stopTime ? this.stopTime : vidElem.duration;
					endTime = endTime <= 0 ? 0 : endTime >= vidElem.duration ? vidElem.duration : endTime;
	
					if(vidElem.currentTime >= endTime) {
						vidElem.currentTime = endTime;
						vidElem.pause();
	
						if(this.setVisibility) {
							if(this.bitmapSwap) {
								if(this.endVisibleNextTick) {
									var currentBitmap = this.bitmap;
									createjs.Ticker.on('tick', () => currentBitmap.visible = this.endVisible, null, true);
								}
								else this.bitmap.visible = this.endVisible;
							}
							else {
								if(this.endVisibleNextTick) createjs.Ticker.on('tick', () => {
									vidInstance.visible = this.endVisible;
									vidElem.hidden = !this.endVisible;
								}, null, true);
								else {
									vidInstance.visible = this.endVisible;
									vidElem.hidden = !this.endVisible;
								}
							}
						}
						vidElem.removeEventListener('timeupdate', this.eventHandler);
	
						if(endCallback) {
							endCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
	
						if(!this.resolved && !this.resolveOnCallbackOnly) {
							this.resolved = true;
							if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
							resolve({passValue: this._passValue});
							this.passValue = undefined;
						}
					}
	
					if(runtimeCallback) {
						runtimeCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								if(this.resolveOnCallbackEnds) {
									vidElem.pause();
	
									if(this.setVisibility) {
										if(this.bitmapSwap) {
											if(this.endVisibleNextTick) {
												var currentBitmap = this.bitmap;
												createjs.Ticker.on('tick', () => currentBitmap.visible = this.endVisible, null, true);
											}
											else this.bitmap.visible = this.endVisible;
										}
										else {
											if(this.endVisibleNextTick) createjs.Ticker.on('tick', () => {
												vidInstance.visible = this.endVisible;
												vidElem.hidden = !this.endVisible;
											}, null, true);
											else {
												vidInstance.visible = this.endVisible;
												vidElem.hidden = !this.endVisible;
											}
										}
									}
									vidElem.removeEventListener('timeupdate', this.eventHandler);
								}
								if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this._data, this._passValue, event);
					}
				}.bind(this);
	
				return this.eventHandler;
			};
		}
	
		onVideoCompleteLoopAndCall(runtimeCallback, endCallback) {
			return (resolve, vidInstance) => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					var vidElem = event.target;
					var beginTime = this.startTime ? this.startTime : 0;
					var endTime = this.stopTime ? this.stopTime : vidElem.duration;
					endTime = endTime <= 0 ? 0 : endTime >= vidElem.duration ? vidElem.duration : endTime;
	
					if(vidElem.currentTime >= endTime) {
						vidElem.currentTime = beginTime;
						vidElem.play();
	
						if(endCallback) {
							endCallback((node, passValue) => {
								if(!this.resolved) {
									this.resolved = true;
									if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
									resolve({node, passValue});
									this.passValue = undefined;
								}
							}, this._data, this._passValue, event);
						}
	
						if(!this.resolved && !this.resolveOnCallbackOnly) {
							this.resolved = true;
							if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
							resolve({passValue: this._passValue});
							this.passValue = undefined;
						}
					}
	
					if(runtimeCallback) {
						runtimeCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								if(this.resolveOnCallbackEnds) {
									vidElem.pause();
	
									if(this.setVisibility) {
										if(this.bitmapSwap) {
											if(this.endVisibleNextTick) {
												var currentBitmap = this.bitmap;
												createjs.Ticker.on('tick', () => currentBitmap.visible = this.endVisible, null, true);
											}
											else this.bitmap.visible = this.endVisible;
										}
										else {
											if(this.endVisibleNextTick) createjs.Ticker.on('tick', () => {
												vidInstance.visible = this.endVisible;
												vidElem.hidden = !this.endVisible;
											}, null, true);
											else {
												vidInstance.visible = this.endVisible;
												vidElem.hidden = !this.endVisible;
											}
										}
									}
									vidElem.removeEventListener('timeupdate', this.eventHandler);
								}
								if(this.disableDetach && this.reenableDetach) Controller.reactivateDetach(this.component);
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this._data, this._passValue, event);
					}
				}.bind(this);
	
				return this.eventHandler;
			};
		}
	}
	
	VideoObject.PAUSE = 0;
	VideoObject.PLAY_THEN_PAUSE = 1;
	VideoObject.DONT_PAUSE = 2;
	
	class WaitObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			this.waiting = false;
			this.timeoutId = -1;
			this.useTicks = inOptions && "useTicks" in inOptions ? inOptions.useTicks : false;
			this.convertTicksToTime = inOptions && "convertTicksToTime" in inOptions ? inOptions.convertTicksToTime : true;
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.runtimeCallback = inOptions && "runtimeCallback" in inOptions ? inOptions.runtimeCallback : null; // only applies if useTicks enabled
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this.disableTickerOnResolve = inOptions && "disableTickerOnResolve" in inOptions ? inOptions.disableTickerOnResolve : false;
	
			this._startCallbackResolveHolder = null;
		}
	
		get type() {
			return "WaitObject";
		}
	
		reset() {
			super.reset();
			if(this.timeoutId >= 0)
				clearTimeout(this.timeoutId);
	
			this.timeoutId = -1;
			this.waiting = false;
	
			this._startCallbackResolveHolder = null;
	
			return this;
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			prom = new Promise(resolve => {
				this._startCallbackResolveHolder = resolve;
	
				this.waiting = true;
				var endCall = (node, passValue) => {
					this.resolved = true;
					resolve({node, passValue});
					this.passValue = undefined;
				};
	
				if(this.useTicks && !this.convertTicksToTime) {
					var counter = 0;
					createjs.Ticker.on('tick', event => {
						event.counter = counter;
						if(counter >= this._data) {
							this.waiting = false;
							event.remove();
	
							if(this.endCallback)
								this.endCallback(endCall, this._data, this._passValue, event);
	
							if(!this.resolved && !this.resolveOnCallbackOnly)
								endCall(undefined, this._passValue);
						}
	
						if(this.runtimeCallback) {
							this.runtimeCallback((node, passValue) => {
								if(!this.resolved) endCall(node, passValue);
							}, this._data, this._passValue, event);
						}
	
						// still ticking but a callback has forced resolve
						// if disableTickerOnResolve then disable ticker
						// otherwise keep ticking until end thereby continuing callbacks (which dont resolve again)
						if(this.waiting && this.resolved && this.disableTickerOnResolve) {
							this.waiting = false;
							event.remove();
						}
						++counter;
					});
				}
				else {
					var delay = this.useTicks ? this._data * 1000 / createjs.Ticker.framerate : this._data;
	
					this.timeoutId = setTimeout(() => {
						this.waiting = false;
						if(!this.resolved) {
							if(this.endCallback) this.endCallback(endCall, this._data, this._passValue, {counter: delay});
							if(!this.resolved && !this.resolveOnCallbackOnly) endCall(undefined, this._passValue);
						}
					}, delay);
				}
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	class CodeObject extends SequenceObject {
		get type() {
			return "CodeObject";
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			this.passValue = inPassValue;
	
			prom = new Promise(resolve => {
				var endcall = (node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						resolve({node, passValue});
						this.passValue = undefined;
					}
				};
				this._data(endcall, this._passValue);
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	// inData is Source, id, or instance
	class SoundObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
	
			// this.dataIsInstance = typeof this._data != "string"; // tell seqcontrol you are using a previously created sound instance instead
	
			this.registerSound = inOptions && "registerSound" in inOptions ? inOptions.registerSound : false; // if src, then try to register it (you should use preload which does it for you), does not apply for instance
			this.registerID = inOptions && "registerID" in inOptions ? inOptions.registerID : undefined; // if src, then try to register it (you should use preload which does it for you), does not apply for instance
			this.registerData = inOptions && "registerData" in inOptions ? inOptions.registerData : undefined;
			this.registerBasePath = inOptions && "registerBasePath" in inOptions ? inOptions.registerBasePath : undefined;
			this.removeOnReset = inOptions && "removeOnReset" in inOptions ? inOptions.removeOnReset : false;
			this.soundHolder = inOptions && "soundHolder" in inOptions ? inOptions.soundHolder : null; // this will be object that will get OUR sound instance assigned to
			this.throwErrorOnMissing = inOptions && "throwErrorOnMissing" in inOptions ? inOptions.throwErrorOnMissing : false; // will force errors to be thrown if sound file is missing
	
			// if(this.dataIsInstance) {
			// 	if(this._data instanceof createjs.AbstractSoundInstance)
			// 		this.sound = this._data;
			// 	else
			// 		this._soundIsReferenced = true; // assume that data is to be an object { sound: soonToBeAssigned } 
			// }
	
			this.doNotPlay = inOptions && "doNotPlay" in inOptions ? inOptions.doNotPlay : false;
			this.resolveImmediate = inOptions && "resolveImmediate" in inOptions ? inOptions.resolveImmediate : false; // resolves promise immediately in doNotPlay enabled
			this.resume = inOptions && "resume" in inOptions ? inOptions.resume : false;
	
			this.setVolume = inOptions && "setVolume" in inOptions ? inOptions.setVolume : true;
			this.playProps = inOptions && "playProps" in inOptions ? inOptions.playProps : {};
	
			// // register sound if enabled, register means will attempt to load, you still need to check for load before play
			// // soundRegistered will be true if registered or already registered previously
			// this.soundRegistered = false;
			// if( this.registerSound && !this.sound && !this.dataIsInstance && this._data && SoundObject.isRegistered(this._data)==SoundObject.UNREGISTERED )
			// 	this.soundRegistered = createjs.Sound.registerSound(this._data, this.registerID, this.registerData, this.registerBasePath, this.playProps);
			
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.preRunCallback = inOptions && "preRunCallback" in inOptions ? inOptions.preRunCallback : null;
	
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this.resolveOnLoopCount = inOptions && "resolveOnLoopCount" in inOptions ? inOptions.resolveOnLoopCount : true; // use complete event otherwise use loop event
			this.resolveOnFailed = inOptions && "resolveOnFailed" in inOptions ? inOptions.resolveOnFailed : false;
			this.resolveOnInterrupt = inOptions && "resolveOnInterrupt" in inOptions ? inOptions.resolveOnInterrupt : false;
			
			this.removeEventListenersOnPlay = inOptions && "removeEventListenersOnPlay" in inOptions ? inOptions.removeEventListenersOnPlay : true;
	
			this._startCallbackResolveHolder = null;
		}

		get type() {
			return "SoundObject";
		}
	
		get data() {
			return this._data;
		}
		
		set data(inData) {
			this._data = inData;
			this.dataIsInstance = typeof this._data != "string"; // tell seqcontrol you are using a previously created sound instance instead
			this.sound = null;
			if(this.dataIsInstance) {
				if(this._data instanceof createjs.AbstractSoundInstance)
					this.sound = this._data;
				else
					this._soundIsReferenced = true; // assume that data is to be an object { sound: soonToBeAssigned } 
			}
		}
	
		// detects if sound has been registered either explicity via registerSound or PreloadJS
		// removeCacheBuster: if true will remove URL query params in sourceOrId assuming sourceOrId is a URL before searching the ID hash
		static isRegistered(sourceOrId, removeCacheBuster = false) {
			if( sourceOrId in createjs.Sound._idHash ) return SoundObject.ID_HASHED;
			if( Object.values(createjs.Sound._idHash).some(i=>sourceOrId == (removeCacheBuster ? i.src.replace(/\?.*$/,'') : i.src)) ) return SoundObject.SOURCE_HASHED;
			if( createjs.Sound.loadComplete(sourceOrId) ) return SoundObject.PRELOAD_HASHED;
			if( sourceOrId in createjs.Sound._preloadHash && Array.isArray(createjs.Sound._preloadHash[sourceOrId]) && createjs.Sound._preloadHash[sourceOrId].length > 0 ) return SoundObject.PRELOAD_HASHED;
			return SoundObject.UNREGISTERED;
		}

		init() {
			super.init();

			if(this.sound) this.sound.stop();
			// register sound if enabled, register means will attempt to load, you still need to check for load before play
			// soundRegistered will be true if registered or already registered previously
			this.soundRegistered = this.registerSound && !this.sound && !this.dataIsInstance && this._data ? (SoundObject.isRegistered(this._data)==SoundObject.UNREGISTERED ? !!createjs.Sound.registerSound(this._data, this.registerID, this.registerData, this.registerBasePath, this.playProps) : true) : false;
			if(this.preRunCallback) this.preRunCallback(this);

			if(this.shouldUnlockAudio && createjs.Sound.activePlugin instanceof createjs.HTMLAudioPlugin) {
				if( !this.sound && !this.dataIsInstance && ( !this.registerSound || (this.registerSound && this.soundRegistered)) )
					this.audioTagsToUnlock.add(this.data);
			}

			return this;
		}

		removeAllEventListeners(type) {
			if(this.sound) {
				if(!type) {
					this.removeSeqcontroListeners('complete', this.sound);
					this.removeSeqcontroListeners('loop', this.sound);
					this.removeSeqcontroListeners('failed', this.sound);
					this.removeSeqcontroListeners('interrupted ', this.sound);
				}
				else if(['complete', 'loop', 'failed', 'interrupted'].includes(type))
					this.removeSeqcontroListeners(type, this.sound);
	
				this.sound[SYMBOLS.AUDIO_UNLOCK] = true;
			}
		}
	
		createPromise(inPassValue) {
			var prom = null;
			var soundProm = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			// this._data has sound property should be assigned now otherwise throw error
			if(!this.sound && this._soundIsReferenced)
				this.sound = this._data.sound;
	
			if(this.removeEventListenersOnPlay)
				this.removeAllEventListeners();
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			var playProps = this.setVolume ? Object.assign({}, this.playProps) : Object.fromEntries(Object.entries(this.playProps).filter(i=>i[0] !== 'volume'));
		
			// if this._data was an object this.sound should alwayts be filled
			if(this.sound) { // this.sound[SYMBOLS.AUDIO_UNLOCK] gets set to true in removeEventListenersOnPlay
				if(this.doNotPlay)
					this.sound.paused = true;
				else if(this.resume)
					this.sound.play(playProps);
				else {
					this.sound.position = 0;
					this.sound.play(playProps);
				}
			}
			else {
				// if sound is registered but not yet load, delay attempt to play
				// this._data will always be a string
				if(this.soundRegistered && !createjs.Sound.loadComplete(this._data)) {
					soundProm = new Promise( (res, rej) => createjs.Sound.on('fileload', (evt) => {
						// if file loaded is this._data
						if(evt.src == this._data) {
							evt.remove();
							if(this.resolved) {
								rej(this);
							}
							else {
								if(this.doNotPlay)
									this.sound = createjs.Sound.createInstance(this._data, playProps && playProps.startTime, playProps && playProps.duration);
								else
									this.sound = createjs.Sound.play(this._data, playProps);
								
								if(this.soundHolder && this.sound) this.soundHolder.sound = this.sound;
								res();
							}
						}
					}) );
				}
				else { // sound could be _soundIsReferenced so watch for that
					if(createjs.Sound.activePlugin instanceof createjs.WebAudioPlugin) {
						// if audio is locked wait for it to unlock and then play
						if(createjs.Sound.activePlugin.context.state == 'suspended') {
							soundProm = new Promise((res, rej) => {
								// this.sound = createjs.Sound.createInstance(this._data, playProps && playProps.startTime, playProps && playProps.duration);
								// if(this.soundHolder && this.sound) this.soundHolder.sound = this.sound;
								if(this.sound) this.sound[SYMBOLS.AUDIO_UNLOCK] = false;

								var handleStateChange;
								createjs.WebAudioPlugin.playEmptySound();
								createjs.Sound.activePlugin.context.addEventListener('statechange', handleStateChange = () => {
									if(this.resolved) {
										createjs.Sound.activePlugin.context.removeEventListener('statechange', handleStateChange);
										rej(this);
									}
									else if(createjs.Sound.activePlugin.context.state == 'running') {
										createjs.Sound.activePlugin.context.removeEventListener('statechange',handleStateChange);
										if(!this.sound || !this.sound[SYMBOLS.AUDIO_UNLOCK]) {
											if(!this.sound && this._soundIsReferenced) this.sound = this._data.sound;

											if(this.sound) {
												if(this.doNotPlay)
													this.sound.paused = true;
												else
													this.sound.play(playProps);
											}
											else {
												if(!this._soundIsReferenced) {
													if(this.doNotPlay)
														this.sound = createjs.Sound.createInstance(this._data, playProps && playProps.startTime, playProps && playProps.duration);
													else
														this.sound = createjs.Sound.play(this._data, playProps);
												}
												else { // no sound but is referenced
													// if dont throw error then reject otherwise throws error
													if(!this.throwErrorOnMissing)
														rej(this);
												}
											}
											
											if(this.sound) {
												if(this.soundHolder) this.soundHolder.sound = this.sound;
												this.sound[SYMBOLS.AUDIO_UNLOCK] = true;
											}
										}
										else { // there is this.sound
											if(this.doNotPlay)
												this.sound.paused = true;
											else
												this.sound.play(playProps);
											
											if(this.soundHolder) this.soundHolder.sound = this.sound;
											this.sound[SYMBOLS.AUDIO_UNLOCK] = true;
										}

										if(!this.sound) {
											if(!this.throwErrorOnMissing)
												rej(this);
										}
										else
											res();
									}
								});
							});
						}
						else if(this._soundIsReferenced) { // no sound but is referenced
							// if dont throw error then reject otherwise throws error
							if(!this.throwErrorOnMissing)
								prom = Promise.reject(this); // cannot return Promise.reject because we need to evaluate more if doNotPlay is enabled
						}
						else // play normal this is the normal routine!
							this.sound = createjs.Sound.play(this._data, playProps);
					}
					else if(createjs.Sound.activePlugin instanceof createjs.HTMLAudioPlugin) {
						// no sound and not referenced
						if(!this._soundIsReferenced) {
							if(!this.sound || !this.sound[SYMBOLS.AUDIO_UNLOCK]) {
								if(!this.sound && this._soundIsReferenced) this.sound = this._data.sound;

								if(this.sound) {
									if(this.doNotPlay)
										this.sound.paused = true;
									else
										this.sound.play(playProps);
								}
								else {
									if(!this._soundIsReferenced) {
										if(this.doNotPlay)
											this.sound = createjs.Sound.createInstance(this._data, playProps && playProps.startTime, playProps && playProps.duration);
										else
											this.sound = createjs.Sound.play(this._data, playProps);
									}
								}

								if(this.sound) {
									if(this.soundHolder && this.sound) this.soundHolder.sound = this.sound;
									this.sound[SYMBOLS.AUDIO_UNLOCK] = true;
									
									soundProm = new Promise((res, rej) => {
										var playHandler = function (evt) {
											evt.target.removeEventListener('playing', playHandler);

											if(this.resolved)
												rej(this);
											else
												res();
										}.bind(this);
										this.sound.playbackResource.addEventListener('playing', playHandler);
									});
								}
								else
									prom = Promise.reject(this); // cannot return Promise.reject because we need to evaluate more if doNotPlay is enabled
							}
							else { // there is this.sound
								if(this.doNotPlay)
									this.sound.paused = true;
								else
									this.sound.play(playProps);
								
								if(this.soundHolder) this.soundHolder.sound = this.sound;
								this.sound[SYMBOLS.AUDIO_UNLOCK] = true;
							}
						}
						else { // no sound and it is referenced
							// if dont throw error then reject otherwise throws error
							if(!this.throwErrorOnMissing)
								prom = Promise.reject(this); // cannot return Promise.reject because we need to evaluate more if doNotPlay is enabled
						}
					}
					else if(this._soundIsReferenced) { // no plugin and no sound but is referenced
						// if dont throw error then reject otherwise throws error
						if(!this.throwErrorOnMissing)
							prom = Promise.reject(this); // cannot return Promise.reject because we need to evaluate more if doNotPlay is enabled
					}
					else { // no plugin and no sound and not referenced attempt
						if(this.doNotPlay)
							this.sound = createjs.Sound.createInstance(this._data, playProps && playProps.startTime, playProps && playProps.duration);
						else
							this.sound = createjs.Sound.play(this._data, playProps);
					}
				}
			}

			// doNotPlay with resolveImmediate enabled may override prom in order to resolve and will block errors being thrown
			if(this.doNotPlay && this.resolveImmediate) {
				this.resolved = true;

				// if _soundIsReferenced it may generate soundprom or set prom to a Promise.reject();
				// however since we are resolveImmediate we need to Promise.resolve()
				// leaving soundProm or prom open to uncaught exception
				// because we used reject in or Promises we MUST chain a catch()
				// since these Promises will no longer propagate
				if(soundProm) soundProm.catch(() => {}); 
				if(prom) prom.catch(() => {});

				prom = Promise.resolve({passValue: this._passValue});
				this.passValue = undefined;
			}
	
			if(!prom) {
				// must have one or more event types and lastly the event handler
				// Example: multiAddEventListenerPromise('complete', 'change', onEndHandler)
				var multiAddEventListenerPromise = function(...params) {
					var inCallback = params.pop();
					return new Promise(resolve => {
						var eventHandler = inCallback(resolve);
						params.forEach(eventType => this.addEventListener(eventType, eventHandler))
					});
				};
	
				var eventTypes = [];
				eventTypes.push(this.resolveOnLoopCount || !playProps.loop || playProps.loop <= 1 ? 'complete' : 'loop');
				if(this.resolveOnFailed) eventTypes.push('failed');
				if(this.resolveOnInterrupt) eventTypes.push('interrupted');

				if(soundProm)
					prom = soundProm.then( () => multiAddEventListenerPromise.call(this.sound, ...eventTypes, this.onSoundHandler.call(this, this.sound, this.endCallback)) );
				else if(!this.sound)
					prom = Promise.reject(this);
				else
					prom = multiAddEventListenerPromise.call(this.sound, ...eventTypes, this.onSoundHandler.call(this, this.sound, this.endCallback));
			}
		
			if(this.soundHolder && this.sound) this.soundHolder.sound = this.sound;
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
			
		reset() {
			super.reset();

			if(this.sound) {
				this.sound.removeEventListener('complete', this.eventHandler);
				this.sound.removeEventListener('loop', this.eventHandler);
				this.sound.removeEventListener('failed', this.eventHandler);
				this.sound.removeEventListener('interrupted', this.eventHandler);
				delete this.sound[SYMBOLS.AUDIO_UNLOCK];
			}
	
			this.eventHandler = null;
			this._startCallbackResolveHolder = null;
	
			if(this.soundRegistered && this.removeOnReset) {
				createjs.Sound.removeSound(this._data, this.registerBasePath);
				this.sound = null;
				this.soundRegistered = false;
			}
	
			return this;
		}
	
		onSoundHandler(instance, endCallback) {
			return resolve => {
				this._startCallbackResolveHolder = resolve;
				this.eventHandler = function(event) {
					instance.paused = true;
					event.currentTarget.removeEventListener('complete', this.eventHandler);
					event.currentTarget.removeEventListener('loop', this.eventHandler);
					event.currentTarget.removeEventListener('failed', this.eventHandler);
					event.currentTarget.removeEventListener('interrupted', this.eventHandler);
	
					if(endCallback) {
						endCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this.sound, event);
					}
	
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}.bind(this);
	
				return this.eventHandler;
			}
		}
	}
	
	SoundObject.UNREGISTERED = 0;
	SoundObject.ID_HASHED = 1;
	SoundObject.SOURCE_HASHED = 2;
	SoundObject.PRELOAD_HASHED = 3;

	// BEGIN SHIM MODIFICATIONS	
	class CacheObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			// this._numUseGLStates = 4;
			// this._numUseGLStates = 3;
	
			this.removeCache = inOptions && "removeCache" in inOptions ? inOptions.removeCache : false;
			this.updateCacheOnly = inOptions && "updateCacheOnly" in inOptions ? inOptions.updateCacheOnly : false;
			this.compositeOperation = (inOptions && "compositeOperation" in inOptions) && inOptions.compositeOperation ? inOptions.compositeOperation : undefined;
			this.compositeOperationMask = (inOptions && "compositeOperationMask" in inOptions) && inOptions.compositeOperationMask ? inOptions.compositeOperationMask : undefined;
			this.concatenatedScale = inOptions && "concatenatedScale" in inOptions ? inOptions.concatenatedScale : false;
			this.maxScale = inOptions && "maxScale" in inOptions ? inOptions.maxScale : 2;
			this.cacheScale = inOptions && "cacheScale" in inOptions ? inOptions.cacheScale : 1;
	
			this.mask = inOptions && "mask" in inOptions ? inOptions.mask : null;
			this.clipAnimates = inOptions && "clipAnimates" in inOptions ? inOptions.clipAnimates : false;
			this.maskAnimates = inOptions && "maskAnimates" in inOptions ? inOptions.maskAnimates : false;
			this.clipListenerTicks = inOptions && "clipListenerTicks" in inOptions ? inOptions.clipListenerTicks : false;
			this.maskListenerTicks = inOptions && "maskListenerTicks" in inOptions ? inOptions.maskListenerTicks : false;

			this.forceCache = inOptions && "forceCache" in inOptions ? inOptions.forceCache : false;
			this.forceMaskCache = inOptions && "forceMaskCache" in inOptions ? inOptions.forceMaskCache : false;
			this.forceX = inOptions && "forceX" in inOptions ? inOptions.forceX : null;
			this.forceY = inOptions && "forceY" in inOptions ? inOptions.forceY : null;
			this.forceWidth = inOptions && "forceWidth" in inOptions ? inOptions.forceWidth : null;
			this.forceHeight = inOptions && "forceHeight" in inOptions ? inOptions.forceHeight : null;

			this.disableTicks = inOptions && "disableTicks" in inOptions ? inOptions.disableTicks : CacheObject.DISABLE_TICK_SELF;
			this.disableMaskTicks = inOptions && "disableMaskTicks" in inOptions ? inOptions.disableMaskTicks : CacheObject.DISABLE_TICK_SELF;
	
			this.callback = inOptions && "callback" in inOptions ? inOptions.callback : null;
			this.maskCallback = inOptions && "maskCallback" in inOptions ? inOptions.maskCallback : null;
	
			this.useGL = inOptions && "useGL" in inOptions ? inOptions.useGL : CacheObject.IGNORE;
			this.userStageGL = inOptions && "userStageGL" in inOptions ? inOptions.userStageGL : null;
			
			this.maskUseGL = inOptions && "maskUseGL" in inOptions ? inOptions.maskUseGL : CacheObject.IGNORE;
			this.maskUserStageGL = inOptions && "maskUserStageGL" in inOptions ? inOptions.maskUserStageGL : null;
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this._startCallbackResolveHolder = null;
		}
	
		get type() {
			return "CacheObject";
		}
	
		get data() {
			return this._data;
		}

		set data(inData) {
			this._data = Array.isArray(inData) ? [...inData] : [inData];
		}	
	
		get mask() {
			return this._mask;
		}

		set mask(inClip = null) {
			this._mask = inClip && inClip instanceof createjs.DisplayObject ? inClip : null;
		}	
	
		get disableTicks() {
			return this._disableTicks;
		}
	
		set disableTicks(inMode = CacheObject.DISABLE_TICK_SELF) {
			this._disableTicks = inMode !== null && inMode !== "" && inMode >= 0 && inMode < CacheObject.NUM_DISABLE_TICK_STATES ? inMode : CacheObject.DISABLE_TICK_SELF;
		}
	
		get disableMaskTicks() {
			return this._disableMaskTicks;
		}
	
		set disableMaskTicks(inMode = CacheObject.DISABLE_TICK_SELF) {
			this._disableMaskTicks = inMode !== null && inMode !== "" && inMode >= 0 && inMode < CacheObject.NUM_DISABLE_TICK_STATES ? inMode : CacheObject.DISABLE_TICK_SELF;
		}

		get useGL() {
			return this._useGL;
		}

		set useGL(inMode = CacheObject.IGNORE) {
			this._useGL = inMode >= 0 && inMode < CacheObject.NUM_USEGL_STATES ? inMode : CacheObject.IGNORE;
		}

		get userStageGL() {
			return this._userStageGL;
		}

		set userStageGL(inStage = null) {
			this._userStageGL = inStage instanceof createjs.StageGL ? inStage : null;
		}


		get maskUseGL() {
			return this._maskUseGL;
		}

		set maskUseGL(inMode = CacheObject.IGNORE) {
			this._maskUseGL = inMode >= 0 && inMode < CacheObject.NUM_USEGL_STATES ? inMode : CacheObject.IGNORE;
		}

		get maskUserStageGL() {
			return this._maskUserStageGL;
		}

		set maskUserStageGL(inStage = null) {
			this._maskUserStageGL = inStage instanceof createjs.StageGL ? inStage : null;
		}

		// NOTE: When using secontrol.AnimationObject make sure to disable "remove old eventListeners on playback" !
		// returns listeners if clip or mask animates
		// you can use these to remove the eventListener later on
		// Multiframe bounds changes getBounds, we ALWAYS need a _bounds because we use it to calculate the cache size
		// Make sure to add a background obj to encompass the size of an animation. You can hide it but it will still calculate correct bounds.
		// or use a try-catch block to avoid the thrown error
		// Graphic Symbols must use 'tick' - its timeline will not dispatch change automatically
		// You can also set clipAnimates, maskAnimates to false and listen to nesting timeline's 'change' event to advance Graphic Symbol
		// Also, keep in mind that when using Graphic symbols, the movie clip will loop
		// so make sure you do not re-run this cache code by saving a init flag on the parent movieClip
	
		// mask: optional mask to apply using AlphaMaskFilter
		// clipAnimates: will update clip cache using ticks or timeline 'change' events
		// maskAnimates: will update mask cache using ticks or timeline 'change' events
		// clipListenerTicks: 	set true to use tick events instead of timeline 'change' event for updates for clip changes
		// 						set an 'animating' property on the clip to toggle animation
		// maskListenerTicks: 	set true to use tick events instead of timeline 'change' event for updates for mask animation
		// 						set an 'animating' property on the clip to toggle animation
	
		// NOTE: if clip/mask is single frame, it will disable clipAnimates/maskAnimates
	
		// forceCache: set to true to cache the clip otherwise you must apply cache beforehand, i.e. set to false if you use Adobe Animate UI to cache clip
		// forceMaskCache: set to true to cache the mask otherwise you must apply cache beforehand, i.e. set to false if you use Adobe Animate UI to cache mask
		// cacheOptions: optional x, y, width, height, scale params for cache method on clip as well as substitute callback for updateCache method
		// if x, y, width, height are undefined then getBounds method is used for bounds and scale defaults to 1
		// if callback is set, then this method is used instead of updateCache
		// this is used to control the updating of the cache on your own, if used you must then call updateCache in your callback to update the cache
		// for example when you want to recache dynamically due to changes in scale etc.
		static quickCache(clip, {mask = null, clipAnimates = false, maskAnimates = false, clipListenerTicks = false, maskListenerTicks = false, forceCache = false, forceMaskCache = false, disableTicks = CacheObject.DISABLE_TICK_SELF, disableMaskTicks = CacheObject.DISABLE_TICK_SELF, callback = null, maskCallback = null, cacheOptions:inCacheOptions = {}} = {}) {
			var clipListener;
			var maskListener;

			// inCacheOptions is an object so we need to use dupes so we dont propagate changes to other caches
			var cacheOptions = Object.assign({}, inCacheOptions);
			var maskCacheOptions = Object.assign({}, inCacheOptions);
	
			var {useGL, maskUseGL} = cacheOptions;
			if(clip) {
				clipAnimates = clipAnimates && !clipListenerTicks && clip.totalFrames <= 1 ? false : clipAnimates;
	
				// we put getBounds to catch exception thrown if getBounds called from empty MC with multiframe bounds
				var bounds = ( ({x,y,width,height,scale}) => ({x,y,width,height,scale}) )(cacheOptions);
				if(bounds.x == null || bounds.y == null || bounds.width == null || bounds.height == null || bounds.scale == null && clip.cacheCanvas) {
					// tempbounds used to make sure that user defined values from cacheOptions are forced
					// tempbounds is used to override clip.getBounds values later
					// we dont want to propagate null or undefined values so remove them
					var tempBounds = Object.keys(bounds).reduce((acc, cur) => {
						if(bounds[cur] != null) acc[cur] = bounds[cur];
						return acc;
					}, {});

					try { 
						Object.assign(bounds, ( ({x,y,width,height}) => ({x,y,width,height}) )(clip.getBounds()));
						if(bounds.scale == null && clip.cacheCanvas && clip.bitmapCache) bounds.scale = clip.bitmapCache.scale;
						if(bounds.scale == null) bounds.scale = 1; // if scale is 1 it does not need to be defined because the default is 1 but we will be explicit in the params anyway
					}
					catch(err) { bounds = {x:0, y:0, width:0, height:0, scale:1}; }

					// tempbounds is used to override clip.getBounds values
					Object.assign(bounds, tempBounds);
				}
				var {x, y, width, height, scale} = bounds;
	
				var shouldForceCache = !clip.cacheCanvas || forceCache;
				if(mask) {
					maskAnimates = maskAnimates && !maskListenerTicks && mask.totalFrames <= 1 ? false : maskAnimates;
	
					var shouldForceMaskCache = !mask.cacheCanvas || forceMaskCache;
					if(shouldForceCache || shouldForceMaskCache) {
						var newUpperLeft = clip.localToLocal(x,y,mask);
						var newLowerRight = clip.localToLocal(width+x, height+y, mask);
	
						mask.visible = true;
						if(shouldForceMaskCache) {
							mask.uncache();
							mask.cache(newUpperLeft.x, newUpperLeft.y, newLowerRight.x-newUpperLeft.x, newLowerRight.y-newUpperLeft.y,scale,maskUseGL&&{useGL:maskUseGL});
						}
						clip.filters = [new createjs.AlphaMaskFilter(mask.cacheCanvas)];
						if(shouldForceCache) {
							clip.uncache();
							clip.cache(x, y, width, height, scale, useGL&&{useGL:useGL});
						}
					}
					mask.visible = false;

					// we can copy properties to this copy of cacheOptions because it wont be reused
					Object.assign(maskCacheOptions, {x, y, width, height, scale, useGL: maskUseGL});
					var maskCacheHandler = maskCallback ? (evt => {
						evt.target = mask;
						evt.cacheOptions = maskCacheOptions;
						maskCallback(evt);
					}) : (() => mask.updateCache(this.compositeOperationMask));

					// if animating does not exist or is true then will update
					if(maskAnimates) maskListener = maskListenerTicks ? mask.on('tick', function(e) { mask.animating !== false && maskCacheHandler(e) }) : mask.timeline&&mask.timeline.on('change', function(e) { maskCacheHandler(e) });
					else {
						switch(disableMaskTicks) {
							case CacheObject.DISABLE_TICK_CHILDREN:
								mask[SYMBOLS.TICKCHILDREN] = mask.tickChildren;
								mask.tickChildren = false;
								break;
							case CacheObject.DISABLE_TICK_SELF:
								mask[SYMBOLS.TICKENABLED] = mask.tickEnabled;
								mask.tickEnabled = false;
								break;
							default:
								break;
						}
						if(maskCallback) maskCallback({target: mask, cacheOptions: maskCacheOptions});
					}
				}
				else if(shouldForceCache) {
					clip.uncache();
					clip.cache(x, y, width, height, scale, useGL&&{useGL:useGL});
				}

				// we can copy properties to this copy of cacheOptions because it wont be reused
				Object.assign(cacheOptions, {x, y, width, height, scale, useGL});
				var cacheHandler = callback ? (evt => {
					evt.target = clip;
					evt.cacheOptions = cacheOptions;
					callback(evt);
				}) : (() => clip.updateCache(this.compositeOperation));

				if(clipAnimates || maskAnimates) clipListener = clipListenerTicks ? clip.on('tick', function(e) { clip.animating !== false && cacheHandler(e); }) : ( !clipAnimates ? clip.on('tick', function(e) { cacheHandler(e); }) : clip.timeline&&clip.timeline.on('change', function(e) { cacheHandler(e); }) );
				else {
					switch(disableTicks) {
						case CacheObject.DISABLE_TICK_CHILDREN:
							clip[SYMBOLS.TICKCHILDREN] = clip.tickChildren;
							clip.tickChildren = false;
							break;
						case CacheObject.DISABLE_TICK_SELF:
							clip[SYMBOLS.TICKENABLED] = clip.tickEnabled;
							clip.tickEnabled = false;
							break;
						default:
							break;
					}
					if(callback) callback({target: clip, cacheOptions: cacheOptions}); // this means callback runs no matter if override is set or not
				}
			}
	
			return [clipListener, maskListener];
		}
	
		static getConcatenatedScale(target) {
			return target.getConcatenatedMatrix().decompose().scaleX;
		}
	
		static onConcatenatedScale(evt) {
			var {x, y, width, height, scale, maxScale, useGL} = evt.cacheOptions;
//			var computedScale = evt.target.getConcatenatedMatrix().decompose().scaleX*(scale || 1);
			var computedScale = CacheObject.getConcatenatedScale(evt.target)*(scale || 1);
			var clampedScale = maxScale ? Math.max(-maxScale, Math.min(maxScale, computedScale)) : computedScale;
			evt.target.cache(x, y, width, height, clampedScale, useGL&&{useGL:useGL});
		}

		// updates a target cache using the previous frame instad of the current one
		// this can be useful for instances to force cache an item which is usually updated
		// via tick event and therefore what is normally rendered is the from the previous state
		static updatePrevCache(target) {
			Controller.setupFromPrevState(target, function(tgt) { tgt.updateCache(); });
		}

		// this is a replacement for AdobeAn.handleFilterCache to be used during when the 'tick' event
		// is not used such as during a spriteSheet build
		// AdobeAn.handleFilterCache will cache before the playhead has advanced
		// this causes a problem as the cache rendered is actually that of the frame before
		// therefore any subsequent update to cache will not match state
		// such as when manually forcing an update during a setupFunc in a sprite build
		// the following method can be use to copy such caching for spritify
		static handleFilterCache(target) {
			if(target.filterCacheList) {
				Controller.setupFromPrevState(target, function(tgt) {
					for(var index = 0; index < tgt.filterCacheList.length ; index++){
						var cacheInst = tgt.filterCacheList[index];
						if((cacheInst.startFrame <= tgt.currentFrame) && (tgt.currentFrame <= cacheInst.endFrame)) cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				});
			}
		}

		removeSeqcontroListeners(type, targets = this._data) {
			targets.forEach(target => {
				if(target._listeners) {
					// get array of listeners of type
					var arr = target._listeners[type];
					if(arr) {
						for (var i=arr.length-1; i>=0; i--) {
							if(arr[i].seqcontrolType == this.type) {
								if(arr.length == 1) delete(target._listeners[type]);
								else arr.splice(i,1);
							}
						}	
					}	
				}
	
				if(target._captureListeners) {
					// get array of listeners of type
					var arr = target._captureListeners[type];
					if(arr) {
						for (var i=arr.length-1; i>=0; i--) {
							if(arr[i].seqcontrolType == this.type) {
								if(arr.length == 1) delete(target._captureListeners[type]);
								else arr.splice(i,1);
							}
						}	
					}
				}	
			});
		}

		removeAllEventListeners(type) {
			if(!type || type == 'tick') {
				this.removeSeqcontroListeners('tick');
				if(this.mask) this.removeSeqcontroListeners('tick', this.mask);
			}

			if(!type || type == 'change') {
				this.removeSeqcontroListeners('change', this._data.map(i=>i.timeline||null).filter(i=>!!i));
				if(this.mask && this.mask.timeline) this.removeSeqcontroListeners('change', this.mask.timeline);
			}
		}

		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;

			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			prom = new Promise(resolve => {
				this._startCallbackResolveHolder = resolve;
				var options = {mask: this.mask, clipAnimates: this.clipAnimates, maskAnimates: this.maskAnimates, clipListenerTicks: this.clipListenerTicks, maskListenerTicks: this.maskListenerTicks, forceCache: this.forceCache, forceMaskCache: this.forceMaskCache, disableTicks: this.disableTicks, disableMaskTicks: this.disableMaskTicks, callback: this.callback, maskCallback: this.maskCallback};

				// remove any undefined values, null values will go through
				options = Object.keys(options).reduce((acc, cur) => {
					if(options[cur] !== undefined) acc[cur] = options[cur];
					return acc;
				}, {});

				// add cacheOptions vals if not undefined or null
				options.cacheOptions = {x: this.forceX, y: this.forceY, width: this.forceWidth, height: this.forceHeight};

				// although quickcache scrubs out null values we still need filter out here as cacheOptions also used for callbacks
				options.cacheOptions = Object.keys(options.cacheOptions).reduce((acc, cur) => {
					if(options.cacheOptions[cur] != null) acc[cur] = options.cacheOptions[cur];
					return acc;
				}, {});

				if(this.concatenatedScale) {
					if(options.callback) {
						var userCallback = options.callback;
						options.callback = function(evt) {
							CacheObject.onConcatenatedScale(evt);
							userCallback(evt);
						}
					}
					else
						options.callback = CacheObject.onConcatenatedScale;
	
					if(this.mask) {
						if(options.maskCallback) {
							var userMaskCallback = options.maskCallback;
							options.maskCallback = function(evt) {
								CacheObject.onConcatenatedScale(evt);
								userMaskCallback(evt);
							}
						}
						else
							options.maskCallback = CacheObject.onConcatenatedScale;
					}
					else
						delete options.maskCallback;

					options.cacheOptions = Object.assign(options.cacheOptions || {}, {maxScale: this.maxScale});
				}
	
				if(this.cacheScale === 0) this.cacheScale = 1;
//				if(this.cacheScale !== 1) options.cacheOptions = Object.assign(options.cacheOptions || {}, {scale: this.cacheScale});
				options.cacheOptions = Object.assign(options.cacheOptions || {}, {scale: this.cacheScale});
	
				if(this.removeCache) {
					this.removeAllEventListeners();
					this._data.forEach(i => {
						i.uncache();
						if(SYMBOLS.TICKENABLED in i) {
							i.tickEnabled = i[SYMBOLS.TICKENABLED];
							delete i[SYMBOLS.TICKENABLED];
						}
						if(SYMBOLS.TICKCHILDREN in i) {
							i.tickChildren = i[SYMBOLS.TICKCHILDREN];
							delete i[SYMBOLS.TICKCHILDREN];
						}
					});
				}
				else if(this.updateCacheOnly) {
					this._data.forEach(i => {
						if(i.cacheCanvas) i.updateCache(this.compositeOperation);
					});
				}
				else {
					if(this.useGL!==CacheObject.IGNORE || this.maskUseGL!==CacheObject.IGNORE) {
						options.cacheOptions = options.cacheOptions || {};
						options.cacheOptions.useGL = this.useGL === CacheObject.USER ? this.userStageGL : this.useGL == CacheObject.STAGE ? "stage" : this.useGL == CacheObject.NEW ? "new" : null;
						options.cacheOptions.maskUseGL = this.maskUseGL === CacheObject.USER ? this.maskUserStageGL : this.maskUseGL == CacheObject.STAGE ? "stage" : this.maskUseGL == CacheObject.NEW ? "new" : null;
					}
					this._data.forEach(i => CacheObject.quickCache(i, options).filter(i=>!!i).forEach(i=>i.seqcontrolType=this.type)); // this assignment will add seqcontrolType to the handlers
				}

				if(this.endCallback) {
					this.endCallback((node, passValue) => {
						if(!this.resolved) {
							this.resolved = true;
							resolve({node, passValue});
							this.passValue = undefined;
						}
					}, this._data, this._passValue);
				}

				if(!this.resolved && !this.resolveOnCallbackOnly) {
					this.resolved = true;
					resolve({passValue: this._passValue});
					this.passValue = undefined;
				}
			});

			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	CacheObject.IGNORE = 0;
	CacheObject.STAGE = 1;
	CacheObject.NEW = 2;
	CacheObject.USER = 3;
	CacheObject.NUM_USEGL_STATES = 4;
	CacheObject.DISABLE_TICK_SELF = 1;
	CacheObject.DISABLE_TICK_CHILDREN = 2;
	CacheObject.NUM_DISABLE_TICK_STATES = 3;
	// END SHIM MODIFICATIONS
		
	class StateObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
//			this._numMakeBoolStates = 3;
//			this._numPlayheadStates = 4;
	
			this.makeVisible = inOptions && "makeVisible" in inOptions ? inOptions.makeVisible : StateObject.ON;
			this.playheadState = inOptions && "playheadState" in inOptions ? inOptions.playheadState : StateObject.IGNORE;
			this.frame = inOptions && ("frame" in inOptions) ? inOptions.frame : null;
			this.loop = inOptions && ("loop" in inOptions) ? inOptions.loop : null;

			this.updateSynched = inOptions && "updateSynched" in inOptions ? inOptions.updateSynched : false;
			this.bubbling = inOptions && "bubbling" in inOptions ? inOptions.bubbling : false;
	
			this.enableMouse = inOptions && "enableMouse" in inOptions ? inOptions.enableMouse : StateObject.IGNORE;
			this.mouseChildren = inOptions && "mouseChildren" in inOptions ? inOptions.mouseChildren : StateObject.IGNORE;
	
			this.playSwappedSprites = inOptions && "playSwappedSprites" in inOptions ? inOptions.playSwappedSprites : false;
			this.clearSprite = inOptions && "clearSprite" in inOptions ? inOptions.clearSprite : false;
			this.clearKnockoff = inOptions && "clearKnockoff" in inOptions ? inOptions.clearKnockoff : false;
			this.clearBitmapSwap = inOptions && "clearBitmapSwap" in inOptions ? inOptions.clearBitmapSwap : false;

			this.tickEnabled = inOptions && "tickEnabled" in inOptions ? inOptions.tickEnabled : StateObject.IGNORE;
			this.tickChildren = inOptions && "tickChildren" in inOptions ? inOptions.tickChildren : StateObject.IGNORE;

			this.actionsEnabled = inOptions && "actionsEnabled" in inOptions ? inOptions.actionsEnabled : StateObject.IGNORE;

			this.props = inOptions && "props" in inOptions ? inOptions.props : null;
			this.moveRegMode = inOptions && "moveRegMode" in inOptions ? inOptions.moveRegMode : true;
	
			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this._startCallbackResolveHolder = null;
		}
	
		get type() {
			return "StateObject";
		}
	
		get data() {
			return this._data;
		}

		set data(inData) {
			this._data = Array.isArray(inData) ? [...inData] : [inData];
		}	
	
		get makeVisible() {
			return this._makeVisible;
		}

		set makeVisible(inMode = StateObject.ON) {
			this._makeVisible =inMode >= 0 ? inMode : StateObject.ON;
		}	
	
		get playheadState() {
			return this._playheadState;
		}

		set playheadState(inMode = StateObject.IGNORE) {
			this._playheadState = inMode >= 0 ? inMode : StateObject.IGNORE;
		}

		get enableMouse() {
			return this._enableMouse;
		}

		set enableMouse(inMode = StateObject.IGNORE) {
			this._enableMouse = inMode >= 0 ? inMode : StateObject.IGNORE;
		}
	
		get mouseChildren() {
			return this._mouseChildren;
		}

		set mouseChildren(inMode = StateObject.IGNORE) {
			this._mouseChildren = inMode >= 0 ? inMode : StateObject.IGNORE;
		}

		get tickEnabled() {
			return this._tickEnabled;
		}

		set tickEnabled(inMode = StateObject.IGNORE) {
			this._tickEnabled = inMode >= 0 ? inMode : StateObject.IGNORE;
		}

		get tickChildren() {
			return this._tickChildren;
		}

		set tickChildren(inMode = StateObject.IGNORE) {
			this._tickChildren = inMode >= 0 ? inMode : StateObject.IGNORE;
		}

		get actionsEnabled() {
			return this._actionsEnabled;
		}

		set actionsEnabled(inMode = StateObject.IGNORE) {
			this._actionsEnabled = inMode >= 0 ? inMode : StateObject.IGNORE;
		}
	
		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			prom = new Promise(resolve => {
				this._startCallbackResolveHolder = resolve;
				this._data.forEach(item => {
					var playItem = this.playSwappedSprites ? item[SYMBOLS.SPRITE] || item : item;
	
					if(this.makeVisible !== StateObject.IGNORE) item.visible = !!this.makeVisible;
	
					if(this.playheadState !== StateObject.IGNORE) {
						switch(this.playheadState) {
							case StateObject.STOP:
								if(this.frame != null) playItem.gotoAndStop(this.frame);
								else playItem.stop();
								break;
							case StateObject.PLAY:
								if(this.frame != null) playItem.gotoAndPlay(this.frame);
								else playItem.play();
								break;
							case StateObject.REWIND:
								playItem.gotoAndStop(0);
								break;
							default:
								break;
						}
					}
	
					if(this.loop != null) item.loop = this.loop;

					if(this.updateSynched) Controller.updateHierarchyState(item, this.bubbling, true);

					if(this.enableMouse !== StateObject.IGNORE) item.mouseEnabled = !!this.enableMouse;
					if(this.mouseChildren !== StateObject.IGNORE) item.mouseChildren = !!this.mouseChildren;
	
					if(this.tickEnabled !== StateObject.IGNORE) item.tickEnabled = !!this.tickEnabled;
					if(this.tickChildren !== StateObject.IGNORE) item.tickChildren = !!this.tickChildren;
					
					if(this.actionsEnabled !== StateObject.IGNORE) item.actionsEnabled = !!this.actionsEnabled;

					if(this.props && typeof this.props == 'object') {
						var propsObj = this.props instanceof Map ? Object.fromEntries(this.props) : this.props;

						// this will moveReg if regX or regY are assigned
						if(this.moveRegMode && ("regX" in propsObj || "regY" in propsObj)) {
							var regX = this.props.regX || item,regX;
							var regY = this.props.regY || item,regY;

							Controller.moveReg(item, regX, regY);

							delete propsObj.regX;
							delete propsObj.regY;
						}

						// assign the rest of props
						Object.assign(item, propsObj);
					}

					if(this.clearSprite) SpritifyObject.removeSpriteDraw(item);
					if(this.clearKnockoff) KnockoffObject.removeKnockoff(item);
					if(this.clearBitmapSwap) Controller.removeBitmapSwap(item);
				});
	
				if(this.endCallback) {
					this.endCallback((node, passValue) => {
						if(!this.resolved) {
							this.resolved = true;
							resolve({node, passValue});
							this.passValue = undefined;
						}
					}, this._data, this._passValue);
				}
	
				if(!this.resolved && !this.resolveOnCallbackOnly) {
					this.resolved = true;
					resolve({passValue: this._passValue});
					this.passValue = undefined;
				}
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	StateObject.OFF = 0;
	StateObject.ON = 1;
	StateObject.IGNORE = 2;
	StateObject.STOP = 0;
	StateObject.PLAY = 1;
	StateObject.REWIND = 3;

	// BEGIN SHIM MODIFICATIONS	
	class KnockoffObject extends SequenceObject {
		constructor(inData, inSrcObj, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);

			this._prime = inSrcObj;
			this.removeKnockoff = inOptions && "removeKnockoff" in inOptions ? inOptions.removeKnockoff : false;

			this.tickEnabled = inOptions && "tickEnabled" in inOptions ? inOptions.tickEnabled : KnockoffObject.OFF;
			this.tickChildren = inOptions && "tickChildren" in inOptions ? inOptions.tickChildren : StateObject.IGNORE;

			this.knockoffmap = inOptions && "knockoffmap" in inOptions ? inOptions.knockoffmap : true; // same as knockoff options true for internal knockoffmap or string for custom knockoffmap

			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;

			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this._startCallbackResolveHolder = null;
		}
	
		get type() {
			return "KnockoffObject";
		}
	
		set data(inData) {
			this._data = Array.isArray(inData) ? [...inData] : [inData];
		}

		get data() {
			return this._data;
		}

		get tickEnabled() {
			return this._tickEnabled;
		}

		set tickEnabled(inMode = KnockoffObject.OFF) {
			this._tickEnabled = inMode >= 0 ? inMode : KnockoffObject.OFF;
		}

		get tickChildren() {
			return this._tickChildren;
		}

		set tickChildren(inMode = KnockoffObject.IGNORE) {
			this._tickChildren = inMode >= 0 ? inMode : KnockoffObject.IGNORE;
		}

		static get KNOCKS() {
			return (KnockoffObject._KNOCKS = KnockoffObject._KNOCKS || new Map());
		}
	
		static clearKnocks() {
			return KnockoffObject._KNOCKS.clear();
		}
	
		static clearKNOCKS() {
			return KnockoffObject._KNOCKS.clear();
		}

		static injectKnockoff(target, prime, tickEnabled = KnockoffObject.OFF, tickChildren = KnockoffObject.IGNORE) {
			if(target === prime) return false;
			if(target[SYMBOLS.PROTECTED_DRAW]) return false;

			target[SYMBOLS.KNOCKOFF] = prime;
			target[SYMBOLS.PROTECTED_DRAW] = target.draw;
			target.draw = prime.draw.bind(prime);

			target[SYMBOLS.TICKENABLED] = target.tickEnabled;
			target[SYMBOLS.TICKCHILDREN] = target.tickChildren;
			
			if(tickEnabled !== KnockoffObject.IGNORE) target.tickEnabled = !!tickEnabled;
			if(tickChildren !== KnockoffObject.IGNORE) target.tickChildren = !!tickChildren;

			return true;
		}

		// target: the MovieClip(s) which are set to have their draw methods overriden to redirect to a prime MovieClip
		// prime: the MovieClip whose draw method will be used to render by target MovieClips
		//        therefore, any changes to this MovieClip will be immediately copied in the target
		// knockoffmap: the Map object that will record the prime MovieClips used or creeated
		//        if true, it will use the static KnockoffObject.KNOCKS map
		//        if set to a Map object it will use this to record prime MovieClips
		//        if not true and not a Map object it will not use a map
		// NOTE: a reference to prime MovieClips may prevent GC therefore must maintain any custom maps
		// You can use the provided static methods to clean up KnockoffObject.KNOCKS    
		//
		// if prime is null and a knockoffmap is used then will attempt to find prime in the knockoffmap
		// if no prime is recorded it will add it to the knockoff map for later use under
		// the MovieClip's prototype as a key instead of injecting knockoff
		//
		// If you have have multiple MovieClips from the same symbol and prime parameter is undefined 
		// then the first processed of those MovieClips will become the prime MovieClip
		// however it may be unable to determine which one it will be
		// therefore it is recommended you specify an explicit prime MovieClip
		//
		// Graphic Symbols (synced MovieClips) can be used as primes and can be set visible to false
		// BUT if a Graphic Symbol prime has a Graphic Symbol parent container then such parent must be visible
		// to propagate the timeline corrently and in order for animations to update properly.
		// Therefore it is recommended you structure Knockoffs such that either the primes can be made not visible or
		// the parents are MovieClip containers or visible Graphic Symbols
		static knockoff(target, prime, tickEnabled = KnockoffObject.OFF, tickChildren = KnockoffObject.IGNORE, knockoffmap = true) {
			var targets = Array.isArray(target) ? target : [target];
			if(knockoffmap === true)
				knockoffmap = KnockoffObject.KNOCKS;
			else if(!(knockoffmap instanceof Map))
				knockoffmap = null;

			if(typeof prime == 'string') {
				if(knockoffmap && knockoffmap.has(prime))
					prime = knockoffmap.get(prime);
				else
					prime = null;
			}
			else if(prime) { // if user set prime check that it is in knockoffmap if we have one and if not then add it
				if(knockoffmap){
					var srcName = Object.getPrototypeOf(prime);
					if(srcName && !knockoffmap.has(srcName)) knockoffmap.set(srcName, prime);
				}
			}

			return targets.filter(item => {
				if(!prime) { // prime is null then search if this is in the map and if so set it to prime and if not then add it as target only
					if(knockoffmap) {
						var srcName = Object.getPrototypeOf(item);
						if(srcName) {
							if(knockoffmap.has(srcName))
								prime = knockoffmap.get(srcName);
							else {
								knockoffmap.set(srcName, item);
								prime = item;
							}
						}
					}
				}

				if(prime) return KnockoffObject.injectKnockoff(item, prime, tickEnabled, tickChildren);

				return false;
			});
		}

		static removeKnockoff(target) {
			var targets = Array.isArray(target) ? target : [target];

			return targets.filter(i => {
				if(SYMBOLS.KNOCKOFF in i) {
					i.draw = i[SYMBOLS.PROTECTED_DRAW];
					delete i[SYMBOLS.PROTECTED_DRAW];
		
					i.tickEnabled = i[SYMBOLS.TICKENABLED];
					delete i[SYMBOLS.TICKENABLED];
		
					i.tickChildren = i[SYMBOLS.TICKCHILDREN];
					delete i[SYMBOLS.TICKCHILDREN];
	
					delete i[SYMBOLS.KNOCKOFF];

					return true;
				}
				return false;
			});
		}

		createPromise(inPassValue) {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			if(!this.noPassValue) this.passValue = inPassValue;
	
			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			prom = new Promise(resolve => {
				this._startCallbackResolveHolder = resolve;

				// if no source or draw method already overridden by non-knockoff then ignore
				if(this.removeKnockoff)
					KnockoffObject.removeKnockoff(this._data);
				else
					KnockoffObject.knockoff(this._data, this._prime, this.tickEnabled, this.tickChildren, this.knockoffmap); // injectKnockoff already checks if Knockoff already exists

				if(this.endCallback) {
					this.endCallback((node, passValue) => {
						if(!this.resolved) {
							this.resolved = true;
							resolve({node, passValue});
							this.passValue = undefined;
						}
					}, this._data, this._passValue);
				}
	
				if(!this.resolved && !this.resolveOnCallbackOnly) {
					this.resolved = true;
					resolve({passValue: this._passValue});
					this.passValue = undefined;
				}
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}

		reset() {
			super.reset();
			KnockoffObject.removeKnockoff(this._data);
			return this;
		}
	}
	
	KnockoffObject.OFF = 0;
	KnockoffObject.ON = 1;
	KnockoffObject.IGNORE = 2;
	// END SHIM MODIFICATIONS

	class PassThruObject extends SequenceObject {
		constructor(inNextDataObjects, inOptions) {
			super(null, inNextDataObjects, inOptions);
			this.block = inOptions && "block" in inOptions ? inOptions.block : false;
			// this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;
		}
	
		get type() {
			return "PassThruObject";
		}

		createPromise(passValue) {
			// if(this.resolved || this.block) return Promise.reject(this);
			// if(!this.noPassValue) this.passValue = passValue;
			
			var prom = null;
			if(this.resolved || this.block) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			prom = new Promise(resolve => {
				if(!this.resolved) {
					this.resolved = true;
					resolve({passValue});
				}
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	class AllObject extends SequenceObject {
		constructor(inData, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			// when this prom node is constructed it adds itself to promNodes array in each of its param nodes
			// when this node createPromise, it first creates
			// individual promises which have a promResolveHolder for each param
			// and adds those promise to a Promise All (the this.requests array)
			// When those param nodes createPromise, they call sendToPromNodes because it has array of promNodes (created above)
			// in sendToPromNodes, for each prom node in promNodes array, it will addRequest which
			// takes the node's promise and saves it in promResolveHolder's promise slot
			// and in addRequest it will add a thenable so that when that promise resolves it will resolve
			// or reject the promiseResolveHolder's promise
			// when those promiseResolveHolder promises resolve the All Promise will resolve
	
			this._data.forEach(item => item.promNodes && item.promNodes.push(this));
			this.requests = [];
			this.promResolveHolders = [];
			this.unfulfilledRequests = [];
		}
	
		get type() {
			return "AllObject";
		}
	
		set data(inData) {
			this._data = Array.isArray(inData) ? [...inData] : [inData];
		}
	
		get data() {
			return this._data;
		}
	
		createPromiseAll(requests) {
			return Promise.all(requests);
		}
	
		addRequest(prom) {
			// assign one of the promholders to this prom
			var eligbleHolder = this.promResolveHolders.find(item => !item.promise);
			if(!eligbleHolder) return; // possible not enough promResolveHolders especially if All node is premeaturely resolved therefore just ignore it
			
			eligbleHolder.promise = prom;
	
			// receives the resolve value which is {node, passValue}
			prom.then(({node, passValue} = {}) => {
				if(node) {
					if(node == this)
						eligbleHolder.resolve(passValue);
					else
						eligbleHolder.reject(prom);
				}
				else
					eligbleHolder.resolve(passValue);
			}).catch(badProm => {
				this.unfulfilledRequests.push(badProm);
			}); // some promise will reject so block the reject from propagating
		}
	
		createPromise() {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			prom = new Promise(res => {
				// create promise any with promise holders
				for(var i = 0; i < this._data.length; i++)
					this.requests.push(new Promise( (resolve, reject) => this.promResolveHolders.push({promise: null, resolve: resolve, reject: reject})));
	
				this.createPromiseAll(this.requests).then((passedValues) => {
					if(!this.resolved) {
						this.resolved = true;
						res({passValue: passedValues});
					}
				}).catch(badProm => this.unfulfilledRequests.push(badProm));
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();
			this.promResolveHolders = [];
			this.requests = [];
			this.unfulfilledRequests = [];
		}
	}
	
	// This says Any but actually it is Promise.race - we remove the settling for rejections so it should operate like Any
	// We do this because Any is not fully supported
	class AnyObject extends AllObject {
		get type() {
			return "AnyObject";
		}
	
		createPromiseRace(requests) {
			return Promise.race(requests);
		}
	
		addRequest(prom) {
			// assign one of the promholders to this prom
			var eligbleHolder = this.promResolveHolders.find( item => !item.promise);
			if(!eligbleHolder) return; // possible not enough promResolveHolders especially if All node is premeaturely resolved therefore just ignore it
			eligbleHolder.promise = prom;
	
			prom.then(({node, passValue} = {}) => {
				if(node) {
					if(node == this)
						eligbleHolder.resolve(passValue);
					// else
					//   eligbleHolder.reject(prom); // disable to simulate Promise.any
				}
				else
					eligbleHolder.resolve(passValue);
			}).catch(badProm => {
				this.unfulfilledRequests.push(badProm);
			}); // we don't want to settle if promise rejects so block the reject from propagating to promise race
		}
	
		createPromise() {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			prom = new Promise(res => {
				// create promise any with promise holders
				for(var i = 0; i < this._data.length; i++)
					this.requests.push(new Promise( (resolve, reject) => this.promResolveHolders.push({promise: null, resolve: resolve, reject: reject})));
	
				this.createPromiseRace(this.requests).then((passedValues) => {
					if(!this.resolved) {
						this.resolved = true;
						res({passValue: passedValues});
					}
				}).catch(badProm => this.unfulfilledRequests.push(badProm)); // this generally shouldnt happen because we're supposed to catch rejections beforehand
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	class CounterObject extends AnyObject {
		constructor(inData, inCount, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			this.count = inCount;
			this._counter = 0;
		}
	
		get type() {
			return "CounterObject";
		}
	
		createPromiseCounter(requests) {
			var passedValues = [];
			return new Promise( (res, rej) => {
				this.requests.forEach( req => {
					req.then(passValue => {
						passedValues.push(passValue);
						if(++this._counter >= this.count)
							res(passedValues);
					})
					.catch( () => { 
						rej(req);
					});
				});
			});
		}
	
		createPromise() {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			prom = new Promise(res => {
				// create promise any with promise holders
				for(var i = 0; i < this._data.length; i++)
					this.requests.push(new Promise( (resolve, reject) => this.promResolveHolders.push({promise: null, resolve: resolve, reject: reject})));
	
				this.createPromiseCounter(this.requests).then((passedValues) => {
					if(!this.resolved) {
						this.resolved = true;
						res({passValue: passedValues});
					}
				}).catch(badProm => this.unfulfilledRequests.push(badProm));
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();
			this._counter = 0;
		}
	}

	// ResetObject handles differently than promNodes in that it receives the passValue like promNode
	// via request promises, however it will not pass through the value but rather like ordinary
	// seqObjs can resolve a value via callbacks 
	class ResetObject extends SequenceObject {
		constructor(inData, inPrevObj, inNextDataObjects, inOptions) {
			super(inData, inNextDataObjects, inOptions);
			// operates similar to seqAll but note that this.prevObj operates like this._data in seqAll
			// and this._data is holder of reset objects instead
	
			this.shouldReset = inOptions && "shouldReset" in inOptions ? inOptions.shouldReset : true;
			this.setResolved = inOptions && "setResolved" in inOptions ? inOptions.setResolved : ResetObject.IGNORE;

			this.noPassValue = inOptions && "noPassValue" in inOptions ? inOptions.noPassValue : false;
			
			this.startCallback = inOptions && "startCallback" in inOptions ? inOptions.startCallback : null;
			this.endCallback = inOptions && "endCallback" in inOptions ? inOptions.endCallback : null;
			this.resolveOnCallbackOnly = inOptions && "resolveOnCallbackOnly" in inOptions ? inOptions.resolveOnCallbackOnly : false;
			this._startCallbackResolveHolder = null;

			inPrevObj.promNodes.push(this);
			this.promResolveHolder = null;
			this.unfulfilledRequests = [];
		}
	
		get type() {
			return "ResetObject";
		}
	
		get data() {
			return this._data;
		}
	
		set data(inData) {
			this._data = Array.isArray(inData) ? [...inData] : [inData];
		}

		get setResolved() {
			return this._setResolved;
		}
	
		set setResolved(inMode = ResetObject.IGNORE) {
			this._setResolved = inMode >= 0 && inMode <= 2 ? inMode : ResetObject.IGNORE;
		}
	
		// ResetObject is special in that it does not use addRequest to pass values
		// it is done using creatPromise like other seqObjs
		addRequest(prom) {
			// assign one of the promholders to this prom
			if(!this.promResolveHolder) return;
			this.promResolveHolder.promise = prom;

			prom.then(({node, passValue} = {}) => {
				if(node) {
					if(node == this)
						this.promResolveHolder.resolve(passValue);
					else
						this.promResolveHolder.reject(prom);
				}
				else
					this.promResolveHolder.resolve(passValue);
			}).catch(badProm => {
				this.unfulfilledRequests.push(badProm);
			}); // we don't want to settle if promise rejects so block the reject from propagating to promise race
		}
	
		createPromise() {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			var startCallbackResNode = null;
			if(this.startCallback) {
				this.startCallback((node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						startCallbackResNode = {node, passValue};
						this._startCallbackResolveHolder && this._startCallbackResolveHolder(startCallbackResNode);
					}
				}, this._data, this._passValue);
			}

			if(this.resolved) {
				prom = Promise.resolve(startCallbackResNode);
				this.passValue = undefined;
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}
			
			prom = new Promise((resolve, reject) => {
				this._startCallbackResolveHolder = resolve;

				// create promise any with promise holders
				var request = new Promise( (res, rej) => this.promResolveHolder = {promise: null, resolve: res, reject: rej} );
	
				request.then((inPassValue) => {
					if(!this.noPassValue) this.passValue = inPassValue;
					
					this._data.forEach(item => {
						if(this.shouldReset) item.reset();
						if(this.setResolved !== ResetObject.IGNORE) item.resolved = !!this.setResolved;
					});
	
					if(this.endCallback) {
						this.endCallback((node, passValue) => {
							if(!this.resolved) {
								this.resolved = true;
								resolve({node, passValue});
								this.passValue = undefined;
							}
						}, this._data, this._passValue);
					}
	
					if(!this.resolved && !this.resolveOnCallbackOnly) {
						this.resolved = true;
						resolve({passValue: this._passValue});
						this.passValue = undefined;
					}
				}).catch(badProm => {
					this.unfulfilledRequest = badProm;
					reject(badProm);
				});
			});
	
			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			super.reset();
			this.promResolveHolder = null;
			this.unfulfilledRequest = null;
		}
	}
	
	ResetObject.OFF = 0;
	ResetObject.ON = 1;
	ResetObject.FALSE = 0;
	ResetObject.TRUE = 1;
	ResetObject.IGNORE = 2;

	// GateObject is used to hold a resolve and make available for external interface
	class GateObject extends SequenceObject {
		constructor(inNextDataObjects, inOptions) {
			super(null, inNextDataObjects, inOptions);
			this.callback = inOptions && "callback" in inOptions ? inOptions.callback : null;
			this.resolve = this.callback || null;
		}
	
		get type() {
			return "GateObject";
		}
	
		isReady() {
			return !this.resolved && this.resolve;
		}
	
		createPromise() {
			var prom = null;
			if(this.resolved) {
				prom = Promise.reject(this);
				if(this.promNodes.length > 0)
					this.sendToPromNodes(prom);
				return prom;
			}

			prom = new Promise(resolve => {
				this.resolve = (node, passValue) => {
					if(!this.resolved) {
						this.resolved = true;
						resolve({node, passValue}); // resolve is called from outside the seqObj so no this.passValue is assigned
					}
				};
			});

			if(this.promNodes.length > 0)
				this.sendToPromNodes(prom);
	
			return prom;
		}
	}
	
	class Controller {
		constructor(inNextDataObjects) {
			this.children = inNextDataObjects;
	
			// static var defaults
			this.updateInterval = 100; // default value
			this.shouldUpdate = false;
			this.unfulfilledSeqObjs = new Set();
	
			this.numPreppedSeqObjs = 0;
			this._numSequenceObjects = null;
			this._setupCallback = null;

			// we need to process promise nodes first so we need separate arrays for processing
			this._resetProperties();

			this.audioTagsToUnlock = new Set();
			this.shouldUnlockAudio = true; // set this to false if you want to disable trying to unlock audio

			this._ran = false;
		}
	
		get type() {
			return "Controller";
		}
	
		get initialized() {
			return this._initialized;
		}
	
		get starters() {
			return this._starters;
		}
	
		// we can retrieve the version number here
		static get version() {
			return VERSION;
		}
	
		// this will override the draw method in an Adobe Animate widget component's MovieClip allowing for it to draw its contents
		static injectComponentDraw(component) {
			if(!(component[SYMBOLS.COMPONENT_DRAW])) {
				component[SYMBOLS.COMPONENT_DRAW] = component.draw;
				component.draw = function(ctx, ignoreCache) {
					this[SYMBOLS.COMPONENT_DRAW]();
					if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
					this._updateState();
					this.Container_draw(ctx, ignoreCache);
					return true;
				};
			}
		}
	
		// this will override the draw method in an Adobe Animate widget component's MovieClip allowing for it to draw its contents
		static removeComponentDraw(component) {
			if(SYMBOLS.COMPONENT_DRAW in component) {
				component.draw = component[SYMBOLS.COMPONENT_DRAW];
				delete component[SYMBOLS.COMPONENT_DRAW];
			}
		}
	
		// this will allow you to swap a managed child usually in Adobe Animate with option to force the swap
		// takes a parent, a child to add, and an index of the before child
		static addTweenAtAnimate(parent, child, index, forceNonTweenMethod) {
			var inputChildren = Array.from(arguments).slice(1,arguments.length-2);
	
			// can't assume parent is a MovieClip
			var tweenIndexFound = parent.timeline ? parent.timeline.tweens.findIndex( item => item.target == parent.children[index]) : -1;
			if((tweenIndexFound >= 0) && !forceNonTweenMethod) {
				var tweenToAdd = createjs.Tween.get({}).to({state: inputChildren.reduce( (acc, cur) => {
						acc.push({t:cur})
						return acc;
					}, []) }).wait(1);
				parent.timeline.tweens.splice(tweenIndexFound, 0, tweenToAdd);
				return {tween: tweenToAdd, index: tweenIndexFound};
			}
			else { // if the index doesnt have a tween do it the old way; this will remove animations on all the children!
				var children = [...parent.children];
				children.splice(index, 0, ...inputChildren);
				parent.timeline&&parent.timeline.removeTween(...parent.timeline.tweens);
				children.forEach( c => {
					var par=c.parent, silent = par === parent;
					par&&par._removeChildAt(createjs.indexOf(par.children, c), silent);
					parent.addChild(c);
					if(!silent && inputChildren.includes(c)) { c.dispatchEvent("added") };
				});
			}
	
			return null;
		}
	
		// this only applies to Adobe Animate components
		// will take a bitmap and embed inside a component's MovieClip
		// used by VideoObject or Canvas component
		// returns a resize function if Canvas and scaleComponent is false. This function can be used to resize the canvas as the window resizes
		static addChildToComponent(parentComponent, childDisplayObject, {injectComponentDraw = true, setBitmapSwap = true, domElem = parentComponent._element._$this[0], componentType = domElem.nodeName.toLowerCase() == "video" ? Controller.VIDEO : domElem.nodeName.toLowerCase() == "canvas" ? Controller.CANVAS : Controller.DEFAULT, scaleComponent = "scaleComponent" in parentComponent._element._options ? parentComponent._element._options.scaleComponent : true} = {}) {
			var resize;
			if(componentType == Controller.VIDEO) {
				if(scaleComponent) { // in video the component always applies its scale to the DOM element
					// if parentComponent has video dimensions then use those otherwise use video element
					var videoWidth = parentComponent.videoWidth || domElem.videoWidth;
					var videoHeight = parentComponent.videoHeight || domElem.videoHeight;

					var nominalScaleX = videoWidth/parentComponent._element.options.width;
					var nominalScaleY = videoHeight/parentComponent._element.options.height;
		
					childDisplayObject.scaleX /= nominalScaleX;
					childDisplayObject.scaleY /= nominalScaleY;
				}

				domElem.hidden = true;
			}
			else if(componentType == Controller.CANVAS) {
				if(!scaleComponent) { // this means that the element will expand dimensions otherwise scaling is applie via CSS transforms and the dimensions are unchanged
					resize = function () {
						var parentScaleX = 1;
						var parentScaleY = 1;
						var parent = parentComponent;
						while(parent) {
							parentScaleX *= parent.scaleX;
							parentScaleY *= parent.scaleY;
							parent = parent.parent;
						}
						childDisplayObject.scaleX = 1/parentScaleX;
						childDisplayObject.scaleY = 1/parentScaleY;
					}
					resize();
				}

				domElem.style.display = 'none';
			}

			if(injectComponentDraw) Controller.injectComponentDraw(parentComponent); // will need to call removeComponentDraw() manually when disposing
			if(setBitmapSwap) parentComponent[SYMBOLS.BITMAPSWAP] = childDisplayObject;

			parentComponent.addChild(childDisplayObject);
			parentComponent.visible = true;

			return resize;
		}
	
		// will take a component and disable detach callback
		// used by VideoObject to block detach when MovieClip visible is false
		static deactivateDetach(component) {
			if(component && !component[SYMBOLS.DETACH_FUNC]) {
				component[SYMBOLS.DETACH_FUNC] = component._element.detach;
				component._element.detach = function() { return null };
			}
		}
	
		// will take a component and reenable detach callback
		static reactivateDetach(component) {
			if(component && component[SYMBOLS.DETACH_FUNC]) {
				component._element.detach = component[SYMBOLS.DETACH_FUNC];
				delete target[SYMBOLS.DETACH_FUNC];
			}
		}

		// For AnimateCC static function returns the DOM element of a MovieClip component
		static getInstanceDOM(component) {
			return component._element._$this ? component._element._$this[0] : null
		}

		// For AnimateCC static function returns the DOM element of a MovieClip component
		static isComponent(component) {
			return !!component._element;
		}

		// utility func to process a target using previous frame instead of current one
		static setupFromPrevState(target, callback) {
			var paused = target.paused;
			var currentFrame = target.currentFrame;
			var prevFrame = Math.max(currentFrame-1, 0);
			target.gotoAndStop(prevFrame);
			callback(target);
			target.gotoAndStop(currentFrame);
			target.paused = paused;
		}

		// will redispatch a MouseEvent to a target and children sinking downwards instead of bubbling upwwards
		static redispatchMouseEvent(evt, target) {
			var o = target._getObjectsUnderPoint(evt.stageX, evt.stageY, null, true);
			return o && o.dispatchEvent && o.dispatchEvent(evt, true, false);
		}
	
		// batch set/remove attributes on a DOM element, used in VideoObject
		static setElementAttributes(element, attributesObj) {
			Object.entries(attributesObj).forEach(([k,v]) => v===undefined?element.removeAttribute(k):element.setAttribute(k,v));
		}
	
		// returns a transformMatrix from a target appropriate for a sprite cached from that target
		static getMatrixFromTarget(target, setReg = false) {
			var tempTransform = new createjs.DisplayObject();
			tempTransform.x = target.x;
			tempTransform.y = target.y;
	
			if(setReg) {
				tempTransform.regX = target.regX;
				tempTransform.regY = target.regY;
			}
	
			tempTransform.rotation = target.rotation;
	
			tempTransform.skewX = target.skewX;
			tempTransform.skewY = target.skewY;
	
			tempTransform.scaleX = target.scaleX;
			tempTransform.scaleY = target.scaleY;
	
			return tempTransform.getMatrix();
		}
	
		// this will constrain an object (constrained) transform or property to a target transform or property
		// props: object of writable properties whose values are set to true if you want to constrain, not considered when using constrainMatrix
		// unconstrain: will revert a constrained property back to a writable property and set it to current value
		// setOnly: will set properties rather than constraining them thereby only setting properties at the value at the time the SequenceObject is evaluated
		// transformSpace: when true will transform position or matrix (if constrainMatrix is true) between local coordinate spaces thereby preserving the concatenated transform of the object
		// updateForSynched: when true and transformSpace is true, will force update transform for nested hidden graphic symbols, otherwise update only happens during draw and will not update if transform changes
		// constrainMatrix: when true the transformMatrix is used to constrain instead. All other transform property settings are ignored
		//                  constrainMatrix is more accurate however, you cannot specify individual properties to constrain
		//                  keep in mind that regX and regY are ignored when transformMatrix is set. You will need to accomodate for This. You may use the moveReg() method to do so
		static constrainToTarget(target, constrained, props = {position: true}, transformSpace = false, updateForSynched = false, constrainMatrix = false, setOnly = false, unconstrain = false) {
			if((!props || Object.values(props).every(i=>!i)) && !constrainMatrix) return null;
	
			var defineProps = {};
			
			var nonTransformKeys = Object.keys(props).filter(i=>!['position', 'rotation', 'scale', 'skew', 'reg'].includes(i) && props[i]);
	
			if(unconstrain) {
				nonTransformKeys.forEach(i => {
					defineProps[i] = { value: target[i], writable: true };
				});
		
				if(constrainMatrix)
					defineProps.transformMatrix = { value: target.transformMatrix, writable: true };
				else if(['position', 'rotation', 'scale', 'skew', 'reg'].some(i=>i in props && props[i])) {
					if('position' in props && props.position) {
						defineProps.x = { value: target.x, writable: true };
						defineProps.y = { value: target.y, writable: true };
					}
		
					if('rotation' in props && props.rotation) defineProps.rotation = { value: target.rotation, writable: true };
		
					if('scale' in props && props.scale) {
						defineProps.scaleX = { value: target.scaleX, writable: true };
						defineProps.scaleY = { value: target.scaleY, writable: true };
					}
		
					if('skew' in props && props.skew) {
						defineProps.skewX = { value: target.skewX, writable: true };
						defineProps.skewY = { value: target.skewY, writable: true };
					}
		
					if('reg' in props && props.reg) {
						defineProps.regX = { value: target.regX, writable: true };
						defineProps.regY = { value: target.regY, writable: true };
					}
				}	
			}
			else {
				if(setOnly) {
					nonTransformKeys.forEach(i => constrained[i] = target[i]);

					if(constrainMatrix) {
						if(transformSpace) {
							if(updateForSynched) {
								Controller.updateHierarchyState(target, true);
								constrained.transformMatrix = constrained.parent.getConcatenatedMatrix().invert().appendMatrix(target.getConcatenatedMatrix());
							}
							else
								constrained.transformMatrix = constrained.parent.getConcatenatedMatrix().invert().appendMatrix(target.getConcatenatedMatrix());
						}
						else
							constrained.transformMatrix = target.getMatrix();
					}
					else if(['position', 'rotation', 'scale', 'skew', 'reg'].some(i=>i in props && props[i])) {
						if('position' in props && props.position) {
							if(transformSpace) {
								if(updateForSynched) {
									Controller.updateHierarchyState(target, true);
									var res = target.parent.localToLocal(target.x, target.y, constrained.parent);
									constrained.x = res.x;
									constrained.y = res.y;
								}
								else {
									var res = target.parent.localToLocal(target.x, target.y, constrained.parent);
									constrained.x = res.x;
									constrained.y = res.y;
								}
							}
							else {
								constrained.x = target.x;
								constrained.y = target.y;
							}
						}
		
						if('rotation' in props && props.rotation) constrained.rotation = target.rotation;
		
						if('scale' in props && props.scale) {
							constrained.scaleX = target.scaleX;
							constrained.scaleY = target.scaleY;
						}
		
						if('skew' in props && props.skew) {
							constrained.skewX = target.skewX;
							constrained.skewY = target.skewY;
						}
		
						if('reg' in props && props.reg) {
							constrained.regX = target.regX;
							constrained.regY = target.regY;
						}
					}
				}
				else {
					nonTransformKeys.forEach(i => {
						if(Object.getOwnPropertyDescriptor(constrained, i).writable)
							defineProps[i] = { get: () => target[i] };
					});
		
					if(constrainMatrix) {
						if(transformSpace) {
							if(updateForSynched) {
								defineProps.transformMatrix = { get: () => {
									Controller.updateHierarchyState(target, true);
									return constrained.parent.getConcatenatedMatrix().invert().appendMatrix(target.getConcatenatedMatrix());
								} };
							}
							else
								defineProps.transformMatrix = { get: () => constrained.parent.getConcatenatedMatrix().invert().appendMatrix(target.getConcatenatedMatrix()), set: function() {} };
						}
						else
							defineProps.transformMatrix = { get: () => target.getMatrix(), set: function() {} };
					}
					else if(['position', 'rotation', 'scale', 'skew', 'reg'].some(i=>i in props && props[i])) {
						if('position' in props && props.position) {
							if(transformSpace) {
								if(updateForSynched) {
									defineProps.x = { get: () => {
										var res = target.parent.localToLocal(target.x, target.y, constrained.parent);
										Controller.updateHierarchyState(target, true);
										return res.x;
									}, set: function() {} };
									defineProps.y = { get: () => {
										var res = target.parent.localToLocal(target.x, target.y, constrained.parent);
										Controller.updateHierarchyState(target, true);
										return res.y;
									}, set: function() {} };
								}
								else {
									defineProps.x = { get: () => target.parent.localToLocal(target.x, target.y, constrained.parent).x, set: function() {} };
									defineProps.y = { get: () => target.parent.localToLocal(target.x, target.y, constrained.parent).y, set: function() {} };
								}
							}
							else {
								defineProps.x = { get: () => target.x, set: function() {} };
								defineProps.y = { get: () => target.y, set: function() {} };
							}
						}
		
						if('rotation' in props && props.rotation) defineProps.rotation = { get: () => target.rotation, set: function() {} };
		
						if('scale' in props && props.scale) {
							defineProps.scaleX = { get: () => target.scaleX, set: function() {} };
							defineProps.scaleY = { get: () => target.scaleY, set: function() {} };	
						}
		
						if('skew' in props && props.skew) {
							defineProps.skewX = { get: () => target.skewX, set: function() {} };
							defineProps.skewY = { get: () => target.skewY, set: function() {} };	
						}
		
						if('reg' in props && props.reg) {
							defineProps.regX = { get: () => target.regX, set: function() {} };
							defineProps.regY = { get: () => target.regY, set: function() {} };	
						}
					}
					Object.defineProperties(constrained, defineProps);
				}
			}
			return constrained;
		}
	
		// Usage: re-parent an object without visually transforming it
		// child: clip to be parented
		// parent: clip to parent to
		// positionOnly: true will set x and y only, false sets full transform is modified
		// and null will ignore transforms
		// _off: if not using Adobe Animate instance then set _off to null
		// true removes child from being managed, this is the default if param is undefined
		// set _off to false when parenting it back to original parent
		// disregard or set to null to ignore _off property
		// when setting _off property to true, adjust transforms AFTER reparenting
		// index: index at which to add child. uses addChildAt method instead
		// returns child (for chaining)
		static parentInPlace(child, parent, _off = true, positionOnly = true, index) {
			child._off = _off === false ? false : _off || child._off;
	
			if(positionOnly)
				child.parent.localToLocal(child.x, child.y, parent, child);
			else if(positionOnly !== null) {
				// get global matrix of child
				var regX = child.regX;
				var regY = child.regY;
				Controller.moveReg(child);
				parent.getConcatenatedMatrix().invert().appendMatrix(child.getConcatenatedMatrix()).decompose(child);
				Controller.moveReg(child, regX, regY);
	
			}
			child.parent.removeChild(child);
	
			if(typeof index === 'number')
				parent.addChildAt(child, index);
			else
				parent.addChild(child);
	
			return child;
		}
	
		// will transform a vector using a matrix
		static transformVector(x, y, mat, pt) {
			pt = pt||{};
			pt.x = x*mat.a+y*mat.c;
			pt.y = x*mat.b+y*mat.d;
			return pt;
		}

		// will recursively update the timelines of instance up hierarchy
		// this is used in constrainToTarget()
		static updateHierarchyState(o, bubbling = false) {
			if(bubbling) {
				while (o = o.parent) o.mode !== createjs.MovieClip.INDEPENDENT && o._updateState && o._updateState();
			}
			else {
				o.children.forEach(i => {
					if(i instanceof createjs.MovieClip && i.mode !== createjs.MovieClip.INDEPENDENT && o._updateState) {
						i._updateState();
						Controller.updateHierarchyState(i);
					}
				});
			}
		}

		// will convert a vector from a clip's local space to the global space
		static localToGlobalVector(x, y, pt, target) {
			return Controller.transformVector(x, y, target.getConcatenatedMatrix(target._props.matrix), pt||new createjs.Point());
		}
	
		// will convert a vector from the global space to a clip's local space
		static globalToLocalVector(x, y, target, pt) {
			return Controller.transformVector(x, y, target.getConcatenatedMatrix(target._props.matrix).invert(), pt||new createjs.Point());
		}

		// will convert a vector from a source local space to a target local space
		static localToLocalVector(x, y, source, target, pt) {
			pt = Controller.localToGlobalVector(x, y, source, pt);
			return Controller.globalToLocalVector(pt.x, pt.y, target, pt);
		}
	
		// change a reg point without moving object
		static moveReg(target, x = 0, y = 0) {
			target.localToLocal(x, y, target.parent, target);
			target.regX = x;
			target.regY = y;
			return target;
		}
	
		// static variables and methods
		static get updateInterval() {
			if(Controller._updateInterval == null) Controller._updateInterval = 100; // static class props do not run constructor so will not be set automatically
			return Controller._updateInterval;
		}
	
		static set updateInterval(inInterval = 100) {
			Controller._updateInterval = inInterval > 0 ? inInterval : 0;
		}
	
		static get shouldUpdate() {
			if(Controller._shouldUpdate == null) Controller._shouldUpdate = false; // static class props do not run constructor so will not be set automatically
			return Controller._shouldUpdate;
		}
	
		static set shouldUpdate(inBool = false) {
			Controller._shouldUpdate = inBool;
		}
	
		static requestUpdate() {
			if(!Controller.shouldUpdate) {
				Controller.shouldUpdate = true;
				setTimeout(() => {
					stage.update();
					Controller.shouldUpdate = false;
				}, Controller.updateInterval);
			}
		}
	
		static get unfulfilledSeqObjs() {
			if(!Controller._unfulfilledSeqObjs) Controller._unfulfilledSeqObjs = new Set(); // static class props do not run constructor so will not be set automatically
			return Controller._unfulfilledSeqObjs;
		}
	
		static set unfulfilledSeqObjs(inSet = new Set()) {
			Controller._unfulfilledSeqObjs = inSet;
		}
	
		// non statics
		get children() {
			return this._nextDataObjectsArray;
		}
	
		set children(inNextDataObjects) {
			this._nextDataObjectsArray = inNextDataObjects ? (Array.isArray(inNextDataObjects) ? [...inNextDataObjects] : [inNextDataObjects]) : [];
		}
	
		getNumSequenceObjects(seqObj = this) {
			return seqObj.children.reduce((acc, cur) => {
				if(cur.children && cur.children.length > 0)
					acc += this.getNumSequenceObjects(cur);
				return acc;
			}, !!seqObj.children && seqObj.children.length);
		}

		_prepSeqObj(so, compsToDeactivateDetach) {
			if(so.init) {
				if(so instanceof VideoObject)
					so.init(compsToDeactivateDetach);
				else
					so.init();
			}

			return true;
		}
	
		_recurse(prom, seqObj, prevPrepped = true) {
			if(prom) {
				prom = prom.then(({node, passValue} = {}) => {
					var outProm = null;
					try {
						if(node) {
							var nodeArray = Array.isArray(node) ? node : [node];
							if(nodeArray.includes(seqObj))
								outProm = seqObj.createPromise(passValue);
							else
								throw seqObj;
						}
						else
							outProm = seqObj.createPromise(passValue);
					}
					catch(so) {
						if(so instanceof SequenceObject || so instanceof ControlObject)
							throw(so);
						else
							throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}`, { cause: so });
//							throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}${seqObj.data && seqObj.data.name?(", with data: " + seqObj.data.parent.name + " and promNodes length: " + (seqObj.promNodes && seqObj.promNodes.length)):""}`, { cause: so });
					}
	
					return outProm;
				});

				var prepped = false; // this is used in ControlObject to facilitate blocking of reset propagation when controlObject encountered that has no gotoObj and is not gotoObj
				// moving this up above the recurse and setupCallback so things like sprites can be built in order or the tree graph
				try {
					var compsToDeactivateDetach = new Set();

					// if the parent node was not init() then don't init() children
					// however we do still want to createProm like above

					prepped = prevPrepped && this._prepSeqObj(seqObj, compsToDeactivateDetach); 
					compsToDeactivateDetach.forEach(i => Controller.deactivateDetach(i));
					
					if(prepped) this.numPreppedSeqObjs++;
				}
				catch(so) {
					if(so instanceof SequenceObject || so instanceof ControlObject)
						throw(so);
					else
						throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}`, { cause: so });
//						throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}${seqObj.data && seqObj.data.name?(", with data: " + seqObj.data.parent.name + " and promNodes length: " + (seqObj.promNodes && seqObj.promNodes.length)):""}`, { cause: so });
				}
	
				if(this._setupCallback) this._setupCallback(seqObj, this.numPreppedSeqObjs, this._numSequenceObjects);

				if(seqObj.children && seqObj.children.length > 0)
					seqObj.children.forEach(it => this._recurse(prom, it, prepped));
				else {
					prom.catch(so => {
						if(so instanceof SequenceObject || so instanceof ControlObject)
							Controller.unfulfilledSeqObjs.add(so); // if we have resolved to a specific seqObj
						else {
							if(so.cause)
								throw(so);
							else
								throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}`, { cause: so });
//								throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}${seqObj.data && seqObj.data.name?(", with data: " + seqObj.data.parent.name + " and promNodes length: " + (seqObj.promNodes && seqObj.promNodes.length)):""}`, { cause: so });
							}
					});
				}

				// try {
				// 	var compsToDeactivateDetach = new Set();
				// 	this._prepSeqObj(seqObj, compsToDeactivateDetach);
				// 	compsToDeactivateDetach.forEach(i => Controller.deactivateDetach(i));
				// 	this.numPreppedSeqObjs++;
				// }
				// catch(so) {
				// 	if(so instanceof SequenceObject || so instanceof ControlObject)
				// 		throw(so);
				// 	else
				// 		throw new Error(`Failed evaluation of SequenceObject type ${seqObj.type}`, { cause: so });
				// }
			}
		}

		_resetProperties() {
			this.startPromiseObjs = new Set();
			this.startObjs = new Set();
			this.children.forEach( obj => ((obj instanceof AllObject) || (obj instanceof ResetObject) ? this.startPromiseObjs : this.startObjs).add(obj) );
			this._starters = [];
			this._initialized = false;
			this._ran = false;
		}
	
		_resetSeqObj(inSeqObj) {
			if(inSeqObj.children && inSeqObj.children.length > 0) inSeqObj.children.forEach(it => this._resetSeqObj(it));
			inSeqObj.reset();
		}

		reset() {
			this._resetSequence();
			return this;
		}

		_resetSequence() {
			this._resetProperties();
			Controller.unfulfilledSeqObjs.clear();
			
			this.children.forEach(item => {
				if(item.children && item.children.length > 0) item.children.forEach(it => this._resetSeqObj(it));
				item.reset();
			});

			this.audioTagsToUnlock.clear()
			this.numPreppedSeqObjs = 0;
			this._numSequenceObjects = null;
		}
	
		_init(setupCallback, postSetupCallback) {
			this._setupCallback = setupCallback;
			this._postSetupCallback = postSetupCallback;
			this._numSequenceObjects = this.getNumSequenceObjects();
	
			var processFunc = item => {
				// we save a ref to resolve because we need to defer resolving until after we have evaluated the node graph
				// this is to protect the startSequenceObject's dependencies from getting override by later SequenceObjects
				// especially when same dependencies are used later as startSequenceObject
				// deferring resolve is generally not good practice because deferred resolving does not have throw safety
				var outsideResolve;
				var prom = new Promise(res => outsideResolve = res);
				try {
					this._prepSeqObj(item);
				}
				catch(err) {
					throw new Error(`Failed evaluation of SequenceObject type ${item.type}`, { cause: err });
				}

				prom = prom.then((passValue) => {
					var outProm = null;
					try {
						outProm = item.createPromise(passValue);
					}
					catch(err) {
						throw new Error(`Failed evaluation of SequenceObject type ${item.type}`, { cause: err });
					}
	
					return outProm;
				});
				// if item has children gets caught in _recurse
				// .catch(so => {
				// 	if(so instanceof SequenceObject || so instanceof ControlObject)
				// 		Controller.unfulfilledSeqObjs.add(so); // if we have resolved to a specific seqObj
				// 	else {
				// 		if(so.cause)
				// 			throw(so);
				// 		else
				// 			throw new Error(`Failed evaluation of SequenceObject type ${item.type}`, { cause: so });
				// 	}
				// });
				
				// we defer startSeqObj resolve until after node graph promises have been traversed
				this._starters.push(outsideResolve);
				
				this.numPreppedSeqObjs++;

				if(this._setupCallback) this._setupCallback(item, this.numPreppedSeqObjs, this._numSequenceObjects, this._starters.length-1);

				// if item has no children need to catch promise
				if(item.children && item.children.length > 0)
					item.children.forEach(it => this._recurse(prom, it));
				else {
					prom.catch(so => {
						if(so instanceof SequenceObject || so instanceof ControlObject)
							Controller.unfulfilledSeqObjs.add(so); // if we have resolved to a specific seqObj
						else {
							if(so.cause)
								throw(so);
							else
								throw new Error(`Failed evaluation of SequenceObject type ${item.type}`, { cause: so });
						}
					});
				}
	
				// splitting run into init and start
				// outsideResolve();
			}
	
			this.startPromiseObjs.forEach(processFunc);
			this.startObjs.forEach(processFunc);
			if(this.shouldUnlockAudio) unlockAudio(this.audioTagsToUnlock);
			this._postSetupCallback && this._postSetupCallback();
			this._initialized = true;
			this._ran = false;
		}
	
		_run() {
			var i = null;
			while(i = this._starters.shift()) i();
			this._ran = true;
		}
	
		run(setupCallback, postSetupCallback) {
			if(!this._initialized) this._init(setupCallback, postSetupCallback);
			if(!this._ran) this._run();
			return this;
		}
		
		init(setupCallback, postSetupCallback) {
			if(!this._initialized) this._init(setupCallback, postSetupCallback);
			return this;
		}
	}
	
	Controller.DEFAULT = Controller.NONE = 0;
	Controller.VIDEO = 1;
	Controller.CANVAS = 2;
	
	// this ControlObject should take only ONE nextDataObj !
	// we do this for simplicity and because we already have the sequencePassThruObj
	class ControlObject extends Controller {
		constructor(inNextDataObjects, inOptions) {
			// inNextDataObjects can be any node including sequenceControlObj's, if setGotoObj never gets called it is just like seqPassThru
			// keep in mind that this differs fron the way it looks in Naru and NaruControlNode's outButton curve.
			// In Naru, if outButton curve connects to a midButton then it does not set a nextDataObj
			// The loopObj seqControlObj also has extra code to call setGotoObj
			// VERY IMPORTANT: You can only setGotoObj() AFTER the gotoObj has been created!
			// therefore, it needs to be called separately from declaration
			// Like in the following example, it is actually later when setGotoObj is called that "loop" is created
			//
			// Example:
			// var nrCt_33539 = new ControlObject();
			// var nran_25712 = new AnimationObject(this.mc, nrCt_33539);
			// var nrCt_74680 = nrCt_33539.setGotoObj(new ControlObject(nran_25712));
			super(inNextDataObjects);

			// not used but need to match the SequenceObject interface
			this.data = null;
			this.meta = null;
	
			this.promNodes = []; // although this isnt used it must exist as an empty array
			this._gotoObj = null;
	
			this.shouldUnlockAudio = false; // control object should not attempt unlock audio 
		}
	
		get type() {
			return "ControlObject";
		}
	
		setGotoObj(inObj) {
			this._gotoObj = inObj instanceof ControlObject ? inObj : null;
			return this._gotoObj;
		}
	
		// sendToPromNodes(prom) {
		// 	this.promNodes.forEach( item => {
		// 		item.addRequest(prom);
		// 	});
		// }
	
		// Does not normally resolve but if resolved is set by StateObject it will stop loop
		createPromise(inPassValue) {
			var prom = new Promise(resolve => {
				if(!this.resolved) {
					resolve({passValue: inPassValue}); // this.resolved is not set true here and no this.passValue is assigned
					if(this._gotoObj) this._gotoObj.run(inPassValue);
				}
			});
	
			// if(this.promNodes.length > 0)
			// 	this.sendToPromNodes(prom);
	
			return prom;
		}
	
		reset() {
			this.passValue = undefined;
			this.resolved = false;
			return this;
		}
	
		set data(inData) {
			this._data = inData;
		}
	
		get data() {
			return this._data;
		}
	
		set meta(inMeta) {
			this._meta = inMeta;
		}
	
		get meta() {
			return this._meta;
		}

		// is this ControlObject used begin the reloop or block resetting
		get reentry() {
			return !this._gotoObj;
		}

		// this tests to see if this ControlObject will block the reset loop from propagating downstream from it
		static canReset(target) {
			return !(target instanceof ControlObject && target.reentry);
		}

		_prepSeqObj(so, compsToDeactivateDetach) {
			if(!ControlObject.canReset(so) || !this._resettableStartPromiseObjs.has(so)) return false;
			if(so.init) {
				if(so instanceof VideoObject)
					so.init(compsToDeactivateDetach);
				else
					so.init();
			}
			return true;
		}

		// will fill startPromiseObjs with the downstream promise nodes
		// _fillStartPromiseObjs(so = this) {
		_fillStartPromiseObjs(so = this, resettable = true) {
			if(!ControlObject.canReset(so) && so != this) resettable = false;
	
			if(so.promNodes && so.promNodes.length > 0) {
				so.promNodes.forEach(promNd => {
					this.startPromiseObjs.add(promNd);
					if(resettable) this._resettableStartPromiseObjs.add(promNd);

					// if(promNd.children && promNd.children.length > 0) promNd.children.forEach(it => this._fillStartPromiseObjs(it));
					if(promNd.children && promNd.children.length > 0) promNd.children.forEach(it => this._fillStartPromiseObjs(it, resettable));
				});
			}
			// if(so.children && so.children.length > 0) so.children.forEach(it => this._fillStartPromiseObjs(it));
			if(so.children && so.children.length > 0) so.children.forEach(it => this._fillStartPromiseObjs(it, resettable));
		}

		_resetProperties() {
			super._resetProperties();
			this._resettableStartPromiseObjs = new Set();
		}

		_resetSeqObj(inSeqObj) {
			if(ControlObject.canReset(inSeqObj) && inSeqObj != this) { // don't resolve the reentry control object
//				if(this.startPromiseObjs.has(inSeqObj) && !this._resettableStartPromiseObjs.has(inSeqObj)) return;
				if(inSeqObj.children && inSeqObj.children.length > 0) inSeqObj.children.forEach(it => this._resetSeqObj(it));
				inSeqObj.reset();
				Controller.unfulfilledSeqObjs.delete(inSeqObj); // remove from unfulfilledSeqObjs since it is reset (if it was put in there previously)
			}
		}

		_resetSequence() {
			this._resetProperties(); 
			this._fillStartPromiseObjs(); // gather all the promnodes underneath the hierarchy
			[...this._resettableStartPromiseObjs, ...this.startObjs].forEach(item => this._resetSeqObj(item)); // prom nodes behind a control node blocker shouldn't be reset
//			[...this.startPromiseObjs, ...this.startObjs].forEach(item => this._resetSeqObj(item));
		}

		_run(passValue) {
			var i = null;
			while(i = this._starters.shift()) i(passValue); // this is a promise that is used to start the first promise
			this._ran = true;
		}
	
		// this wwill be the gotoObj which will be a control object
		run(passValue) {
			this._resetSequence();
			if(!this._initialized) this._init();
			if(!this._ran) this._run(passValue);
//			super.run();
			return this;
		}

		// this wwill be the gotoObj which will be a control object
		// run() {
		// 	this._resetSequence();
		// 	super.run();
		// 	return this;
		// }
	}
	
	sc.VERSION = VERSION;
	sc.SYMBOLS = SYMBOLS;
	sc.restoreDefaultAlert = restoreDefaultAlert;
	sc.disableTestWebAudioXHR = disableTestWebAudioXHR;
	sc.enableTestWebAudioXHR = enableTestWebAudioXHR;
	sc.unlockAudio = unlockAudio;
	sc.GestureHelper = GestureHelper;
	sc.CollisionHelper = CollisionHelper;
	sc.AnimationObject = AnimationObject;
	sc.SpritifyObject = SpritifyObject;
	sc.SpriteObject = SpriteObject;
	sc.ButtonObject = ButtonObject;
	sc.DraggableObject = DraggableObject;
	sc.GesturableObject = GesturableObject;
	sc.VideoObject = VideoObject;
	sc.WaitObject = WaitObject;
	sc.CodeObject = CodeObject;
	sc.SoundObject = SoundObject;
	sc.CacheObject = CacheObject;
	sc.StateObject = StateObject;
	sc.KnockoffObject = KnockoffObject;
	sc.PassThruObject = PassThruObject;
	sc.AllObject = AllObject;
	sc.AnyObject = AnyObject;
	sc.CounterObject = CounterObject;
	sc.ResetObject = ResetObject;
	sc.GateObject = GateObject;
	sc.Controller = Controller;
	sc.ControlObject = ControlObject;
	sc.reverseTweensState = AnimationObject.reverseTweensState.bind(AnimationObject);
	sc.copyCanvas = VideoObject.copyCanvas.bind(VideoObject);
	sc.spritify = SpritifyObject.spritify.bind(SpritifyObject);
	sc.quickCache = CacheObject.quickCache.bind(CacheObject);
	sc.knockoff = KnockoffObject.knockoff.bind(KnockoffObject);
	sc.updatePrevCache = CacheObject.updatePrevCache.bind(CacheObject);
	sc.handleFilterCache = CacheObject.handleFilterCache.bind(CacheObject);
	sc.addChildToComponent = Controller.addChildToComponent.bind(Controller);
	sc.constrainToTarget = Controller.constrainToTarget.bind(Controller);
	sc.parentInPlace = Controller.parentInPlace.bind(Controller);
	sc.transformVector = Controller.transformVector.bind(Controller);
	sc.updateHierarchyState = Controller.updateHierarchyState.bind(Controller);
	sc.localToGlobalVector = Controller.localToGlobalVector.bind(Controller);
	sc.globalToLocalVector = Controller.globalToLocalVector.bind(Controller);
	sc.localToLocalVector = Controller.localToLocalVector.bind(Controller);
	sc.moveReg = Controller.moveReg.bind(Controller);
	sc.redispatchMouseEvent = Controller.redispatchMouseEvent.bind(Controller);
	sc.version = Controller.version;
})(seqcontrol = seqcontrol||{});
var seqcontrol;