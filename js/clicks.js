define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
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


//Choosen menu and click handler
//For Chosen options visit https://harvesthq.github.io/chosen/
//Single deselect only works if the first option in the select tag is blank
// huc 6 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
				$("#" + t.id + "wfa-huc6dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c,p){
					console.log(t.layersArray);
					var v = c.target.value;
					// if an item was selected 
					if(p){
						t.obj.selHuc = '6' // set huc tracker
						$("#" + t.id + "wfa-huc8Chosen").slideDown();
						$("#" + t.id + "wfa-huc6Chosen").slideUp();
						$("#" + t.id + "wfa-huc6Text").slideDown();
						$("#" + t.id + "wfa-huc6dd").parent().next().find("span").first().html(' '+ v);
					}else{ // else if the x was clicked on the dropdown menu
						$("#" + t.id + "wfa-huc8Chosen").slideUp();
					}
				});
				// on click of back button 
				$('#' + t.id + 'wfa-huc6back').on('click',function(c){
					t.obj.selHuc = '6' // set huc tracker
					$("#" + t.id + "wfa-huc6Chosen").slideDown();
					$("#" + t.id + "wfa-huc8Chosen" + ",#" + t.id + "wfa-huc10Chosen" + ",#" + t.id + "wfa-huc12Chosen").slideUp();
					// Empty dd menus below the back button
					$("#" + t.id + "wfa-huc8dd" + ",#" + t.id + "wfa-huc10dd" + ",#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
					// $('#' + t.id + 'ch-years').val('').trigger('chosen:updated').trigger('change');
					$("#" + t.id + "wfa-huc6Text" + ",#" + t.id + "wfa-huc8Text" + ",#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text").slideUp();
				});

// huc 8 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
				$("#" + t.id + "wfa-huc8dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c, p){
					var v = c.target.value;
					// if an item was selected 
					if(p){
						t.obj.selHuc = '8' // set huc tracker
						$("#" + t.id + "wfa-huc10Chosen").slideDown();
						$("#" + t.id + "wfa-huc8Chosen").slideUp();
						$("#" + t.id + "wfa-huc8Text").slideDown();
						$("#" + t.id + "wfa-huc8dd").parent().next().find("span").first().html(' '+ v);
					}else{ // else if the x was clicked on the dropdown menu
						$("#" + t.id + "wfa-huc10Chosen").slideUp();
					}
				});

				// on click of back button 
				$('#' + t.id + 'wfa-huc8back').on('click',function(c){
					t.obj.selHuc = '8' // set huc tracker
					$("#" + t.id + "wfa-huc8Chosen").slideDown();
					// Empty dd menus below the back button
					$("#" + t.id + "wfa-huc10dd" + ",#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
					$( "#" + t.id + "wfa-huc10Chosen" + ",#" + t.id + "wfa-huc12Chosen").slideUp();
					$("#" + t.id + "wfa-huc8Text" + ",#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text").slideUp();
				});

// huc 10 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
				$("#" + t.id + "wfa-huc10dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c,p){
					var v = c.target.value;
					// if an item was selected 
					if(p){
						t.obj.selHuc = '10' // set huc tracker
						$("#" + t.id + "wfa-huc12Chosen").slideDown();
						$("#" + t.id + "wfa-huc10Chosen").slideUp();
						$("#" + t.id + "wfa-huc10Text").slideDown();
						$("#" + t.id + "wfa-huc10dd").parent().next().find("span").first().html(' '+ v);
					}else{ // else if the x was clicked on the dropdown menu
						$("#" + t.id + "wfa-huc12Chosen").slideUp();
					}
				});

				// on click of back button 
				$('#' + t.id + 'wfa-huc10back').on('click',function(c){
					t.obj.selHuc = '10' // set huc tracker
					$("#" + t.id + "wfa-huc10Chosen").slideDown();
					$("#" + t.id + "wfa-huc12Chosen").slideUp();
					// Empty dd menus below the back button
					$("#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
					$("#" + t.id + "wfa-huc10Text" + ",#" + t.id + "wfa-huc12Text").slideUp();
				});

// huc 12 chosen menu ////////////////////////////////////////////////////////////////////////////////////////////////////////
				$("#" + t.id + "wfa-huc12dd").chosen({allow_single_deselect:true, width:"355px"}).change(function(c,p){
					var v = c.target.value;
					// if an item was selected 
					if(p){
						t.obj.selHuc = '12' // set huc tracker
						//$("#" + t.id + "wfa-huc12Chosen").slideDown();
						$("#" + t.id + "wfa-huc12Chosen").slideUp();
						$("#" + t.id + "wfa-huc12Text").slideDown();
						$("#" + t.id + "wfa-huc12dd").parent().next().find("span").first().html(' '+ v);
					}else{ // else if the x was clicked on the dropdown menu
						//$("#" + t.id + "wfa-huc12Chosen").slideUp();
					}
				});

				// on click of back button 
				$('#' + t.id + 'wfa-huc12back').on('click',function(c){
					t.obj.selHuc = '10' // set huc tracker
					$("#" + t.id + "wfa-huc12dd").val('').trigger("chosen:updated").trigger('change');
					$("#" + t.id + "wfa-huc12Chosen").slideDown();
					$("#" + t.id + "wfa-huc12Text").slideUp();
				});

// Checkboxes for radio buttons ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// $('#' + t.id + 'funcWrapper .rb_cb').on('click',function(c){
				// 	$.each($('#' + c.target.id).parent().parent().find('input'),function(i,v){
				// 		$(v).attr('disabled', false)
				// 	});
				// });

				
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
							t.obj.visibleLayers = [v.id];
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
					});
				})



				var clickCnt = 0;
				// Flood frequency, HUC, and Management Action clicks
				$('#' + t.id + 'top-controls input').on('click',function(c){
					// Update json object
					var rname = $('#' + c.target.id).attr("name")
					var val = c.target.value;
					t.obj[rname] = val;
					// Flood Frequency
					if (rname == "floodFreq"){
						t.obj.ffDef = "( FloodFrequency = '" + val + "' )";
					}
					// HUCs
					if (rname == "huc"){
						var h = val.split(" ").pop();
						$('.h10, .h12').hide();
						$('.h' + h).show();
						$.each(t.layersArray, function(i,v){
							if (v.name == val){
								t.obj.hucLayer = v.id;
								t.obj.hucLayerSel = (v.id - 1)
								t.obj.visibleLayers = [t.obj.hucLayerSel, t.obj.hucLayer];
								t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							}
						})
					}
					// Management Action
					if (rname == "mngmtAction"){
						$('.mng-act-wrap').slideUp(500,function(){
							$('.mng-act-toggle').hide();
							$('.' + c.target.value).show()
							$('.mng-act-wrap').slideDown(500);	
						});
					}
					if (clickCnt < 2){
						clickCnt = clickCnt + 1
					}else{
						// Set definition expressions for visible and enable sliders
						$.each($('#' + t.id + 'mng-act-wrap .slider'),function(i,v){
							var idArray = v.id.split("-")
							var h = t.obj.huc.split(" ").pop();
							var ben  = v.id.split("-").pop();
							if (idArray[1] == h){
								if ( $('#' + v.id).parents('.' + t.obj.mngmtAction).length ){
									var dis = $('#' + v.id).slider("option", "disabled");
									if (dis == false){
										var values = $('#' + v.id).slider("option", "values");
										t[ben] = "(" + ben + " >= " + values[0] + " AND " + ben + " <= " + values[1] + ")";
									}else{
										t[ben] = "";
									}								
								}else{
									t[ben] = "";
								}	
							}
						})
						// Set definition expressions for visible and enabled radion buttons
						$.each( $('.wfa-radio-indent input'), function(i,v){
							var ben = v.value.split("-")[0]
							var val = v.value.split("-")[1]
							// use class name to test if it's visible
							if ( $('#' + v.id).parents('.' + t.obj.mngmtAction).length ){
								if (v.disabled == true){
									t[ben] = "";
								}
								if (v.disabled == false && v.checked == true){
									t[ben] = "( " + ben + " = '" + val + "' )";
								}	
							}else{	
								t[ben] = "";
							}
						}) 
						t.clicks.layerDefs(t);
					}	
				})
				// Checkboxes for sliders
				$('#' + t.id + 'wfa-wrap .-slCb').on('click',function(c){
					if (c.target.checked == true){
						$('#' + c.target.id).parent().parent().find('.wfa-slider-label').css("display", "inline-block");
						var sl = $('#' + c.target.id).parent().parent().find('.slider')[0].id 
						$('#' + sl).slider( "option", "disabled", false );
						var values = $('#' + sl).slider("option", "values");
						$('#' + sl).slider('values', values);
					}
					if (c.target.checked == false){
						$('#' + c.target.id).parent().parent().find('.wfa-slider-label').css("display", "none");
						var sl = $('#' + c.target.id).parent().parent().find('.slider')[0].id 
						$('#' + sl).slider( "option", "disabled", true );
						var ben  = sl.split("-").pop();
						t[ben] = "";
						t.clicks.layerDefs(t);
					}	
				})

				//Natural lands not behind levess slider
				$('#' + t.id + '-10-NatNotProt').slider({range:true, min:0, max:8000, values:[0,8000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				$('#' + t.id + '-12-NatNotProt').slider({range:true, min:0, max:2000, values:[0,2000], disabled:true,
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				//Agricultural lands not behind levess slider
				$('#' + t.id + '-10-RowAgNotProt').slider({range:true, min:0, max:10000, values:[0,10000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				$('#' + t.id + '-12-RowAgNotProt').slider({range:true, min:0, max:2000, values:[0,2000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				//Structural loss slider
				$('#' + t.id + '-10-FRStruct_TotLoss').slider({range:true, min:0, max:10000000, values:[0,10000000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				$('#' + t.id + '-12-FRStruct_TotLoss').slider({range:true, min:0, max:10000000, values:[0,10000000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				//Agricultural loss slider
				$('#' + t.id + '-10-AGLoss_7').slider({range:true, min:0, max:20000000, values:[0,20000000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				$('#' + t.id + '-12-AGLoss_7').slider({range:true, min:0, max:1000000, values:[0,1000000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				//Agricultural land use behind levees slider
				$('#' + t.id + '-10-RowAgProt').slider({range:true, min:0, max:1000, values:[0,1000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				$('#' + t.id + '-12-RowAgProt').slider({range:true, min:0, max:1000, values:[0,1000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				//Developed lands behind levess slider
				$('#' + t.id + '-10-DevProt').slider({range:true, min:0, max:1000, values:[0,1000], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
				$('#' + t.id + '-12-DevProt').slider({range:true, min:0, max:500, values:[0,500], disabled:true, 
						change:function(event,ui){t.clicks.sliderChange(event,ui,t)},
						slide:function(event,ui){t.clicks.sliderSlide(event,ui,t)}
					})
			},
			sliderChange: function(e, ui, t){
				var max = $('#' + e.target.id).slider("option", "max");
				var ben  = e.target.id.split("-").pop()
				// slider change was mouse-driven
				if (e.originalEvent) {
					if (max == ui.values[1]){
						t[ben] = "(" + ben + " >= " + ui.values[0] + ")";
						$('#' + e.target.id).parent().prev().find('.wfa-grth').css('display', 'inline-block');
					}else{
						t[ben] = "(" + ben + " >= " + ui.values[0] + " AND " + ben + " <= " + ui.values[1] + ")";	
						$('#' + e.target.id).parent().prev().find('.wfa-grth').css('display', 'none');
					}
					t.clicks.layerDefs(t);
				}
				//slider change was programmatic
				else{
					if (t.obj.stateSet == "no"){
						if (max == ui.values[1]){
							t[ben] = "(" + ben + " >= " + ui.values[0] + ")";
							$('#' + e.target.id).parent().prev().find('.wfa-grth').css('display', 'inline-block');
						}else{
							t[ben] = "(" + ben + " >= " + ui.values[0] + " AND " + ben + " <= " + ui.values[1] + ")";	
							$('#' + e.target.id).parent().prev().find('.wfa-grth').css('display', 'none');
						}	
						t.clicks.sliderSlide(e, ui, t);
						t.clicks.layerDefs(t);
					}else{
						t.clicks.sliderSlide(e, ui, t);
					}
				}	
			},
			sliderSlide: function(e, ui, t){
				var sid = e.target.id.split("-");
				$('#' + t.id + '-' + sid[1] + '-' + sid[2]).parent().prev().find('.blueFont').each(function(i,v){
					if (ui.values[i] > 100000){
						var val = t.clicks.abbreviateNumber(ui.values[i])
					}else{
						var val = t.clicks.commaSeparateNumber(ui.values[i])
					}
					$(v).html(val)
				})	
			},
			layerDefs: function(t){
				if (t.obj.stateSet == "no"){
					
					t.obj.exp = [t.NatNotProt, t.RowAgNotProt, t.RowAgProt, t.DevProt, t.FRStruct_TotLoss, t.AGLoss_7, 
								 t.NDelRet, t.Denitrification, t.Reconnection, t.BF_Existing, t.BF_Priority, t.SDM]
				}
				var exp = "";
				var cnt = 0;
				$.each(t.obj.exp, function(i, v){
					if (v.length > 0){
						cnt = cnt + 1;
					}	
				});	
				if (cnt > 0){
					t.obj.exp.unshift(t.obj.ffDef);
					$.each(t.obj.exp, function(i, v){
						if (v.length > 0){
							if (exp.length == 0){
								exp = v;
							}else{
								exp = exp + " AND " + v;
							}	
						}	
					});
					t.layerDefinitions = [];		
					t.layerDefinitions[t.obj.hucLayerSel] = exp;			
					t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
					t.obj.visibleLayers = [t.obj.hucLayerSel, t.obj.hucLayer];
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					var query = new Query();
					var queryTask = new QueryTask(t.url + '/' + t.obj.hucLayerSel);
					query.where = exp;
					queryTask.executeForCount(query,function(count){
						var countWcomma = t.clicks.commaSeparateNumber(count)
						$('#' + t.id + 'mng-act-wrap .fuCount').html(countWcomma); 
					});
				}else{
					t.obj.visibleLayers = [t.obj.hucLayer];
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					$('#' + t.id + 'mng-act-wrap .fuCount').html("0"); 
				}	
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
