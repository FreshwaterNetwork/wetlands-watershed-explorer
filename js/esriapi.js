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
					// console.log('look here 1');
        			t.map.on("load", function(){
        				// console.log('look here')
	        			// t.toolbar = new Draw(t.map);
	        			// t.toolbar.on("draw-end", t.printMap.addToMap(t, evt));
	        		})
					$('#map-utils-control').hide();
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
					//For Chosen options visit https://harvesthq.github.io/chosen/
					//Single deselect only works if the first option in the select tag is blank
					$("#" + t.id + "chosenSingle").chosen({allow_single_deselect:true, width:"65px"})
						.change(function(c){
							var v = c.target.value;
							// check for a deselect
							if (v.length == 0){
								v = "none";
							}
							$('#' + c.target.id ).parent().next().find("span").html(v)
						});
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
					t.printMap.drawOptions(t);
					t.addShapefile.uploadShapefile(t);
				});
				// main header toggle buttons
				$('.toggle-btn input').unbind().on('click',function(c){
					if($(c.currentTarget).next().html() == 'Search for a new site'){
						t.currentToggle = 'newSite'
						if($("#" + t.id + "wfa-mainContentWrap").height() == 0){
							$('#' + t.id + 'getStartedText').slideDown();
						}
						$('#' + t.id + 'searchWrapper').slideUp();
					}else{
						t.map.graphics.clear(); // reset graphics before search
						$('#' + t.id + 'explainButton').slideUp();
						$('#' + t.id + 'getStartedText').slideUp();
						$('#' + t.id + 'searchWrapper').slideDown();
						$('#' + t.id + 'wfa-mainContentWrap').slideUp();
						t.currentToggle = 'knownSite'
						if($('#' + t.id + 'wfa-mainContentWrap').height() > 0){
							$('#' + t.id + 'fullExt-selText').trigger('click');
							t.clicks.hoverGraphic(t,1,t.obj.where)
						}
						t.currentToggle = 'newSite' // set back to new site
					}
				})


				// Work with the explain each choice buttons ////////////////////////////
				$('.wfa-helpLinkText').unbind().on('click',function(c){
					if(c.currentTarget.id == 'dijit_layout_ContentPane_0explainButton'){
						let helpText = $('.wfa-helpText');
						if($(c.currentTarget).html() == 'Explain Each Section'){
							helpText.slideDown();
							$(c.currentTarget).html('Hide Explanations')
							$(c.currentTarget).css('color', 'rgb(140, 33, 48)')
						}else{
							helpText.slideUp();
							$(c.currentTarget).html('Explain Each Section')
							$(c.currentTarget).css('color', 'blue')
						}
					}
					// work with the learn more button intro text
					if(c.currentTarget.id == 'dijit_layout_ContentPane_0learnMoreButton'){
						let elem = $('#' + t.id + 'wfa-intoText');
						let elem1 = $('#' + t.id + 'learnMoreButton');
						if(elem.is(":visible")){
							elem.slideUp();
							elem1.html('Learn More about the Explorer');
						}else{
							elem.slideDown();
							elem1.html('Hide Learn More');
						}
					}
				});
				// collapse sections code ///////////
				$('.wfa-headerInfoWrap').on('mouseover',function(c){
					$(c.currentTarget).children().last().addClass("blueFont");
				})
				$('.wfa-headerInfoWrap').on('mouseout',function(c){
					$(c.currentTarget).children().last().removeClass("blueFont");
				})
				// on header click slide up and down content below 				
				$('.wfa-headerInfoWrap').on('click',function(c){
					if($(c.currentTarget).next().is(":visible")){
						$(c.currentTarget).next().slideUp()
						$(c.currentTarget).children().last().html('Show')
					}else{
						$(c.currentTarget).next().slideDown();
						$(c.currentTarget).children().last().html('Collapse')
					}
				})
				// zoom button hover code
				$('.wfa-hucSelWrap').on('mouseover',function(c){
					$(c.currentTarget).children().children().last().css('color', 'blue')
				})
				$('.wfa-hucSelWrap').on('mouseout',function(c){
					$(c.currentTarget).children().children().last().css('color', 'white')
				})

// the code below may be useful. we used it to hide a legend item but it is clunky.
				t.map.on("update-end", function (e) {
					let span = $(".layer-legends").find('span');
					$.each(span,function(i,v){
						if($(v).html() == 'HUC - Mask'){
							$(v).parent().parent().hide()
						}
					});
				})	
				t.map.on("update-start", function (e) {
					let span = $(".layer-legends").find('span');
					$.each(span,function(i,v){
						if($(v).html() == 'HUC - Mask'){
							$(v).parent().parent().hide()
						}
					});
				})

				t.dynamicLayer2.on("load", function () {	
					t.layersArray2 = t.dynamicLayer.layerInfos;
				});				
			}
		});
    }
);