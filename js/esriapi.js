define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent","esri/toolbars/draw", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color", 
],
function ( 	ArcGISDynamicMapServiceLayer, Extent,Draw, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Add dynamic map service layer number 2
				t.dynamicLayer2 = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer2);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer2.setVisibleLayers(t.obj.visibleLayers2);
				}
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				
// Dynamic layer on load ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.dynamicLayer.on("load", function () {
					// t.toolbar = new Draw(t.map);
        			// t.toolbar.on("draw-end", t.printMap.addToMap(t,evt));
        			t.map.on("load", function(){
	        			t.toolbar = new Draw(t.map);
	        			t.toolbar.on("draw-end", t.printMap.addToMap(t, evt));
	        		})
					// hide save and share html on app load;
					$('#map-utils-control').children().find('.dropdown-menu').children().last().hide();
					// hide the create map tool on app load
					$('#map-utils-control').children().find('.dropdown-menu').children().last().prev().hide();
					// add tooltip to info icon.
					$('#' + t.id + 'funcInfoGraphicWrapper').tooltip();
					// set layers array 
					t.layersArray = t.dynamicLayer.layerInfos;
					t.obj.dynamicLyrExt = t.dynamicLayer.fullExtent.expand(1);
					if(t.obj.opacityVal < 1){
						t.obj.opacityVal = 100- (t.obj.opacityVal*100)
					}
					if(t.obj.opacityVal2 < 1){
						t.obj.opacityVal2 =100- (t.obj.opacityVal2*100)
					}
					// work with Opacity sliders /////////////////////////////////////////////
					$("#" + t.id +"sldr").slider({ min: 0, max: 100, range: false, values: [t.obj.opacityVal] })
					t.dynamicLayer.setOpacity(1 - t.obj.opacityVal/100); // set init opacity
					$("#" + t.id +"sldr").on( "slide", function(c,ui){
						t.obj.opacityVal = 1 - ui.value/100;
						t.dynamicLayer.setOpacity(t.obj.opacityVal);
					})
					$("#" + t.id +"sldr1").slider({ min: 0, max: 100, range: false, values: [t.obj.opacityVal2] })
					t.dynamicLayer2.setOpacity(1 - t.obj.opacityVal2/100); // set init opacity
					$("#" + t.id +"sldr1").on( "slide", function(c,ui){
						t.obj.opacityVal2 = 1 - ui.value/100;
						t.dynamicLayer2.setOpacity(t.obj.opacityVal2);
					})	
					
					// call feature layer function
					t.clicks.featureLayerListeners(t);
					if (t.obj.stateSet == "no"){
						t.map.setExtent(t.dynamicLayer.fullExtent.expand(.6), true)
					}

// Save and Share ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// Save and Share Handler					
					if (t.obj.stateSet == "yes"){
						// set slider values
						$.each(t.obj.slIdsVals,function(i,v){
							$('#' + t.id + v[0]).slider('values', v[1]);
						});	
						// checkboxes for sliders
						$.each(t.obj.slCbIds,function(i,v){
							$('#' + t.id + v).trigger('click');
						})
						// set radio buttons to checked state
						$.each(t.obj.rbIds,function(i,v){
							$('#' + t.id + v).attr('checked', true);
						})
						// checkboxes for radio buttons
						$.each(t.obj.rbCbIds,function(i,v){
							$('#' + t.id + v).trigger('click');
						})
						//extent
						var extent = new Extent(t.obj.extent.xmin, t.obj.extent.ymin, t.obj.extent.xmax, t.obj.extent.ymax, new SpatialReference({ wkid:4326 }))
						t.map.setExtent(extent, true);
						t.obj.stateSet = "no";
					}
					// instantiate print button and draw buttons
					t.printMap.printMap2(t);
					t.printMap.drawOptions(t);
					// // trigger initial top control clicks
					// $.each($('#' + t.id + 'top-controls input'),function(i,v){
					// 	if (t.obj[v.name] == v.value){
					// 		$('#' + v.id).trigger('click');	
					// 	}	
					// });
				
				});
				// Work with the explain each choice buttons ////////////////////////////
				$('.wfa-helpLinkText').unbind().on('click',function(c){
					if(c.currentTarget.id == 'dijit_layout_ContentPane_0explainButton'){
						let helpText = $('.wfa-helpText');
						$.each(helpText,function(i,v){
							if($(v).is(":visible") == false){
								$(v).slideDown();
								$(c.currentTarget).html('Hide Explanations')
								$(c.currentTarget).css('color', 'rgb(140, 33, 48)')
							}else{
								$(v).slideUp();
								$(c.currentTarget).html('Explain Each Section')
								$(c.currentTarget).css('color', 'blue')
							}
						})
					}
					// work with the learn more button intro text
					if(c.currentTarget.id == 'dijit_layout_ContentPane_0learnMoreButton'){
						let elem = $('#' + t.id + 'wfa-intoText');
						let elem1 = $('#' + t.id + 'learnMoreButton');
						if(elem.is(":visible")){
							elem.slideUp();
							elem1.html('Learn More about the Explorer')
						}else{
							elem.slideDown();
							elem1.html('Hide Learn More')
						}
					}
				});
				// collapse sections code ///////////
				$('.wfa-collapseText').unbind().on('click',function(c){
					let target = $(c.currentTarget)
					let elem = $(c.currentTarget).parent().next();
					if(elem.is(":visible")){
						elem.slideUp();
						target.html('Show')
					}else{
						elem.slideDown();
						target.html('Collapse')
					}
				})

// the code below may be useful. we used it to hide a legend item but it is clunky.
				// t.map.on("update-end", function (e) {
				// 	let span = $(".layer-legends").find('span');
				// 	$.each(span,function(i,v){
				// 		if($(v).html() == 'HUC - Mask'){
				// 			$(v).parent().parent().hide()
				// 		}
				// 	});
				// })	
				// t.map.on("update-start", function (e) {
				// 	let span = $(".layer-legends").find('span');
				// 	$.each(span,function(i,v){
				// 		if($(v).html() == 'HUC - Mask'){
				// 			$(v).parent().parent().hide()
				// 		}
				// 	});
				// })

				t.dynamicLayer2.on("load", function () {	
					t.layersArray2 = t.dynamicLayer.layerInfos;
				});				
			}
		});
    }
);