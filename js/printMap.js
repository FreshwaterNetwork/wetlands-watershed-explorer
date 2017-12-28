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
        	printMap2: function(t){
        		// t.printUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
        		// parser.parse();
		        // esriConfig.defaults.io.proxyUrl = "/proxy/";
		        // // get print templates from the export web map task
		        // var printInfo = esriRequest({
		        //   "url": t.printUrl,
		        //   "content": { "f": "json" }
		        // });
		        // printInfo.then(t.printMap.handlePrintInfo(t), handleError);

		        // var printer = new Print({
		        //   map: t.map,
		        //   url: t.printUrl
		        // }, dom.byId(t.id + "mapBtn2"));
		        // printer.startup();
        	},
        	handlePrintInfo: function(){

        	},
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
		        t.symbols.point = new SimpleMarkerSymbol("square", 10, new SimpleLineSymbol(), new Color([0, 255, 0, 0.75]));
		        t.symbols.polyline = new SimpleLineSymbol("solid", new Color([255, 128, 0]), 2);
		        t.symbols.polygon = new SimpleFillSymbol().setColor(new Color([255,255,0,0.25]));
		        t.symbols.circle = new SimpleFillSymbol().setColor(new Color([0, 0, 180, 0.25]));
		        t.symbols.rectangle = new SimpleFillSymbol().setColor(new Color([0, 0, 180, 0.25]));
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

   //      	printMap: function(t){
   //      		t.url ='http://cumulus-web-adapter-1827610810.us-west-1.elb.amazonaws.com/arcgis/rest/services/nascience/ny_ExportWebMap/GPServer/Export%20Web%20Map';
			// 	t.printTask = new esri.tasks.PrintTask(t.url);
			// 	t.params = new esri.tasks.PrintParameters();
			// 	t.params.map = t.map;

			// 	//var legendLayer = new esri.tasks.LegendLayer();
			// 	//    legendLayer.layerId = "nyService";
			// 	var layoutTemplate, templateNames, mapOnlyIndex, templates;
			// 	var printTitle = "Biodiversity and Energy in New York - Working Together";

			// 	var layouts = [
			// 	  { 
			// 	  	"name": "Letter ANSI A Landscape", 
			// 	    "label": "Landscape (PDF)", 
			// 	    "format": "png", 
			// 	    "options": { 
			// 	    	"legendLayers": [t.legendLayer], // empty array means no legend
			// 	      "scalebarUnit": "Miles",
			// 	      "titleText": printTitle,
			// 	 			"copyrightText": "The Nature Conservancy"
			// 	   	}
			// 	  }];

			// 	// create the print templates, could also use dojo.map
			// 	var templates = [];
			// 	dojo.forEach(layouts, function(lo) {
			// 		var t = new esri.tasks.PrintTemplate();
			// 		t.layout = lo.name;
			// 		t.label = lo.label;
			// 		t.format = lo.format;
			// 		t.preserveScale = false;
			// 		t.layoutOptions = lo.options;
			// 		templates.push(t);
			// 	});
					
			// 	t.params.template = templates;
			// 	t.printTask.execute(t.params, t.printMap.printResult());
			// 	// $('#pbtn').hide();
			// 	// $('#pbuild').show();
   //      	},
   //      	printResult: function(result){
			// 	// $('#pbuild').hide();
			// 	// $('#pdflink').show();
			// 	// app.pdflocal = result.url;
			// },
		});
    }
);