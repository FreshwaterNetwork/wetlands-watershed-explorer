define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color ) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
		

// Dynamic layer on load ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.dynamicLayer.on("load", function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;
					t.obj.dynamicLyrExt = t.dynamicLayer.fullExtent;
					t.clicks.featureLayerListeners(t);
					if (t.obj.stateSet == "no"){
						t.map.setExtent(t.dynamicLayer.fullExtent.expand(1.2), true)
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
					// trigger initial top control clicks
					$.each($('#' + t.id + 'top-controls input'),function(i,v){
						if (t.obj[v.name] == v.value){
							$('#' + v.id).trigger('click');	
						}	
					});
					// work with Opacity sliders /////////////////////////////////////////////
					$("#" + t.id +"sldr").slider({ min: 0, max: 100, range: false, values: [t.obj.opacityVal] })
					t.dynamicLayer.setOpacity(1 - t.obj.opacityVal/100);
					$("#" + t.id +"sldr").on( "slide", function(c,ui){
						console.log(c, ui, 'chnge')
						console.log(ui.value);
						console.log(1 - ui.value/100)
						t.dynamicLayer.setOpacity(1 - ui.value/100);
						// update attributes opacity on slide
						// let attributes = $('#' + t.id + 'wfa-fas_AttributeWrap').find('.elm-title');
						// $.each(attributes, function(i,v){
						// 	$(v).parent().css("opacity", t.obj.opacityVal/100);
						// });
					})
					// $('#' + t.id + 'slider').on( "slidechange",function( e, ui ) {
					// 	t.obj.sliderVal = ui.value;
					// 	t.dynamicLayer.setOpacity(1 - ui.value/10);
					// 	// t.land.setOpacity(1 - ui.value/10);
					// 	// t.soils.setOpacity(1 - ui.value/10);
					// });
				});					
			}
		});
    }
);