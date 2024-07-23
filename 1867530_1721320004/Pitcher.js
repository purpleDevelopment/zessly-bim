var lastCurrent = -1;
function manageBullets(current,total){
	if(current==lastCurrent){
		return;
	}
	lastCurrent = current;
	var bullets = "";
	for(var i = 0;i<(current);i++){
		bullets+="<img width='5' src='assets/bullet_empty.png'>";
	}
	for(var i = 0;i<(total-current);i++){
		bullets+="<img width='5' src='assets/bullet.png'>";
	}
	window.document.getElementById("progressbar").innerHTML = bullets;
	if(total>0)
	Ti.App.fireEvent('sendAnimationNext');




}
var sCounter = 0;
var paramDict = {};
var loadedSlideIndex = 0;
function gotoSlide(slideNumber){
	paramDict["currentSlide"] = slideNumber;

	setupShowController();
	
}
var slideCounter =0;
var jsVersion = 3;
function getParameters(parameters){
	document.documentElement.style.webkitTapHighlightColor = "rgba(0,0,0,0.0)";
	var paramO = JSON.parse(parameters);
	isPitching = paramO.isPitching;
	slideCounter = paramO.pageNumber;
	sCounter = slideCounter;
	gotoSlide((slideCounter+1));
	var paramO = JSON.parse(parameters);
	isPitching = paramO.isPitching;
	if(paramO.player!="connectPlayer")
			$('body').setStyle({backgroundImage:"url(Slide"+(0+parseInt(slideCounter)+1)+".png)",backgroundRepeat:"no-repeat"}); 
	
	try{
		new Ajax.Request('./slide'+(parseInt(slideCounter)+1)+'.json',
		{
			method:'get',
			onSuccess: function(transport){
				var response = transport.responseText || "no response text";

				var ratioX = window.innerWidth/400;
				var ratioY = window.innerHeight/300;
				
				if(paramO.player == "Win") {
				    //ratio = ratio *= window.innerWidth / 1024;
				}
				else{
					ratioX = 2.56;
					ratioY = 2.56;
				}
				
				var slideJSON = JSON.parse(response);
				if (slideJSON.notes != null && slideJSON.notes != "") {
					$('overlay').insert({after:"<div class=\"notesArea\" skipclick=\"true\" onClick=\"showNotes(event);\" style=\"top:0px;left:974px;position:absolute; \"><img height=\"40\" src=\"note.png\"></div><div id=\"notes\" class=\"notes\" onClick=\"closeNotes(event);\">" + slideJSON.notes + "</div>"});

				}
				
				if(slideJSON.hotspots!=null && slideJSON.hotspots.length>0){
					for(var i = 0;i<slideJSON.hotspots.length;i++){
						var hotspot = slideJSON.hotspots[i];

						var launchString = "";
						var targetObject = hotspot.actionParameter;

						switch(hotspot.actionID){
							case "jumpPres":
							launchString = "gotoPage("+(hotspot.actionParameter-1)+");";
							break;
							case "launchPres":
							switch(targetObject.category){
								case "pdf":
								launchString = 'showPDF(\'pdfs/'+targetObject.filename+'\',\''+targetObject.body+'\',1,null,null,null,'+hotspot.secondParameter+','+targetObject.ID+');';						
								break;
								case "video":
								launchString = 'playVideo(\'videos/'+targetObject.filename+'\',0,'+targetObject.ID+');';						
								break;
								case "surveys":
								launchString = 'showSurvey(\''+ targetObject.filename +'\',\''+targetObject.body +'\','+targetObject.ID+');';					
								break;
								case "presentation":
								launchString = 'showPresentation(' + targetObject.ID + ',' + hotspot.secondParameter + ')';
								break;
							case "3D":
								launchString = 'load3D(\'3DModels/' + targetObject.filename + '\',' + targetObject.ID + ');';
								break;
							case "molecule":
								launchString = 'loadMolecule(\'3DModels/' + targetObject.filename + '\',\'' + targetObject.body + '\',' + targetObject.ID + ');';
								break;
								
								default:
								break;
							}

							break;
							case "exitPres":
							launchString = "closePresentation();";
							break;
							case "gotoURL":
							launchString = "showPage('"+ hotspot.actionParameter +"');";
							break;
							case "reportPres":
							launchString = "customEvent('"+hotspot.actionParameter+"');";
							break;
							default:
							break;
						}
						try{
							var opacity = "0.1";
							opacity = "0.0";
								if (launchString && launchString.indexOf("showPage") > -1 && launchString.toLowerCase().indexOf("crm.com") > -1) {

									var objParts = hotspot.actionParameter.split('crm.com/');
									var source = decodeURIComponent(objParts.pop());
									var lastString = source;
									try{
										lastString = decodeURI(lastString);
									}
									catch(exc){

									}
									try{
										var currentSFDCObj = localStorage.currentSFDCObj;
										try {
											if(sessionStorage.currentSFDCObj){
												currentSFDCObj = sessionStorage.currentSFDCObj;
											}
										} catch (e) {
											
											
										}
										var params = JSON.parse(currentSFDCObj);
										var template = Handlebars.compile(lastString);
										var handledText = template(params);
									$('overlay').insert({after:"<div  skipClick=\"true\"  style=\"top:" + hotspot.y * ratioY + "px;left:" + hotspot.x * ratioX + "px;width:" + hotspot.width * ratioX + "px;height:" + hotspot.height * ratioY + "px;position:absolute;cursor:default;\" class='hotspot'>" + handledText + "</div>"});
				
										
									}
									catch(exc){
										console.error(exc);
									}
									
									//$('body').append("<div style=\"top:" + hotspot.y * ratio + "px;left:" + hotspot.x * ratio + "px;width:" + hotspot.width * ratio + "px;height:" + hotspot.height * ratio + "px;position:absolute;color:"+decodeURIComponent(lastParsed.color)+";text-align:"+textAlign+";font-family:"+lastParsed.font+";font-size:"+(lastParsed.size* 3)+"px;\" class='hotspot'>"+handledText+"</div>");
									

								}
								else{
									$('overlay').insert({after:"<div skipClick=\"true\" onClick=\""+launchString+"\" style=\"top:"+hotspot.y*ratioY+"px;left:"+hotspot.x*ratioX+"px;width:"+hotspot.width*ratioX+"px;height:"+hotspot.height*ratioY+"px;position:absolute; background-color:black;opacity:"+opacity+";border-radius:15px;\" class='hotspot'></div>"});
								}
							hasHyperlinks = true;
						}
						catch(e){
							alert(e);
						}
					}
				}
				
				
				var toTextFit = [];
				$$( ".hotspot span" ).each(function( index ) {
					if($( index ).getStyle("font-size")=="100px"){
						$( index ).getStyle("font-size","");
						toTextFit.push($(index).closest(".hotspot"));
					}
				
				});
			
				for(var tI =0;tI<toTextFit.length;tI++){
					textFit(toTextFit[tI], {minFontSize:30, maxFontSize: 500});
				}
							
				if(paramO.player!="connectPlayer")
				pitcherInit();
			},
			onFailure: function(){ alert("failed downloading"); }
		});
	}
	catch(e){
		alert(e);
	}
}

Element.addMethods({
   closest: function closest (element, cssRule) {
      var $element = $(element);
      // Return if we don't find an element to work with.
      if(!$element) {
         return;
      }
      return $element.match(cssRule) ? $element : $element.up(cssRule);
   }
});

var slideCounter =0;
var jsVersion = 3;
function okPressedFromRemote(){
	gShowController.advanceToNextBuild("processClickOrTapAtDisplayCoOrds");
	return "OK";
}
function load3D(filename, fileID) {
	var folders = filename.split("/");
	if (folders.length != 0) {
		Ti.App.fireEvent('loadThreeD', {
			'model': folders[1],
			'folder': folders[0],
			'title': 'Pre Treatment CT - Dicom',
			'fileID': fileID
		});
	} else {
		Ti.App.fireEvent('loadThreeD', {
			'model': filename,
			'title': 'Pre Treatment CT - Dicom',
			'fileID': fileID
		});
	}

}


function showPDF(filename,title,launchMode,lockMode,references,subFolder,jumpPage,fileID){
	try{
		//Ti.App.fireEvent('closeOpenModal',{'reset':true});
	 	Ti.App.fireEvent('loadPDF',{'file':filename,'titleV':title,'viewMode':launchMode,'lockViewMode':lockMode,'references':null,'articles':null,'annotationEnabled':true,"subFolder":subFolder,'jumpToPage':(jumpPage-1),'pdfID':fileID});
	}
	catch(e){
		alert(e);
	}
}
function playVideo(filename,isOnline,fileID){
	
//		Ti.App.fireEvent('closeOpenModal',{'reset':true});
	Ti.App.fireEvent('loadMovie',{'file':filename,'isOnline':isOnline,'fileID':fileID});
}
function showSurvey(url,title,fileID){

//		Ti.App.fireEvent('closeOpenModal',{'reset':true});
	Ti.App.fireEvent('loadWebPageFromFolder',{'urlValue':url.replace(".zip","").replace("surveys","")+"/index.html",'title':title,'showBar':true,'folderName':"surveys",'allowPortrait':false,'fileID':fileID});

}

function showPresentation(ID, subID) {

	Ti.App.fireEvent('launchContentWithID', {
		'fileID': ID,
		'subID': subID
	});
}

function showPage(pageURL,title){
//	Ti.App.fireEvent('closeOpenModal',{'reset':true});
	
	Ti.App.fireEvent('loadWebPage',{'urlValue':pageURL,'title':pageURL,'showBar':true,'allowPortrait':true});
}

function closePresentation(){

	Ti.App.fireEvent('closeOpenModal',{"version":jsVersion});
	Ti.App.fireEvent('closeScrollWeb');
}
function customEvent(eventName){
	Ti.App.fireEvent('sendStatsFromHTML',{'event_name':"customPresEvent",'event_params':eventName,'event_extra':getPageNumber()});
}
function gotoPage(page){
	Ti.App.fireEvent('gotoVSlideH',{'p':page});
	Ti.App.fireEvent('closeOpenModal',{"version":jsVersion});
}


var hasHyperlinks = false;
var lastTimeTouchEnded = 0;
var lastPosition = null;
document.observe("touchstart", function(e) {
	if(e.changedTouches.length>1){
		return;
		
	}
	var currentTouchTime = new Date();
		var pageX = e.changedTouches[0].pageX;
		var pageY = e.changedTouches[0].pageY;
	if((currentTouchTime - lastTimeTouchEnded) < 400){
		if(Math.abs(pageY - lastPosition.pageY) < 30){
			Ti.App.fireEvent('tappedOnSlideD',{'cX':pageX,'cY':pageY,'animation':true});
		}
		e.preventDefault();
	}
	else{
		
			if(pageX<50){
					Ti.App.fireEvent('sendCLMPoint',{'pX':pageX,'pY':pageY});
					e.preventDefault();
			}
			lastPosition =  e.changedTouches[0];
			lastTimeTouchEnded = currentTouchTime;
	}
	
});
var isPitching = false;
var isTwoD = false;
var isPreventDefault = true;

var notesShown = false;

function showNotes(e) {
	
	try{
		if (notesShown) {
			$("notes").style.display='';
			notesShown = false;
		} else {
			$("notes").style.display='block';
			notesShown = true;
		}
		e.preventDefault();
	}
	catch(e){
	}
}
function closeNotes(e) {

	notesShown = false;
	$("notes").style.display='';
	e.preventDefault();
}
function loadMolecule(filename,title,fileID){
	var folders = filename.split("/");
	if(folders.length!=0){

		Ti.App.fireEvent('loadMolecule',{'model':folders[1],'folder':folders[0],'title':title,'fileID':fileID});
	}
	else{
		Ti.App.fireEvent('loadMolecule',{'model':filename,'title':title,'fileID':fileID});

	}
}
function gotoLastStage(){
	gShowController.jumpToScene((finalScene), false);

	manageBullets((finalScene - initialScene-1), (finalScene - initialScene-1));
	gShowController.nextSceneIndex = -1;
	
}