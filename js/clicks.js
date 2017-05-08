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
					console.log('tab btn click', c);
					t.obj.active = c.target.value;
					$.each($("#" + t.id + " .wfa-sections"),function(i,v){
						console.log(v.id);
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
					console.log(c, 'c');
					if (c.currentTarget.value == 'find'){
						console.log('valeu');
						$( '#' + t.id + 'wfa-eval_WetlandWrap').slideUp()
						$( '#' + t.id + 'wfa-find_WetlandWrap').slideDown()

					}else{
						$( '#' + t.id + 'wfa-eval_WetlandWrap').slideDown()
						$( '#' + t.id + 'wfa-find_WetlandWrap').slideUp()
						console.log('other')
					}
				});

				
// Radio button clicks //////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('.wfa-radio-indent input').on('click',function(c){
					var val = c.target.value.split("-")[0]
					$.each($(t.layersArray),function(i,v){
						// console.log(i,v,'i');
						var lyrName = v.name.split(' - ');
						var hucNum = lyrName[0]
						lyrName = lyrName.pop();
						t.obj.selHuc;
						if(val == lyrName && hucNum == 'HUC' + t.obj.selHuc){
							t.obj.visibleLayers.push(v.id);
							console.log(t.obj.visibleLayers)
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
					});
				})
			},
			
// Function for clicks on map and zooming /////////////////////////////////////////////////////////////////////////////////////////////
			featureLayerListeners: function(t){
				t.open = 'yes';
				// handle map clicks
				t.map.setMapCursor("pointer")
				t.map.on('click',function(c){
					if (t.open == "yes"){
						var pnt = c.mapPoint;
						var q1 = new Query();
						var qt1 = new QueryTask(t.url + "/" + t.obj.visibleLayers[1]);
						q1.geometry = pnt;
						q1.returnGeometry = true;
						q1.outFields = ["*"];
						qt1.execute(q1, function(evt){
							console.log(evt)
							if (evt.features.length > 0){
								var fExt = evt.features[0].geometry.getExtent().expand(1);
								t.map.setExtent(fExt, true);
								//t.huc10val = evt.features[0].attributes.WHUC10
								if(t.obj.visibleLayers[1] == 1 ){
									// t.obj.selHuc = 11;
									t.currentHuc = 'WHUC6' 
									t.hucVal  = evt.features[0].attributes.WHUC6
									t.obj.visibleLayers = [0,2,t.obj.selHuc]

								}else if(t.obj.visibleLayers[1] == 2 ){
									t.obj.selHuc = 12;
									t.currentHuc = 'WHUC8' 
									t.hucVal  = evt.features[0].attributes.WHUC8
									t.obj.visibleLayers = [0,3,t.obj.selHuc]

								}else if(t.obj.visibleLayers[1] == 3 ){
									t.obj.selHuc = 13;
									t.currentHuc = 'WHUC10'
									t.hucVal  = evt.features[0].attributes.WHUC10
									t.obj.visibleLayers = [0,4,t.obj.selHuc]
								}else if(t.obj.visibleLayers[1] == 4 ){
									t.obj.selHuc = 13;
									t.currentHuc = 'WHUC12'
									t.hucVal  = evt.features[0].attributes.WHUC12
									t.obj.visibleLayers = [0,4,5,6,t.obj.selHuc]
								}
								t.layerDefinitions = [];	
								// set the def query for the huc mask /////////////////////	
								t.layerDefinitions[0] =  t.currentHuc + " <> '" + t.hucVal + "'";
								t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
								t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							}
						})	

					}
				});
// control hover on HUCs ////////////////////////////////////////////////////////////////////////////////////////////////
				//and add it to the maps graphics layer
				var graphicQuery = new QueryTask(t.url + "/" + 1);
				var gQ = new Query();
				//gQ.geometry = pnt;
				gQ.returnGeometry = true;
				gQ.outFields = ["WHUC6", "name"];
				gQ.where = "OBJECTID > 0"
				// gQ.outSpatialReference = { "wkid": 102100 };
				graphicQuery.execute(gQ, function(evt){
					console.log(evt)
					
				});
				graphicQuery.on("complete", function(event){
					console.log('new query', event)
					t.map.graphics.clear();
		            var highlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
		                  new Color([0, 0, 255]), 1), new Color([125, 125, 125, 0.1]));

		            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
		                  new Color([255, 255, 255, 0]), 1), new Color([125, 125, 125, 0]));
		            var features = event.featureSet.features;
		            console.log(features)
		            t.countiesGraphicsLayer = new GraphicsLayer();
		            console.log(t.countiesGraphicsLayer, 'graph layer')
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
      					console.log('mouse over')
		            	console.log(event.graphic.attributes);
		                t.map.graphics.clear();  //use the maps graphics layer as the highlight layer
		                var highlightGraphic = new Graphic(event.graphic.geometry, highlightSymbol);
                		t.map.graphics.add(highlightGraphic);
		            });
		            //listen for when map.graphics mouse-out event is fired
		            //and then clear the highlight graphic
		            t.map.graphics.on("mouse-out", function () {
		            	console.log('mouse out')
		                t.map.graphics.clear();
		            });
				});
			}, 
			// Layer deff functions //////////////////////////////////////////////////////////////////////////////////////////////
			layerDefs: function(t){ 

				// if(t.obj.hucClickTracker == 'huc6'){
				// 	t.layerDefinitions = [];		
				// 	t.layerDefinitions[0] = "WHUC6 <> '" + t.huc6val + "'";
				// 	t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				// 	t.obj.visibleLayers = [0,2,4];
				// }else if(t.obj.hucClickTracker == 'huc8'){
				// 	t.layerDefinitions = [];		
				// 	t.layerDefinitions[0] = "WHUC8 <> '" + t.huc8val + "'";
				// 	t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				// 	t.obj.visibleLayers = [0,3,5];
				// }else if(t.obj.hucClickTracker == 'huc10'){
				// 	t.layerDefinitions = [];		
				// 	t.layerDefinitions[0] = "WHUC10 <> '" + t.huc10val + "'";
				// 	t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				// 	t.obj.visibleLayers = [0,6];
				// }
				// t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
			},
				// Create a feature layer of future parcels selected by PIN
				// t.hiddenSym = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
				// 	SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255,0]), 0 ), new Color([255,255,255,0])
				// );
				// // t.fManyPinFL = new FeatureLayer(t.url + "/1" , { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// // t.hucMask = new FeatureLayer(t.url + "/0", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });

				// // t.huc6Feat = new FeatureLayer(t.url + "/1", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// // t.huc8Feat = new FeatureLayer(t.url + "/2", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// // t.huc10Feat = new FeatureLayer(t.url + "/3", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// // t.huc12Feat = new FeatureLayer(t.url + "/6", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// //t.huc6Feat.setSelectionSymbol(t.hiddenSym);
				// t.map.addLayer(t.huc6Feat);
				// var hoverSym = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
				// 	SimpleLineSymbol.STYLE_SOLID, new Color([0,128,255,0]), 0 ), new Color([0,0,0,0.15])
				// );
				// Control mouse over and graphics for the various 
				// t.huc6Feat.on('mouse-over', function(evt){
				// 	console.log('look here');
				// 	if ( t.open == "yes"){ 
				// 		t.map.setMapCursor("pointer");
				// 		var highlightGraphic = new Graphic(evt.graphic.geometry,hoverSym);
				// 		t.map.graphics.add(highlightGraphic);
				// 		t.obid = evt.graphic.attributes.OBJECTID
				// 	}	
				// });
				// t.map.graphics.on("mouse-out", function(){
				// 	if ( t.open == "yes"){ 
				// 		t.map.setMapCursor("default");
				// 		t.map.graphics.clear();
				// 	}	
				// });

				// t.map.on("click", function(evt) {
				// 	t.obj.pnt = evt.mapPoint;
				// 	var q = new Query();
				// 	q.geometry = t.obj.pnt;
				// 	// var where = "WHUC6 = '"  + 040301 + "'"
				// 	//var where = "WHUC6 = '040301'"
				// 	// q.where = where
				// 	if(t.obj.hucClickTracker == 'huc6'){
				// 		console.log('yes 6')
				// 		t.huc6Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				// 	}else if(t.obj.hucClickTracker == 'huc8'){
				// 		console.log('yes 8')
				// 		t.huc8Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				// 	}else if(t.obj.hucClickTracker == 'huc10'){
				// 		console.log('yes 10')
				// 		t.huc10Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				// 	}
				// 	//t.hucMask.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				// });
				// t.huc6Feat.on('selection-complete', function(evt){
				// 	if(evt.features.length > 0){
				// 		t.huc12InitExt = t.map.extent;
				// 		var fExt = evt.features[0].geometry.getExtent().expand(.8);
				// 		t.map.setExtent(fExt, true);
				// 		t.huc6val = evt.features[0].attributes.WHUC6
				// 		t.clicks.layerDefs(t);
				// 		// t.map.addLayer(t.huc8Feat);
				// 		t.obj.hucClickTracker = 'huc8'
				// 	}
				// });
				// t.huc8Feat.on('selection-complete', function(evt){
				// 	if(evt.features.length > 0){
				// 		console.log(evt, 'evt 2')
				// 		t.huc12InitExt = t.map.extent;
				// 		var fExt = evt.features[0].geometry.getExtent().expand(1.2);
				// 		t.map.setExtent(fExt, true);
				// 		t.huc8val = evt.features[0].attributes.WHUC8
				// 		t.clicks.layerDefs(t);
				// 		// t.map.addLayer(t.huc10Feat);
				// 		t.obj.hucClickTracker = 'huc10'
				// 	}
				// });
				// t.huc10Feat.on('selection-complete', function(evt){
				// 	if(evt.features.length > 0){
				// 		console.log(evt, 'evt 2')
				// 		t.huc12InitExt = t.map.extent;
				// 		var fExt = evt.features[0].geometry.getExtent().expand(1.2);
				// 		t.map.setExtent(fExt, true);
				// 		t.huc10val = evt.features[0].attributes.WHUC10
				// 		t.clicks.layerDefs(t);
				// 		// t.map.addLayer(t.huc12Feat);
				// 		t.obj.hucClickTracker = 'huc12'
				// 	}
				// });
				
  
			
				// Build the Huc 6 DD menu on init
				//t.clicks.populateDD(t);

//Choosen menu and click handler
//For Chosen options visit https://harvesthq.github.io/chosen/
//Single deselect only works if the first option in the select tag is blank
// huc 6 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
				// $("#" + t.id + "wfa-huc6dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c,p){
				// 	var v = c.target.value;
				// 	t.huc6val  = v.split('_')[0]
				// 	var ddVal = v.split('_')[1]
				// 	t.hucQuery = 8;
				// 	// if an item was selected 
				// 	if(p){
				// 		var q = new Query();
				// 		q.where = "WHUC6 = '" + t.huc6val + "'";
				// 		t.huc6Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				// 		//t.clicks.layerDefs(t);
				// 		t.clicks.populateDD(t);
				// 		t.obj.selHuc = '6' // set huc tracker
				// 		$("#" + t.id + "wfa-huc8Chosen").slideDown();
				// 		$("#" + t.id + "wfa-huc6Chosen").slideUp();
				// 		$("#" + t.id + "wfa-huc6Text").slideDown();
				// 		$("#" + t.id + "wfa-huc6dd").parent().next().find("span").first().html(' '+ ddVal);
				// 	}else{ // else if the x was clicked on the dropdown menu
				// 		$("#" + t.id + "wfa-huc8Chosen").slideUp();
				// 	}
				// });

// 				// on click of back button 
// 				$('#' + t.id + 'wfa-huc6back').on('click',function(c){
// 					// t.obj.visibleLayers = [0];
// 					// t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
// 					t.map.setExtent(t.huc6InitExt, true);
// 					t.obj.selHuc = '6' // set huc tracker
// 					t.clicks.layerDefs(t);
// 					$("#" + t.id + "wfa-huc6Chosen").slideDown();
// 					$( "#" + t.id + "wfa-huc6Text" + ",#" + t.id + "wfa-huc8Text" + ",#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text" + ",#" + t.id + "wfa-huc8Chosen" + ",#" + t.id + "wfa-huc10Chosen" + ",#" + t.id + "wfa-huc12Chosen").slideUp();
// 					// Empty dd menus below the back button
// 					$("#" + t.id + "wfa-huc8dd" + ",#" + t.id + "wfa-huc10dd" + ",#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
// 					// $("#" + t.id + "wfa-huc6Text" + ",#" + t.id + "wfa-huc8Text" + ",#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text").slideUp();
// 				});



// // huc 8 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 				$("#" + t.id + "wfa-huc8dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c, p){
// 					var v = c.target.value;
// 					t.huc8val  = v.split('_')[0]
// 					t.hucQuery = 10;
// 					t.clicks.populateDD(t);
// 					// if an item was selected 
// 					if(p){
// 						var q = new Query();
// 						q.where = "WHUC8 = '" + t.huc8val + "'";
// 						t.huc8Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
// 						t.obj.selHuc = '8' // set huc tracker
// 						//t.clicks.layerDefs(t);
// 						$("#" + t.id + "wfa-huc10Chosen").slideDown();
// 						$("#" + t.id + "wfa-huc8Chosen").slideUp();
// 						$("#" + t.id + "wfa-huc8Text").slideDown();
// 						$("#" + t.id + "wfa-huc8dd").parent().next().find("span").first().html(' '+ v);
// 					}else{ // else if the x was clicked on the dropdown menu
// 						$("#" + t.id + "wfa-huc10Chosen").slideUp();
// 					}
// 				});

// 				// on click of back button 
// 				$('#' + t.id + 'wfa-huc8back').on('click',function(c){
// 					t.map.setExtent(t.huc8InitExt, true);
// 					t.obj.selHuc = '8' // set huc tracker
// 					t.clicks.layerDefs(t);
// 					$("#" + t.id + "wfa-huc8Chosen").slideDown();
// 					// Empty dd menus below the back button
// 					$("#" + t.id + "wfa-huc10dd" + ",#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
// 					$( "#" + t.id + "wfa-huc10Chosen" + ",#" + t.id + "wfa-huc12Chosen").slideUp();
// 					$("#" + t.id + "wfa-huc8Text" + ",#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text").slideUp();
// 				});

// // huc 10 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 				$("#" + t.id + "wfa-huc10dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c,p){
// 					var v = c.target.value;
// 					t.huc10val  = v.split('_')[0]
// 					t.hucQuery = 12;
// 					t.clicks.populateDD(t);
// 					//t.clicks.layerDefs(t);
// 					// if an item was selected 
// 					if(p){
// 						var q = new Query();
// 						q.where = "WHUC10 = '" + t.huc10val + "'";
// 						t.huc10Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
// 						t.obj.selHuc = '10' // set huc tracker
// 						//t.clicks.layerDefs(t);
// 						$("#" + t.id + "wfa-huc12Chosen").slideDown();
// 						$("#" + t.id + "wfa-huc10Chosen").slideUp();
// 						$("#" + t.id + "wfa-huc10Text").slideDown();
// 						$("#" + t.id + "wfa-huc10dd").parent().next().find("span").first().html(' '+ v);
// 					}else{ // else if the x was clicked on the dropdown menu
// 						$("#" + t.id + "wfa-huc12Chosen").slideUp();
// 					}
// 				});

// 				// on click of back button 
// 				$('#' + t.id + 'wfa-huc10back').on('click',function(c){
// 					t.map.setExtent(t.huc10InitExt, true);
// 					t.obj.selHuc = '10' // set huc tracker
// 					//t.clicks.layerDefs(t);
// 					$("#" + t.id + "wfa-huc10Chosen").slideDown();
// 					$("#" + t.id + "wfa-huc12Chosen").slideUp();
// 					// Empty dd menus below the back button
// 					$("#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
// 					$("#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text").slideUp();
// 				});

// // huc 12 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 				$("#" + t.id + "wfa-huc12dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c,p){
// 					var v = c.target.value;
// 					t.huc12val  = v.split('_')[0]
// 					t.clicks.layerDefs(t);
// 					// if an item was selected 
// 					if(p){
// 						var q = new Query();
// 						q.where = "WHUC12 = '" + t.huc12val + "'";
// 						t.huc12Feat.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
// 						t.obj.selHuc = '12' // set huc tracker
// 						//t.clicks.layerDefs(t);
// 						$("#" + t.id + "wfa-huc12Chosen").slideUp();
// 						$("#" + t.id + "wfa-huc12Text").slideDown();
// 						$("#" + t.id + "wfa-huc12dd").parent().next().find("span").first().html(' '+ v);
// 					}else{ // else if the x was clicked on the dropdown menu
// 						//$("#" + t.id + "wfa-huc12Chosen").slideUp();
// 					}
// 				});

// 				// on click of back button 
// 				$('#' + t.id + 'wfa-huc12back').on('click',function(c){
// 					t.map.setExtent(t.huc12InitExt, true);
// 					t.obj.selHuc = '10' // set huc tracker
// 					$("#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
// 					$("#" + t.id + "wfa-huc12Chosen").slideDown();
// 					$("#" + t.id + "wfa-huc12Text").slideUp();
// 				});



			
// 			populateDD: function(t){
// // Populate huc 6 dropdown /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 				// create query task on the huc 6 table at app startup
// 				var queryTask = new QueryTask(t.url + "/1")
// 				var query = new Query();
// 				query.returnGeometry = false;
// 				query.outFields = ["WHUC6", "name"];
// 				query.where = "OBJECTID > -1"
// 				queryTask.execute(query, function(results){
// 					var hucs = [];
// 					$.each(results.features, function(i,v){
// 						hucs.push(v.attributes)
// 					});
// 					// sort huc list......
// 					hucs.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
// 					t.HUC6s = hucs;
// 					$('#' + t.id + 'wfa-huc6dd').empty();
// 					$('#' + t.id + 'wfa-huc6dd').append("<option value=''></option>")
// 					// $('#' + t.id + 'wfa-huc6dd').append("<option value='fullExtent'>Zoom to Full Extent</option>")
// 					$.each(t.HUC6s, function(i,v){
// 						$('#' + t.id + 'wfa-huc6dd').append("<option value='" + v.WHUC6 + '_'+v.name + "'>" + v.name + "</option>")
// 					}); 
// 					$('#' + t.id + 'wfa-huc6dd').trigger("chosen:updated");
// 				});

// 				if (t.hucQuery == 8){
// 					// create query task on the huc 8 table at app startup
// 					var queryTask = new QueryTask(t.url + "/2")
// 					var query = new Query();
// 					query.returnGeometry = false;
// 					query.outFields = ["WHUC8", "name"];
// 					query.where = "WHUC6 = '" + t.huc6val + "'";
// 					queryTask.execute(query, function(results){
// 						var hucs = [];
// 						$.each(results.features, function(i,v){
// 							hucs.push(v.attributes)
// 						});
// 						// sort huc list......
// 						hucs.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
// 						t.HUC6s = hucs;
// 						$('#' + t.id + 'wfa-huc8dd').empty();
// 						$('#' + t.id + 'wfa-huc8dd').append("<option value=''></option>")
// 						// $('#' + t.id + 'wfa-huc8dd').append("<option value='fullExtent'>Zoom to Full Extent</option>")
// 						$.each(t.HUC6s, function(i,v){
// 							$('#' + t.id + 'wfa-huc8dd').append("<option value='" + v.WHUC8 + '_'+v.name + "'>" + v.name + "</option>")
// 						}); 
// 						$('#' + t.id + 'wfa-huc8dd').trigger("chosen:updated");
// 					});
// 				}
// 				if (t.hucQuery == 10){
// 					// create query task on the huc 10 table at app startup
// 					var queryTask = new QueryTask(t.url + "/3")
// 					var query = new Query();
// 					query.returnGeometry = false;
// 					query.outFields = ["WHUC10", "name"];
// 					query.where = "WHUC8 = '" + t.huc8val + "'";
// 					queryTask.execute(query, function(results){
// 						var hucs = [];
// 						$.each(results.features, function(i,v){
// 							hucs.push(v.attributes)
// 						});
// 						// sort huc list......
// 						hucs.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
// 						t.HUC6s = hucs;
// 						$('#' + t.id + 'wfa-huc10dd').empty();
// 						$('#' + t.id + 'wfa-huc10dd').append("<option value=''></option>")
// 						// $('#' + t.id + 'wfa-huc8dd').append("<option value='fullExtent'>Zoom to Full Extent</option>")
// 						$.each(t.HUC6s, function(i,v){
// 							$('#' + t.id + 'wfa-huc10dd').append("<option value='" + v.WHUC10 + '_'+v.name + "'>" + v.name + "</option>")
// 						}); 
// 						$('#' + t.id + 'wfa-huc10dd').trigger("chosen:updated");
// 					});
// 				}
// 				if (t.hucQuery == 12){
// 					console.log('huc 12');
// 					// create query task on the huc 10 table at app startup
// 					var queryTask = new QueryTask(t.url + "/6")
// 					var query = new Query();
// 					query.returnGeometry = false;
// 					query.outFields = ["WHUC12", "name"];
// 					query.where = "WHUC10 = '" + t.huc10val + "'";
// 					queryTask.execute(query, function(results){
// 						var hucs = [];
// 						$.each(results.features, function(i,v){
// 							hucs.push(v.attributes)
// 						});
// 						// sort huc list......
// 						hucs.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
// 						t.HUC6s = hucs;
// 						$('#' + t.id + 'wfa-huc12dd').empty();
// 						$('#' + t.id + 'wfa-huc12dd').append("<option value=''></option>")
// 						// $('#' + t.id + 'wfa-huc8dd').append("<option value='fullExtent'>Zoom to Full Extent</option>")
// 						$.each(t.HUC6s, function(i,v){
// 							console.log(v);
// 							$('#' + t.id + 'wfa-huc12dd').append("<option value='" + v.WHUC12 + '_'+v.Name + "'>" + v.Name + "</option>")
// 						}); 
// 						$('#' + t.id + 'wfa-huc12dd').trigger("chosen:updated");
// 					});
// 				}

// 			},
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
