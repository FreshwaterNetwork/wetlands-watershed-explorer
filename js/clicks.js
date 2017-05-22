define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color","esri/layers/GraphicsLayer"
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color, GraphicsLayer) {
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
							console.log(v.id)
						}else{
							console.log(v.id)
							$("#"+ v.id).slideDown();
						}
					});
					if(t.obj.active == 'wfa-showInfo' || t.obj.active == 'wfa-downloadData'){
						$("#"+ t.id + 'wfa-mainContentWrap').slideUp();
						console.log('look here')
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
				$('.wfa-radio-indent input').on('click',function(c){
					t.obj.funcTracker = c.target.value.split("-")[0];
					t.clicks.controlVizLayers(t, t.obj.maskWhere);
				});
			},
			
// Function for clicks on map and zooming /////////////////////////////////////////////////////////////////////////////////////////////
			featureLayerListeners: function(t){
				// set initial array vars, these will be populated later. 
				t.hucExps = ['','','',''];
				t.hucExtents = [t.obj.dynamicLyrExt,'','',''];
				t.maskExps = ['OBJECTID < 0','','',''];
				t.layerDefinitions = [];	
				// set the def query for the huc mask /////////////////////	
				t.layerDefinitions[0] =  "WHUC6 < 0";
				//t.maskWhere = "OBJECTID < 0";
				t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				t.currentHuc = 'WHUC4' 
				t.where = "OBJECTID > 0";
				t.clicks.hoverGraphic(t,1,t.where)
				t.open = 'yes';
				// handle map clicks
				t.map.setMapCursor("pointer")
				
				t.map.on('click',function(c){
					if (t.open == "yes"){
						var pnt = c.mapPoint;
						t.mq = new Query();
						t.maskQ = new QueryTask(t.url + "/" + 0);
						t.mq.geometry = pnt;
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
						// Only trigger wetland query when in the huc 12 current huc 8dh
						if(t.currentHuc == 'WHUC12'){
							// wetland query 
							var wq = new Query();
							var wetQ = new QueryTask(t.url + "/" + 35);
							wq.geometry = pnt;
							wq.returnGeometry = true;
							wq.outFields = ["*"];
							wq.where = "OBJECTID > 0"
							wetQ.execute(wq, function(evt){
								if (evt.features.length > 0){
									var curColors  = ['#F0F0F0', '#BFD690','#AACC66', '#70A800'];
									var potColors = ['blue', 'green', 'red', 'purple'];
									// $("[data-wfa=FA_RANK]").css("color", "red");
									var atts = evt.features[0].attributes;
									console.log(atts)
									$('#' + t.id + 'mainAttributeWrap').slideDown();
									var title = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.elm-title');
									$.each(title, function(i,v){
										let attVal = atts[$(v).data('wfa')];
										let spanElem = $(v).next().find('.s2Atts').html(attVal);
										if(atts.WETLAND_TYPE == 'WWI'){
											$(v).parent().css('background-color', curColors[attVal])
										}else{
											console.log('pot colors')
											$(v).parent().css('background-color', potColors[attVal])
										}
									});

								}else{
									$('#' + t.id + 'mainAttributeWrap').slideUp();
								}
							});
							// potential wetland query 
							var pwq = new Query();
							var pwetQ = new QueryTask(t.url + "/" + 9);
							pwq.geometry = pnt;
							pwq.returnGeometry = true;
							pwq.outFields = ["*"];
							pwq.where = "OBJECTID > 0"
							pwetQ.execute(pwq, function(evt){
								if (evt.features.length > 0){
									// var curColors  = ['#F0F0F0', '#BFD690','#AACC66', '#70A800'];
									var potColors = ['blue', 'green', 'red', 'purple'];
									// $("[data-wfa=FA_RANK]").css("color", "red");
									var atts = evt.features[0].attributes;
									console.log(atts)
									$('#' + t.id + 'mainAttributeWrap').slideDown();
									var title = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.elm-title');
									$.each(title, function(i,v){
										let attVal = atts[$(v).data('wfa')];
										let spanElem = $(v).next().find('.s2Atts').html(attVal);
										$(v).parent().css('background-color', potColors[attVal])
									});
								}else{
									//$('#' + t.id + 'mainAttributeWrap').slideUp();
								}
							});
						}
						
						
						var q1 = new Query();
						var qt1 = new QueryTask(t.url + "/" + t.obj.visibleLayers[1]);
						q1.geometry = pnt;
						q1.returnGeometry = true;
						q1.outFields = ["*"];
						qt1.execute(q1, function(evt){
							if (evt.features.length > 0 && t.maskClick == 'no'){
								t.fExt = evt.features[0].geometry.getExtent().expand(1);
								t.map.setExtent(t.fExt, true);
								if(t.obj.visibleLayers[1] == 1 ){
									t.where = 
									t.obj.selHuc = 17;
									t.currentHuc = 'WHUC6' 
									t.hucVal  = evt.features[0].attributes.WHUC6
									t.obj.visibleLayers = [0,2,t.obj.selHuc]
								}else if(t.obj.visibleLayers[2] > 4 && t.obj.visibleLayers[2] < 13){
									t.currentHuc == 'wetland' // this is a wetland click
								}else if(t.obj.visibleLayers[1] == 2 ){
									t.obj.selHuc = 18;
									t.currentHuc = 'WHUC8' 
									t.hucVal  = evt.features[0].attributes.WHUC8
									t.obj.visibleLayers = [0,3,t.obj.selHuc]
								}else if(t.obj.visibleLayers[1] == 3 ){
									t.obj.selHuc = 19;
									t.currentHuc = 'WHUC10'
									t.hucVal  = evt.features[0].attributes.WHUC10
									t.obj.visibleLayers = [0,4,t.obj.selHuc]
								}else if(t.obj.visibleLayers[1] == 4 ){
									t.obj.selHuc = 19;
									t.currentHuc = 'WHUC12'
									t.hucVal  = evt.features[0].attributes.WHUC12
									t.obj.visibleLayers = [0,4,5,9]
								}
								// set the def query for the huc mask /////////////////////	
								if(t.currentHuc != 'WHUC12'){
									t.where = t.currentHuc + " = '" + t.hucVal + "'";
								}else{
									t.where = t.currentHuc + " = '" + 9999 + "'";
								}				
								t.obj.maskWhere = t.currentHuc + " <> '" + t.hucVal + "'";

								// add the expression and extents in the approriate location in the huc expression tracker array. 
								var name = evt.features[0].attributes.name;
								if(t.currentHuc != 'WHUC12'){
									t.hucExps[(t.obj.visibleLayers[1]-1)] = t.where;
									t.maskExps[(t.obj.visibleLayers[1]-1)] = t.obj.maskWhere;
									t.hucExtents[(t.obj.visibleLayers[1]-1)] = t.fExt;
									if(t.currentHuc == "WHUC6"){
										$('#' + t.id + t.currentHuc + '-selText').parent().prev().children().slideDown();
										$('#' + t.id + 'mainFuncWrapper').slideDown();
										$('#' + t.id + 'wfa-findASite').slideUp();

									}
									$('#' + t.id + t.currentHuc + '-selText').parent().children().slideDown();
									$('#' + t.id + t.currentHuc + '-selText').parent().find('span').first().html(name);
								}else{
									$('#' + t.id + t.currentHuc + '-selText').parent().prev().children().slideDown();
									$('#' + t.id + t.currentHuc + '-selText').parent().find('span').first().html(name);
									$('#' + t.id + t.currentHuc + '-selText').slideDown();
								}
								// call the hover graphic function ////////////////////////////
								t.clicks.hoverGraphic(t, t.obj.visibleLayers[1], t.where)
								// call the viz layers function ///////////////////////////////
								t.clicks.controlVizLayers(t,t.obj.maskWhere);
							}
						})
					}
					// var zoomBtns = $('#' + t.id + 'hucSelWrap').find('.wfa-hucZoom');
					$('.wfa-hucZoom').unbind().on('click',function(c){
						var id = c.currentTarget.id.split('-')[1];
						// reset viz layers on zoom click 
						if(id == 0){
							$('#' + t.id +'fullExt-selText').slideUp();
							$('#' + t.id + 'mainFuncWrapper').slideUp();
							$('#' + t.id + 'wfa-findASite').slideDown();
							t.currentHuc = 'WHUC4'
							t.where = "OBJECTID > 0";
							t.clicks.hoverGraphic(t,1,t.where)
							t.obj.visibleLayers = [0,1]
							

						}else if (id == 1){
							t.currentHuc = 'WHUC6'
							t.obj.visibleLayers = [0,2,11]
						}else if(id == 2){
							t.currentHuc = 'WHUC8'
							t.obj.visibleLayers = [0,3,12]
						}else if(id == 3){
							t.currentHuc = 'WHUC10'
							t.obj.visibleLayers = [0,4,13]
						}
						// set map extent on back button click
						if(id<1){
							t.map.setExtent(t.obj.dynamicLyrExt, true);
						}else{
							t.map.setExtent(t.hucExtents[id], true);
							// set huc exp on back button click
							t.clicks.hoverGraphic(t,t.obj.visibleLayers[1], t.hucExps[id]);
						}
						
						
						
						// reset maskwhere tracker
						t.obj.maskWhere = t.maskExps[id]
						// control viz function
						t.clicks.controlVizLayers(t,t.obj.maskWhere);
						// Loop through all zoom buttons below the button clicked, slide up. //////////////////////////////
						$.each($('#' + c.currentTarget.id).parent().parent().nextAll().children(),function(i,v){
							$('#' + v.id).slideUp();
						});
					});
				});
			},
			wetlandClick: function(t){

			},
// control visible layers function /////////////////////////////////////////////////////////////////////////////
			controlVizLayers :function(t, maskWhere){
				if (t.currentHuc != 'WHUC4') {
					// manipulate string to the proper format, use the same tracker as for the queries but add 2 unless it is a huc 12
					var curHucNum = t.currentHuc.slice(-1);
					var curHucNum2 = t.currentHuc.slice(0,-1);
					if(t.currentHuc != 'WHUC12'){
						var curHucNum3 = parseInt(curHucNum)  + 2;
					}else{
						var curHucNum3 = parseInt(curHucNum)
					}
					var newHuc = curHucNum2 + curHucNum3;
					newHuc =  newHuc.substring(1);
					var lyrName  = newHuc + ' - ' + t.obj.funcTracker;
					var curWetLyrName = 'Wetlands - Current - ' + t.obj.funcTracker;
					var potWetLyrName = 'Wetlands - Potential - ' + t.obj.funcTracker;
					// loop through layers array and see if any layer name matches 
					$.each($(t.layersArray),function(i,v){
						if(lyrName == v.name){
							var id = v.id
							t.obj.visibleLayers.pop();

							t.obj.visibleLayers.push(v.id)
							if(t.currentHuc == "WHUC12"){
								
								$.each($(t.layersArray),function(i,v){
									if(curWetLyrName == v.name){
										t.obj.visibleLayers.pop()
										t.obj.visibleLayers.pop()
										t.obj.visibleLayers.push(v.id)
									}
									if(potWetLyrName == v.name){
										t.obj.visibleLayers.push(v.id)
									}

								});
							}
							// handle wetland clicks
							if(t.currentHuc == "wetland"){
								$.each($(t.layersArray),function(i,v){
									if(curWetLyrName == v.name){
										t.obj.visibleLayers.pop()
										t.obj.visibleLayers.push(v.id)
									}
									if(potWetLyrName == v.name){
										t.obj.visibleLayers.push(v.id)
									}
								});
							}
						}
					});
				}
				// set layer defs and update the mask layer /////////////////////
				t.layerDefinitions = [];
				t.layerDefinitions[0] =  maskWhere
				t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				// update the visible layers ///////////////////////////
				console.log(t.obj.visibleLayers)
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
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
				//and add it to the maps graphics layer
				var graphicQuery = new QueryTask(t.url + "/" + lyrNum);
				var gQ = new Query();
				gQ.returnGeometry = true;
				gQ.outFields = ["OBJECTID","WHUC6", "name"];
				gQ.where =  where
				graphicQuery.execute(gQ, function(evt){

				});
				graphicQuery.on("complete", function(event){
					t.map.graphics.clear();
		            var highlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
		                  new Color([0, 0, 255]), 1), new Color([125, 125, 125, 0.1]));

		            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
		                  new Color([255, 255, 255, 0]), 1), new Color([125, 125, 125, 0]));
		            var features = event.featureSet.features;
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
