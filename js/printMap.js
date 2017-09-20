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
        		console.log('start of print 2')
        		t.printUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
        		parser.parse();
		        esriConfig.defaults.io.proxyUrl = "/proxy/";
		        console.log('1')
		        // get print templates from the export web map task
		        // var printInfo = esriRequest({
		        //   "url": t.printUrl,
		        //   "content": { "f": "json" }
		        // });
		        // console.log(printInfo);
		        // printInfo.then(t.printMap.handlePrintInfo(t), handleError);
		        // var printer = new Print({
		        //   map: t.map,
		        //   url: "http://cumulus-web-adapter-1827610810.us-west-1.elb.amazonaws.com/arcgis/rest/services/nascience/ny_ExportWebMap/GPServer/Export%20Web%20Map"
		        // }, dom.byId(t.id + "mapBtn2"));
		        // printer.startup();
        	},
        	handlePrintInfo: function(){
        		console.log('handle print', t)
        	},
        	drawOptions: function(t){
        		t.lyrs = []
        		t.toolbar = new Draw(t.map);
    			t.toolbar.on("draw-end", function(evt){
    				t.printMap.addToMap(t,evt)
    			});
        		
        		// var renderer = new ClassBreaksRenderer(null, "pop2000");
		        // var outline = new SimpleLineSymbol("solid", new Color([0,0,0,0.5]), 1);
		        // var colors = [
		        //   new Color([255,255,178,0.5]),
		        //   new Color([254,204,92,0.5]),
		        //   new Color([253,141,60,0.5]),
		        //   new Color([240,59,32,0.5]),
		        //   new Color([189,0,38,0.5])
		        // ];
    			// renderer.addBreak(0, 20000, new SimpleFillSymbol("solid", outline, colors[0]));
		     //    renderer.addBreak(20000, 50000, new SimpleFillSymbol("solid", outline, colors[1]));
		     //    renderer.addBreak(50000, 100000, new SimpleFillSymbol("solid", outline, colors[2]));
		     //    renderer.addBreak(10000, 1000000, new SimpleFillSymbol("solid", outline, colors[3]));
		     //    renderer.addBreak(1000000, 10000000, new SimpleFillSymbol("solid", outline, colors[4]));
		        var drawingOptions = new LayerDrawingOptions();
		        // drawingOptions.renderer = renderer;
		        // set the drawing options for the relevant layer
		        // optionsArray index corresponds to layer index in the map service
		        var optionsArray = [];
		        optionsArray[3] = drawingOptions;
		        // t.dynamicLayer.setLayerDrawingOptions(optionsArray);
		        // app.map.addLayer(layer);
		        
		        // set up symbols for the various geometry types
		        t.symbols = {};
		        t.symbols.point = new SimpleMarkerSymbol("square", 10, new SimpleLineSymbol(), new Color([0, 255, 0, 0.75]));
		        t.symbols.polyline = new SimpleLineSymbol("solid", new Color([255, 128, 0]), 2);
		        t.symbols.polygon = new SimpleFillSymbol().setColor(new Color([255,255,0,0.25]));
		        t.symbols.circle = new SimpleFillSymbol().setColor(new Color([0, 0, 180, 0.25]));
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
        		t.drawLayer = new GraphicsLayer();
		        var graphic2 = new Graphic(evt.geometry, t.symbols[t.tool]);
		        t.drawLayer.add(graphic2);
		        t.map.addLayer(t.drawLayer);
		        t.lyrs.push(t.drawLayer)
        	},

   //      	printMap: function(t){
   //      		console.log('print map function called');
   //      		t.url ='http://cumulus-web-adapter-1827610810.us-west-1.elb.amazonaws.com/arcgis/rest/services/nascience/ny_ExportWebMap/GPServer/Export%20Web%20Map';
			// 	t.printTask = new esri.tasks.PrintTask(t.url);
			// 	t.params = new esri.tasks.PrintParameters();
			// 	console.log(t.params);
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
			// 		console.log(lo);
			// 		var t = new esri.tasks.PrintTemplate();
			// 		t.layout = lo.name;
			// 		t.label = lo.label;
			// 		t.format = lo.format;
			// 		t.preserveScale = false;
			// 		t.layoutOptions = lo.options;
			// 		//console.log(lo.options);
			// 		templates.push(t);
			// 	});
					
			// 	t.params.template = templates;
			// 	console.log(t.params.template);
			// 	console.log(t.params);
			// 	//console.log(params);
			// 	t.printTask.execute(t.params, t.printMap.printResult());
			// 	// $('#pbtn').hide();
			// 	// $('#pbuild').show();
   //      	},
   //      	printResult: function(result){
			// 	// $('#pbuild').hide();
			// 	// $('#pdflink').show();
			// 	// app.pdflocal = result.url;
			// 	console.log(result);
			// },
		});
    }
);