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
				t.layerDefinitions = [];	
				// set the def query for the huc mask /////////////////////	
				t.layerDefinitions[0] =  "WHUC6 < 1";
				t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				t.currentHuc = 'WHUC6' 
				t.where = "OBJECTID > 0";
				t.clicks.hoverGraphic(t,1,t.where)
				
				t.open = 'yes';
				// handle map clicks
				t.map.setMapCursor("pointer")
				t.map.on('click',function(c){
					console.log('map click')
					if (t.open == "yes"){
						var pnt = c.mapPoint;
						var q1 = new Query();
						console.log(t.obj.visibleLayers[1], 'viz layrs')
						var qt1 = new QueryTask(t.url + "/" + t.obj.visibleLayers[1]);
						console.log(qt1, 'qt1')
						q1.geometry = pnt;
						q1.returnGeometry = true;
						q1.outFields = ["*"];
						qt1.execute(q1, function(evt){
							console.log('q1')
							if (evt.features.length > 0){
								var fExt = evt.features[0].geometry.getExtent().expand(1);
								t.map.setExtent(fExt, true);
								//t.huc10val = evt.features[0].attributes.WHUC10
								if(t.obj.visibleLayers[1] == 1 ){
									console.log('look here if 1')
									// t.obj.selHuc = 11;
									t.where = 
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
									// t.obj.visibleLayers = [0,4,5,6]
								}
								t.layerDefinitions = [];	
								// set the def query for the huc mask /////////////////////	
								t.layerDefinitions[0] =  t.currentHuc + " <> '" + t.hucVal + "'";
								t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
								t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
								t.where = t.currentHuc + " = '" + t.hucVal + "'";
								t.clicks.hoverGraphic(t, t.obj.visibleLayers[1], t.where)
							}
						})	


					}
				});

			}, 
			// Layer deff functions //////////////////////////////////////////////////////////////////////////////////////////////
			// layerDefs: function(t){ 

			// 	// if(t.obj.hucClickTracker == 'huc6'){
			// 	// 	t.layerDefinitions = [];		
			// 	// 	t.layerDefinitions[0] = "WHUC6 <> '" + t.huc6val + "'";
			// 	// 	t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
			// 	// 	t.obj.visibleLayers = [0,2,4];
			// 	// }else if(t.obj.hucClickTracker == 'huc8'){
			// 	// 	t.layerDefinitions = [];		
			// 	// 	t.layerDefinitions[0] = "WHUC8 <> '" + t.huc8val + "'";
			// 	// 	t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
			// 	// 	t.obj.visibleLayers = [0,3,5];
			// 	// }else if(t.obj.hucClickTracker == 'huc10'){
			// 	// 	t.layerDefinitions = [];		
			// 	// 	t.layerDefinitions[0] = "WHUC10 <> '" + t.huc10val + "'";
			// 	// 	t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
			// 	// 	t.obj.visibleLayers = [0,6];
			// 	// }
			// 	// t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
			// },
// control hover on HUCs ////////////////////////////////////////////////////////////////////////////////////////////////
			hoverGraphic: function(t, lyrNum, where){
				console.log('look here hover')
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
				//gQ.where = t.currentHuc + " = '" + t.hucVal + "'";
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
                		$('#' + t.basinId).html(event.graphic.attributes.name)
						$('#' + t.basinId).show()
		            });
		            //listen for when map.graphics mouse-out event is fired
		            //and then clear the highlight graphic
		            t.map.graphics.on("mouse-out", function () {
		                t.map.graphics.clear();
						$('#' + t.basinId).hide()
		            });
				});
			},

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
