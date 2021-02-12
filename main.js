// // Pull in your favorite version of jquery
// require({
// 	packages: [{ name: "jquery", location: "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/", main: "jquery.min" }]
// });
// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
  "dojo/_base/declare",
  "framework/PluginBase",
  "esri/toolbars/draw",
  "dijit/layout/ContentPane",
  "dojo/dom",
  "dojo/dom-style",
  "dojo/dom-geometry",
  "dojo/text!./obj.json",
  "dojo/text!./html/content.html",
  "dojo/text!./html/report.html",
  "./js/esriapi",
  "./js/clicks",
  // "./js/addShapefile",
  "./js/report",
  "./js/printMap",
  "dojo/_base/lang",
  "esri/dijit/Search",
  "esri/map",
  "dojo/on",
  "esri/dijit/Legend",
  "dojo/domReady!",
], function (
  declare,
  PluginBase,
  Draw,
  ContentPane,
  dom,
  domStyle,
  domGeom,
  obj,
  content,
  reportHtml,
  esriapi,
  clicks,
  // addShapefile,
  report,
  printMap,
  lang,
  Search,
  Map,
  on,
  Legend
) {
  return declare(PluginBase, {
    // The height and width are set here when an infographic is defined. When the user click Continue it rebuilds the app window with whatever you put in.
    toolbarName: "Wetlands and Watersheds Explorer",
    showServiceLayersInLegend: true,
    allowIdentifyWhenActive: false,
    rendered: false,
    resizable: false,
    hasCustomPrint: true,
    size: "custom",
    width: 455,
    hasHelp: true,

    // First function called when the user clicks the pluging icon.
    initialize: function (frameworkParameters) {
      // Access framework parameters
      declare.safeMixin(this, frameworkParameters);
      // Define object to access gFlobal variables from JSON object. Only add variables to varObject.json that are needed by Save and Share.
      this.obj = dojo.eval("[" + obj + "]")[0];
      this.url =
        "https://cirrus.tnc.org/arcgis/rest/services/FN_Wisconsin/ScoringExplore_All_addFeas/MapServer";
      this.url =
        "https://cirrus.tnc.org/arcgis/rest/services/FN_Wisconsin/ScoringExplore_All_Final_huc_6_test/MapServer";
      this.layerDefs = [];
    },
    // Called after initialize at plugin startup (why the tests for undefined). Also called after deactivate when user closes app by clicking X.
    hibernate: function () {
      if (this.appDiv != undefined) {
        // set viz layers back to -1 to remove layers from the map screen
        this.dynamicLayer.setVisibleLayers([-1]);
        this.dynamicLayer2.setVisibleLayers([-1]);
      }
      this.open = "no";
    },

    // Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.
    activate: function (showHelpOnStart) {
      if (this.rendered == false) {
        this.rendered = true;
        this.render();
        $(this.printButton).hide();
      } else {
        $("#search").hide(); // hide main search bar when app is open.
        this.dynamicLayer.setVisibleLayers(this.obj.visibleLayers);
        $("#" + this.id)
          .parent()
          .parent()
          .css("display", "flex");
        this.clicks.updateAccord(this);
      }
      if (showHelpOnStart) {
        this.showHelp();
      } else {
        $("#" + this.id + "-shosu").attr("checked", true);
        $("#" + this.id + "wfa-wrap").show();
        $("#" + this.id + " .wfa-help").hide();
      }
      this.open = "yes";
    },
    showHelp: function (h) {
      $("#" + this.id + " .wfa-wrap").hide();
      $("#" + this.id + " .wfa-help").show();
      this.clicks.updateAccord(this);

      // Show this help on startup anymore, after the first time
      // this.app.suppressHelpOnStartup(true);
    },
    // Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
    deactivate: function () {
      this.open = "no";
      this.map.removeLayer(this.countiesGraphicsLayer); //
      $("#search").show(); // show main search bar when app is closed.
      // show save and share when app is closed
      $("#map-utils-control").show();
      $(".nav-main-title").html("Wisconsin’s Waters, Wetlands, and Watersheds");
      // $('#map-utils-control').children().find('.dropdown-menu').children().last().show();
      // $('#map-utils-control').children().find('.dropdown-menu').children().last().prev().show();
    },
    // Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON.
    // Write anything to you varObject.json file you have tracked during user activity.
    getState: function () {
      // remove this conditional statement when minimize is added
      if ($("#" + this.id).is(":visible")) {
        //extent
        this.obj.extent = this.map.geographicExtent;
        this.obj.stateSet = "yes";
        var state = new Object();
        state = this.obj;
        return state;
      }
    },
    // Called before activate only when plugin is started from a getState url.
    //It's overwrites the default JSON definfed in initialize with the saved stae JSON.
    setState: function (state) {
      this.obj = state;
    },
    // Called when the user hits the print icon
    beforePrint: function (printDeferred, $printArea, mapObject) {
      printDeferred.resolve();
    },
    // Called by activate and builds the plugins elements and functions
    render: function () {
      $("#legend-container-0").find(".legend-body").css("height", "99%"); // fix the legend overlap problem
      $("#search").hide(); // hide main search bar when app is open.
      $(".nav-main-title").html("Wetlands by Design: A Watershed Approach");
      this.obj.extent = this.map.geographicExtent;
      //this.oid = -1;
      //$('.basemap-selector').trigger('change', 3);
      this.mapScale = this.map.getScale();
      // BRING IN OTHER JS FILES
      this.esriapi = new esriapi();
      this.clicks = new clicks();
      // this.addShapefile = new addShapefile();
      this.report = new report();
      this.printMap = new printMap();

      // ADD HTML TO APP
      // Define Content Pane as HTML parent
      this.appDiv = new ContentPane({
        style:
          "padding:0; color:#000; flex:1; display:flex; flex-direction:column;}",
      });
      this.id = this.appDiv.id;
      dom.byId(this.container).appendChild(this.appDiv.domNode);
      $("#" + this.id)
        .parent()
        .addClass("flexColumn");
      $("#" + this.id).addClass("accord");
      if (this.obj.stateSet == "no") {
        $("#" + this.id)
          .parent()
          .parent()
          .css("display", "flex");
      }
      // Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
      this.report2 = reportHtml;
      var idUpdate0 = content.replace(/for="/g, 'for="' + this.id);
      var idUpdate = idUpdate0.replace(/id="/g, 'id="' + this.id);
      $("#" + this.id).html(idUpdate);

      // add watershed name div that will be placed over the map.
      this.basinDiv = new ContentPane({
        style:
          "padding:0; padding-left:5px; padding-right:5px; color:#FFF; background-color:#21658c; font-size: 17px; opacity: 0.9; margin-right:145px; flex:1; z-index:1000; position: absolute; top: 27px; left: 50%; text-align:center; border-radius:1px; -moz-box-shadow:0 1px 2px rgba(0,0,0,0.5); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.5); box-shadow: 0 1px 2px rgba(0,0,0,0.5); }",
      });
      this.basinId = this.basinDiv.id;
      dom.byId("map-0").appendChild(this.basinDiv.domNode);
      $("#" + this.basinId).html(
        '<div class="wfa_basinText" id="basinMapText"></div>'
      );
      // add report popup
      this.reportDiv = new ContentPane({
        style:
          "width:100%; height:20%; padding:0; padding-left:5px; padding-right:5px; color:#FFF; background-color:#21658c; font-size: 17px; opacity: 0.9; margin-right:145px; flex:1; z-index:1000; position: absolute; bottom: 0px; text-align:center; border-radius:1px; -moz-box-shadow:0 1px 2px rgba(0,0,0,0.5); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.5); box-shadow: 0 1px 2px rgba(0,0,0,0.5); }",
      });
      this.reportId = this.reportDiv.id;
      // dom.byId('map-0').appendChild(this.reportDiv.domNode);
      $("#" + this.basinId).html(
        '<div class="wfa-reportContent" id="reportWrapper"></div>'
      );

      // Set up variables
      // Create ESRI objects and event listeners
      this.esriapi.esriApiFunctions(this);
      this.clicks.makeVariables(this);
      // Click listeners
      this.clicks.eventListeners(this);
      this.report.createReport(this);
      this.rendered = true;
    },
  });
});
