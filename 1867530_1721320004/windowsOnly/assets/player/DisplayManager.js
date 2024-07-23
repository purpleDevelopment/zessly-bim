var kStageSizeDidChangeEvent = "DisplayManager:StageSizeDidChangeEvent";
var kTimeoutValueForCursor = 1000;
var kMobilePortraitModeHorizontalMargin = 0;
var kMobilePortraitModeTopMargin = 0;
var kMobilePortraitModeVerticalCenterLine = 0;
var kMobilePortraitModeMaxStageHeight = 0;
var kMobilePortraitMaxStageHeight = 0;
var kMobilePortraitMaxStageWidth = 0;
var kMobileLandscapeModeVerticalMargin = 0;
var kMobileLandscapeModeHorizontallMargin = 0;
var kBottomButtonHeight = 0;
var kNavigationArrowSize = 0;
var kNavigationAreaHeight = kNavigationArrowSize;
var kHelpAreaHeight = 0;
var kMobilePortraitModeVerticalCenterLineToNavigationAreaGap = 0;
var kStageToNavigationAreaGap = 0;
var kNavigationAreaToHelpAreaGap = 0;
var kHelpAreaToBottomGap = 0;
var kMobilePortraitModeNavigationAreaSideMargin = 0;
var kMobilePortraitModeHelpAreaSideMargin = 0;
var kMobileLandscapeModeMinSideSpacerWidth = kNavigationArrowSize + 10;
var kPadPortraitModeHorizontalMargin = 0;
var kPadPortraitModeMaxStageHeight = 768;
var kPadPortraitModeVerticalCenterLine = 0;
var kPadLandscapeModeHorizontallMargin = 0;
var kPadLandscapeModeVerticalMargin = 0;
var kInfoPanelButtonHeight = 0;
var DisplayManager = Class.create({
	initialize: function() {
		document.observe(kShowSizeDidChangeEvent, this.handleShowSizeDidChangeEvent.bind(this));
		document.observe(kOrientationChangedEvent, this.handleOrientationDidChangeEvent.bind(this));
		this.body = document.getElementById("body");
		this.stageArea = document.getElementById("stageArea");
		this.stage = document.getElementById("stage");
		this.hyperlinkPlane = document.getElementById("hyperlinkPlane");
		this.waitingIndicator = document.getElementById("waitingIndicator");
		this.helpText = document.getElementById("helpText");
		this.previousButton = document.getElementById("previousButton");
		this.nextButton = document.getElementById("nextButton");
		this.slideCounter = document.getElementById("slideCounter");
		this.waitingIndicatorTimeout = null;
		this.orientation = kOrientationUnknown;
		this.showWidth = 0;
		this.showHeight = 0;
		this.stageAreaWidth = 0;
		this.stageAreaHeight = 0;
		this.stageAreaTop = 0;
		this.stageAreaLeft = 0;
		this.usableDisplayWidth = 0;
		this.usableDisplayHeight = 0;
		this.inLaunchMode = true;
		this.initialAddressBarScrollPerformed = false;
		this.updateUsableDisplayArea();
		this.positionWaitingIndicator();
		this.showWaitingIndicator();
		this.hyperlinksOnly = false;
		this.showStatisticsDisplay = gIpad && getUrlParameter("statistics") === "1";
		this.hasCacheEverGoneOverPixelLimit = false;
		this.hhasStageEverGoneOverPixelLimit = false;
		this.cacheHighWaterMark = 0;
		this.stageHighWaterMark = 0;
		if (gMode === kModeMobile) {
			// this.stageArea.style.backgroundColor = "black";
			this.helpText.innerHTML = kTapOrSwipeToAdvance
		} else {
			Event.observe(this.body, "click", function(a) {
				if(a!=null && a.target!=null && a.target.getAttribute("skipClick")!=null && a.target.getAttribute("skipClick")=="true"){
					
				}
				else{
					gShowController.handleClickEvent(a)	
				}
				
			});
			Event.observe(this.body, "mousemove", this.handleMouseMove.bind(this));
			this.lastMouseX = -1;
			this.lastMouseY = -1;
			this.cursorTimeout = null;
			this.setTimeoutForCursor()
		}
	},
	setHyperlinksOnlyMode: function() {
		this.hyperlinksOnly = true;
		this.setPreviousButtonEnabled(false);
		this.setNextButtonEnabled(false);
		this.helpText.style.display = "none"
	},
	handleMouseMove: function(a) {
		a = a || window.event;
		var b = Math.abs(this.lastMouseX - a.clientX) + Math.abs(this.lastMouseY - a.clientY);
		if (b > 10) {
			if (this.cursorIsShowing === false) {
				this.showCursor()
			} else {
				if (!this.navigatorIsShowing) {
					this.setTimeoutForCursor()
				}
			}
		} else {
			if (!this.navigatorIsShowing) {
				this.setTimeoutForCursor()
			}
		}
		this.lastMouseX = a.clientX;
		this.lastMouseY = a.clientY
	},
	updateSlideNumber: function(b, a) {
		var d = "";
		var c = null;
		if (gMode != kModeDesktop) {
			d = kSlideLabel + " " + b + "/" + a;
			c = this.slideCounter
		}
		if (c != null) {
			c.innerHTML = d
		}
	},
	handleShowSizeDidChangeEvent: function(a) {
		this.showWidth = a.memo.width;
		this.showHeight = a.memo.height;
		this.layoutDisplay()
	},
	handleOrientationDidChangeEvent: function(a) {
		this.orientation = a.memo.orientation;
		clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(this.handleOrientationDidChangeEvent_partTwo.bind(this), 300)
	},
	handleOrientationDidChangeEvent_partTwo: function() {
		this.layoutDisplay();
		if (this.inLaunchMode === false) {
			this.showApplicableControls()
		}
	},
	showCursor: function() {
		if (this.inLaunchMode) {
			return
		}
		this.body.style.cursor = "default";
		this.cursorIsShowing = true;
		this.setTimeoutForCursor()
	},
	hideCursor: function() {
		// we wamt the curser to be always visible
		// on windows devices
		this.body.style.cursor = "default";
		this.cursorIsShowing = false
	},
	setTimeoutForCursor: function() {
		if (this.cursorTimeout) {
			clearTimeout(this.cursorTimeout)
		}
		this.cursorTimeout = setTimeout(this.handleTimeoutForCursor.bind(this), kTimeoutValueForCursor)
	},
	clearTimeoutForCursor: function() {
		if (this.cursorTimeout) {
			clearTimeout(this.cursorTimeout)
		}
	},
	handleTimeoutForCursor: function() {
		this.hideCursor()
	},
	updateUsableDisplayArea: function() {
		if (false && gMode === kModeMobile) {
			var a = gIpad;
			if (this.orientation === kOrientationLandscape) {
				this.usableDisplayWidth = (a ? kiPadDeviceHeight : kiPhoneDeviceHeight);
				this.usableDisplayHeight = (a ? kiPadDeviceWidth : kiPhoneDeviceWidth) - kiPhoneStatusBarHeight - kiPhoneLandscapeButtonBarHeight - (a ? (kiPadAddressBarHeight + kiPadBookmarksBarHeight) : 0)
			} else {
				this.usableDisplayWidth = (a ? kiPadDeviceWidth : kiPhoneDeviceWidth);
				this.usableDisplayHeight = (a ? kiPadDeviceHeight : kiPhoneDeviceHeight) - kiPhoneStatusBarHeight - kiPhonePortraitButtonBarHeight - (a ? kiPadBookmarksBarHeight + 10 : 0)
			}
		} else {
			this.usableDisplayWidth = window.innerWidth;
			this.usableDisplayHeight = window.innerHeight
		}
	},
	clearLaunchMode: function() {
		this.inLaunchMode = false;
		var a = this;
		runInNextEventLoop(this.showAll.bind(this))
	},
	positionWaitingIndicator: function() {
		var c = 110;
		var b = 32;
		var a;
		var d;
		if (gMode === kModeMobile && this.orientation === kOrientationUnknown) {
			a = 1000;
			d = 1000
		} else {
			if (gMode === kModeMobile && this.orientation === kOrientationPortrait) {
				a = (this.usableDisplayWidth - c) / 2;
				if (gIpad === false) {
					d = kMobilePortraitModeVerticalCenterLine - (c / 2)
				} else {
					d = kPadPortraitModeVerticalCenterLine - (c / 2)
				}
			} else {
				a = (this.usableDisplayWidth - c) / 2;
				d = (this.usableDisplayHeight - c) / 2
			}
		}
		setElementPosition(this.waitingIndicator, d, a, c, c)
	},
	hideWaitingIndicator: function() {
		this.waitingIndicator.style.display = "none"
	},
	showWaitingIndicator: function() {
		this.waitingIndicator.style.display = "none"
		// this.waitingIndicator.style.display = "block"
	},
	convertDisplayCoOrdsToShowCoOrds: function(d) {
		var b = {};
		var c = this.stageAreaLeft + this.stageAreaWidth;
		var a = this.stageAreaTop + this.stageAreaHeight;
		if ((d.pointX < this.stageAreaLeft) || (d.pointX > c) || (d.pointY < this.stageAreaTop) || (d.pointY > a)) {
			b.pointX = -1;
			b.pointY = -1
		} else {
			b.pointX = ((d.pointX - this.stageAreaLeft) / this.stageAreaWidth) * this.showWidth;
			b.pointY = ((d.pointY - this.stageAreaTop) / this.stageAreaHeight) * this.showHeight
		}
		return b
	},
	layoutDisplay: function() {
		this.updateUsableDisplayArea();
		var q;
		var k;
		if (gMode === kModeDesktop) {
			q = this.usableDisplayWidth;
			k = this.usableDisplayHeight;
			if (!gShowController.isFullscreen) {
				if (q > this.showWidth || k > k) {
					q = this.showWidth;
					k = k
				}
			}
		} else {
			if (gIpad === false) {
				if (this.orientation === kOrientationPortrait) {
					q = this.usableDisplayWidth - 2 * kMobilePortraitModeHorizontalMargin;
					k = kMobilePortraitModeMaxStageHeight
				} else {
					q = this.usableDisplayWidth - 2 * kMobileLandscapeModeHorizontallMargin;
					k = this.usableDisplayHeight - 2 * kMobileLandscapeModeVerticalMargin
				}
			} else {
				if (this.orientation === kOrientationPortrait) {
					q = this.usableDisplayWidth - 2 * kPadPortraitModeHorizontalMargin;
					k = kPadPortraitModeMaxStageHeight
				} else {
					q = this.usableDisplayWidth - 2 * kPadLandscapeModeHorizontallMargin;
					k = this.usableDisplayHeight - 2 * kPadLandscapeModeVerticalMargin
				}
			}
		}
		var o = scaleSizeWithinSize(this.showWidth, this.showHeight, q, k);
		this.stageAreaWidth = o.width;
		this.stageAreaHeight = o.height;
		this.stageAreaLeft = (this.usableDisplayWidth - this.stageAreaWidth) / 2;
		if (gMode === kModeDesktop) {
			this.stageAreaTop = (k - this.stageAreaHeight) / 2
		} else {
			if (this.orientation === kOrientationPortrait) {
				if (gIpad === false) {
					this.stageAreaTop = Math.max(10, kMobilePortraitModeVerticalCenterLine - (this.stageAreaHeight / 2))
				} else {
					this.stageAreaTop = Math.max(10, kPadPortraitModeVerticalCenterLine - (this.stageAreaHeight / 2))
				}
			} else {
				this.stageAreaTop = (this.usableDisplayHeight - this.stageAreaHeight) / 2
			}
		}
		setElementPosition(this.stageArea, this.stageAreaTop, this.stageAreaLeft, this.stageAreaWidth, this.stageAreaHeight);
		var e = -1;
		var b = -1;
		var p = -1;
		var h = -1;
		var a = null;
		if (gMode === kModeDesktop) {
			a = false;
			e = -1;
			b = -1;
			p = -1;
			h = -1
		} else {
			a = true;
			p = 0;
			h = 0;
			if (gIpad) {
				b = kiPadDeviceHeight
			} else {
				b = kiPhoneDeviceHeight
			}
			e = b
		}
		if (p != -1 && h != -1 && e != -1 && b != -1) {
			var s = document.getElementById("background");
			s.style.top = p;
			s.style.left = h;
			s.style.width = e;
			s.style.height = b;
			if (a === true) {
				// s.style.visibility = "visible"
			}
		}
		var g = {
			x: 0,
			y: 0,
			width: this.usableDisplayWidth,
			height: this.stageAreaTop
		};
		var d = {
			x: 0,
			y: this.stageAreaTop + this.stageAreaHeight,
			width: this.usableDisplayWidth,
			height: this.usableDisplayHeight - this.stageAreaTop - this.stageAreaHeight
		};
		var n = {
			x: 0,
			y: this.stageAreaTop,
			width: this.stageAreaLeft,
			height: this.stageAreaHeight
		};
		var i = {
			x: this.stageAreaLeft + this.stageAreaWidth,
			y: this.stageAreaTop,
			width: this.usableDisplayWidth - this.stageAreaWidth - n.width,
			height: this.stageAreaHeight
		};
		var l = document.getElementById("statisticsDisplay");
		if (this.showStatisticsDisplay && gIpad && this.orientation === kOrientationPortrait) {
			setElementPosition(l, d.y + 70, 0, this.usableDisplayWidth, d.height - 105);
			l.style.visibility = "visible"
		}
		if (gMode != kModeDesktop) {
			if (this.orientation === kOrientationPortrait) {
				var m = kNavigationArrowSize + 2 * kMobilePortraitModeNavigationAreaSideMargin;
				var f = kNavigationArrowSize + 2 * kStageToNavigationAreaGap;
				var r = this.usableDisplayWidth - 2 * m;
				var c = d.y + 7;
				setElementPosition(this.previousButton, c, 0, m, f);
				setElementPosition(this.slideCounter, c + kStageToNavigationAreaGap, m, r, f);
				setElementPosition(this.nextButton, c, m + r - 5, m, f);
				setElementPosition(this.helpText, d.y + d.height - kHelpAreaToBottomGap - kHelpAreaHeight, 0, this.usableDisplayWidth, kHelpAreaHeight);
				setElementPosition(this.infoPanelIcon, this.usableDisplayHeight - kInfoPanelButtonHeight, this.usableDisplayWidth - kInfoPanelButtonWidth - 5, kInfoPanelButtonWidth, kInfoPanelButtonHeight)
			} else {
				var j = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				};
				if (n.width > kMobileLandscapeModeMinSideSpacerWidth) {
					setElementRect(this.previousButton, n);
					setElementRect(this.nextButton, i)
				} else {
					setElementRect(this.previousButton, j);
					setElementRect(this.nextButton, j)
				}
				setElementRect(this.slideCounter, j);
				setElementRect(this.helpText, j);
				setElementRect(this.infoPanelIcon, j)
			}
		}
		this.positionWaitingIndicator();
		this.hideAddressBar();
		document.fire(kStageSizeDidChangeEvent, {
			left: this.stageAreaLeft,
			top: this.stageAreaTop,
			width: this.stageAreaWidth,
			height: this.stageAreaHeight
		})
	},
	showApplicableControls: function() {
		if (this.inLaunchMode === true) {
			hideElement(this.previousButton);
			hideElement(this.nextButton);
			hideElement(this.slideCounter);
			hideElement(this.helpText);
			hideElement(this.infoPanelIcon)
		} else {
			if (gMode === kModeDesktop) {
				hideElement(this.previousButton);
				hideElement(this.nextButton);
				hideElement(this.slideCounter);
				hideElement(this.helpText);
				hideElement(this.infoPanelIcon)
			} else {
				if (this.orientation === kOrientationPortrait) {
					showElement(this.previousButton);
					showElement(this.nextButton);
					showElement(this.slideCounter);
					showElement(this.helpText);
					showElement(this.infoPanelIcon)
				} else {
					hideElement(this.slideCounter);
					hideElement(this.helpText);
					hideElement(this.infoPanelIcon);
					if (this.stageAreaLeft > kMobileLandscapeModeMinSideSpacerWidth) {
						showElement(this.previousButton);
						showElement(this.nextButton)
					} else {
						hideElement(this.previousButton);
						hideElement(this.nextButton)
					}
				}
			}
		}
		this.hideAddressBar()
	},
	showAll: function() {
		this.hideWaitingIndicator();
		setTimeout(this.showAll_partTwo.bind(this))
	},
	showAll_partTwo: function() {
		if (gDevice === kDeviceMobile) {
			window.scrollTo(0, 1);
			setTimeout(this.showAll_partThree.bind(this))
		} else {
			this.showAll_partThree()
		}
	},
	showAll_partThree: function() {
		if (this.inLaunchMode === false) {
			this.showApplicableControls()
		}
		showElement(this.stageArea);
		var a = navigator.userAgent.match(/Windows/);
		if (a) {
			if (gShowController.delegate.triggerReflow) {
				gShowController.delegate.triggerReflow()
			}
		}
		showElement(this.hyperlinkPlane);
		if (gMode === kModeMobile) {
			showElement(this.infoPanelIcon)
		}
	},
	setPreviousButtonEnabled: function(a) {
		if (this.hyperlinksOnly) {
			return
		}
		if (gMode != kModeDesktop) {
			if (a) {
				this.previousButton.setAttribute("class", "previousButtonEnabled")
			} else {
				this.previousButton.setAttribute("class", "previousButtonDisabled")
			}
		}
	},
	setNextButtonEnabled: function(a) {
		if (this.hyperlinksOnly) {
			return
		}
		if (gMode != kModeDesktop) {
			if (a) {
				this.nextButton.setAttribute("class", "nextButtonEnabled")
			} else {
				this.nextButton.setAttribute("class", "nextButtonDisabled")
			}
		}
	},
	hideAddressBar: function() {
		if (this.inLaunchMode) {
			return
		}
		if (gDevice === kDeviceMobile) {
			var a = this.initialAddressBarScrollPerformed ? 0 : kHideAddressBarDelay;
			setTimeout("window.scrollTo(0, 1);", a);
			this.initialAddressBarScrollPerformed = true
		}
	},
	updateStatisticsDisplay: function() {
		if (this.showStatisticsDisplay === false) {
			return
		}
		var k = document.getElementById("statisticsDisplay");
		var j = gShowController.textureManager.getCacheStatistics();
		var a = gShowController.scriptManager.degradeStatistics;
		var h = gShowController.stageManager.debugGetStageStatistics();
		var d = gShowController.textureManager.numLoadFailures;
		var c = gShowController.textureManager.numOutstandingLoadRequests;
		var i = 1024 * 1024;
		var b = gSafeMaxPixelCount / i;
		b = Math.floor(b * 100) / 100;
		j.numPixels /= i;
		h.numPixels /= i;
		j.numPixels = Math.floor(j.numPixels * 100) / 100;
		h.numPixels = Math.floor(h.numPixels * 100) / 100;
		var e = false;
		var g = false;
		if (j.numPixels > b) {
			e = true;
			this.hasCacheEverGoneOverPixelLimit = true
		}
		if (h.numPixels > b) {
			g = true;
			this.hasStageEverGoneOverPixelLimit = true
		}
		if (j.numPixels > this.cacheHighWaterMark) {
			this.cacheHighWaterMark = j.numPixels
		}
		if (h.numPixels > this.stageHighWaterMark) {
			this.stageHighWaterMark = h.numPixels
		}
		var f = "<div style='position: absolute; left: 0px;'><b>Cache Statistics:</b><br>- Scenes: <b>" + j.numScenes + "</b><br>- Textures: <b>" + j.numTextures + "</b><br>- Pixels: <b>" + j.numPixels + " MP</b><br>- Peak Pixels: <b>" + this.cacheHighWaterMark + " MP</b><br>%nbsp<br><b>Limits:</b><br>- Max Pixels: <b>" + b + " MP</b><br></div><div style='position: absolute; left: 175px;'><b>Scene Statistics:</b><br>- Scene Index: <b>" + gShowController.currentSceneIndex + "</b><br>- Textures: <b>" + h.numTextures + "</b><br>- Total Pixels: <b>" + h.numPixels + " MP</b><br>- Peak Pixels: <b>" + this.stageHighWaterMark + " MP</b><br><b>Texture Loader:</b><br>- Num Load Requests: <b>" + (c > 0 ? ("<span style='color:yellow;'>" + c + "</span>") : "0") + "</b><br>- Num Load Failures: <b>" + (d > 0 ? ("<span style='color:red;'>" + d + "</span>") : "0") + "</b><br></div><div style='position: absolute; left: 350px;'><b>Degrade Statistics:</b><br>- Scenes w/Degrades: <b>" + a.numDegradedSlides + "</b><br>- Total Textures Degraded: <b>" + a.numDegradedTextures + "</b><br>- Max Textures/Scene: <b>" + a.maxNumDegradedTexturesPerSlide + "</b><br>- Textures in Current: <b>" + (h.numDegraded > 0 ? ("<span style='color:yellow;'>" + h.numDegraded + "</span>") : "0") + "</b><br></div><div style='position: absolute; left: 550px;'><b>Summary:</b><br>- Cache: <br>- Over Pixel Limit Now: <b>" + (e ? "<span style='color:red;'>YES</span>" : "NO") + "</b><br>- Ever Over Pixel Limit: <b>" + (this.hasCacheEverGoneOverPixelLimit ? "<span style='color:red;'>YES</span>" : "NO") + "</b><br>- Stage: <br>- Over Pixel Limit Now: <b>" + (g ? "<span style='color:red;'>YES</span>" : "NO") + "</b><br>- Ever Over Pixel Limit: <b>" + (this.hasStageEverGoneOverPixelLimit ? "<span style='color:red;'>YES</span>" : "NO") + "</b><br></div>";
		k.innerHTML = f
	}
});