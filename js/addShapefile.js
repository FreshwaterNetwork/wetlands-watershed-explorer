define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color","esri/layers/GraphicsLayer","esri/renderers/SimpleRenderer",'dojo/_base/lang',"dojo/on",'dojo/domReady!'
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color, GraphicsLayer, SimpleRenderer,lang,on, domReady) {
        "use strict";

        return declare(null, {
        	testFunction: function(t){
        		console.log('test function has been called')
        	}
        })
    }
)