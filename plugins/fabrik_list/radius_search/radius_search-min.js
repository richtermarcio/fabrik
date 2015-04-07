var doGeoCode=function(c){var e=c.retrieve("uberC");var b=c.retrieve("fld");var a=b.value;var d=new google.maps.Geocoder();d.geocode({address:a},function(h,f){if(f===google.maps.GeocoderStatus.OK){var g=c.retrieve("mapid");var i=h[0].geometry.location;e.getElement("input[name^=radius_search_geocode_lat]").value=i.lat();e.getElement("input[name^=radius_search_geocode_lon]").value=i.lng();var j=h[0].geometry.location;Fabrik.radiusSearch[g].map.setCenter(j);Fabrik.radiusSearch[g].marker.setPosition(j)}else{alert("Geocode was not successful for the following reason: "+f)}})};function geoCode(){Fabrik.googleMap=true;window.addEvent("domready",function(){var c=new google.maps.LatLng(Fabrik.radiusSearch.geocode_default_lat,Fabrik.radiusSearch.geocode_default_long);var a={zoom:4,mapTypeId:google.maps.MapTypeId.ROADMAP};Fabrik.radiusSearch=typeOf(Fabrik.radiusSearch)==="null"?{}:Fabrik.radiusSearch;var b=document.getElements(".radius_search_geocode_map");b.each(function(e){var j=e.getParent(".radius_search_geocode");var f=j.getElement("button");var g=f?f:j.getElement(".radius_search_geocode_field");if(g.retrieve("events-added",0).toInt()!==1){Fabrik.radiusSearch[e.id]=typeOf(Fabrik.radiusSearch[e.id])==="null"?{}:Fabrik.radiusSearch[e.id];Fabrik.radiusSearch[e.id].map=new google.maps.Map(e,a);var i=j.getParent(".radius_search_options");g.store("events-added",1);g.store("uberC",i);g.store("mapid",e.id);var h=j.getElement(".radius_search_geocode_field");g.store("fld",h);if(typeOf(f)!=="null"){f.addEvent("click",function(m){m.stop();doGeoCode(g)});h.addEvent("keyup",function(m){if(m.key==="enter"){doGeoCode(g)}})}else{h.addEvent("keyup",function(m){doGeoCode(g)})}var l=i.getElement("input[name=geo_code_def_zoom]").get("value").toInt();var k=i.getElement("input[name=geo_code_def_lat]").get("value").toFloat();var d=i.getElement("input[name=geo_code_def_lon]").get("value").toFloat();Fabrik.fireEvent("google.radiusmap.loaded",[e.id,l,k,d])}})})}var FbListRadiusSearch=new Class({Extends:FbListPlugin,options:{geocode_default_lat:"0",geocode_default_long:"0",geocode_default_zoom:4,prefilter:true,prefilterDistance:1000,prefilterDone:false,offset_y:0},geocoder:null,map:null,initialize:function(d){this.parent(d);Fabrik.radiusSearch=Fabrik.radiusSearch?Fabrik.radiusSearch:{};var c="radius_search_geocode_map"+this.options.renderOrder;if(typeOf(Fabrik.radiusSearch[c])==="null"){Fabrik.radiusSearch[c]={};Fabrik.radiusSearch[c].geocode_default_lat=this.options.geocode_default_lat;Fabrik.radiusSearch[c].geocode_default_long=this.options.geocode_default_long;Fabrik.radiusSearch[c].geocode_default_zoom=this.options.geocode_default_zoom;Fabrik.addEvent("google.radiusmap.loaded",function(f,g,h,i){var j=new google.maps.LatLng(h,i);if(Fabrik.radiusSearch[f].loaded){return}Fabrik.radiusSearch[f].loaded=true;Fabrik.radiusSearch[f].map.setCenter(j);Fabrik.radiusSearch[f].map.setZoom(g);Fabrik.radiusSearch[f].marker=new google.maps.Marker({map:Fabrik.radiusSearch[f].map,draggable:true,position:j});google.maps.event.addListener(Fabrik.radiusSearch[f].marker,"dragend",function(){var l=Fabrik.radiusSearch[f].marker.getPosition();var m=document.id(f).getParent(".radius_search_options");var k=m.getElement("input[name^=radius_search_geocode_lat]");if(typeOf(k)!=="null"){k.value=l.lat();m.getElement("input[name^=radius_search_geocode_lon]").value=l.lng()}});this.makeWin(f)}.bind(this));Fabrik.loadGoogleMap(true,"geoCode");if(typeOf(this.options.value)==="null"){this.options.value=0}if(typeOf(this.listform)!=="null"){this.listform=this.listform.getElement("#radius_search"+this.options.renderOrder);if(typeOf(this.listform)==="null"){fconsole("didnt find element #radius_search"+this.options.renderOrder);return}var a=this.listform.getElements("select[name^=radius_search_type]");a.addEvent("change",function(f){this.toggleFields(f)}.bind(this));this.listform.getElements("input.cancel").addEvent("click",function(){this.win.close()}.bind(this));this.active=false;this.listform.getElement(".fabrik_filter_submit").addEvent("mousedown",function(f){this.active=true;this.listform.getElement("input[name^=radius_search_active]").value=1}.bind(this))}this.options.value=this.options.value.toInt();if(typeOf(this.listform)==="null"){return}var b=this.listform.getElement(".radius_search_distance");var e=this.listform.getElement(".slider_output");this.mySlide=new Slider(this.listform.getElement(".fabrikslider-line"),this.listform.getElement(".knob"),{onChange:function(f){b.value=f;e.set("text",f+this.options.unit)}.bind(this),steps:this.options.steps}).set(0);this.mySlide.set(this.options.value);b.value=this.options.value;e.set("text",this.options.value);if(this.options.myloc&&!this.options.prefilterDone){if(geo_position_js.init()){geo_position_js.getCurrentPosition(function(f){this.setGeoCenter(f)}.bind(this),function(f){this.geoCenterErr(f)}.bind(this),{enableHighAccuracy:true})}}}},makeWin:function(d){var h=document.id(d).getParent(".radius_search");var a=new Element("button.btn.button").set("html",'<i class="icon-location"></i> '+Joomla.JText._("COM_FABRIK_SEARCH"));h.getParent().adopt(a);var f=this.options.offset_y>0?this.options.offset_y:null;var e={id:"win_"+d,title:Joomla.JText._("PLG_LIST_RADIUS_SEARCH"),loadMethod:"html",content:h,width:500,height:540,offset_y:f,visible:false,destroy:false,onContentLoaded:function(){this.center()},onClose:function(i,b){var c;if(!this.active&&confirm(Joomla.JText._("PLG_LIST_RADIUS_SEARCH_CLEAR_CONFIRM"))){c=0}else{c=1}this.win.window.getElement("input[name^=radius_search_active]").value=c}.bind(this)};var g=Fabrik.getWindow(e);a.addEvent("click",function(c){c.stop();h.setStyles({position:"relative",left:0});var b=a.retrieve("win");b.open()}.bind(this));a.store("win",g);this.button=a;this.win=g;Fabrik.addEvent("list.filter",function(b){return this.injectIntoListForm()}.bind(this))},injectIntoListForm:function(){var a=this.button.retrieve("win");var b=a.contentEl.clone();b.hide();this.button.getParent().adopt(b);return true},setGeoCenter:function(a){this.geocenterpoint=a;this.geoCenter(a);this.prefilter()},prefilter:function(){if(this.options.prefilter){this.mySlide.set(this.options.prefilterDistance);this.listform.getElement("input[name^=radius_search_active]").value=1;this.listform.getElements("input[value=mylocation]").checked=true;if(!this.list){this.listform.getParent("form").submit()}else{this.getList().submit("filter")}}},geoCenter:function(a){if(typeOf(a)==="null"){alert(Joomla.JText._("PLG_VIEW_RADIUS_NO_GEOLOCATION_AVAILABLE"))}else{this.listform.getElement("input[name=radius_search_lat]").value=a.coords.latitude.toFixed(2);this.listform.getElement("input[name=radius_search_lon]").value=a.coords.longitude.toFixed(2)}},geoCenterErr:function(a){fconsole("geo location error="+a.message)},toggleActive:function(a){},toggleFields:function(a){var b=a.target.getParent(".radius_search_options");switch(a.target.get("value")){case"latlon":b.getElement(".radius_search_place_container").hide();b.getElement(".radius_search_coords_container").show();b.getElement(".radius_search_geocode").setStyles({position:"absolute",left:"-100000px"});break;case"mylocation":b.getElement(".radius_search_place_container").hide();b.getElement(".radius_search_coords_container").hide();b.getElement(".radius_search_geocode").setStyles({position:"absolute",left:"-100000px"});this.setGeoCenter(this.geocenterpoint);break;case"place":b.getElement(".radius_search_place_container").show();b.getElement(".radius_search_coords_container").hide();b.getElement(".radius_search_geocode").setStyles({position:"absolute",left:"-100000px"});break;case"geocode":b.getElement(".radius_search_place_container").hide();b.getElement(".radius_search_coords_container").hide();b.getElement(".radius_search_geocode").setStyles({position:"relative",left:0});break}},clearFilter:function(){this.listform.getElement("input[name^=radius_search_active]").value=0;return this.injectIntoListForm()}});