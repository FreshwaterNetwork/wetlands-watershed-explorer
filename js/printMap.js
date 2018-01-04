define([
        "dojo/_base/declare","esri/map", "esri/toolbars/draw", "esri/dijit/Print",
        "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/LayerDrawingOptions",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
        "esri/symbols/SimpleFillSymbol", "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/renderers/ClassBreaksRenderer",
        "esri/config",
        "dojo/_base/array", "esri/Color", "dojo/parser", 
        "dojo/query", "dojo/dom", "dojo/dom-construct", 
        "dijit/form/CheckBox", "dijit/form/Button","esri/request",

        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
      ], function(
        declare, Map, Draw, Print,
        ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer,
        LayerDrawingOptions,
        SimpleMarkerSymbol, SimpleLineSymbol,
        SimpleFillSymbol, Graphic,GraphicsLayer,
        ClassBreaksRenderer,
        esriConfig,
        arrayUtils, Color, parser, 
        query, dom, domConstruct, 
        CheckBox, Button, esriRequest
      ) {


        "use strict";

        return declare(null, {
        	drawOptions: function(t){
        		t.lyrs = []
        		t.toolbar = new Draw(t.map);
    			t.toolbar.on("draw-end", function(evt){
    				t.printMap.addToMap(t,evt)
    			});
		        var drawingOptions = new LayerDrawingOptions();
		        // set the drawing options for the relevant layer
		        // optionsArray index corresponds to layer index in the map service
		        var optionsArray = [];
		        optionsArray[3] = drawingOptions;
		        // set up symbols for the various geometry types
		        t.symbols = {};
		        // t.symbols.point = new SimpleMarkerSymbol("square", 10, new SimpleLineSymbol(), new Color([0, 255, 0, 0.75]));
		        t.symbols.polyline = new SimpleLineSymbol("solid", new Color([255, 128, 0]), 2);
		        t.symbols.polygon = new SimpleFillSymbol().setColor(new Color([255,0,0,0.0]));
		        t.symbols.polygon.setOutline(new SimpleLineSymbol("solid", new Color([17, 124, 7]), 3));
		        t.symbols.circle = new SimpleFillSymbol().setColor(new Color([255, 0, 180, 0]));
		        t.symbols.circle.setOutline(new SimpleLineSymbol("solid", new Color([9, 50, 196]), 3));
		        t.symbols.rectangle = new SimpleFillSymbol().setColor(new Color([0, 0, 180, 0.0]));
		        t.symbols.rectangle.setOutline(new SimpleLineSymbol("solid", new Color([196, 37, 9]), 3));
		        // find the divs for buttons
		        query(".wfa-drawing").forEach(function(btn) {
		          var button = new Button({
		            label: btn.innerHTML,
		            onClick: function() {
		              t.printMap.activateTool(t,this.id);
		            }
		          }, btn);
		        });
		        $.each($("#dijit_layout_ContentPane_0drawingWrapper .dijitButton"),function(i,v){
		        	$(v).addClass('button');
		        	$(v).css('padding', '0');
		        	$(v).find('.dijitButtonText').css('margin', '10px 5px 10px 5px');
		        });
		        // clear button for graphics
		        $('#' + t.id + 'drawGraphicClear').on('click', function(){
		        	var lastItem = t.lyrs.pop()
		        	if(lastItem){
		        		t.map.removeLayer(lastItem);
		        	}
		        });
        	},

        	activateTool: function(t,type){
        		type = type.split('-')[1];
        	    t.tool = type.replace("freehand", "");
		        t.toolbar.activate(type);
		        t.map.hideZoomSlider();
        	},
        	addToMap: function(t,evt){
        		t.map.showZoomSlider();
        		t.toolbar.deactivate();
        		t.obj.drawLayer = new GraphicsLayer();
		        var graphic2 = new Graphic(evt.geometry, t.symbols[t.tool]);
		        t.obj.drawLayer.add(graphic2);
		        t.map.addLayer(t.obj.drawLayer);
		        t.lyrs.push(t.obj.drawLayer)
        	},
		});
    }
);