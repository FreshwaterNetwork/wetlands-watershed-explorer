define([
  "dojo/_base/declare",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/geometry/Extent",
  "esri/SpatialReference",
  "esri/layers/FeatureLayer",
  "esri/dijit/Search",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic",
  "dojo/_base/Color",
  "esri/layers/GraphicsLayer",
  "esri/renderers/SimpleRenderer",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/domReady!",
], function (
  declare,
  Query,
  QueryTask,
  Extent,
  SpatialReference,
  FeatureLayer,
  Search,
  SimpleLineSymbol,
  SimpleFillSymbol,
  SimpleMarkerSymbol,
  Graphic,
  Color,
  GraphicsLayer,
  SimpleRenderer,
  lang,
  on,
  domReady
) {
  "use strict";

  return declare(null, {
    eventListeners: function (t) {
      // building

      //t.addShapefile.testFunction(t);
      $("#" + t.id + "dialogBoxTest").dialog({ autoOpen: false });
      $("#" + t.id + "wildDialogBoxTest").dialog({ autoOpen: false });
      t.clicks.infographicText(t);

      //info accord
      $(function () {
        $("#" + t.id + "infoAccord").accordion({ heightStyle: "fill" });
        $("#" + t.id + "infoAccord > div").addClass("accord-body");
        $("#" + t.id + "infoAccord > h3").addClass("accord-header");
      });
      // main accord
      $(function () {
        $("#" + t.id + "mainAccord").accordion({ heightStyle: "fill" });
        $("#" + t.id + "mainAccord > div").addClass("accord-body");
        $("#" + t.id + "mainAccord > h3").addClass("accord-header");
      });
      // update accordians on window resize
      var doit;
      $(window).resize(function () {
        clearTimeout(doit);
        doit = setTimeout(function () {
          t.clicks.updateAccord(t);
        }, 100);
      });
      // leave help button
      $("#" + t.id + "getHelpBtn").on("click", function (c) {
        $("#" + t.id + " .wfa-wrap").show();
        $("#" + t.id + " .wfa-help").hide();
      });

      // info icon clicks
      $("#" + t.id + " .infoIcon").on("click", function (c) {
        let helpText = $("#" + c.currentTarget.id)
          .parent()
          .next();
        // let helpText = $('#' + c.currentTarget.id).parent().find('.wfa-helpText');
        if (helpText.is(":visible")) {
          helpText.slideUp();
        } else {
          helpText.slideDown();
        }
      });
      $(".wfa-download-feas-data").on("click", (evt) => {
        window.open(
          "https://nascience.s3-us-west-1.amazonaws.com/apps/wisconsin_wbd_data/PRW_Feasability_Data.zip",
          "_parent"
        );
      });

      // suppress help on startup click
      $("#" + t.id + "-shosu").on("click", function (c) {
        if (c.clicked == true) {
          t.app.suppressHelpOnStartup(true);
        } else {
          t.app.suppressHelpOnStartup(false);
        }
      });
      // tab button listener
      $("#" + t.id + "tabBtns input").on("click", function (c) {
        t.obj.active = c.target.value;
        $.each($("#" + t.id + " .wfa-sections"), function (i, v) {
          if (v.id != t.id + t.obj.active) {
            $("#" + v.id).slideUp();
          } else {
            $("#" + v.id).slideDown();
          }
        });
        if (
          t.obj.active == "wfa-showInfo" ||
          t.obj.active == "wfa-downloadData"
        ) {
          $("#" + t.id + "wfa-mainContentWrap").slideUp();
        }
      });
      // save and share code outside the toolbox
      $(".wfa-saveAndShare").on("click", function () {
        let ss = $("#map-utils-control").find(".i18n")[3];
        ss.click();
        // t.printMap.testMap(t);
      });
      // create pdf map code
      $(".wfa-mapCreate").on("click", function () {
        let ss = $("#map-utils-control").find(".i18n")[2];
        ss.click();
      });
      // measure tool code
      $(".wfa-measure").on("click", function () {
        let ss = $("#map-utils-control").find(".i18n")[0];
        ss.click();
      });
      // draw tool code
      $(".wfa-draw").on("click", function () {
        $("#" + t.id + "drawWrapper").slideDown();
      });
      // close button for graphics toolbar
      $(".wfa-drawWrapper .wfa-helpLinkText").on("click", function (v) {
        $(v.currentTarget).parent().parent().slideUp();
      });
      // Download HUC 12 data click //////////////////////////////////////////////////////////////////////////////////////////////
      // Data download click
      $("#" + t.id + "dlBtn").on("click", function () {
        let val = t.obj.huc12Name.replace("-", "_");

        window.open(
          "https://nsttnc.blob.core.windows.net/freshwater-network/wi-wetland-explorer/" +
            val +
            "_data.zip",
          "_parent"
        );
      });
      // metadata links click
      $("#" + t.id + "selectWaterMetadata").on("click", function () {
        window.open(
          "https://nsttnc.blob.core.windows.net/freshwater-network/wi-wetland-explorer/DSS_AllScore_web_metadata.xml",
          "_blank"
        );
      });
      $("#" + t.id + "serviceMetadata").on("click", function () {
        window.open(
          "https://nsttnc.blob.core.windows.net/freshwater-network/wi-wetland-explorer/DSS_AllScore_web_metadata.xml",
          "_blank"
        );
      });
      // Checkboxes for radio buttons ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Set selected value text for button clicks
      $("#" + t.id + "wfa-findEvalSiteToggle input").click(function (c) {
        if (c.currentTarget.value == "find") {
          $("#" + t.id + "wfa-eval_WetlandWrap").slideUp();
          $("#" + t.id + "wfa-find_WetlandWrap").slideDown();
        } else {
          $("#" + t.id + "wfa-eval_WetlandWrap").slideDown();
          $("#" + t.id + "wfa-find_WetlandWrap").slideUp();
        }
      });
      //
      // Radio button clicks //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      $(".wfa-radio-indent input").on("click", function (c, x) {
        t.obj.funcTracker = c.target.value.split("-")[0];
        t.obj.wetTracker = c.target.value.split("-")[0];

        // change the function site services text when radio buttons are clicked.
        if (t.obj.wetlandToggleTracker == "services") {
          $(".wfa-att-title-1").html("Range of Services: ");
        } else {
          $(".wfa-att-title-1").html("Feasibility: ");
        }
        $("#" + t.id + "siteServices_span").html(
          "(Currently selected: " + c.target.value + ")"
        );
        t.clicks.controlVizLayers(t, t.obj.maskWhere);
        // remove the infographic element from the label
        $.each($(".wfa-radio-indent").find("label"), function (i, v) {
          if ($(v).find("img")) {
            $(v).find("img").remove();
          }
        });
        // add new text to dialog box if open. base this on what function the user clicks
        if ($("#" + t.id + "dialogBoxTest").dialog("isOpen")) {
          // force click on info icon.
          let value;
          if (t.obj.currentHuc == "WHUC12") {
            value = $(c.currentTarget).next().next().html() + "_wet";
          } else {
            value = $(c.currentTarget).next().next().html();
          }
          let textParts = t.infographicText[value].split(" - ");
          $("#ui-id-1").html(textParts[0]);
          $("#" + t.id + "dialogBoxTest").html(textParts[1]);
        }

        $(c.currentTarget)
          .parent()
          .append(
            '<img id="dialogBoxTest" title="" src="plugins/wetlands-watershed-explorer/images/info.png" alt="show more info in documentation" class="wfa-infoIcon">'
          );
        // function info icon click, open the appropriate popup window
        $(".wfa-infoIcon").on("click", function (e) {
          let value;
          if (t.obj.currentHuc == "WHUC12") {
            value = $(e.currentTarget).prev().html() + "_wet";
          } else {
            value = $(e.currentTarget).prev().html();
          }
          let textParts = t.infographicText[value].split(" - ");
          $("#ui-id-1").html(textParts[0]);
          $("#" + t.id + "dialogBoxTest").html(textParts[1]);
          $("#" + t.id + "dialogBoxTest").dialog("open");
          $("#ui-id-1").parent().parent().css("z-index", "100000");
          $("#ui-id-1").parent().parent().css("top", "250px");
          $("#ui-id-1").parent().parent().css("left", "507px");
        });
      });

      // code for hover over huc name, this codes changes the huc name to the huc code.
      $(".wfa-hucCode").on("mouseover", function (e) {
        let str = e.currentTarget.id.split("ContentPane_0")[1];
        str = str.substr(0, str.length - 3);
        t.prevHTML = $(e.currentTarget).html();
        $(e.currentTarget).html("HU Code: " + t.obj.hucInfo[str]);
        $(e.currentTarget).css("color", "rgb(140, 33, 48)");
      });
      $(".wfa-hucCode").on("mouseout", function (e) {
        $(e.currentTarget).html(t.prevHTML);
        $(e.currentTarget).css("color", "#2f6384");
      });

      // wildlife checkbox show and hide ///////////////////////////////////////////////////////////////////////////////////////////////////
      // wildlife radio buttons /////////////////
      $("#" + t.id + "wildlifeRadioButtons input").on("click", function (c, x) {
        t.obj.wildlifeCheck = "wildlife";
        if (this.checked) {
          var checkname = $(this).attr("name");
          $("input:checkbox[name='" + checkname + "']")
            .not(this)
            .removeAttr("checked");
        }
        if (c.currentTarget.type == "checkbox") {
          if (c.currentTarget.checked == true) {
            if (c.currentTarget.name == "prwCheck") {
              t.obj.prwTracker = c.currentTarget.value;
            } else {
              // t.obj.prwTracker = 'null';
              t.obj.wildTracker = c.currentTarget.value;
            }
          } else {
            if (c.currentTarget.name == "prwCheck") {
              t.obj.prwTracker = "null";
            } else {
              t.obj.wildTracker = "null";
            }
          }
        }
        t.clicks.controlVizLayers(t, t.obj.maskWhere);
        // add and remove info icons for the wildlife checkboxes.
        $.each($("#" + t.id + "wildlifeRadioButtons input"), function (i, v) {
          if (v.checked) {
            $(v).parent().parent().find("img").remove();
            $(v)
              .parent()
              .parent()
              .append(
                '<img id="wildDialogBoxTest"  src="plugins/wetlands-watershed-explorer/images/info.png" alt="show more info in documentation" class="wfa-wildInfoIcon">'
              );
          } else {
            $(v).parent().parent().find("img").remove();
          }
        });
        if ($("#" + t.id + "wildDialogBoxTest").dialog("isOpen")) {
          let value;
          value = $(c.currentTarget).next().next().html();
          let textParts = t.infographicText[value].split(" - ");
          $("#ui-id-2").html(textParts[0]);
          $("#" + t.id + "wildDialogBoxTest").html(textParts[1]);
        }

        $(".wfa-wildInfoIcon").on("click", function (e) {
          let value;
          value = $(e.currentTarget).prev().find("span").html();
          let textParts = t.infographicText[value].split(" - ");
          $("#ui-id-2").html(textParts[0]);
          $("#" + t.id + "wildDialogBoxTest").html(textParts[1]);
          $("#" + t.id + "wildDialogBoxTest").dialog("open");
          $("#ui-id-2").parent().parent().css("z-index", "100000");
          $("#ui-id-2").parent().parent().css("top", "380px");
          $("#ui-id-2").parent().parent().css("left", "500px");
        });
      });
    },
    // Function for clicks on map and zooming /////////////////////////////////////////////////////////////////////////////////////////////
    featureLayerListeners: function (t) {
      t.clickCounter = 0;
      // set initial array vars, these will be populated later.
      t.obj.hucExtents[0] = t.obj.dynamicLyrExt;
      t.layerDefinitions = [];
      // set the def query for the huc mask /////////////////////
      t.layerDefinitions[0] = "WHUC6 < 0";
      t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
      t.open = "yes";
      // handle map clicks
      t.map.setMapCursor("pointer");
      // call map click function ////////////////////////////////////////////////////////////////////////////////////////
      t.map.on("click", function (c) {
        t.obj.search = "no";
        if (t.open == "yes") {
          // map click point ////////////////////////////////////////
          t.obj.pnt = c.mapPoint;
          t.clicks.mapClickQuery(t, t.obj.pnt); // call t.mapClickQuery function
        }
      });
      if (t.obj.stateSet != "yes") {
        t.clicks.hoverGraphic(t, 1, t.obj.where);
      }
      t.clicks.searchFunction(t); // call the searchbox init function ///////
      t.clicks.hucZoom(t); // call the huc zoom function
      // on search complete function ///////////////
      on(t.search1, "select-result", function (e) {
        $("#dijit_layout_ContentPane_1").hide();
        // t.map.graphics.clear();
        t.scale = t.map.getScale();
        if (e.source.name == "Wetlands") {
          t.obj.wetlandClick = "yes";
          if (t.scale < 24000) {
            t.map.setScale(t.scale * 2);
          }
        } else {
          // t.map.setScale(t.scale*1.3)
        }
        t.obj.search = "yes";
        t.obj.pnt = e.result.feature.geometry;
        // slide down download button in toolbox
        $("#" + t.id + "downloadDataWrapper").show();
        t.clicks.mapClickQuery(t, t.obj.pnt); // call t.FmapClickQuery function
      });
      // on state set true /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (t.obj.stateSet == "yes") {
        // force the func tracker back to the coirrect value because save and share does not like '>' symbol
        if (t.obj.funcTracker == "Count of Services    High") {
          t.obj.funcTracker = "Count of Services ≥ High";
        }
        if (t.obj.wildlifeCheck == "wildlife") {
          $("#" + t.id + "a-option").trigger("click");
          $.each($("#" + t.id + "wildlifeRadioButtons input"), function (i, v) {
            if (v.value == t.obj.wildTracker) {
              $(v).prop("checked", true);
            }
          });
          if (t.obj.prwTracker != "null") {
            $("#" + t.id + "prw-option").prop("checked", true);
          }
        }
        // t.dynamicLayer.setOpacity(t.obj.opacityVal);
        // force a check on the radio button that matches the funcTracker
        $.each($(".wfa-radio-indent input"), function (i, v) {
          if (v.value == t.obj.funcTracker) {
            $(v).prop("checked", true);
          }
        });

        // loop through huc name list and populate the zoom buttons
        $.each(t.obj.hucNames, function (i, v) {
          let count = (i += 1);
          let name = v;
          if (v.length > 0) {
            let zoomBtns = $("#" + t.id + "hucSelWrap").find(".wfa-hucSelWrap");
            $.each(zoomBtns, function (i, v) {
              let idIndex = v.id.split("-")[1];
              if (idIndex == 0) {
                $(v).children().slideDown();
              }
              if (count == idIndex) {
                $(v).children().slideDown();
                $(v).children().children().last().prev().html(name);
              }
            });
          }
        });

        // slide and show various elements based on what huc we are in.
        if (t.obj.currentHuc != "WHUC4") {
          $("#" + t.id + "watershedHoverText").show();
          $("#" + t.id + "wfa-findASite").slideUp();
          $("#" + t.id + "mainFuncWrapper").slideDown();
          $("#" + t.id + "hucSelWrap").slideDown();
        }

        // slide down donload button if in huc 12 section
        if (t.obj.currentHuc == "WHUC12") {
          $("#" + t.id + "downloadDataWrapper").slideDown();
          $("#" + t.id + "mainAttributeWrap").slideDown();
          $("#" + t.id + "watershedHoverText").slideUp();
        }
        // slide down wildlife check wrapper if in 8, 10, or 12
        if (
          t.obj.currentHuc == "WHUC8" ||
          t.obj.currentHuc == "WHUC10" ||
          t.obj.currentHuc == "WHUC12"
        ) {
          $("#" + t.id + "wildlifeCheckWrap").slideDown();
        }
        // try and catch the hover graphic function. throws error in certain circumstances that we want to avoid
        try {
          t.clicks.hoverGraphic(t, t.obj.visibleLayers[1], t.obj.where);
        } catch (err) {}
        // get started text and help link wrapper
        if ($("#" + t.id + "wfa-mainContentWrap").height() == 0) {
          $("#" + t.id + "getStartedText").slideDown();
        } else {
          $("#" + t.id + "explainButton").slideDown();
        }
        // call functions here on save and share
        t.clicks.radioAttDisplay(t);
        t.clicks.controlVizLayers(t, t.obj.maskWhere);
        t.clicks.wetlandAttributePopulate(t);
        // set map extent and viz layers
        t.map.setExtent(t.fExt, true);
        t.dynamicLayer2.setVisibleLayers(t.obj.visibleLayers2);
        t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);

        t.obj.stateSet = "no"; // reset state set back to no
      } else {
        $("#" + t.id + "getStartedText").slideDown();
      }
    },
    // map click query ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    mapClickQuery: function (t, p) {
      // mask query ////////////////////////
      t.mq = new Query();
      t.maskQ = new QueryTask(t.url + "/" + 0);
      t.mq.geometry = p;
      t.mq.returnGeometry = true;
      t.mq.outFields = ["*"];
      t.mq.where = t.obj.maskWhere;

      // execute mask function
      t.maskQ.execute(t.mq, function (evt) {
        if (evt.features.length > 0) {
          t.obj.maskClick = "yes";
        } else {
          t.obj.maskClick = "no";
        }
      });
      // query for for the hucs /////////////////////////////////////////////////////////
      // if the user is searching /////////
      if (t.obj.search == "yes") {
        t.searchSuccess;
        t.q1 = new Query();
        t.qt1 = new QueryTask(t.url + "/" + 4); // set qt1 let
        t.obj.visibleLayers = [0, 4, 6, 16];
        $("#" + t.id + "wfa-findASite").slideUp();
        $("#" + t.id + "mainFuncWrapper").slideDown();
        $("#" + t.id + "hucSelWrap").slideDown();
        $("#" + t.id + "wildlifeCheckWrap").slideDown();
        $("#" + t.id + "createReportWrapper").slideDown();
        t.obj.wildlifeOpenTracker = "open";
        let zoomBtns = $("#" + t.id + "hucSelWrap").find(".wfa-hucSelWrap");
        $.each(zoomBtns, function (i, v) {
          $(v).children().slideDown(); // slide down all the zoom buttons on search
        });
        // loop through all the other hucs and populate data on search for the hucExtnets
        $.each([1, 2, 3, 4], function (i, v) {
          var q1 = new Query();
          var qt1 = new QueryTask(t.url + "/" + (i + 1));
          q1.geometry = p;
          q1.returnGeometry = true;
          q1.outFields = ["*"];
          qt1.execute(q1, function (evt) {
            t.searchSuccess;
            if (evt.features.length > 0) {
              if (i + 1 == 4) {
                t.obj.hucInfo.huc6 = evt.features[0].attributes.WHUC6;
                t.obj.hucInfo.huc8 = evt.features[0].attributes.WHUC8;
                t.obj.hucInfo.huc10 = evt.features[0].attributes.WHUC10;
                t.obj.hucInfo.huc12 = evt.features[0].attributes.WHUC12;
              }
              // t.obj.hucInfo;
              t.searchSuccess = "yes";
              t.obj.hucExtents[i + 1] = evt.features[0].geometry.getExtent();
              $("#" + t.id + "searchOutsideStudy").slideUp(); // slide up warning text
            } else {
              t.searchSuccess = "no";
              if (i == 3) {
                $("#" + t.id + "fullExt-selText").trigger("click");
                $("#" + t.id + "searchOutsideStudy").slideDown(); // slide down warning text
              }
            }
          });
        });
      } else {
        $("#" + t.id + "searchOutsideStudy").slideUp(); // slide up warning text
        t.q1 = new Query();
        t.qt1 = new QueryTask(t.url + "/" + t.obj.visibleLayers[1]);
      }
      // start of main query ////////////////////////////////////////////
      t.q1.geometry = p;
      t.q1.returnGeometry = true;
      t.q1.outFields = ["*"];
      // t.q1.where = t.obj.where;
      t.qt1.execute(t.q1, function (evt) {
        // t.obj.maskClick = 'no';
        if (evt.features.length > 0 && t.obj.maskClick == "no") {
          t.searchSuccess = "yes";
          $("#" + t.id + "getStartedText").slideUp();
          $("#" + t.id + "wfa-mainContentWrap").slideDown();
          // populate the maskExps and hucExps objects after query has been triggered
          if (t.obj.search == "yes") {
            $("#" + t.id + "searchWrapper").slideUp();
            $("#" + t.id + "num1").prop("checked", true);

            t.huc6Val = evt.features[0].attributes.WHUC6;
            t.huc8Val = evt.features[0].attributes.WHUC8;
            t.huc10Val = evt.features[0].attributes.WHUC10;
            t.huc12Val = evt.features[0].attributes.WHUC12;
            // populate the mask exp array
            t.obj.maskExps = [
              "OBJECTID < 0",
              "WHUC6 <>'" + t.huc6Val + "'",
              "WHUC8 <>'" + t.huc8Val + "'",
              "WHUC10 <>'" + t.huc10Val + "'",
              "WHUC12 <>'" + t.huc12Val + "'",
            ];
            // populate the huc exp array
            t.obj.hucExps = [
              "WHUC6 ='" + t.huc6Val + "'",
              "WHUC6 ='" + t.huc6Val + "'",
              "WHUC8 ='" + t.huc8Val + "'",
              "WHUC10 ='" + t.huc10Val + "'",
            ];
            // loop through three times to retreive the names for huc 6, 8, 10 and populate on zoom buttons.
            $.each([1, 2, 3], function (i, v) {
              let count = (i += 1);
              var hucQT = new QueryTask(t.url + "/" + count);
              var hucQ = new Query();
              hucQ.where = t.obj.hucExps[count];
              hucQ.outFields = ["*"];
              hucQT.execute(hucQ, function (evt) {
                // loop through zoom buttons and populate the name.
                let zoomBtns = $("#" + t.id + "hucSelWrap").find(
                  ".wfa-hucSelWrap"
                );
                $.each(zoomBtns, function (i, v) {
                  let idIndex = v.id.split("-")[1];
                  if (count == idIndex) {
                    $(v)
                      .children()
                      .children()
                      .last()
                      .prev()
                      .html(evt.features[0].attributes.name);
                  }
                });
              });
            });
          } else {
            if ($(".wfa-opening-toggle input:checked").last().is(":checked")) {
              $("#" + t.id + "searchWrapper").slideUp();
              $("#" + t.id + "num1").prop("checked", true);
            }
          }
          // retrieve huc attributes on map click to be used in the huc Attribute functions.
          t.hucAttributes = evt.features[0].attributes;
          t.obj.hucNames.push(t.hucAttributes.name);
          t.fExt = evt.features[0].geometry.getExtent().expand(1);
          if (t.obj.visibleLayers[1] == 1) {
            t.firstClick = "yes";
            t.obj.selHuc = 30;
            t.obj.currentHuc = "WHUC6";
            t.obj.hucVal = evt.features[0].attributes.WHUC6;

            t.obj.hucInfo.huc6 = evt.features[0].attributes.WHUC6;

            // t.obj.hucVal  = evt.features[0].attributes.WHUC6
            t.obj.visibleLayers = [0, 2, t.obj.selHuc];
            $("#" + t.id + "watershedHoverText").show();
            $("#" + t.id + "wetlandHoverText").hide();
            t.clicks.animateColor(t, "viewCrsInfoGraphicIcon"); // call the animate color function
          } else if (
            (t.obj.visibleLayers[2] > 4 && t.obj.visibleLayers[2] < 26) ||
            (t.obj.visibleLayers[2] > 54 && t.obj.visibleLayers[2] < 58)
          ) {
            t.obj.currentWet = "wetland"; // this is a wetland click
            if (t.obj.search == "yes") {
              t.obj.currentHuc = "WHUC12";
              t.obj.hucVal = evt.features[0].attributes.WHUC12;
            }
            $("#" + t.id + "watershedHoverText").hide();
          } else if (t.obj.visibleLayers[1] == 2) {
            t.obj.selHuc = 31;
            t.obj.currentHuc = "WHUC8";
            t.obj.hucVal = evt.features[0].attributes.WHUC8;
            t.obj.hucInfo.huc8 = evt.features[0].attributes.WHUC8;
            t.obj.wildlifeOpenTracker = "open";
            t.obj.visibleLayers = [0, 3, t.obj.selHuc];
            // slide down wildlife checkbox
            $("#" + t.id + "wildlifeCheckWrap").slideDown();
          } else if (t.obj.visibleLayers[1] == 3) {
            //t.hucAttributesList[1] = t.hucAttributes;
            t.obj.selHuc = 32;
            t.obj.currentHuc = "WHUC10";
            t.obj.hucVal = evt.features[0].attributes.WHUC10;
            t.obj.hucInfo.huc10 = evt.features[0].attributes.WHUC10;
            t.obj.visibleLayers = [0, 4, t.obj.selHuc];
            $("#" + t.id + "createReportWrapper").slideUp(); // slide up report button
            $("#" + t.id + "downloadDataWrapper").slideUp(); // slide down report button
          } else if (t.obj.visibleLayers[1] == 4) {
            t.obj.selHuc = 33;
            t.obj.currentHuc = "WHUC12";
            t.obj.hucVal = evt.features[0].attributes.WHUC12;
            t.obj.hucInfo.huc12 = evt.features[0].attributes.WHUC12;
            t.obj.huc12Name = evt.features[0].attributes.name;
            t.obj.visibleLayers = [0, 4, 6, 16];
            $("#" + t.id + "mainAttributeWrap").slideUp();
            $("#" + t.id + "wetlandHoverText").show();
            // $('#' + t.id + 'createReportWrapper').slideDown(); // slide down report button
            $("#" + t.id + "downloadDataWrapper").slideDown(); // slide down report button
          }
          // set the def query for the huc mask /////////////////////
          if (t.obj.currentHuc != "WHUC12") {
            t.obj.where = t.obj.currentHuc + " = '" + t.obj.hucVal + "'";
          } else {
            t.obj.where = t.obj.currentHuc + " = '" + 9999 + "'";
          }
          t.obj.maskWhere = t.obj.currentHuc + " <> '" + t.obj.hucVal + "'";
          // add the expression and extents in the approriate location in the huc expression tracker array.
          var name = evt.features[0].attributes.name;
          // change the extent if current wet does not = wetland
          if (t.obj.currentWet != "wetland") {
            t.map.setExtent(t.fExt, true); // only change the extent if the wetlands are not displayed
          }
          if (t.obj.currentHuc != "WHUC12") {
            t.obj.hucExps[t.obj.visibleLayers[1] - 1] = t.obj.where;
            t.obj.maskExps[t.obj.visibleLayers[1] - 1] = t.obj.maskWhere;
            t.obj.hucExtents[t.obj.visibleLayers[1] - 1] = t.fExt;
            if (t.obj.currentHuc == "WHUC6") {
              $("#" + t.id + t.obj.currentHuc + "-selText")
                .parent()
                .prev()
                .children()
                .slideDown();
              $("#" + t.id + "mainFuncWrapper").slideDown();
              $("#" + t.id + "hucSelWrap").slideDown();
              $("#" + t.id + "wfa-findASite").slideUp();
            } else {
              // only slide down if its beyond the huc 6 level
              $("#" + t.id + "mainAttributeWrap").slideDown();
            }
            // save state
            if (t.obj.stateSet == "yes") {
              $("#" + t.id + "mainFuncWrapper").slideDown();
              $("#" + t.id + "hucSelWrap").slideDown();
              $("#" + t.id + "wfa-findASite").slideUp();
            }
            // slide down the huc selected text area and populate
            $("#" + t.id + t.obj.currentHuc + "-selText")
              .parent()
              .children()
              .slideDown();
            $("#" + t.id + t.obj.currentHuc + "-selText")
              .parent()
              .find("span")
              .last()
              .prev()
              .html(name);
          } else {
            // slide up the huc selected text area and populate
            $("#" + t.id + t.obj.currentHuc + "-selText")
              .parent()
              .prev()
              .children()
              .slideDown();
            $("#" + t.id + t.obj.currentHuc + "-selText")
              .parent()
              .find("span")
              .last()
              .prev()
              .html(name);
            $("#" + t.id + t.obj.currentHuc + "-selText").slideDown();
          }
          // Call the functions at the end of map click /////////////////////////////////////////////////////////////////
          // call the hover graphic function ////////////////////////////
          if (t.obj.search != "yes") {
            t.clicks.hoverGraphic(t, t.obj.visibleLayers[1], t.obj.where);
          } else {
            t.map.graphics.clear();
            var gl = t.map.getLayer("hoverGraphic");
            if (gl) {
              gl.clear();
              t.map.removeLayer(gl);
            }
          }

          // call the wetland click function ////////////////////////////
          t.clicks.wetlandClick(t);
          // slide down explain links
          // wfa-helpLinkWrapper
          $("#" + t.id + "explainButton").slideDown();
        }
      }); // end of main map click query
    },
    // Radio/attribute display function //////////////////////////////////////////////////////////////////////////////////////
    radioAttDisplay: function (t) {
      // function help text controlsF
      if (t.obj.currentHuc == "WHUC12") {
        $("#" + t.id + "serviceOfInterest").html(
          "Choose Option Below to Compare Wetland Sites:"
        );
        $("#" + t.id + "functionHelpText")
          .find("span")
          .first()
          .html(
            "The map at right ranks sites based on their potential to provide ecosystem services, relative to other sites in the watershed. To choose a different service for comparison, click below."
          );
      } else {
        $("#" + t.id + "serviceOfInterest").html(
          "Choose Service to Compare Watersheds:"
        );
        $("#" + t.id + "functionHelpText")
          .find("span")
          .first()
          .html(
            "The map at right shows how subwatersheds compare for services lost, due to wetland loss. Loss of services can help with watershed planning—identifying where services may be needed and the relative amount of opportunity to restore and protect them. To choose a different service for comparison, click below."
          );

        $("#" + t.id + "num-services").click();
      }
      // attribute control //////////////////////////////
      var attributes = $("#" + t.id + "wfa-fas_AttributeWrap").find(
        ".wfa-sum-wrap"
      );

      // new version
      t.attributeTracker = "";
      if (t.obj.wetlandClick == "yes") {
        // you have clicked a wetland
        if (t.obj.wetlandToggleTracker === "services") {
          // you have clicked wetland with services toggle checked
          t.attributeTracker = "wet";
        } else {
          // you have clicked a wetland with feasability toggle checked
          t.attributeTracker = "feas";
        }
      } else {
        // you are not in wetlands, hide all wetland related attrbutes and show huc related atts
        t.attributeTracker = "huc";
      }

      $.each(attributes, function (i, v) {
        // if attribute tracker is feas, slide up wet and huc
        if (t.attributeTracker === "feas") {
          if ($(v).data().wfaMode === "wet" || $(v).data().wfaMode === "huc") {
            $(v).hide();
          } else {
            $(v).show();
          }
          // if attribute tracker is wet, slide up feas and huc
        } else if (t.attributeTracker === "wet") {
          if ($(v).data().wfaMode === "feas" || $(v).data().wfaMode === "huc") {
            $(v).hide();
          } else {
            $(v).show();
          }
          // if attribute tracker is huc, slide up wet and feas
        } else if (t.attributeTracker === "huc") {
          if ($(v).data().wfaMode === "feas" || $(v).data().wfaMode === "wet") {
            $(v).hide();
          } else {
            $(v).show();
          }
        }
      });

      // radio buttons controls //////////////////////////////
      var radioBtns = $("#" + t.id + "funcWrapper").find("label");
      if (t.obj.wetlandClick == "yes") {
        t.radVal = "huc";
      } else {
        t.radVal = "wet";
      }
      $.each(radioBtns, function (i, v) {
        if (t.obj.currentHuc == "WHUC12") {
          t.radVal = "huc";
        }
        if ($(v).data().wfaMode == t.radVal) {
          $(v).slideUp();
        } else {
          $(v).slideDown();
        }
      });

      // show/hide the feasibilty wrapper
      if (t.obj.currentHuc == "WHUC12") {
        $(".wfa-feasibility-toggle-wrapper").show();
      } else {
        $(".wfa-feasibility-toggle-wrapper").hide();
      }

      // feas/ num of services toggle buttons
      $(".wfa-view-feasibility-toggle input").on("click", function (evt) {
        if (evt.currentTarget.value === "numServe") {
          $(".wfa-feasWrapper").hide();
          $(".wfa-funcWrapper").show();
          t.obj.wetlandToggleTracker = "services";
          // on toggle click find the checked radio button and trigger click
          // to display the layers
          let numOfServicesRadioButtons = $(".wfa-funcWrapper input");
          $.each(numOfServicesRadioButtons, (i, radBtn) => {
            if (radBtn.checked) {
              $(radBtn).trigger("click");
            }
          });

          // remove the wetland selected layer
          let index = t.obj.visibleLayers.indexOf(5);
          if (index > -1) {
            t.obj.visibleLayers.splice(index, 1); // colors = ["red","blue","green"]
          }
          t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
          // close attribute wrapper
          $(".wfa-mainAttributeWrap").hide();

          // show click on map text
          $(".wfa-wetlandHoverText").show();
        } else if (evt.currentTarget.value === "feas") {
          $(".wfa-funcWrapper").hide();
          $(".wfa-feasWrapper").show();
          t.obj.wetlandToggleTracker = "feas";
          // on toggle click find the checked radio button and trigger click
          // to display the layers
          let feasRadioButtons = $(".wfa-feasWrapper input");
          $.each(feasRadioButtons, (i, radBtn) => {
            if (radBtn.checked) {
              $(radBtn).trigger("click");
            }
          });
          // remove the wetland selected layer
          let index = t.obj.visibleLayers.indexOf(5);
          if (index > -1) {
            t.obj.visibleLayers.splice(index, 1); // colors = ["red","blue","green"]
          }
          t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
          // close attribute wrapper
          $(".wfa-mainAttributeWrap").hide();

          // show click on map text
          $(".wfa-wetlandHoverText").show();
        }
      });
    },
    // Huc click function //////////////////////////////////////////////////////////////////////////////////////////////////////
    hucClick: function (t, atts, mousePos) {
      if (mousePos == "over") {
        if (t.obj.currentHuc != "WHUC4") {
          $("#" + t.id + "mainAttributeWrap").show();
          // check to see if its the first click if not change display to flex, this fixes the jumpyness on page load
          if (t.firstClick != "yes") {
            $("#" + t.id + "wfa-fas_AttributeWrap").css("display", "flex");
          }
          t.firstClick = "no"; // set the first click back to no
          $("#" + t.id).scrollTop(500); // force a scroll on hover so the user can see the attribute table on small screens
          $("#" + t.id + "watershedHoverText").hide();
        }
        let attributes = $("#" + t.id + "wfa-fas_AttributeWrap").find(
          ".elm-title"
        );
        let htmlVal;
        let huc8Colors = [
          "rgb(0,109,44)",
          "rgb(44,162,95)",
          "rgb(102,194,164)",
        ];
        let huc10Colors = [
          "rgb(165,15,21)",
          "rgb(222,45,38)",
          "rgb(251,106,74)",
        ];
        let huc12Colors = [
          "rgb(37,52,148)",
          "rgb(44,127,184)",
          "rgb(65,182,196)",
        ];
        $.each(attributes, function (i, v) {
          let attVal;
          try {
            attVal = atts[$(v).data("wfa")];
          } catch (err) {
            ("");
          }
          if (attVal == 1) {
            htmlVal = "Most Loss";
          } else if (attVal == 2) {
            htmlVal = "Moderate Loss";
          } else if (attVal == 3) {
            htmlVal = "Least Loss";
          }
          let spanElem = $(v).next().find(".s2Atts").html(htmlVal);
          if (t.obj.currentHuc == "WHUC6") {
            $(v)
              .parent()
              .find(".wfa-attributePatch")
              .css("background-color", huc8Colors[attVal - 1]);
          } else if (t.obj.currentHuc == "WHUC8") {
            $(v)
              .parent()
              .find(".wfa-attributePatch")
              .css("background-color", huc10Colors[attVal - 1]);
          } else if (t.obj.currentHuc == "WHUC10") {
            $(v)
              .parent()
              .find(".wfa-attributePatch")
              .css("background-color", huc12Colors[attVal - 1]);
          }
        });
      } else {
        if (atts == undefined) {
          if (t.obj.currentHuc != "WHUC4") {
            $("#" + t.id + "watershedHoverText").show();
            $("#" + t.id).scrollTop(0);
          }
          $("#" + t.id + "mainAttributeWrap").hide();
        }
      }
    },
    hucZoom: function (t) {
      // zoom buttons click //////////////////////////////////////////////////////////////////////////////////////////
      $(".wfa-hucZoom")
        .unbind()
        .on("click", function (c) {
          var id = $(c.currentTarget).parent().attr("id").split("-")[1];
          t.obj.hucNames = t.obj.hucNames.slice(0, id); // remove huc names out of array when zooming out
          t.obj.where = t.obj.hucExps[id]; // reset where clause with id and hucExps
          t.obj.wetlandWhere = "OBJECTID < 0"; // reset wetland where tracker
          // reset viz layers on zoom click
          if (id == 0) {
            try {
              t.obj.currentHuc = "WHUC4";
              t.obj.visibleLayers = [0, 1];
              $("#" + t.id + "fullExt-selText").slideUp();
              $("#" + t.id + "explainButton").slideUp();

              $("#" + t.id + "mainFuncWrapper").slideUp();
              if (t.currentToggle != "knownSite") {
                $("#" + t.id + "getStartedText").slideDown();
              }
              $("#" + t.id + "hucSelWrap").slideUp("400", function () {
                t.clicks.hoverGraphic(t, 1, t.obj.where);
              });
              // $('#' + t.id + 'wfa-findASite').slideDown();
              $("#" + t.id + "wildlifeCheckWrap").slideUp();
              $("#" + t.id + "watershedHoverText").slideUp();
              $("#" + t.id + "wetlandHoverText").slideUp();
              t.obj.wildlifeOpenTracker = "null";
              t.obj.wetlandClick = "no";
              // reset opacity values.
              t.clicks.opacityReset(t);
            } catch (err) {
              console.log("there was an error or nothing to zoom to");
            }
          } else if (id == 1) {
            t.obj.currentHuc = "WHUC6";
            t.obj.visibleLayers = [0, 2, 30];
            // $('#' + t.id + 'mainAttributeWrap').slideUp();
            $("#" + t.id + "wildlifeCheckWrap").slideUp();
            t.obj.wildlifeOpenTracker = "null";
            t.obj.wetlandClick = "no";
          } else if (id == 2) {
            t.obj.currentHuc = "WHUC8";
            t.obj.visibleLayers = [0, 3, 31];
            t.obj.wetlandClick = "no";
          } else if (id == 3) {
            t.obj.currentHuc = "WHUC10";
            t.obj.visibleLayers = [0, 4, 32];
            t.obj.wetlandClick = "no";
          }
          // reset maskwhere tracker
          t.obj.maskWhere = t.obj.maskExps[id];
          // set map extent on back button click
          // below code is for if the user clicks on the full extent zoom //////////////////////////
          if (id < 1) {
            t.obj.currentWet = "null"; // reset this tracker
            t.map.setExtent(t.obj.dynamicLyrExt, true);
            t.obj.where = "OBJECTID > 0";
            // control viz function
            t.clicks.controlVizLayers(t, t.obj.maskWhere);
            $("#" + t.id + "createReportWrapper").slideUp(); // slide up report button
            $("#" + t.id + "downloadDataWrapper").slideUp(); // slide down report button
            $("#" + t.id + "wetlandHoverText").hide();

            // below code is for if the user clicks on the huc 12 zoom //////////////////////////////
          } else if (id == 4) {
            // set extent back to huc 12 when the go to button is clicked
            t.obj.currentWet = "null"; // reset this tracker
            t.map.setExtent(t.obj.hucExtents[4], true); // zoom back to huc 12
            t.obj.maskWhere = "WHUC12 <> '" + t.obj.hucVal + "'";
            // below code is for if the user clicks on the huc 6, 8 , 10 zoom /////////////////////////
          } else {
            t.obj.currentWet = "null"; // reset this tracker
            // rebuild the extent object so it works in save and share
            let ext = t.obj.hucExtents[id];
            let ext1 = new Extent(
              ext.xmin,
              ext.ymin,
              ext.xmax,
              ext.ymax,
              new SpatialReference({ wkid: 3857 })
            );
            t.map.setExtent(ext1, true);
            // set huc exp on back button click
            t.clicks.hoverGraphic(t, t.obj.visibleLayers[1], t.obj.hucExps[id]);
            // control viz function
            t.clicks.controlVizLayers(t, t.obj.maskWhere);
            $("#" + t.id + "createReportWrapper").slideUp(); // slide up report button
            $("#" + t.id + "downloadDataWrapper").slideUp(); // slide down report button
            $("#" + t.id + "wetlandHoverText").slideUp();
          }
          // call the radio attribute controller function
          t.clicks.radioAttDisplay(t);
          // call the huc click function
          // t.clicks.hucClick(t);
          // Loop through all zoom buttons below the button clicked, slide up. //////////////////////////////
          $.each(
            $("#" + $(c.currentTarget).parent().attr("id"))
              .nextAll()
              .children(),
            function (i, v) {
              $("#" + v.id).slideUp();
            }
          );
        });
    },
    // search box function for main search area /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    searchFunction: function (t) {
      // search box init //////////////
      var s = t.id + "search1";
      t.search1 = new Search(
        {
          enableButtonMode: false, //this enables the search widget to display as a single button
          enableLabel: false,
          enableInfoWindow: false,
          showInfoWindowOnSelect: false,
          map: t.map,
        },
        s
      );

      // initi sources for search 1
      var sources = t.search1.get("sources");
      // Add the wetlands source
      sources.push({
        featureLayer: new FeatureLayer(t.url + "/48"),
        searchFields: ["wetlandIdString"],
        displayField: "wetlandIdString",
        exactMatch: false,
        outFields: ["wetlandIdString"],
        name: "Wetlands",
        placeholder: "ex: 4522416546",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        minScale: 250000,
      });
      // add the huc 12 source
      sources.push({
        featureLayer: new FeatureLayer(t.url + "/4"),
        searchFields: ["name"],
        displayField: "name",
        exactMatch: false,
        outFields: ["name"],
        name: "WHUC 12",
        placeholder: "ex: Lower Fox",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
      });

      //Set the sources above to the search widget
      t.search1.set("sources", sources);
      // t.search1.destroy();
      // search startup //////////
      t.search1.startup();
      // t.search1.destroy();
      // call search populate function
      //t.clicks.searchPopulate(t);
    },

    // Wetland click function /////////////////////////////////////////////////////////////////////////////////////////////////
    wetlandClick: function (t) {
      // wetland query
      var wq = new Query();
      var wetQ = new QueryTask(t.url + "/" + 48);
      wq.geometry = t.obj.pnt;
      wq.returnGeometry = true;
      wq.outFields = ["*"];
      wq.where = "OBJECTID > 0";

      if (t.obj.currentHuc == "WHUC12") {
        $("body").css("cursor", "progress");
        t.map.setMapCursor("progress");
        wetQ.execute(wq, function (evt) {
          $("body").css("cursor", "default");
          t.map.setMapCursor("pointer");
          if (evt.features.length > 0 && t.obj.currentWet == "wetland") {
            t.obj.wetlandClick = "yes";
            t.obj.wetlandAtts = evt.features[0].attributes;

            // set the wetland where clause
            t.wetlandID = t.obj.wetlandAtts.OBJECTID;
            t.obj.wetlandWhere = "OBJECTID = " + t.wetlandID;
            t.clicks.wetlandAttributePopulate(t);
            $("#" + t.id + "wetlandHoverText").hide();
            $("#" + t.id + "mainAttributeWrap").slideDown();
          } else {
            t.obj.wetlandClick = "no";
            if (t.obj.currentWet == "wetland") {
              $("#" + t.id + "wetlandHoverText").show();
            }
          }
          // call the control viz layers function ////////////////////////////////////
          t.clicks.controlVizLayers(t, t.obj.maskWhere);
          // call the radio attribute controller function
          t.clicks.radioAttDisplay(t);
        });
      } else {
        // call the control viz layers function ////////////////////////////////////
        t.clicks.controlVizLayers(t, t.obj.maskWhere);
        // call the radio attribute controller function
        t.clicks.radioAttDisplay(t);
      }
    },
    wetlandAttributePopulate: function (t) {
      var curColors = [
        "rgb(237,248,233)",
        "rgb(0,109,44)",
        "rgb(49,163,84)",
        "rgb(116,196,118)",
      ];
      var potColors = [
        "rgb(254,229,217)",
        "rgb(165,15,21)",
        "rgb(222,45,38)",
        "rgb(251,106,74)",
      ];
      var feasColors = [
        "rgb(254,229,217)",
        "rgb(165,15,21)",
        "rgb(222,45,38)",
        "rgb(251,106,74)",
      ];
      var title = $("#" + t.id + "wfa-fas_AttributeWrap").find(".elm-title");
      var htmlVal;

      $.each(title, function (i, v) {
        let attVal = t.obj.wetlandAtts[$(v).data("wfa")];
        if (t.obj.wetlandToggleTracker == "services") {
          if (attVal == 0) {
            htmlVal = "Not Applicable";
            t.countVal = "0";
          } else if (attVal == 1) {
            htmlVal = "Very High";
            t.countVal = "7-9";
          } else if (attVal == 2) {
            htmlVal = "High";
            t.countVal = "4-6";
          } else if (attVal == 3) {
            htmlVal = "Moderate";
            t.countVal = "1-3";
          }
        } else {
          if (attVal == 0) {
            htmlVal = "Not Applicable";
          } else if (attVal == 1) {
            htmlVal = "Very High";
          } else if (attVal == 2) {
            htmlVal = "High";
          } else if (attVal == 3) {
            htmlVal = "Moderate";
          }
        }

        // set the wetland id
        if ($(v).data("wfa") == "WETLAND_ID") {
          let wetlandVal;
          htmlVal = attVal;
          if (t.obj.wetlandAtts.WETLAND_TYPE == "WWI") {
            wetlandVal = "Current Wetland ID: ";
          } else {
            wetlandVal = "Potentially Restorable Wetland ID: ";
          }
          $(v).html(wetlandVal);
        }
        // set the wetland acres
        if ($(v).data("wfa") == "acres") {
          htmlVal = attVal + " acres";
          let areaVal;
          if (t.obj.wetlandAtts.WETLAND_TYPE == "WWI") {
            areaVal = "Wetland Area: ";
          } else {
            areaVal = "Potentially Restorable Area: ";
          }
          $(v).html(areaVal);
        }
        // set the span element to the HTML Value
        let spanElem = $(v).next().find(".s2Atts").html(htmlVal);
        if (v.innerHTML == "Count of Services ≥ High:") {
          t.countValue = $("#" + t.id + "countOptionText").html(t.countVal);
        }
        if (t.obj.wetlandAtts.WETLAND_TYPE == "WWI") {
          $(v)
            .parent()
            .find(".wfa-attributePatch")
            .css("background-color", curColors[attVal]);
        } else {
          if (t.obj.wetlandToggleTracker == "services") {
            $(v)
              .parent()
              .find(".wfa-attributePatch")
              .css("background-color", potColors[attVal]);
          } else {
            $(v)
              .parent()
              .find(".wfa-attributePatch")
              .css("background-color", feasColors[attVal]);
          }
        }
      });
    },
    // control visible layers function /////////////////////////////////////////////////////////////////////////////
    controlVizLayers: function (t, maskWhere) {
      if (t.obj.currentHuc != "WHUC4") {
        // manipulate string to the proper format, use the same tracker as for the queries but add 2 unless it is a huc 12
        var curHucNum = t.obj.currentHuc.slice(-1);
        var curHucNum2 = t.obj.currentHuc.slice(0, -1);
        if (t.obj.currentHuc != "WHUC12") {
          var curHucNum3 = parseInt(curHucNum) + 2;
        } else {
          var curHucNum3 = parseInt(curHucNum);
        }
        var newHuc = curHucNum2 + curHucNum3;
        newHuc = newHuc.substring(1);
        var lyrName = newHuc + " - " + t.obj.funcTracker;
        var curWetLyrName = "Current Wetlands - " + t.obj.funcTracker;
        var potWetLyrName =
          "Potentially Restorable Wetlands - " + t.obj.funcTracker;
        var feasWetlandLyrName = "Wetland Feasibility - " + t.obj.funcTracker;
        var wetlandSelected = "Wetlands - Selected";

        // loop through layers array and see if any layer name matches
        $.each($(t.layersArray), function (i, v) {
          if (lyrName == v.name) {
            t.obj.visibleLayers.pop();
            t.obj.visibleLayers.push(v.id);
            if (t.obj.currentHuc == "WHUC12") {
              $.each($(t.layersArray), function (i, v) {
                if (curWetLyrName == v.name) {
                  t.obj.visibleLayers.pop();
                  t.obj.visibleLayers.pop();
                  t.obj.visibleLayers.push(v.id);
                }
                if (potWetLyrName == v.name) {
                  t.obj.visibleLayers.push(v.id);
                }
              });
            }
          }
          // handle adding the wetland layers and the wetland selected layer.
          if (t.obj.currentHuc == "WHUC12") {
            // remove wetland layers and wetland selected layers before re-adding them
            var numArray = [
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              55,
              56,
              57,
              58,
              59,
            ];
            $.each(numArray, function (i, v) {
              var index = t.obj.visibleLayers.indexOf(v);
              if (index > -1) {
                t.obj.visibleLayers.splice(index, 1);
              }
            });

            if (t.obj.wetlandToggleTracker === "services") {
              $.each($(t.layersArray), function (i, v) {
                if (curWetLyrName == v.name) {
                  t.obj.visibleLayers.push(v.id);
                }
                if (potWetLyrName == v.name) {
                  t.obj.visibleLayers.push(v.id);
                }
                // add the wetland selected layer
                if (t.obj.wetlandWhere != "OBJECTID < 0") {
                  if (wetlandSelected == v.name) {
                    t.obj.visibleLayers.push(v.id);
                  }
                }
              });
            } else if (t.obj.wetlandToggleTracker === "feas") {
              $.each($(t.layersArray), function (i, v) {
                if (feasWetlandLyrName == v.name) {
                  t.obj.visibleLayers.push(v.id);
                  t.obj.visibleLayers.push(58);
                  t.obj.visibleLayers.push(5);
                }
              });
            }
          }
        });
      }
      // call the radio button selector function ////////////////////
      t.clicks.radioSelector(t);
      // set layer defs and update the mask layer /////////////////////
      t.layerDefinitions = [];
      t.layerDefinitions[0] = maskWhere;
      t.layerDefinitions[5] = t.obj.wetlandWhere;
      t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
      // remove the wetland selected layer if not clicked ////////////////////////
      if (t.obj.wetlandClick != "yes") {
        var index = t.obj.visibleLayers.indexOf(5);
        if (index > -1) {
          t.obj.visibleLayers.splice(index, 1);
        }
      }
      // update the visible layers  ///////////////////////////
      t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
      // show hide the raster wildlife layers if checkbox toggled on THIS IS IN VIZ LAYERS FUNCTION ///////////////////////////////////////////////////////////////////
      if (t.obj.wildlifeCheck == "wildlife") {
        t.obj.visibleLayers2 = [];
        if (t.obj.wildTracker != "null") {
          $.each($(t.layersArray), function (i, v) {
            if (t.obj.wildTracker == v.name) {
              t.obj.visibleLayers2.push(v.id);
            }
          });
        }
        if (t.obj.prwTracker != "null") {
          $.each($(t.layersArray), function (i, v) {
            if (t.obj.prwTracker == v.name) {
              t.obj.visibleLayers2.push(v.id);
            }
          });
        }
      }
      if (t.obj.wildlifeOpenTracker != "open") {
        t.obj.visibleLayers2 = [];
      }
      t.dynamicLayer2.setVisibleLayers(t.obj.visibleLayers2);
      // re add layers to control draw order.
      t.map.addLayer(t.dynamicLayer2);
      t.map.addLayer(t.dynamicLayer);
    },
    // radio button tester function, this decides if the radio buttons exist between clicks of HUCs and wetlands
    radioSelector: function (t) {
      // radio buttons controls //////////////////////////////
      var radioBtns = $("#" + t.id + "funcWrapper").find("input");
      $.each(radioBtns, function (i, v) {
        if (v.checked) {
          let data = $(v).parent().data().wfaMode;
          if (data == "both") {
            ("do nothing");
          } else if (data == "huc") {
            if (t.obj.currentHuc != "WHUC12") {
              ("do nothing");
            } else {
              $("#" + t.id + "count-option").prop("checked", true);
              t.obj.funcTracker = "Count of Services ≥ High";
              t.obj.visibleLayers = [0, 4, 5, 6, 16];
            }
          } else if (data == "wet") {
            if (t.obj.currentHuc != "WHUC12") {
              $("#" + t.id + "combined-option").prop("checked", true);
              t.obj.funcTracker = "Combined Services";
            } else {
              let wetVizLyrs = t.obj.visibleLayers;
              t.wetRadioTracker = v.id;
            }
          }
        }
      });
    },

    hoverGraphic: function (t, lyrNum, where) {
      t.map.graphics.clear();
      // the try catch statement below is used to remove the graphic layer.
      t.map.graphics.refresh();
      if (t.searchSuccess == "no") {
        ("do nothing");
      } else {
        try {
          var gl = t.map.getLayer("hoverGraphic");
          if (gl) {
            gl.clear();
            t.map.removeLayer(gl);
          }
        } catch (err) {
          t.clickCounter += 1;
        }

        // graphics layer hover code below ////////////////////////////////////////////////////////////////////////////////////////////////
        //and add it to the maps graphics layer
        var graphicQuery = new QueryTask(t.url + "/" + lyrNum);
        var gQ = new Query();
        gQ.returnGeometry = true;
        gQ.outFields = ["*"];
        gQ.where = where;
        // graphicQuery.execute(gQ, function(evt){
        graphicQuery.on("complete", function (evt) {
          t.map.graphics.clear();
          var highlightSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([0, 0, 255]),
              1
            ),
            new Color([125, 125, 125, 0.1])
          );

          var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 255, 255, 0]),
              1
            ),
            new Color([125, 125, 125, 0])
          );
          var features = evt.featureSet.features;
          t.countiesGraphicsLayer = new GraphicsLayer({ id: "hoverGraphic" });
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
          // on mouse out and over functions
          t.countiesGraphicsLayer.on("mouse-over", function (event) {
            t.map.graphics.clear(); //use the maps graphics layer as the highlight layer
            t.highlightGraphic = new Graphic(
              event.graphic.geometry,
              highlightSymbol
            );
            t.map.graphics.add(t.highlightGraphic);
            $("#" + t.basinId).html(event.graphic.attributes.name);
            $("#" + t.basinId).show();
            let atts = event.graphic.attributes;
            t.mousePos = "over";
            t.clicks.hucClick(t, atts, t.mousePos); // call the huc click atts function to populate attribute box
          });
          //listen for when map.graphics mouse-out event is fired
          //and then clear the highlight graphic
          t.map.graphics.on("mouse-out", function (test) {
            let atts;
            let array = [];
            t.map.graphics.clear();
            $("#" + t.basinId).hide();
            t.mousePos = "out";
            array.push(t.map.graphics.graphics);
            t.clicks.hucClick(t, atts, t.mousePos); // call the huc click atts function to populate attribute box
          });
        });
        graphicQuery.execute(gQ);
      }
    },
    // reset opacity values /////////////////////////////////////////////////////////////////////////////////////
    opacityReset: function (t) {
      if (t.obj.currentHuc == "WHUC4") {
        // reset opacity for vector layer
        t.obj.opacityVal = 20;
        t.dynamicLayer.setOpacity(1 - t.obj.opacityVal / 100); // reset init opacity
        // reset opacity for raster layer
        t.obj.opacityVal2 = 20;
        t.dynamicLayer.setOpacity(1 - t.obj.opacityVal2 / 100); // reset init opacity
      }
      if (t.obj.currentHuc == "WHUC6") {
        // reset opacity for vector layer
        t.obj.opacityVal = 20;
        t.dynamicLayer.setOpacity(1 - t.obj.opacityVal / 100); // reset init opacity
        // reset opacity for raster layer
        t.obj.opacityVal2 = 20;
        t.dynamicLayer.setOpacity(1 - t.obj.opacityVal2 / 100); // reset init opacity
        // reset slider bar to the approriate place //////////////////
      }
    },
    animateColor: function (t, id) {
      // yellow more opaque
      $("#" + t.id + id)
        .delay(2000)
        .animate(
          { backgroundColor: "rgba(243,243,21,0.6)" },
          1050,
          function () {
            $("#" + t.id + id).animate(
              { backgroundColor: "#ffffff" },
              1050,
              function () {
                $("#" + t.id + id).animate(
                  { backgroundColor: "rgba(243,243,21,0.6)" },
                  1050,
                  function () {
                    $("#" + t.id + id).animate(
                      { backgroundColor: "#ffffff" },
                      1000
                    );
                  }
                );
              }
            );
          }
        );
    },
    infographicText: function (t) {
      t.infographicText = {
        "Combined Services":
          "Combined Services -  Wetlands can provide multiple services. Each wetland’s characteristics determine which services that wetland provides and to what extent. Some watersheds have lost more services than others, due to historical wetland loss and alteration.<br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=18' target='_blank'>View in report</a>",
        "Count of Services ≥ High_wet":
          "Count of Service >= High - Current and potentially restorable wetlands often have the potential to provide more than one service at “high” or “very high” levels. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=24' target='_blank'>View in report</a>",

        "Flood Abatement":
          "Flood Abatement - After heavy rainfall, many wetlands detain storm water runoff and overbank flooding from rivers, which slows the flow of excess water downstream. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=20' target='_blank'>View in report</a>",
        "Flood Abatement_wet":
          "Flood Abatement - After heavy rainfall, many wetlands detain storm water runoff and overbank flooding from rivers, which slows the flow of excess water downstream. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=49' target='_blank'>View in report</a>",

        "Fish and Aquatic Habitat":
          "Fish and Aquatic Habitat - Wetlands support some part of the full life cycle for most fish and aquatic life. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=23' target='_blank'>View in report</a>",
        "Fish and Aquatic Habitat_wet":
          "Fish and Aquatic Habitat - Wetlands support some part of the full life cycle for most fish and aquatic life. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=58' target='_blank'>View in report</a>",

        "Phosphorus Retention": "test obj text5",
        "Phosphorus Retention_wet":
          "Phosphorus Retention - Wetlands can intercept phosphorus from water and sediments, and store it in plants and soils. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=53' target='_blank'>View in report</a>",

        "Sediment Retention":
          "Sediment Retention - Wetlands retain some sediment that would otherwise move downstream.  Excess sediment in streams impairs water quality and aquatic habitat. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=20' target='_blank'>View in report</a>",
        "Sediment Retention_wet":
          "Sediment Retention - Wetlands retain some sediment that would otherwise move downstream.  Excess sediment in streams impairs water quality and aquatic habitat. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=51' target='_blank'>View in report</a>",

        "Nitrogen Reduction": "",
        "Nitrogen Reduction_wet":
          "Nitrogen Reduction - Wetlands remove nitrate from the water and convert it into plants, soil, or harmless gas. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=55' target='_blank'>View in report</a>",

        "Nutrient Transformation":
          "Nutrient Transformation - Wetlands remove nutrients from the water and convert them into plants, soil, or harmless gas. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=22' target='_blank'>View in report</a>",
        "Nutrient Transformation_wet": "test obj text",

        "Surface Water Supply":
          "Surface Water Supply - Wetlands often contribute water to streams and rivers, especially during dry periods. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=22' target='_blank'>View in report</a>",
        "Surface Water Supply_wet":
          "Surface Water Supply - Many wetlands contribute water to streams and rivers, especially during dry periods. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=56' target='_blank'>View in report</a>",

        "Shoreline Protection": "test obj text",
        "Shoreline Protection_wet":
          "Shoreline Protection - Wetlands reduce wave energy in lakes and slow flows in rivers, protecting banks and shorelines from erosion. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=57' target='_blank'>View in report</a>",

        "Carbon Storage": "test obj text",
        "Carbon Storage_wet":
          "Carbon Storage - Wetlands capture carbon dioxide, a greenhouse gas, and store carbon in vegetation and deep organic soils. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=59' target='_blank'>View in report</a>",

        "Floristic Integrity": "test obj text",
        "Floristic Integrity_wet":
          "Floristic Integrity - Some wetlands are of high condition, containing a healthy array of plant species. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=60' target='_blank'>View in report</a>",
        // feasability descriptions
        "Overall Feasibility_wet":
          "Overall Feasibility - Potentially restorable wetlands (PRWs) are ranked for restoration feasibility based on land use, susceptibility to invasive plants, and ownership. PRWs are also ranked based on each of these three categories, individually (see below). <br> This information helps to distinguish which PRWs have fewer obstacles to restoration and merit further assessment at the site level. None of the feasibility factors preclude wetland restoration. <br> <a style='color:blue;' href='https://nascience.s3-us-west-1.amazonaws.com/apps/wisconsin_wbd_data/Feasibility-info-blurbs-for-Explorer_final.pdf' target='_blank'>View in report</a>",
        "Land use considerations_wet":
          "Land Use Considerations - Land use and land cover factors affect restoration feasibility. Agricultural lands are the most feasible due to the general absence of structures. Proximity to urban areas reduces feasibility, varying by intensity of development. Due to regulations, proximity to airports is a consideration, but not an absolute barrier. Sites within drainage districts are considered not feasible for restoration. <br> <a style='color:blue;' href='https://nascience.s3-us-west-1.amazonaws.com/apps/wisconsin_wbd_data/Feasibility-info-blurbs-for-Explorer_final.pdf' target='_blank'>View in report</a>",
        "Ownership Considerations_wet":
          "Ownership Considerations - Ownership Considerations test description",
        "Invasive species considerations_wet":
          "Invasive Plant Species Considerations - The presence of invasive plants, or proximity to an invasive plant seed source, reduces the habitat quality of wetland restorations and may increase long-term management needs. Four common invaders are considered: reed canary grass, Phragmites, cattails, and invasive shrubs (buckthorn or honeysuckle). <br> <a style='color:blue;' href='https://nascience.s3-us-west-1.amazonaws.com/apps/wisconsin_wbd_data/Feasibility-info-blurbs-for-Explorer_final.pdf' target='_blank'>View in report</a>",

        "All Guilds":
          "All Guilds - A wildlife guild is a group of species that use the same or similar habitats and resources. Some wetlands, and associated uplands, can support multiple guilds.<br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=16' target='_blank'>View in report</a>",
        "Forest Interior Guild":
          "Forest Interior Guild - The Forest Interior Guild includes species that require forested wetlands embedded within heavily forested landscapes. Black-and-white warbler, northern waterthrush, and northern flying squirrels are examples. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=25' target='_blank'>View in report</a>",
        "Shrub Swamp Guild":
          "Shrub Swamp Guild - The Shrub Swamp Guild includes species that depend on dense thickets over wet soils that usually flood in spring, such as willow and alder flycatchers. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=25' target='_blank'>View in report</a>",
        "Shallow Marsh Guild":
          "Shallow Marsh Guild - The Shallow Marsh Guild includes species that use open canopy wetlands with shallow water, or that are saturated most of the year, and may use adjacent open canopy uplands for breeding or foraging.  These include American bittern, blue-winged teal, amphibians and aquatic invertebrates. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=25' target='_blank'>View in report</a>",
        "Open Waters Guild":
          "Open Waters Guild - The Open Waters Guild includes species that prefer large areas of open water, or where water is deeper and lasts longer than in a shallow marsh.  Terns and diving ducks are examples. <br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=25' target='_blank'>View in report</a>",
        "All-Guild Restoration Opportunities":
          "All-Guild Restoration Opportunities - Restorable wetlands may have the potential to provide habitat for multiple guilds, depending on the habitat type restored and its proximity to core guild habitat.<br><a style='color:blue;' href='plugins/wetlands-watershed-explorer/assets/WetlandsByDesign_FinalReport.pdf#page=25' target='_blank'>View in report</a>",
      };
    },
    // Make vars //////////////////////////////////////////////////////////////////////////////////////////////////
    makeVariables: function (t) {
      t.wetEnd = 26;
      t.wetStart = 4;
    },
    updateAccord: function (t) {
      var ia = $("#" + t.id + "infoAccord").accordion("option", "active");
      $("#" + t.id + "infoAccord").accordion("destroy");
      $("#" + t.id + "infoAccord").accordion({ heightStyle: "fill" });
      $("#" + t.id + "infoAccord").accordion("option", "active", ia);

      var ma = $("#" + t.id + "mainAccord").accordion("option", "active");
      $("#" + t.id + "mainAccord").accordion("destroy");
      $("#" + t.id + "mainAccord").accordion({ heightStyle: "fill" });
      $("#" + t.id + "mainAccord").accordion("option", "active", ma);
    },
    commaSeparateNumber: function (val) {
      while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
      }
      return val;
    },
    abbreviateNumber: function (num) {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
      }
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
      }
      return num;
    },
  });
});
