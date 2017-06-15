define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color","esri/layers/GraphicsLayer","esri/renderers/SimpleRenderer",'dojo/_base/lang'
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color, GraphicsLayer, SimpleRenderer,lang) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				//info accord
				$( function() {
					$( "#" + t.id + "infoAccord" ).accordion({heightStyle: "fill"});
					$( '#' + t.id + 'infoAccord > div' ).addClass("accord-body");
					$( '#' + t.id + 'infoAccord > h3' ).addClass("accord-header"); 
				});
				// main accord
				$( function() {		
					$( "#" + t.id + "mainAccord" ).accordion({heightStyle: "fill"});
					$( '#' + t.id + 'mainAccord > div' ).addClass("accord-body");
					$( '#' + t.id + 'mainAccord > h3' ).addClass("accord-header");
				});
				// update accordians on window resize
				var doit;
				$(window).resize(function(){
					clearTimeout(doit);
					doit = setTimeout(function() {
						t.clicks.updateAccord(t);
					}, 100);
				});	
				// leave help button
				$('#' + t.id + 'getHelpBtn').on('click', function(c){
					$('#' + t.id + ' .wfa-wrap').show()
					$('#' + t.id + ' .wfa-help').hide()
				})
				// info icon clicks
				$('#' + t.id + ' .infoIcon').on('click',function(c){
					t.showHelp();
					var ben = c.target.id.split("-").pop();
					$('#' + t.id + 'getHelpBtn').html('Back to wfa Floodplain Explorer');
					t.clicks.updateAccord(t);	
					$('#' + t.id + 'infoAccord .' + ben).trigger('click');
				});
				// suppress help on startup click
				$('#' + t.id + '-shosu').on('click',function(c){
					if (c.clicked == true){
						t.app.suppressHelpOnStartup(true);
					}else{
						t.app.suppressHelpOnStartup(false);
					}
				})
				// tab button listener
				$( "#" + t.id + "tabBtns input").on('click',function(c){
					t.obj.active = c.target.value;
					$.each($("#" + t.id + " .wfa-sections"),function(i,v){
						if (v.id != t.id + t.obj.active){
							$("#"+ v.id).slideUp();
						}else{
							$("#"+ v.id).slideDown();
						}
					});
					if(t.obj.active == 'wfa-showInfo' || t.obj.active == 'wfa-downloadData'){
						$("#"+ t.id + 'wfa-mainContentWrap').slideUp();
					}
				});
// Checkboxes for radio buttons ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// Set selected value text for button clicks
				$( '#' + t.id + 'wfa-findEvalSiteToggle input' ).click(function(c){
					if (c.currentTarget.value == 'find'){
						$( '#' + t.id + 'wfa-eval_WetlandWrap').slideUp()
						$( '#' + t.id + 'wfa-find_WetlandWrap').slideDown()

					}else{
						$( '#' + t.id + 'wfa-eval_WetlandWrap').slideDown()
						$( '#' + t.id + 'wfa-find_WetlandWrap').slideUp()
					}
				});
// Radio button clicks //////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('.wfa-radio-indent input').on('click',function(c, x){
					t.obj.funcTracker = c.target.value.split("-")[0];
					// change the function site services text when radio buttons are clicked.
					$( '#' + t.id + 'siteServices_span').html('(Currently selected: ' + c.target.value + ')');
					t.clicks.controlVizLayers(t, t.obj.maskWhere);
				});
// wildlife checkbox show and hide ///////////////////////////////////////////////////////////////////////////////////////////////////
				// wildlife checkboxes /////////////
				$('#' + t.id + 'wildlifeCheck input').on('click',function(c, x){
					let isChecked = c.currentTarget.checked;
					if(isChecked){
						console.log('is checked')
						//t.map.addLayer(t.dynamicLayer2);
						$('#' + t.id + 'wildlifeRadioButtons').slideDown();
						t.obj.wildlifeCheck = 'wildlife'
						t.clicks.controlVizLayers(t, t.obj.maskWhere);
					}else{
						console.log('not checked')
						// t.map.removeLayer(t.dynamicLayer2);
						$('#' + t.id + 'wildlifeRadioButtons').slideUp();
						t.obj.wildlifeCheck = 'null'
						t.obj.visibleLayers2 = []; // empty list of rasters
						t.clicks.controlVizLayers(t, t.obj.maskWhere);
					}
					
				});
				// wildlife radio buttons /////////////////
				$("#" + t.id + 'wildlifeRadioButtons input').on('click',function(c, x){
					t.obj.wildTracker = c.target.value.split("-")[0];
					t.clicks.controlVizLayers(t, t.obj.maskWhere);
				});
			},
// Function for clicks on map and zooming /////////////////////////////////////////////////////////////////////////////////////////////
			featureLayerListeners: function(t){
				// set initial array vars, these will be populated later. 
				t.hucExps = ['','','',''];
				t.hucExtents = [t.obj.dynamicLyrExt,'','','', ''];
				t.maskExps = ['OBJECTID < 0','','',''];
				t.layerDefinitions = [];	
				// set the def query for the huc mask /////////////////////	
				t.layerDefinitions[0] =  "WHUC6 < 0";
				//t.maskWhere = "OBJECTID < 0";
				t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				t.obj.currentHuc = 'WHUC4' 
				t.where = "OBJECTID > 0";
				t.clicks.hoverGraphic(t,1,t.where)
				t.open = 'yes';
				// handle map clicks
				t.map.setMapCursor("pointer")
				// t.map.trigger('click');
				t.map.on('click',function(c){
					if (t.open == "yes"){
						// map click point ////////////////////////////////////////
						t.pnt = c.mapPoint;
						// i think the object below might be the right format for a map point click
						// t.pnt= {type:'point', x:-9811591.693385411 ,y: 5364399.610102563, 
						// spatialReference: {latestWkid:3857, wkid:102100}}
						// mask query //////////////////
						t.mq = new Query();
						t.maskQ = new QueryTask(t.url + "/" + 0);
						t.mq.geometry = t.pnt;
						t.mq.returnGeometry = true;
						t.mq.outFields = ["*"];
						t.mq.where = t.obj.maskWhere
						// execute mask function
						t.maskQ.execute(t.mq, function(evt){
							if (evt.features.length > 0){
								t.maskClick = 'yes';
							}else{
								t.maskClick = 'no';
							}
						});
						// query for for the hucs /////////////////////////////////////						
						var q1 = new Query();
						var qt1 = new QueryTask(t.url + "/" + t.obj.visibleLayers[1]);
						q1.geometry = t.pnt;
						q1.returnGeometry = true;
						q1.outFields = ["*"];
						qt1.execute(q1, function(evt){
							if (evt.features.length > 0 && t.maskClick == 'no'){
								// retrieve huc attributes on map click to be used in the huc Attribute functions.
								t.hucAttributes = evt.features[0].attributes; 
								t.fExt = evt.features[0].geometry.getExtent().expand(1);
								if(t.obj.visibleLayers[1] == 1 ){
									t.obj.selHuc = 17;
									t.obj.currentHuc = 'WHUC6' 
									t.hucVal  = evt.features[0].attributes.WHUC6
									t.obj.visibleLayers = [0,2,t.obj.selHuc]
								}else if(t.obj.visibleLayers[2] > 4 && t.obj.visibleLayers[2] < 26){
									t.obj.currentWet = 'wetland' // this is a wetland click
								}else if(t.obj.visibleLayers[1] == 2 ){
									t.obj.selHuc = 18;
									t.obj.currentHuc = 'WHUC8' 
									t.hucVal  = evt.features[0].attributes.WHUC8
									t.obj.visibleLayers = [0,3,t.obj.selHuc]
								}else if(t.obj.visibleLayers[1] == 3 ){
									t.obj.selHuc = 19;
									t.obj.currentHuc = 'WHUC10'
									t.hucVal  = evt.features[0].attributes.WHUC10
									t.obj.visibleLayers = [0,4,t.obj.selHuc]
								}else if(t.obj.visibleLayers[1] == 4 ){
									t.huc12Ext = evt.features[0].geometry.getExtent().expand(1);
									t.obj.selHuc = 19;
									t.obj.currentHuc = 'WHUC12';
									// t.obj.currentWet = 'wetland'
									t.hucVal  = evt.features[0].attributes.WHUC12
									t.obj.visibleLayers = [0,4,6,16]
								}
								// set the def query for the huc mask /////////////////////	
								if(t.obj.currentHuc != 'WHUC12'){
									t.where = t.obj.currentHuc + " = '" + t.hucVal + "'";
								}else{
									t.where = t.obj.currentHuc + " = '" + 9999 + "'";
								}				
								t.obj.maskWhere = t.obj.currentHuc + " <> '" + t.hucVal + "'";
								// add the expression and extents in the approriate location in the huc expression tracker array. 
								var name = evt.features[0].attributes.name;
								// change the extent if current wet does not = wetland
								if(t.obj.currentWet != 'wetland'){
									t.map.setExtent(t.fExt, true); // only change the extent if the wetlands are not displayed
								}
								if(t.obj.currentHuc != 'WHUC12'){
									t.hucExps[(t.obj.visibleLayers[1]-1)] = t.where;
									t.maskExps[(t.obj.visibleLayers[1]-1)] = t.obj.maskWhere;
									t.hucExtents[(t.obj.visibleLayers[1]-1)] = t.fExt;
									if(t.obj.currentHuc == "WHUC6"){
										$('#' + t.id + t.obj.currentHuc + '-selText').parent().prev().children().slideDown();
										$('#' + t.id + 'mainFuncWrapper').slideDown();
										$('#' + t.id + 'hucSelWrap').slideDown();
										$('#' + t.id + 'wfa-findASite').slideUp();
									}else{
										// only slide down if its beyond the huc 6 level
										$('#' + t.id + 'mainAttributeWrap').slideDown();
									}
									// slide down the huc selected text area and populate
									$('#' + t.id + t.obj.currentHuc + '-selText').parent().children().slideDown();
									$('#' + t.id + t.obj.currentHuc + '-selText').parent().find('span').last().html(name);
								}else{
									// slide up the huc selected text area and populate
									$('#' + t.id + t.obj.currentHuc + '-selText').parent().prev().children().slideDown();
									$('#' + t.id + t.obj.currentHuc + '-selText').parent().find('span').last().html(name);
									$('#' + t.id + t.obj.currentHuc + '-selText').slideDown();
								}
								
// Call the functions at the end of map click /////////////////////////////////////////////////////////////////
								// call the hover graphic function ////////////////////////////
								t.clicks.hoverGraphic(t, t.obj.visibleLayers[1], t.where)
								// call the wetland click function ////////////////////////////
								t.clicks.wetlandClick(t);
								// call the huc attribute controller function
								t.clicks.hucClick(t);
								// // call the radio attribute controller function
								// t.clicks.radioAttDisplay(t);
								// // call the control viz layers function ////////////////////////////////////
								// t.clicks.controlVizLayers(t,t.obj.maskWhere);

							}
						})
						
					}
				});
				
// zoom buttons click //////////////////////////////////////////////////////////////////////////////////////////
				$('.wfa-hucZoom').unbind().on('click',function(c){
					var id = c.currentTarget.id.split('-')[1];
					t.obj.wetlandWhere = "OBJECTID < 0" // reset wetland where tracker
					// reset viz layers on zoom click 
					if(id == 0){
						$('#' + t.id +'fullExt-selText').slideUp();
						$('#' + t.id + 'mainFuncWrapper').slideUp();
						$('#' + t.id + 'hucSelWrap').slideUp('400', function(){
							t.clicks.hoverGraphic(t,1,t.where)
						});
						$('#' + t.id + 'wfa-findASite').slideDown();
						t.obj.currentHuc = 'WHUC4'
						t.obj.visibleLayers = [0,1]
						// slide up attribute wrapper when any zoom button is clicked.
						$('#' + t.id + 'mainAttributeWrap').slideUp();
					}else if (id == 1){
						t.obj.currentHuc = 'WHUC6'
						t.obj.visibleLayers = [0,2,30]
					}else if(id == 2){
						t.obj.currentHuc = 'WHUC8'
						t.obj.visibleLayers = [0,3,31]
					}else if(id == 3){
						t.obj.currentHuc = 'WHUC10'
						t.obj.visibleLayers = [0,4,32]
					}
					// reset maskwhere tracker
					t.obj.maskWhere = t.maskExps[id]
					// set map extent on back button click
					// below code is for if the user clicks on the full extent zoom //////////////////////////
					if(id<1){
						t.obj.currentWet = 'null'; // reset this tracker
						t.map.setExtent(t.obj.dynamicLyrExt, true);
						t.where = "OBJECTID > 0";
						// control viz function
						t.clicks.controlVizLayers(t,t.obj.maskWhere);
						//t.clicks.hoverGraphic(t,1,t.where)
					// below code is for if the user clicks on the huc 12 zoom //////////////////////////////
					}else if(id == 4){ // set extent back to huc 12 when the go to button is clicked
						t.obj.currentWet = 'null'; // reset this tracker
						t.map.setExtent(t.huc12Ext, true); // zoom back to huc 12
						t.obj.maskWhere = "WHUC12 <> '" + t.hucVal + "'";
					// below code is for if the user clicks on the huc 6, 8 , 10 zoom /////////////////////////
					}else{
						t.obj.currentWet = 'null'; // reset this tracker
						t.map.setExtent(t.hucExtents[id], true);
						// set huc exp on back button click
						t.clicks.hoverGraphic(t,t.obj.visibleLayers[1], t.hucExps[id]);
						// control viz function
						t.clicks.controlVizLayers(t,t.obj.maskWhere);
					}
					
					// call the radio attribute controller function
					t.clicks.radioAttDisplay(t);
					// Loop through all zoom buttons below the button clicked, slide up. //////////////////////////////
					console.log(c.currentTarget.id);
					$.each($('#' + c.currentTarget.id).nextAll().children(),function(i,v){
						$('#' + v.id).slideUp();
					});
				});

			},
// Radio/attribute display function //////////////////////////////////////////////////////////////////////////////////////
			radioAttDisplay: function(t){
				if (t.obj.currentWet != 'wetland'){
					t.radAttVal = 'wet' // value should be what you want to slide up
				}else{
					t.radAttVal = 'huc' // value should be what you want to slide up
				}
				// attribute control //////////////////////////////
				var attributes = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.wfa-sum-wrap');
				$.each(attributes,function(i,v){
					
					// if(t.obj.currentHuc == 'WHUC12'){
					// 	t.radAttVal = 'wet'
					// }
					// console
					if(t.obj.wetlandClick == 'yes'){
						console.log('yes wetland click')
						t.radAttVal = 'huc';
					}else{
						t.radAttVal = 'wet';
					}
					console.log(t.radAttVal, t.obj.currentWet, t.obj.currentHuc, 'look here //////////////');
					if($(v).data().wfaMode == t.radAttVal){
						$(v).slideUp();
					}else{
						$(v).slideDown();
					}
				});
				// radio buttons controls //////////////////////////////
				var radioBtns = $('#' + t.id + 'funcWrapper').find('label');
				$.each(radioBtns,function(i,v){
					if(t.obj.currentHuc == 'WHUC12'){
						t.radAttVal = 'huc'
					}
					// console.log(t.radAttVal);
					// console.log(t.obj.currentWet);
					if($(v).data().wfaMode == t.radAttVal){
						$(v).slideUp();
					}else{
						$(v).slideDown();
					}
				});
				
			},
// Huc click function //////////////////////////////////////////////////////////////////////////////////////////////////////
			hucClick: function(t){
				// console.log(t.hucAttributes);
				let attributes = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.elm-title');
				// var title = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.elm-title');
				let htmlVal;
				// let huc8Colors  = ['rgba(112,168,0,${t.obj.opacityVal})','rgb(170,204,102)', 'rgb(240,240,240)'];
				let huc8Colors  = ['rgb(112,168,0)','rgb(170,204,102)', 'rgb(240,240,240)'];
				let huc10Colors  = ['rgb(196,10,10)','rgb(224,132,101)', 'rgb(255,235,214)'];
				let huc12Colors  = ['rgb(0,57,148)','rgb(85,108,201)', 'rgb(214,214,255)'];
				$.each(attributes, function(i,v){
					let attVal = t.hucAttributes[$(v).data('wfa')];
					if(attVal == 1){
						htmlVal = 'Most'
					}else if(attVal == 2){
						htmlVal = 'Moderate'
					}else if(attVal == 3){
						htmlVal = 'Least'
					}
					let spanElem = $(v).next().find('.s2Atts').html(htmlVal);
					if(t.obj.currentHuc == 'WHUC8'){
						$(v).parent().find('.wfa-attributePatch').css('background-color', huc8Colors[(attVal-1)])
					}else if(t.obj.currentHuc == 'WHUC10'){
						$(v).parent().find('.wfa-attributePatch').css('background-color', huc10Colors[(attVal-1)])
					}else if(t.obj.currentHuc == 'WHUC12'){
						$(v).parent().find('.wfa-attributePatch').css('background-color', huc12Colors[(attVal-1)])
					}
				});

			},
// Wetland click function /////////////////////////////////////////////////////////////////////////////////////////////////
			wetlandClick: function(t){
				// wetland query 
				var wq = new Query();
				var wetQ = new QueryTask(t.url + "/" + 48);
				wq.geometry = t.pnt;
				wq.returnGeometry = true;
				wq.outFields = ["*"];
				wq.where = "OBJECTID > 0"
				wetQ.execute(wq, function(evt){
					if (evt.features.length > 0 && t.obj.currentWet == 'wetland'){
						t.obj.wetlandClick = 'yes'
						var curColors  = ['#F0F0F0', '#BFD690','#AACC66', '#70A800'];
						var potColors = ['#FFEBD6', '#EBA988', '#D65D45', '#C40A0A'];
						// $("[data-wfa=FA_RANK]").css("color", "red");
						var atts = evt.features[0].attributes;
						// $('#' + t.id + 'mainAttributeWrap').slideDown();
						// update the attribute colors for wetlands
						var title = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.elm-title');
						var htmlVal;
						$.each(title, function(i,v){
							let attVal = atts[$(v).data('wfa')];
							if(attVal == 0){
								htmlVal = 'N/A'
							}else if(attVal == 1){
								htmlVal = 'Low'
							}else if(attVal == 2){
								htmlVal = 'Medium'
							}else if(attVal == 3){
								htmlVal = 'High'
							}
							let spanElem = $(v).next().find('.s2Atts').html(htmlVal);
							if(atts.WETLAND_TYPE == 'WWI'){
								$(v).parent().find('.wfa-attributePatch').css('background-color', curColors[attVal])
							}else{
								$(v).parent().find('.wfa-attributePatch').css('background-color', potColors[attVal])
							}
						});
						// set the wetland where clause
						t.wetlandID = atts.OBJECTID;
						t.obj.wetlandWhere = "OBJECTID = " + t.wetlandID;
					}else{
						//$('#' + t.id + 'mainAttributeWrap').slideUp();
						t.obj.wetlandClick = 'no'
					}
					// call the control viz layers function ////////////////////////////////////
					t.clicks.controlVizLayers(t,t.obj.maskWhere);
					// call the radio attribute controller function
					t.clicks.radioAttDisplay(t);
				});
			},
// control visible layers function /////////////////////////////////////////////////////////////////////////////
			controlVizLayers :function(t, maskWhere){
				if (t.obj.currentHuc != 'WHUC4') {
					// manipulate string to the proper format, use the same tracker as for the queries but add 2 unless it is a huc 12
					var curHucNum = t.obj.currentHuc.slice(-1);
					var curHucNum2 = t.obj.currentHuc.slice(0,-1);
					if(t.obj.currentHuc != 'WHUC12'){
						var curHucNum3 = parseInt(curHucNum)  + 2;
					}else{
						var curHucNum3 = parseInt(curHucNum)
					}
					var newHuc = curHucNum2 + curHucNum3;
					newHuc =  newHuc.substring(1);

					var lyrName  = newHuc + ' - ' + t.obj.funcTracker;
					var curWetLyrName = 'Current Wetlands - ' + t.obj.funcTracker;
					var potWetLyrName = 'Potentially Restorable Wetlands - ' + t.obj.funcTracker;
					var wetlandSelected = 'Wetlands - Selected'

					// loop through layers array and see if any layer name matches 
					$.each($(t.layersArray),function(i,v){
						if(lyrName == v.name){
							t.obj.visibleLayers.pop();
							t.obj.visibleLayers.push(v.id);
							if(t.obj.currentHuc == "WHUC12"){
								$.each($(t.layersArray),function(i,v){
									if(curWetLyrName == v.name){
										console.log('found a match')
										t.obj.visibleLayers.pop()
										t.obj.visibleLayers.pop()
										t.obj.visibleLayers.push(v.id)
									}
									if(potWetLyrName == v.name){
										t.obj.visibleLayers.push(v.id)
									}
								});
							}
						}
						// handle adding the wetland layers and the wetland selected layer.
						if(t.obj.currentHuc == "WHUC12"){
							// remove wetland layers and wetland selected layers before readding them
							var numArray = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
							$.each(numArray, function(i,v){
								var index = t.obj.visibleLayers.indexOf(v)
								if(index > -1){
									t.obj.visibleLayers.splice(index,1)
								}
							});
							$.each($(t.layersArray),function(i,v){
								if(curWetLyrName == v.name){
									t.obj.visibleLayers.push(v.id)
								}
								if(potWetLyrName == v.name){
									t.obj.visibleLayers.push(v.id)
								}
								// add the wetland selected layer
								if(t.obj.wetlandWhere != "OBJECTID < 0"){
									if(wetlandSelected == v.name) {
										t.obj.visibleLayers.push(v.id)
									}
								}
							});
						}
					});
				}
				// set layer defs and update the mask layer /////////////////////
				t.layerDefinitions = [];
				t.layerDefinitions[0] =  maskWhere
				t.layerDefinitions[5] = t.obj.wetlandWhere
				t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				// remove the wetland selected layer if not clicked ////////////////////////
				if(t.obj.wetlandClick != 'yes'){
					var index = t.obj.visibleLayers.indexOf(5)
					if(index > -1){
						t.obj.visibleLayers.splice(index,1)
					}
				}
				// update the visible layers  ///////////////////////////
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				
// show hide the raster wildlife layers if checkbox toggled on THIS IS IN VIZ LAYERS FUNCTION ///////////////////////////////////////////////////////////////////
				if (t.obj.wildlifeCheck == 'wildlife'){
					if(t.obj.visibleLayers2.length > 0){
						t.obj.visibleLayers2.pop();
						$.each($(t.layersArray),function(i,v){
							if(t.obj.wildTracker == v.name){
								t.obj.visibleLayers2.push(v.id);
							}
						});
					}else{
						$.each($(t.layersArray),function(i,v){
							if(t.obj.wildTracker == v.name){
								t.obj.visibleLayers2.push(v.id);
							}
						});
					}
				}
				t.dynamicLayer2.setVisibleLayers(t.obj.visibleLayers2);
				// re add layers to control draw order.
				t.map.addLayer(t.dynamicLayer2);
				t.map.addLayer(t.dynamicLayer);
			},
			
// control hover on HUCs ////////////////////////////////////////////////////////////////////////////////////////////////
			hoverGraphic: function(t, lyrNum, where){
				// the try catch statement below is used to remove the graphic layer. 
				try {
				    t.map.removeLayer(t.countiesGraphicsLayer);
				}
				catch(err) {
				    console.log('there is no layer to remove on the first iteration')
				}
				console.log(where, 'where')
// graphics layer hover code below ////////////////////////////////////////////////////////////////////////////////////////////////
				//and add it to the maps graphics layer
				var graphicQuery = new QueryTask(t.url + "/" + lyrNum);
				var gQ = new Query();
				gQ.returnGeometry = true;
				gQ.outFields = ["OBJECTID","WHUC6", "name"];
				gQ.where =  where;
				graphicQuery.execute(gQ, function(evt){
					t.map.graphics.clear();
		            var highlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
		                  new Color([0, 0, 255]), 1), new Color([125, 125, 125, 0.1]));

		            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
		                  new Color([255, 255, 255, 0]), 1), new Color([125, 125, 125, 0]));
		            var features = evt.features;
		            t.countiesGraphicsLayer = new GraphicsLayer();
		            //QueryTask returns a featureSet.
		            //Loop through features in the featureSet and add them to the map.
		            var featureCount = features.length;
		            for (var i = 0; i < featureCount; i++) {
		                //Get the current feature from the featureSet.
		                var graphic = features[i]; //Feature is a graphic
		                graphic.setSymbol(symbol);
		                t.countiesGraphicsLayer.add(graphic);
		            }
		            t.map.addLayer(t.countiesGraphicsLayer);
      				t.map.graphics.enableMouseEvents();
      				t.countiesGraphicsLayer.on("mouse-over",function (event) {
		                t.map.graphics.clear();  //use the maps graphics layer as the highlight layer
		                var highlightGraphic = new Graphic(event.graphic.geometry, highlightSymbol);
                		t.map.graphics.add(highlightGraphic);
                		$('#' + t.basinId).html(event.graphic.attributes.name);
						$('#' + t.basinId).show();
		            });
		            //listen for when map.graphics mouse-out event is fired
		            //and then clear the highlight graphic
		            t.map.graphics.on("mouse-out", function () {
		                t.map.graphics.clear();
						$('#' + t.basinId).hide()
		            });
				});
			},
// Make vars //////////////////////////////////////////////////////////////////////////////////////////////////
			makeVariables: function(t){
				t.NatNotProt = "";
				t.RowAgNotProt = "";
				t.RowAgProt = "";
				t.DevProt = "";
				t.FRStruct_TotLoss = "";
				t.AGLoss_7 = "";
				t.NDelRet = "";
				t.Denitrification = "";
				t.Reconnection = "";
				t.BF_Existing = "";
				t.BF_Priority = "";
				t.SDM = "";
			},
			updateAccord: function(t){
				var ia = $( "#" + t.id + "infoAccord" ).accordion( "option", "active" );
				$( "#" + t.id +  "infoAccord" ).accordion('destroy');	
				$( "#" + t.id + "infoAccord" ).accordion({heightStyle: "fill"});	
				$( "#" + t.id + "infoAccord" ).accordion( "option", "active", ia );		

				var ma = $( "#" + t.id + "mainAccord" ).accordion( "option", "active" );
				$( "#" + t.id +  "mainAccord" ).accordion('destroy');	
				$( "#" + t.id + "mainAccord" ).accordion({heightStyle: "fill"});	
				$( "#" + t.id + "mainAccord" ).accordion( "option", "active", ma );				
			},
			commaSeparateNumber: function(val){
				while (/(\d+)(\d{3})/.test(val.toString())){
					val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
				return val;
			},
			abbreviateNumber: function(num) {
			    if (num >= 1000000000) {
			        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
			     }
			     if (num >= 1000000) {
			        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
			     }
			     if (num >= 1000) {
			        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
			     }
			     return num;
			}
        });
    }
);
