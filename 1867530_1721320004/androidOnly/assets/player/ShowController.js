var kShowControllerState_Stopped = "Stopped";
var kShowControllerState_Starting = "Starting";
var kShowControllerState_DownloadingScript = "DownloadingScipt";
var kShowControllerState_SettingUpScene = "SettingUpScene";
var kShowControllerState_IdleAtFinalState = "IdleAtFinalState";
var kShowControllerState_IdleAtInitialState = "IdleAtInitialState";
var kShowControllerState_WaitingToJump = "WaitingToJump";
var kShowControllerState_ReadyToJump = "ReadyToJump";
var kShowControllerState_WaitingToDisplay = "WaitingToDisplay";
var kShowControllerState_ReadyToDisplay = "ReadyToDisplay";
var kShowControllerState_WaitingToPlay = "WaitingToPlay";
var kShowControllerState_ReadyToPlay = "ReadyToPlay";
var kShowControllerState_Playing = "Playing";
var kKeyDownEvent = "keydown";
var hasComeToEndBefore = false;
var kSlideIndexDidChangeEvent = "ShowController:SlideIndexDidChangeEvent";
var ShowController = Class.create({
	initialize: function() {
		this.delegate = extractDelegateFromUrlParameter();
		this.delegate.showDidLoad();
		this.showUrl = "./assets/";
		this.displayManager = new DisplayManager();
		this.scriptManager = new ScriptManager(this.showUrl);
		this.textureManager = new TextureManager(this.showUrl);
		this.stageManager = new StageManager(this.textureManager, this.scriptManager);
		this.touchController = new TouchController();
		this.animationManager = new AnimationManager();
		this.orientationController = new OrientationController();
		this.activeHyperlinks = new Array();
		this.movieHyperlinks = new Array();
		this.script = null;
		this.currentSceneIndex = -1;
		this.nextSceneIndex = -1;
		this.currentSlideIndex = -1;
		this.previousSlideIndex = -1;
		this.currentSoundTrackIndex = 0;
		this.transformOriginValue = "";
		this.accumulatingDigits = false;
		this.digitAccumulator = 0;
		this.firstSlide = true;
		this.lastSlideViewedIndex = -1;
		this.accountID = "";
		this.guid = "";
		this.locale = "EN";
		this.isNavigationBarVisible = false;
		this.isFullscreen = false;
		this.volume = 3;
		this.muted = false;
		this.soundTrackPlayer = null;
		this.sceneIndexOfPrebuiltAnimations = -1;
		this.queuedUserAction = null;
		document.observe(kScriptDidDownloadEvent, this.handleScriptDidDownloadEvent.bind(this));
		document.observe(kScriptDidNotDownloadEvent, this.handleScriptDidNotDownloadEvent.bind(this));
		document.observe(kStageIsReadyEvent, this.handleStageIsReadyEvent.bind(this));
		document.observe(kStageSizeDidChangeEvent, this.handleStageSizeDidChangeEvent.bind(this));
		document.observe(kFullscreenChangeEventName, this.handleFullscreenChangeEvent.bind(this));
		Event.observe(window, "resize", this.handleWindowResizeEvent.bind(this));
		//this.touchController.registerTapEventCallback(this.handleTapEvent.bind(this));
		this.changeState(kShowControllerState_Stopped);
		this.movieCache = null;
		this.movieCacheInfo = null;
		this.audioCache = null;
		this.playbackController = new KPFPlaybackController({}, this.stageManager.stage);
		this.navigatorController = new NavigatorController(document.getElementById("slideshowNavigator"));
		this.slideNumberController = new SlideNumberController(document.getElementById("slideNumberControl"));
		this.slideNumberDisplay = new SlideNumberDisplay(document.getElementById("slideNumberDisplay"));
		this.helpPlacard = new HelpPlacardController(document.getElementById("helpPlacard"));
		this.isRecording = false;
		this.isRecordingStarted = false;
		if (browserPrefix == "ms" && browserVersion < 10) {
			this.animationSupported = false
		} else {
			this.animationSupported = true
		}
		document.observe("contextmenu", this.handleContextMenuEvent.bind(this));
		document.observe(kKeyDownEvent, this.handleKeyDownEvent.bind(this));
		document.observe(kSwipeEvent, this.handleSwipeEvent.bind(this));
		Event.observe(this.displayManager.previousButton, "click", this.goBackToPreviousSlide.bind(this, "tapPreviousButton"));
		Event.observe(this.displayManager.nextButton, "click", this.advanceToNextBuild.bind(this, "tapNextButton"))
	},
	startShow: function() {
		this.changeState(kShowControllerState_DownloadingScript);
		this.scriptManager.downloadScript(this.delegate)
	},
	exitShow: function(a) {
		clearTimeout(this.exitTimeout);
		if (a) {
			this.delegate.showExited()
		} else {
			this.exitTimeout = setTimeout((function() {
				this.delegate.showExited()
			}).bind(this), 750)
		}
	},
	promptUserToTryAgain: function(b) {
		var a = false;
		a = confirm(b);
		return a
	},
	handleScriptDidDownloadEvent: function(e) {
		switch (this.state) {
		case kShowControllerState_DownloadingScript:
			this.script = e.memo.script;
			if (this.script.showMode == kShowModeHyperlinksOnly) {
				this.displayManager.setHyperlinksOnlyMode()
			}
			this.changeState(kShowControllerState_Starting);
			var h;
			var c = parseInt(getUrlParameter("restartingSceneIndex"));
			var f = document.URL.split("?");
			var a = f[0].split("#");
			if (a[1]) {
				c = parseInt(a[1])
			}
			if (c) {
				h = c
			} else {
				var d = getUrlParameter("currentSlide");
				var g;
				if (d) {
					g = parseInt(d)
				} else {
					g = 1
				}
				h = this.scriptManager.sceneIndexFromSlideIndex(g - 1)
			}
			if (this.script.recording) {
				if (this.script.recording.eventTracks[0].type === "navigation") {
					this.narrationManager = new NarrationManager(this.script.recording);
					h = this.narrationManager.sceneIndexFromNavigationEvent(this.narrationManager.navigationEvents[0]);
					this.isRecording = true;
					this.jumpToScene(h, false);
					break
				}
			}
			if (h > this.script.lastSceneIndex) {
				break
			}
			var e = this.script.events[h];
			var b = e.automaticPlay == 1 || e.automaticPlay == true;
			this.jumpToScene(h, b);
			break;
		default:
			debugMessage(kDebugShowController_HandleScriptDidDownloadEvent, "- hmmm we seem to have arrived here from an unpredicted state");
			break
		}
	},
	handleScriptDidNotDownloadEvent: function(b) {
		debugMessage(kDebugShowController_HandleScriptDidNotDownloadEvent);
		var a = this.promptUserToTryAgain(kUnableToReachiWorkTryAgain);
		if (a) {
			this.scriptManager.downloadScript()
		} else {
			this.displayManager.clearLaunchMode();
			this.displayManager.hideWaitingIndicator()
		}
	},
	handleStageIsReadyEvent: function(a) {
		if (this.isFullscreen) {
			setTimeout((function() {
				this.displayManager.stageArea.style.opacity = 1
			}).bind(this), 50)
		} else {
			setTimeout((function() {
				this.displayManager.stageArea.style.opacity = 1
			}).bind(this), 500)
		}
		this.positionSlideNumberControl();
		this.positionSlideNumberDisplay();
		this.positionHelpPlacard()
	},
	positionSlideNumberControl: function() {
		var b = (this.displayManager.usableDisplayWidth - this.slideNumberController.width) / 2;
		var a = this.displayManager.stageAreaTop + this.displayManager.stageAreaHeight - (this.slideNumberController.height + 16);
		this.slideNumberController.setPosition(b, a)
	},
	positionSlideNumberDisplay: function() {
		var b = (this.displayManager.usableDisplayWidth - this.slideNumberDisplay.width) / 2;
		var a = this.displayManager.stageAreaTop + this.displayManager.stageAreaHeight - (this.slideNumberDisplay.height + 16);
		this.slideNumberDisplay.setPosition(b, a)
	},
	positionHelpPlacard: function() {
		var b = (this.displayManager.usableDisplayWidth - this.helpPlacard.width) / 2;
		var a = (this.displayManager.usableDisplayHeight - this.helpPlacard.height) / 2;
		this.helpPlacard.setPosition(b, a)
	},
	handleFullscreenChangeEvent: function() {
		if (document.webkitIsFullScreen || document.mozFullScreen) {
			this.isFullscreen = true
		} else {
			this.isFullscreen = false
		}
		setTimeout((function() {
			this.displayManager.layoutDisplay()
		}).bind(this), 0)
	},
	handleWindowResizeEvent: function() {
		clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(this.changeWindowSize.bind(this), 1000)
	},
	changeWindowSize: function() {
		if (this.delegate.setViewScale) {
			this.scriptManager.reapplyScaleFactor();
			this.textureManager.slideCache = null;
			this.textureManager.slideCache = {};
			var a = this.currentSceneIndex;
			if (this.state === kShowControllerState_IdleAtFinalState) {
				if (this.currentSceneIndex < this.script.numScenes - 1) {
					a = this.currentSceneIndex + 1
				} else {
					if (this.script.loopSlideshow) {
						a = 0
					}
				}
			}
			this.jumpToScene(a, false)
		}
		document.fire(kShowSizeDidChangeEvent, {
			width: this.script.slideWidth,
			height: this.script.slideHeight
		})
	},
	handleStageSizeDidChangeEvent: function(a) {
		this.touchController.setTrackArea(a.memo.left, a.memo.top, a.memo.width, a.memo.height)
	},
	handleKeyDownEvent: function(c) {
		var b = c.charCode || c.keyCode;
		if (b === kKeyCode_F11 || b === kKeyCode_F12) {
			return
		}
		var a = {
			altKey: !! c.altKey,
			ctrlKey: !! c.ctrlKey,
			shiftKey: !! c.shiftKey,
			metaKey: !! c.metaKey
		};
		if (a.metaKey) {
			if (b === kKeyCode_Period || b === kKeyCode_Dot) {
				this.exitShow(true)
			} else {
				if (b != kKeyCode_Return) {
					return
				}
			}
		} else {
			if (a.ctrlKey) {
				return
			}
		}
		c.stop();
		this.onKeyPress(b, a)
	},
	handleContextMenuEvent: function(a) {
		a.stop()
	},
	handleClickEvent: function(b) {
		if (this.isRecording) {
			return
		}
		var a, d;
		if (b.pageX || b.pageY) {
			a = b.pageX;
			d = b.pageY
		} else {
			a = b.clientX;
			d = b.clientY
		}
		var c = {
			pointX: a,
			pointY: d
		};
		if (browserPrefix === "ms") {
			window.focus()
		}
		if (b.target.nodeName.toLowerCase() === "video") {
			return
		}
		this.processClickOrTapAtDisplayCoOrds(c)
	},
	handleTapEvent: function(a) {
		var b = {
			pointX: a.memo.pointX,
			pointY: a.memo.pointY
		};
		//this.processClickOrTapAtDisplayCoOrds(b)
	},
	processClickOrTapAtDisplayCoOrds: function(c) {
		var b = false;
		var d;
		if (this.slideNumberController.isShowing) {
			if (this.slideNumberTimeout) {
				clearTimeout(this.slideNumberTimeout)
			}
			this.slideNumberTimeout = setTimeout(this.hideAndResetSlideNumberController.bind(this), 0);
			return
		}
		if (this.helpPlacard.isShowing) {
			this.helpPlacard.hide();
			return
		}
		var a = this.displayManager.convertDisplayCoOrdsToShowCoOrds(c);
		if (a.pointX != -1) {
			d = this.findHyperlinkAtCoOrds(a)
		}
		if (d) {
			this.processHyperlink(d)
		} else {
			this.advanceToNextBuild("processClickOrTapAtDisplayCoOrds")
		}
	},
	handleSwipeEvent: function(a) {
		if (a.memo.direction === "left") {
			switch (a.memo.fingers) {
			case 1:
				this.advanceToNextBuild("handleSwipeEvent");
				break;
			case 2:
				this.advanceToNextSlide("handleSwipeEvent");
				break;
			default:
				break
			}
		} else {
			if (a.memo.direction === "right") {
				switch (a.memo.fingers) {
				case 1:
					this.goBackToPreviousSlide("handleSwipeEvent");
					break;
				case 2:
					this.goBackToPreviousBuild("handleSwipeEvent");
					break;
				default:
					break
				}
			}
		}
	},
	onMouseDown: function(a) {
		if (a.leftClick) {
			this.advanceToNextBuild("onMouseDown")
		} else {
			if (a.rightClick) {
				this.goBackToPreviousBuild("onMouseDown")
			}
		}
	},
	onKeyPress: function(c, a) {
		if ((c >= kKeyCode_Numeric_0) && (c <= kKeyCode_Numeric_9)) {
			c = kKeyCode_0 + (c - kKeyCode_Numeric_0)
		}
		c += (a.shiftKey ? kKeyModifier_Shift : 0);
		c += (a.altKey ? kKeyModifier_Alt : 0);
		c += (a.ctrlKey ? kKeyModifier_Ctrl : 0);
		c += (a.metaKey ? kKeyModifier_Meta : 0);
		if (this.isRecording) {
			return
		}
		var b = false;
		switch (c) {
		case kKeyCode_Escape:
			this.exitShow(true);
			break;
		case kKeyCode_Slash:
		case kKeyCode_Slash + kKeyModifier_Shift:
			if (this.helpPlacard.isShowing) {
				this.helpPlacard.hide()
			} else {
				this.helpPlacard.show()
			}
			break;
		case kKeyCode_Q:
			this.exitShow(true);
			break;
		case kKeyCode_S:
			if (this.slideNumberController.isShowing) {
				if (this.slideNumberTimeout) {
					clearTimeout(this.slideNumberTimeout)
				}
				this.slideNumberTimeout = setTimeout(this.hideAndResetSlideNumberController.bind(this), 0)
			}
			if (this.slideNumberDisplay.isShowing) {
				this.slideNumberDisplay.hide()
			} else {
				this.slideNumberDisplay.setSlideNumber(this.currentSlideIndex + 1);
				this.slideNumberDisplay.show()
			}
			break;
		case kKeyCode_Return:
			if (this.accumulatingDigits) {
				this.accumulatingDigits = false;
				if (this.script.showMode != kShowModeHyperlinksOnly) {
					if (this.digitAccumulator > this.script.slideCount) {
						this.digitAccumulator = this.script.slideCount
					} else {
						if (this.digitAccumulator < 1) {
							this.digitAccumulator = 1
						}
					}
					this.slideNumberController.setSlideNumber(this.digitAccumulator);
					this.jumpToSlide(this.digitAccumulator)
				} else {
					debugMessage(kDebugShowController_OnKeyPress, "- can't do it, we're in hyperlinks only mode")
				}
				break
			}
		case kKeyCode_N:
		case kKeyCode_Space:
		case kKeyCode_DownArrow:
		case kKeyCode_RightArrow:
		case kKeyCode_PageDown:
		case kKeyCode_RightArrow + kKeyModifier_Shift:
			this.advanceToNextBuild("onKeyPress");
			break;
		case kKeyCode_DownArrow + kKeyModifier_Shift:
		case kKeyCode_PageDown + kKeyModifier_Shift:
		case kKeyCode_CloseBracket:
		case kKeyCode_Equal + kKeyModifier_Shift:
		case kKeyCode_Equal:
		case kKeyCode_Plus:
			this.advanceToNextSlide("onKeyPress");
			break;
		case kKeyCode_LeftArrow + kKeyModifier_Shift:
		case kKeyCode_PageUp + kKeyModifier_Shift:
		case kKeyCode_OpenBracket:
			this.goBackToPreviousBuild("onKeyPress");
			break;
		case kKeyCode_P:
		case kKeyCode_PageUp:
		case kKeyCode_LeftArrow:
		case kKeyCode_UpArrow:
		case kKeyCode_UpArrow + kKeyModifier_Shift:
		case kKeyCode_Hyphen:
		case kKeyCode_Minus:
			this.goBackToPreviousSlide("onKeyPress");
			break;
		case kKeyCode_Delete:
			b = true;
			if (this.accumulatingDigits) {
				if (this.digitAccumulator < 10) {
					if (this.slideNumberTimeout) {
						clearTimeout(this.slideNumberTimeout)
					}
					this.slideNumberTimeout = setTimeout(this.hideAndResetSlideNumberController.bind(this), 0)
				} else {
					if (this.slideNumberTimeout) {
						clearTimeout(this.slideNumberTimeout)
					}
					this.slideNumberTimeout = setTimeout(this.hideAndResetSlideNumberController.bind(this), 7000);
					var d = this.digitAccumulator.toString();
					this.digitAccumulator = parseInt(d.substring(0, d.length - 1));
					this.slideNumberController.setSlideNumber(this.digitAccumulator)
				}
			}
			break;
		case kKeyCode_Home:
			if (this.script.showMode != kShowModeHyperlinksOnly) {
				this.jumpToSlide(1)
			} else {
				debugMessage(kDebugShowController_OnKeyPress, "- can't do it, we're in hyperlinks only mode")
			}
			break;
		case kKeyCode_End:
			if (this.script.showMode != kShowModeHyperlinksOnly) {
				this.jumpToSlide(this.script.slideCount)
			} else {
				debugMessage(kDebugShowController_OnKeyPress, "- can't do it, we're in hyperlinks only mode")
			}
			break;
		default:
			if (this.slideNumberTimeout) {
				clearTimeout(this.slideNumberTimeout)
			}
			this.slideNumberTimeout = setTimeout(this.hideAndResetSlideNumberController.bind(this), 7000);
			if ((c >= kKeyCode_0) && (c <= kKeyCode_9)) {
				if (this.slideNumberDisplay.isShowing) {
					this.slideNumberDisplay.hide()
				}
				b = true;
				if (this.accumulatingDigits === false) {
					this.accumulatingDigits = true;
					this.digitAccumulator = 0
				}
				if (this.digitAccumulator.toString().length < 4) {
					this.digitAccumulator *= 10;
					this.digitAccumulator += (c - kKeyCode_0);
					this.slideNumberController.setSlideNumber(this.digitAccumulator);
					if (!this.slideNumberController.isShowing) {
						this.slideNumberController.show()
					}
				}
			} else {
				b = true
			}
			break
		}
		if (this.accumulatingDigits && (b === false)) {}
	},
	hideAndResetSlideNumberController: function() {
		if (this.slideNumberTimeout) {
			clearTimeout(this.slideNumberTimeout)
		}
		this.accumulatingDigits = false;
		this.digitAccumulator = 0;
		this.slideNumberController.hide()
	},
	hideSlideNumberDisplay: function() {
		this.slideNumberDisplay.hide()
	},
	toggleFullscreen: function() {
		if (browserPrefix === "ms") {
			return
		}
		setTimeout((function() {
			this.displayManager.stageArea.style.opacity = 0
		}).bind(this), 0);
		this.displayManager.hideHUD(true);
		if (document.webkitIsFullScreen || document.mozFullScreen) {
			this.isFullscreen = false;
			(document.webkitCancelFullScreen && document.webkitCancelFullScreen()) || (document.mozCancelFullScreen && document.mozCancelFullScreen())
		} else {
			this.isFullscreen = true;
			(document.body.webkitRequestFullScreen && document.body.webkitRequestFullScreen()) || (document.body.mozRequestFullScreen && document.body.mozRequestFullScreen())
		}
	},
	changeState: function(a) {
		if (a != this.state) {
			this.leavingState();
			this.state = a;
			this.enteringState()
		}
	},
	leavingState: function() {
		switch (this.state) {
		case kShowControllerState_Stopped:
			break;
		case kShowControllerState_Starting:
			break;
		case kShowControllerState_SettingUpScene:
			break;
		case kShowControllerState_IdleAtFinalState:
			break;
		case kShowControllerState_IdleAtInitialState:
			break;
		case kShowControllerState_WaitingToJump:
			break;
		case kShowControllerState_ReadyToJump:
			break;
		case kShowControllerState_WaitingToPlay:
			this.displayManager.hideWaitingIndicator();
			break;
		case kShowControllerState_ReadyToPlay:
			break;
		case kShowControllerState_Playing:
			break
		}
	},
	enteringState: function() {
		switch (this.state) {
		case kShowControllerState_Stopped:
			break;
		case kShowControllerState_Starting:
			this.displayManager.showWaitingIndicator();
			break;
		case kShowControllerState_SettingUpScene:
			break;
		case kShowControllerState_IdleAtFinalState:
		case kShowControllerState_IdleAtInitialState:
			this.updateSlideNumber();
			this.displayManager.hideWaitingIndicator();
			this.createHyperlinksForCurrentState("idle");
			runInNextEventLoop(this.doIdleProcessing.bind(this));
			break;
		case kShowControllerState_WaitingToJump:
			break;
		case kShowControllerState_ReadyToJump:
			break;
		case kShowControllerState_WaitingToPlay:
			this.displayManager.showWaitingIndicator();
			break;
		case kShowControllerState_ReadyToPlay:
			break;
		case kShowControllerState_Playing:
			break
		}
	},
	doIdleProcessing: function() {
		this.preloadAppropriateScenes();
		if (this.queuedUserAction != null) {
			this.queuedUserAction();
			this.queuedUserAction = null
		} else {
			var a = this.stageManager.stage;
			if (a.childNodes.length != 0) {
				this.updateNavigationButtons()
			} else {}
		}
	},
	truncatedSlideIndex: function(a) {
		return this.truncatedIndex(a, this.script.lastSlideIndex, this.script.loopSlideshow)
	},
	truncatedSceneIndex: function(a) {
		return this.truncatedIndex(a, this.script.lastSceneIndex, this.script.loopSlideshow)
	},
	truncatedIndex: function(a, c, b) {
		if (a < 0) {
			if (b) {
				a = a + c + 1
			} else {
				a = -1
			}
		} else {
			if (a > c) {
				if (b) {
					a = a - c - 1
				} else {
					a = -1
				}
			}
		}
		return a
	},
	preloadAppropriateScenes: function() {
		var d = this.currentSceneIndex;
		if (this.state === kShowControllerState_IdleAtFinalState) {
			d++
		}
		var a = this.script.slideIndexFromSceneIndexLookup[d];
		var e = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(a - 1));
		var b = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(a - 2));
		var p = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(a - 3));
		var g = this.truncatedSceneIndex(d - 1);
		var f = this.truncatedSceneIndex(d - 2);
		var c = this.truncatedSceneIndex(d - 3);
		var n = this.truncatedSceneIndex(d + 1);
		var m = this.truncatedSceneIndex(d + 2);
		var k = this.truncatedSceneIndex(d + 3);
		var l = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(a + 1));
		var j = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(a + 2));
		var i = this.scriptManager.sceneIndexFromSlideIndex(this.truncatedSlideIndex(a + 3));
		var o = {};
		var h = (gIpad === true);
		if (!h && p != -1) {
			o[p] = true
		}
		if (!h && b != -1) {
			o[b] = true
		}
		if (!h && e != -1) {
			o[e] = true
		}
		if (!h && c != -1) {
			o[c] = true
		}
		if (!h && f != -1) {
			o[f] = true
		}
		if (!h && g != -1) {
			o[g] = true
		}
		o[this.currentSceneIndex] = true;
		o[d] = true;
		if (n != -1) {
			o[n] = true
		}
		if (!h && m != -1) {
			o[m] = true
		}
		if (!h && k != -1) {
			o[k] = true
		}
		if (!h && l != -1) {
			o[l] = true
		}
		if (!h && j != -1) {
			o[j] = true
		}
		if (!h && i != -1) {
			o[i] = true
		}
		this.textureManager.preloadScenes(o)
	},
	advanceToNextBuild: function(b) {
		if (this.script.showMode === kShowModeHyperlinksOnly && b != "currentSceneDidComplete") {
			return false
		}
		if (this.displayManager.infoPanelIsShowing) {
			return false
		}
		var a = false;
		switch (this.state) {
		case kShowControllerState_IdleAtFinalState:
			if (this.nextSceneIndex === -1) {
				if (this.delegate.getKPFJsonStringForShow) {
					this.stopSoundTrack();
					this.exitShow()
				} else {
					this.stopSoundTrack();
					break
				}
			}
			a = true;
			this.jumpToScene(this.nextSceneIndex, true,b);
			break;
		case kShowControllerState_IdleAtInitialState:
			if (this.currentSceneIndex >= this.script.numScenes) {
				if (this.script.loopSlideshow) {
					a = true;
					this.jumpToScene(0, false,b)
				} else {
					if (this.delegate.getKPFJsonStringForShow) {
						this.stopSoundTrack();
						this.exitShow()
					} else {
						this.stopSoundTrack();
						break
					}
				}
			} else {
				a = true;
				this.playCurrentScene()
			}
			break;
		default:
			debugMessage(kDebugShowController_AdvanceToNextBuild, "nextSceneIndex: " + this.nextSceneIndex + " can't advance now, not in an idle state (currently in '" + this.state + "' state), queue up action to run in next idle time");
			if (this.queuedUserAction == null) {
				a = true;
				this.queuedUserAction = this.advanceToNextBuild.bind(this, b)
			}
			break
		}
		return a
	},
	advanceToNextSlide: function(d) {
		if (this.script.showMode == kShowModeHyperlinksOnly) {
			return
		}
		if (this.displayManager.infoPanelIsShowing) {
			return
		}
		var b = this.currentSceneIndex;
		switch (this.state) {
		case kShowControllerState_IdleAtFinalState:
			b = b + 1;
		case kShowControllerState_IdleAtInitialState:
			var f = this.scriptManager.slideIndexFromSceneIndex(b);
			var c;
			if (f === this.script.slideCount - 1) {
				if (this.script.loopSlideshow) {
					c = 0
				} else {
					return
				}
			} else {
				c = this.currentSlideIndex + 1
			}
			var g = this.scriptManager.sceneIndexFromSlideIndex(c);
			var e = this.script.events[g];
			var a = e.automaticPlay == 1 || e.automaticPlay == true;
			this.jumpToSlide(c + 1, a);
			break;
		default:
			debugMessage(kDebugShowController_AdvanceToNextSlide, "can't advance now, not in an idle state (currently in '" + this.state + "' state), queue up action to run in next idle time");
			if (this.queuedUserAction == null) {
				this.queuedUserAction = this.advanceToNextSlide.bind(this, d)
			}
			break
		}
	},
	goBackToPreviousBuild: function(c) {
		this.resetMediaCache();
		if (this.script.showMode == kShowModeHyperlinksOnly) {
			return
		}
		if (this.displayManager.infoPanelIsShowing) {
			return
		}
		var a = this.currentSceneIndex;
		switch (this.state) {
		case kShowControllerState_IdleAtFinalState:
			a = a + 1;
		case kShowControllerState_Playing:
		case kShowControllerState_IdleAtInitialState:
			var b;
			if (a === 0) {
				if (this.script.loopSlideshow) {
					b = this.script.events.length - 1
				} else {
					return
				}
			} else {
				b = a - 1
			}
			this.jumpToScene(b, false,c);
			break;
		default:
			debugMessage(kDebugShowController_GoBackToPreviousBuild, "can't go back now, not in an idle state (currently in '" + this.state + "' state)");
			if (this.queuedUserAction == null) {
				this.queuedUserAction = this.goBackToPreviousBuild.bind(this, c)
			}
			break
		}
	},
	goBackToPreviousSlide: function(c) {
		if (this.script.showMode == kShowModeHyperlinksOnly) {
			return
		}
		if (this.displayManager.infoPanelIsShowing) {
			return
		}
		var b = this.currentSceneIndex;
		switch (this.state) {
		case kShowControllerState_IdleAtFinalState:
			b = b + 1;
		case kShowControllerState_Playing:
		case kShowControllerState_IdleAtInitialState:
			var d = this.scriptManager.slideIndexFromSceneIndex(b);
			var a;
			if (d === 0) {
				if (this.script.loopSlideshow) {
					a = this.script.slideCount - 1
				} else {
					a = 0
				}
			} else {
				if (d === -1 && b > 0) {
					a = this.script.slideCount - 1
				} else {
					a = this.currentSlideIndex - 1
				}
			}
			this.jumpToSlide(a + 1);
			break;
		default:
			debugMessage(kDebugShowController_GoBackToPreviousSlide, "can't go back now, not in an idle state (currently in '" + this.state + "' state)");
			if (this.queuedUserAction == null) {
				this.queuedUserAction = this.goBackToPreviousSlide.bind(this, c)
			}
			break
		}
	},
	calculatePreviousSceneIndex: function(a) {
		if (a == -1) {
			previousSceneIndex = -1
		} else {
			previousSceneIndex = a - 1
		}
		return previousSceneIndex
	},
	jumpToSlide: function(b, a) {
		var c = b - 1;
		var d = this.scriptManager.sceneIndexFromSlideIndex(c);
		this.resetMediaCache();
		if (a == null) {
			a = false
		}
		this.jumpToScene(d, a)
	},
	manageBullets:function(sceneIndexV,c){
		try{
			loadedSlideIndex = this.scriptManager.slideIndexFromSceneIndex(sceneIndexV);
			var initialScene = this.scriptManager.sceneIndexFromSlideIndex(loadedSlideIndex);
			var finalScene = this.scriptManager.sceneIndexFromSlideIndex((loadedSlideIndex+1));
			var stepScene = (sceneIndexV-initialScene);
			var totalScenes = (finalScene - initialScene)-1;
			manageBullets(stepScene, totalScenes);
			
		}
		catch(e){
			alert(e);
		}
		
	},
	jumpToScene: function(d, c, initiator) {
		this.lastSlideViewedIndex = this.scriptManager.slideIndexFromSceneIndex(this.currentSceneIndex);
		if (d === -1) {
			return
		}
		loadedSlideIndex = this.scriptManager.slideIndexFromSceneIndex(d);
		var initialScene = this.scriptManager.sceneIndexFromSlideIndex(loadedSlideIndex);
		var finalScene = this.scriptManager.sceneIndexFromSlideIndex((loadedSlideIndex+1));
		var stepScene = (d-initialScene);
		var totalScenes = (finalScene - initialScene)-1;
		if(stepScene >= totalScenes){
			if(initiator=="onKeyPress"){
				Ti.App.fireEvent('goNextSlide');
				//Titanium.App.fireEvent('goPrevSlide');			
				return;
			}
			else{
				if(totalScenes!=0 && stepScene==totalScenes){
					if(hasComeToEndBefore==true){
						this.jumpToScene((initialScene), false);
					}
					else{
						hasComeToEndBefore = true;
					}
				//	
					return;	
				}
				else{
					if(stepScene>totalScenes){
						this.jumpToScene((initialScene), false);
						return;	
					}
					else{
						//0==0
						Ti.App.fireEvent('goPrevSlide');
						//Titanium.App.fireEvent('goPrevSlide');			
						return;
					}
				}
			}


		}
		
		this.manageBullets(d);
		
		switch (this.state) {
		case kShowControllerState_Starting:
			var b = "position:absolute;background-color:transparent; left:0px; top:0px; width:" + this.displayManager.usableDisplayWidth + "px; height:" + this.displayManager.usableDisplayHeight + "px;";
			this.starting = true;
			this.maskElement = document.createElement("div");
			this.maskElement.setAttribute("style", b);
			document.body.appendChild(this.maskElement);
		case kShowControllerState_IdleAtInitialState:
		case kShowControllerState_IdleAtFinalState:
		case kShowControllerState_ReadyToJump:
			break;
		default:
			debugMessage(kDebugShowController_JumpToScene, "can't jump now, currently in '" + this.state + "' state which does not supports jumping...");
			return
		}
		if (this.textureManager.isScenePreloaded(d) === false) {
			this.changeState(kShowControllerState_WaitingToJump);
			var a = {
				sceneIndex: d,
				automaticPlay: c
			};
			this.waitForSceneToLoadTimeout = setTimeout(this.handleSceneDidNotLoad.bind(this, a), kMaxSceneDownloadWaitTime);
			this.textureManager.loadScene(d, this.handleSceneDidLoad.bind(this, a));
			return
		}
		this.changeState(kShowControllerState_SettingUpScene);
		runInNextEventLoop(this.jumpToScene_partThree.bind(this, d, c))
	},
	handleSceneDidLoad: function(a) {
		clearTimeout(this.waitForSceneToLoadTimeout);
		this.displayManager.setNextButtonEnabled(this.currentSceneIndex < (this.script.pageCount - 1));
		switch (this.state) {
		case kShowControllerState_WaitingToJump:
			this.changeState(kShowControllerState_ReadyToJump);
			this.jumpToScene_partTwo(a.sceneIndex, a.automaticPlay);
			break;
		default:
			break
		}
	},
	handleSceneDidNotLoad: function(a) {
		clearTimeout(this.waitForSceneToLoadTimeout);
		this.queuedUserAction = null;
		var b = this.promptUserToTryAgain(kUnableToReachiWorkTryAgain);
		if (b) {
			var d = window.location.href;
			var f;
			var e = d.indexOf("&restartingSceneIndex");
			if (e === -1) {
				f = d
			} else {
				f = d.substring(0, e)
			}
			var c = f + "&restartingSceneIndex=" + a.sceneIndex;
			window.location.replace(c)
		} else {
			this.changeState(kShowControllerState_IdleAtFinalState)
		}
	},
	jumpToScene_partTwo: function(b, a) {
		this.changeState(kShowControllerState_SettingUpScene);
		runInNextEventLoop(this.jumpToScene_partThree.bind(this, b, a))
	},
	jumpToScene_partThree: function(c, a) {
		var b = false;
		if (b) {
			runInNextEventLoop(this.jumpToScene_partFour.bind(this, c, a))
		} else {
			this.jumpToScene_partFour(c, a)
		}
	},
	jumpToScene_partFour: function(b, a) {
		this.displayScene(b);
		if (this.starting) {
			if (this.maskElement != null) {
				document.body.removeChild(this.maskElement);
				this.maskElement = null;
				this.starting = false
			}
			window.focus()
		}
		if (this.helpPlacard.isShowing) {
			this.helpPlacard.hide()
		}
		if (this.slideNumberDisplay.isShowing) {
			this.slideNumberDisplay.hide()
		}
		if (this.slideNumberController.isShowing) {
			if (this.slideNumberTimeout) {
				clearTimeout(this.slideNumberTimeout)
			}
			this.slideNumberTimeout = setTimeout(this.hideAndResetSlideNumberController.bind(this), 500)
		}
		if (a) {
			this.playCurrentScene()
		} else {
			this.changeState(kShowControllerState_IdleAtInitialState);
			if (this.isRecording && !this.isRecordingStarted) {
				this.narrationManager.start();
				this.isRecordingStarted = true
			}
		}
	},
	displayScene: function(g, c) {
		if (g === -1) {
			return
		}
		this.animationManager.deleteAllAnimations();
		var f = this.scriptManager.slideIndexFromSceneIndex(this.currentSceneIndex);
		var b = c ? c.slideIndex : this.scriptManager.slideIndexFromSceneIndex(g);
		if (f != b) {
			this.resetMediaCache()
		}
		this.setCurrentSceneIndexTo(g);
		if (c) {
			this.playbackController.renderEvent(c)
		} else {
			var e = this.script.slideIndexFromSceneIndexLookup[g];
			var d = this.script.slideList[e];
			var a = new KPFEvent({
				slideId: d,
				slideIndex: e,
				sceneIndex: g,
				event: this.script.events[g],
				animationSupported: this.animationSupported
			});
			this.playbackController.renderEvent(a)
		}
		this.updateNavigationButtons()
	},
	setCurrentSceneIndexTo: function(a) {
		this.currentSceneIndex = a;
		this.assignNextSceneIndex();
		this.updateSlideNumber();
		this.updateNavigationButtons()
	},
	assignNextSceneIndex: function() {
		this.nextSceneIndex = this.calculateNextSceneIndex(this.currentSceneIndex)
	},
	calculateNextSceneIndex: function(b) {
		var a = this.calculateNextSceneIndex_internal(b);
		return a
	},
	calculateNextSceneIndex_internal: function(b) {
		var a = -1;
		if (b < this.script.lastSceneIndex) {
			a = b + 1
		} else {
			if (this.script.loopSlideshow) {
				a = 0
			} else {
				a = -1
			}
		}
		return a
	},
	updateSlideNumber: function() {
		var b = this.currentSceneIndex;
		if (this.state === kShowControllerState_IdleAtFinalState) {
			b = this.nextSceneIndex
		}
		var a = this.scriptManager.slideIndexFromSceneIndex(b);
		if (this.firstSlide) {
			runInNextEventLoop((function() {
				this.startSoundTrack();
				this.displayManager.clearLaunchMode()
			}).bind(this));
			this.firstSlide = false
		}
		if (this.currentSlideIndex != a) {
			this.previousSlideIndex = this.currentSlideIndex;
			this.currentSlideIndex = a;
			this.displayManager.updateSlideNumber(this.currentSlideIndex + 1, this.script.slideCount);
			this.delegate.propertyChanged(kPropertyName_currentSlide, this.currentSlideIndex + 1);
			document.fire(kSlideIndexDidChangeEvent, {
				slideIndex: this.currentSlideIndex
			})
		}
	},
	updateNavigationButtons: function() {
		var c = this.currentSceneIndex;
		if (this.state === kShowControllerState_IdleAtFinalState) {
			c++
		}
		this.updateWindowHistory(c);
		var a = false;
		var b = false;
		if (this.script.lastSceneIndex === -1) {
			b = false;
			a = false
		} else {
			if (this.script.loopSlideshow) {
				b = true;
				a = true
			} else {
				if (c > 0) {
					a = true
				}
				if (c === 0 && this.script.lastSceneIndex === 0) {
					b = true
				} else {
					if (this.currentSceneIndex < this.script.lastSceneIndex) {
						b = true
					} else {
						if (this.currentSceneIndex === this.script.lastSceneIndex) {
							if (this.state === kShowControllerState_IdleAtInitialState) {
								b = true
							} else {
								b = false
							}
						} else {
							b = false
						}
					}
				}
			}
		}
		this.displayManager.setPreviousButtonEnabled(a);
		this.displayManager.setNextButtonEnabled(b)
	},
	playCurrentScene: function(d) {
		var a = this.state;
		var b;
		var c = 0;
		var g = this.playbackController.eventOverallEndTime();
		this.changeState(kShowControllerState_Playing);
		if (this.helpPlacard.isShowing) {
			this.helpPlacard.hide()
		}
		if (this.slideNumberDisplay.isShowing) {
			this.slideNumberDisplay.hide()
		}
		if (d) {
			b = d.sceneIndexToJump
		} else {
			b = this.nextSceneIndex;
			if (this.playbackController.kpfEvent.event.automaticPlay == true && this.playbackController.kpfEvent.event.effects[0].type === "transition") {
				c = this.playbackController.kpfEvent.event.effects[0].beginTime;
				g = this.playbackController.kpfEvent.event.effects[0].duration
			}
		}
		if (this.animationSupported) {
			clearTimeout(this.animateTimeout);
			var f;
			if (this.playbackController.kpfEvent.event.effects[0].type === "transition" && this.playbackController.kpfEvent.event.effects[0].name != "com.apple.iWork.Keynote.BLTBlinds") {
				f = this.playbackController.renderEffects()
			}
			this.animateTimeout = setTimeout((function(h) {
				if (h == null) {
					h = this.playbackController.renderEffects()
				}
				this.playbackController.animateEffects(h);
				setTimeout(this.currentSceneDidComplete.bind(this, b), g * 1000 + 100)
			}).bind(this, f), c * 1000)
		} else {
			var e = this.script.events[this.currentSceneIndex].automaticPlay;
			if (b === -1) {
				this.updateNavigationButtons();
				if (this.delegate.getKPFJsonStringForShow) {
					if (e) {
						setTimeout(this.exitShow.bind(this), 2000)
					} else {
						this.exitShow()
					}
				} else {
					this.changeState(kShowControllerState_IdleAtInitialState)
				}
			} else {
				if (e) {
					setTimeout((function() {
						this.changeState(kShowControllerState_IdleAtInitialState);
						this.jumpToScene(b, this.script.events[b].automaticPlay)
					}).bind(this), 2000)
				} else {
					this.changeState(kShowControllerState_IdleAtInitialState);
					setTimeout(this.jumpToScene.bind(this, b, this.script.events[b].automaticPlay), 100)
				}
			}
		}
		this.manageBullets(b);
	},
	currentSceneDidComplete: function(b) {
		
		if (this.slideNumberDisplay.isShowing) {
			this.slideNumberDisplay.hide()
		}
		this.changeState(kShowControllerState_IdleAtFinalState);
		if (this.script.showMode == kShowModeHyperlinksOnly || (b != -1 && b != this.nextSceneIndex)) {
			var c = this.script.events[b];
			var a = c.automaticPlay == 1 || c.automaticPlay == true;
			this.jumpToScene(b, a)
		} else {
			if (this.nextSceneIndex === -1) {
				this.updateNavigationButtons();
				if (this.delegate.getKPFJsonStringForShow) {
					this.stopSoundTrack();
					this.exitShow()
				} else {
					this.stopSoundTrack()
				}
			} else {
				if (this.script.events[this.nextSceneIndex].automaticPlay) {
					runInNextEventLoop(this.advanceToNextBuild.bind(this, "currentSceneDidComplete"))
				}
			}
		}
		this.manageBullets(b);
	},
	resetMediaCache: function() {
		this.resetMovieCache();
		this.resetAudioCache()
	},
	resetMovieCache: function() {
		for (var a in this.movieCache) {
			delete this.movieCache[a]
		}
		for (var a in this.movieCacheInfo) {
			delete this.movieCacheInfo[a]
		}
		this.movieCache = null;
		this.movieCacheInfo = null
	},
	resetAudioCache: function() {
		for (var a in this.audioCache) {
			delete this.audioCache[a]
		}
		this.audioCache = null
	},
	updateWindowHistory: function(c) {
		if (typeof(window.history.replaceState) != "undefined") {
			var b = document.URL.split("?");
			var a = b[0].split("#");
			window.history.replaceState(null, "Keynote", a[0] + "#" + c + (b[1] ? "?" + b[1] : ""))
		}
	},
	startSoundTrack: function() {
return;
		if (gMode === kModeMobile) {
			return
		}
		if (this.script.soundtrack == null) {
			return
		}
		if (this.script.soundtrack.mode === kSoundTrackModeOff) {
			return
		}
		this.currentSoundTrackIndex = 0;
		this.playNextItemInSoundTrack()
	},
	stopSoundTrack: function() {
		if (this.soundTrackPlayer) {
			this.soundTrackPlayer.stopObserving("ended");
			this.soundTrackPlayer.pause();
			this.soundTrackPlayer = null
		}
	},
	playNextItemInSoundTrack: function() {
		var a = this.script.soundtrack.tracks[this.currentSoundTrackIndex];
		this.soundTrackPlayer = new Audio();
		this.soundTrackPlayer.src = "assets/" + a;
		this.soundTrackPlayer.volume = this.script.soundtrack.volume;
		this.soundTrackPlayer.observe("ended", this.soundTrackItemDidComplete.bind(this), false);
		this.soundTrackPlayer.load();
		this.soundTrackPlayer.play()
	},
	soundTrackItemDidComplete: function() {
		this.currentSoundTrackIndex++;
		if (this.currentSoundTrackIndex < this.script.soundtrack.tracks.length) {
			this.playNextItemInSoundTrack()
		} else {
			if (this.script.soundtrack.mode === kSoundTrackModePlayOnce) {
				this.soundTrackPlayer = null
			} else {
				if (this.script.soundtrack.mode === kSoundTrackModeLooping) {
					this.startSoundTrack()
				}
			}
		}
	},
	processHyperlink: function(k) {
		var d = k.url;
		var m;
		if (d.indexOf("?slide=") === 0) {
			var l = d.substring(7);
			var g = -1;
			if (l === "first") {
				g = 0
			} else {
				if (l === "last") {
					g = this.script.slideCount - 1
				} else {
					var b = this.currentSceneIndex;
					var f = -1;
					switch (this.state) {
					case kShowControllerState_IdleAtFinalState:
						b = b + 1;
					case kShowControllerState_IdleAtInitialState:
						var a = this.scriptManager.slideIndexFromSceneIndex(b);
						if (l === "next") {
							if (a === this.script.slideCount - 1) {
								if (this.script.loopSlideshow) {
									f = 0
								} else {
									if (this.delegate.getKPFJsonStringForShow) {
										this.exitShow()
									}
								}
							} else {
								f = a + 1
							}
						} else {
							if (l === "previous") {
								if (a === 0) {
									if (this.script.loopSlideshow) {
										f = this.script.slideCount - 1
									} else {
										f = 0
									}
								} else {
									f = a - 1
								}
							}
						}
						break;
					default:
						break
					}
					g = f
				}
			}
			if (g != -1) {
				this.jumpToHyperlinkSlide(g, k)
			}
		} else {
			if (d.indexOf("?slideid=") === 0) {
				var j = d.substring(9);
				var c = this.script.slideList;
				var g = -1;
				for (var h = 0, e = c.length; h < e; h++) {
					if (c[h] === j) {
						g = h;
						break
					}
				}
				if (g != -1) {
					this.jumpToHyperlinkSlide(g, k)
				}
			} else {
				if (d.indexOf("?action=retreat") === 0) {
					if (this.lastSlideViewedIndex != -1) {
						this.jumpToHyperlinkSlide(this.lastSlideViewedIndex, k)
					}
				} else {
					if (d.indexOf("?action=exitpresentation") === 0) {
						this.exitShow()
					} else {
						if (d.indexOf("http:") === 0) {
							window.open(d, "_blank", null)
						} else {
							if (d.indexOf("mailto:") === 0) {
								window.location = d
							}
						}
					}
				}
			}
		}
	},
	jumpToHyperlinkSlide: function(h, l) {
		var k = l.events;
		var j = this.script.sceneIndexFromSlideIndexLookup[h];
		if (k) {
			var d = this.script.slideList[h];
			var e = k[d];
			if (e) {
				var g = this.currentSceneIndex;
				switch (this.state) {
				case kShowControllerState_IdleAtFinalState:
					if (g < this.script.numScenes - 1) {
						g = g + 1
					} else {
						if (this.script.loopSlideshow) {
							g = 0
						}
					}
				case kShowControllerState_IdleAtInitialState:
					var c = this.script.slideIndexFromSceneIndexLookup[g];
					var a = this.script.slideList[c];
					var i = new KPFEvent({
						slideId: a,
						slideIndex: c,
						sceneIndex: g,
						event: e,
						animationSupported: this.animationSupported
					});
					this.displayScene(g, i);
					this.playCurrentScene({
						sceneIndexToJump: j
					});
					break;
				default:
					return
				}
			} else {
				var b = this.script.events[j];
				var f = b.automaticPlay == 1 || b.automaticPlay == true;
				this.jumpToSlide(h + 1, f)
			}
		} else {
			var b = this.script.events[j];
			var f = b.automaticPlay == 1 || b.automaticPlay == true;
			this.jumpToSlide(h + 1, f)
		}
	},
	addMovieHyperlink: function(c, a) {
		var b = {
			targetRectangle: c,
			url: a
		};
		this.movieHyperlinks.push(b)
	},
	clearMovieHyperlinks: function() {
		delete this.movieHyperlinks;
		this.movieHyperlinks = new Array()
	},
	clearAllHyperlinks: function() {
		this.stageManager.clearAllHyperlinks();
		delete this.activeHyperlinks;
		this.activeHyperlinks = new Array()
	},
	findHyperlinkAtCoOrds: function(b) {
		var a = this.activeHyperlinks != null ? this.activeHyperlinks.length : 0;
		for (var d = a; d > 0; d--) {
			var e = this.activeHyperlinks[d - 1];
			var c = e.targetRectangle;
			hyperlinkLeft = Math.floor(c.x);
			hyperlinkTop = Math.floor(c.y);
			hyperlinkRight = hyperlinkLeft + Math.floor(c.width);
			hyperlinkBottom = hyperlinkTop + Math.floor(c.height);
			if ((b.pointX >= hyperlinkLeft) && (b.pointX <= hyperlinkRight) && (b.pointY >= hyperlinkTop) && (b.pointY <= hyperlinkBottom)) {
				return e
			}
		}
		return null
	},
	createHyperlinksForCurrentState: function(a) {
		var b = -1;
		switch (this.state) {
		case kShowControllerState_IdleAtInitialState:
			b = this.currentSceneIndex;
			break;
		case kShowControllerState_IdleAtFinalState:
			if (this.currentSceneIndex < this.script.lastSceneIndex) {
				b = this.currentSceneIndex + 1
			} else {
				if (this.script.showMode == kShowModeHyperlinksOnly) {
					b = this.currentSceneIndex
				} else {
					if (this.script.loopSlideshow) {
						b = 0
					}
				}
			}
			break;
		default:
			break
		}
		if (b != -1) {
			this.clearAllHyperlinks();
			this.createHyperlinks(b)
		}
	},
	createHyperlinks: function(l) {
		if (l === -1) {
			return
		}
		var m = this.script.events[l];
		if (m == null) {
			return
		}
		var g = m.hyperlinks;
		if (g == null) {
			return
		}
		var p = g.length;
		var j;
		var b = 150;
		var v = 50;
		var d = this.displayManager.showWidth;
		var k = this.displayManager.showHeight;
		for (j = 0; j < p; j++) {
			var f = g[j];
			var u = f.targetRectangle;
			var r = {
				targetRectangle: u,
				events: f.events,
				url: f.url
			};
			var t = u.x;
			var i = u.y;
			var w = d - (u.x + u.width);
			var o = k - (u.y + u.top);
			if (gMode === kModeMobile) {
				if (u.width < b) {
					var q = b - u.width;
					var c = q / 2;
					var e = q / 2;
					if (t < c) {
						c = t
					} else {
						if (w < e) {
							c = c + (e - w)
						}
					}
					r.targetRectangle.x -= c;
					r.targetRectangle.width += q
				}
				if (u.height < v) {
					var s = v - u.height;
					var n = s / 2;
					var h = s / 2;
					if (i < n) {
						n = i
					} else {
						if (o < h) {
							n = n + (e - w)
						}
					}
					r.targetRectangle.y -= n;
					r.targetRectangle.height += s
				}
			}
			this.stageManager.addHyperlink(r.targetRectangle);
			this.activeHyperlinks[j] = r
		}
		if (this.movieHyperlinks.length > 0) {
			for (var a = 0; a < this.movieHyperlinks.length; a++) {
				var x = this.movieHyperlinks[a];
				this.stageManager.addHyperlink(x.targetRectangle);
				this.activeHyperlinks[j++] = x
			}
		}
	}
});
