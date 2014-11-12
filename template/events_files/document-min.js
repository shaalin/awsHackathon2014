var lang=$("html").attr("lang")||"en";
var language={en:{"help-tip":"Show help tip for",wait:"Please wait while the content loads...",print:"Print this page",sorry:"Sorry",close:"Close this dialog box","please-wait":"Please wait...","continue":"Continue",error:"There was a technical problem, don't worry it was our fault. Please click 'Continue'.","new-window":"Opens in a new window","show-pages":"Show pages within","hide-pages":"Hide pages within",clear:"Clear details"}};
var called=[];
var cruk={variables:{loader:'<p class="icon-loading" title="'+language[lang].wait+'"><span class="access">'+language[lang].wait+"</span></p>","loader-sml":'<p class="icon-loading-sml" title="'+language[lang].wait+'"><span class="access">'+language[lang].wait+"</span></p>"},onload:function(){$(window).bind("resize",function(e){if($(window).width()<850){$("#promo").remove().insertAfter($("#news-list"))
}else{$("#promo").remove().appendTo($("#carousel-content"))
}});
$(window).resize();
if($(window).width()<=850&&$("#facebook-app").length===0){modules=$.grep(modules,function(value,index){return(value!="friends")
});
$.getScript(cruk.variables["script-path"]+"mobile.js",function(){mobilecruk.onload();
$(window).trigger("window:resize")
})
}else{cruk.button.onload();
cruk["page-tools"].onload();
cruk["external-links"].onload();
cruk.skip.onload()
}cruk["cruk-sites"].onload();
cruk["more-block"].onload();
cruk["map-toggle"].onload();
cruk["watermark"].onload();
cruk["toggle-events"].onload();
var handler;
$(window).bind("resize",function(){clearTimeout(handler);
handler=setTimeout(function(){if(typeof mobilecruk=="undefined"&&$(window).width()<=850){$.getScript(cruk.variables["script-path"]+"mobile.js",function(){mobilecruk.onload();
$(window).trigger("window:resize")
})
}else{$(window).trigger("window:resize")
}},200)
});
cruk.modules={};
$.each(modules,function(key,value){if(!cruk.modules[value]){cruk.modules[value]=value;
cruk[cruk.modules[value]]?cruk[cruk.modules[value]].onload():0
}})
},searchInMemory:{onload:function(data){if(typeof data=="undefined"){data={source:"",status:"success"}
}var box=$(".search-inmemory"),dropdown=box.find(".inmemory-results"),searchButton=box.find(".search-button-inmemory"),isSearch=($(data.source).attr("id")==searchButton.attr("id")),isFundraise=box.hasClass("fundraise-inmemory"),clone='<a href="#" class="clone-button">'+searchButton.text()+"</a>",allValid=true;
var html='<div class="form-row"><div class="lrg-button full-button">';
html+='<a href="#" class="inmemory-drop">Use these details</a></div></div>';
html+="<div class=\"form-row\">If these results don't include the person you're running in memory of, we'll create a page for them using the details you entered.</div>";
html+='<div class="form-row"><div class="lrg-button full-button">';
html+='<a href="#" class="inmemory-orig" data-first="{first}" data-last="{last}" data-gender="{gender}">Use the details I entered for {first} {last}</a></div></div>';
var html2="<div class=\"form-row\">The person you're running in memory of doesn't have a JustGiving page. We'll create one for them using the details you entered.</div>";
html2+='<div class="form-row"><div class="lrg-button full-button">';
html2+='<a href="#" class="inmemory-orig" data-first="{first}" data-last="{last}" data-gender="{gender}">Use the details I entered for <br>{first} {last}</a></div></div>';
if(typeof data=="undefined"){data={status:"success"}
}if(data.status!="success"||searchButton.length==0){return
}cruk.searchInMemory.select(box);
searchButton.hide().after(clone);
box.delegate(".clone-button","click",function(e){var fields=box.find(".inmemory-firstname, .inmemory-lastname"),allValid=true;
e.preventDefault();
fields.each(function(){var field=$(this),rules={"f1-inMemoryFirstname":{minlength:2,firstname:true},"f1-inMemoryLastname":{minlength:2,surname:true}};
field.addClass("required").rules("add",rules[field.attr("id")]);
if(!field.valid()){allValid=false
}setTimeout(function(){field.removeClass("required").rules("remove")
},30)
});
if(allValid){if($(this).parent().hasClass("alt-button")){_gaq.push(["_trackEvent","EntryForm","Thankyou","InMemory_SearchAgain"])
}else{_gaq.push(["_trackEvent","EntryForm","Thankyou","InMemory_Search"])
}$(this).prev().click()
}});
if(dropdown.length>0){html=html.replace(/\{first\}/g,box.find(".inmemory-firstname").val());
html=html.replace(/\{last\}/g,box.find(".inmemory-lastname").val());
html=html.replace(/\{gender\}/g,box.find(".inmemory-gender").val());
if(isSearch){dropdown.focus()
}box.find(".choose-buttons").html(html);
box.find(".clone-button").text("Search again").parent().addClass("alt-button")
}else{if(isSearch){html2=html2.replace(/\{first\}/g,box.find(".inmemory-firstname").val());
html2=html2.replace(/\{last\}/g,box.find(".inmemory-lastname").val());
html2=html2.replace(/\{gender\}/g,box.find(".inmemory-gender").val());
box.find(".choose-buttons").html(html2);
box.find(".clone-button").text("Search again").parent().addClass("alt-button")
}}if(isFundraise){box.removeClass("linear");
box.find("input[type=text], select").addClass("lrg");
box.find(".full-button").removeClass("full-button").find("a").addClass("left")
}box.delegate(".inmemory-drop, .inmemory-orig","click",function(e){e.preventDefault();
if($(this).hasClass("inmemory-drop")){dropdown.addClass("required");
if(dropdown.valid()){$(".inmemory-choice").find("input[value=choice-drop]").attr("checked",true);
cruk.searchInMemory.select(box);
_gaq.push(["_trackEvent","EntryForm","Thankyou","InMemory_UseSearchResults"])
}setTimeout(function(){dropdown.removeClass("required")
},30)
}else{$(".inmemory-choice").find("input[value=choice-orig]").attr("checked",true);
cruk.searchInMemory.select(box);
_gaq.push(["_trackEvent","EntryForm","Thankyou","InMemory_UseMyDetails"])
}});
box.delegate(".inmemory-edit","click",function(e){e.preventDefault();
box.find(".color-block").parent().remove();
box.find(".main-inmemory").show();
$(".inmemory-choice :checked").attr("checked",false)
})
},select:function(box){var selected=$(".inmemory-choice input:checked").val(),droptext,clip,button,text,html='<div class="form-row"><div class="color-block">';
html+='<div class="buttons-right">';
html+='<a href="#" class="inmemory-edit"><span class="icon icon-arrow"></span> Edit</a></div>';
html+="{text}";
html+="</div></div>";
if(typeof selected=="undefined"){return
}droptext=box.find(".inmemory-results option:selected").text();
button=box.find(".inmemory-orig");
box.find(".hide-inmemory").hide();
if(selected=="choice-drop"){text=droptext.replace(",","<br>");
text=text.replace("(","<br>(Page created by ")
}else{if(typeof button.data("first")!="undefined"){box.find(".inmemory-firstname").val(button.data("first"));
box.find(".inmemory-lastname").val(button.data("last"));
box.find(".inmemory-gender").val(button.data("gender"))
}text=box.find(".inmemory-firstname").val()+" "+box.find(".inmemory-lastname").val()+"<br> ("+box.find(".inmemory-gender option:selected").text()+")"
}box.find(".hide-inmemory").after(html.replace("{text}",text));
box.find(".main-inmemory").hide();
box.find(".clone-button").text("Search").parent().removeClass("alt-button");
$(window).scrollTop(box.find(".color-block").offset().top-20)
}},"toggle-box":{onload:function(context){if(typeof context=="undefined"){context=$("body")
}context.find(".toggle-box").each(function(){var box=$(this),head=box.children(".tb-head");
head.find(".hint-more, .hint-less, .icon-arrow-up, .icon-arrow-down").remove();
if(!head.hasClass("tb-no-trigger")){head.append('<span class="hint-more">More info</span>'+'<span class="hint-less">Less info</span>'+'<span class="icon icon-arrow-up"></span>'+'<span class="icon icon-arrow-down"></span>');
head.wrap('<a href="#" class="tb-trigger" />').parent(".tb-trigger").bind("click",function(e){box.toggleClass("tb-active");
e.preventDefault();
if(box.hasClass("tb-active")&&box.hasClass("ga-voucher")){_gaq.push(["_trackEvent","EntryForm","PersonalDetails","VoucherCode"])
}else{if(box.hasClass("tb-active")&&box.hasClass("ga-create-join-group")){_gaq.push(["_trackEvent","EntryForm","PersonalDetails","CreateJoinGroup"])
}else{if(box.hasClass("ga-wysiwyg")){var label=box.find(".tb-head span:first").text()+" "+(box.hasClass("tb-active")?"MoreInfo":"LessInfo");
_gaq.push(["_trackEvent","EntryForm","Enter",label])
}}}})
}if(box.find(".error").length>0){box.addClass("tb-active")
}})
}},"toggle-events":{onload:function(){var availableRaces=$(".race-times .active-race").length,totalRaces=$(".race-times ol > li");
if(availableRaces===0){for(var i=0;
i<2;
i++){totalRaces.eq(i).show()
}}else{$(".active-race").each(function(){$(this).parent("li").show()
})
}$(".race-times div:not(.active-race)").parent("li").hide();
if((totalRaces.length>2&&availableRaces!==totalRaces.length)||(availableRaces<2&&totalRaces.length>=2)){$(".show-all").css("display","block")
}$(".show-all").click(function(e){var target=$(e.currentTarget);
target.toggleClass("tb-active");
if(target.hasClass("tb-active")){totalRaces.fadeIn(700)
}else{if(availableRaces===0){for(var i=2;
i<totalRaces.length;
i++){totalRaces.eq(i).hide()
}}else{$(".race-times div:not(.active-race)").parent("li").hide()
}}e.preventDefault()
})
}},"more-block":{onload:function(){$(".confirm-entry h4.toggle").each(function(){var heading=$(this),next=heading.next("h4.toggle"),i=0;
heading.nextAll().each(function(){var elem=$(this);
if(elem.is("h4.toggle")){i++
}if(i===0){elem.hide()
}});
heading.after($('<div class="mb-trigger"><a href="#">More info</a></div>'));
var trigger=heading.next(".mb-trigger");
trigger.click(function(e){e.preventDefault();
var i=0;
heading.nextAll().each(function(){var elem=$(this);
if(elem.is("h4.toggle")){i++
}if(i===0){elem.show()
}});
trigger.hide()
})
})
}},"map-toggle":{onload:function(){var elem=$("#map"),icon=$('<span class="icon icon-widget-toggle"></span>'),trigger="click";
if(!!("ontouchstart" in window)){trigger="touchend"
}if(elem.closest(".choose-event").length>0||$("#facebook-app").length!==0){return
}elem.addClass("widget-closed");
elem.children("h2").add(icon).bind(trigger,function(){elem.toggleClass("widget-closed")
});
elem.append(icon)
}},"watermark":{onload:function(){var watermarks=$("[data-watermark]");
watermarks.each(function(){var elem=$(this);
elem.bind("focus blur",function(evnt){cruk.watermark.trigger(elem,evnt)
});
elem.closest("form").bind("submit",function(evnt){cruk.watermark.trigger(elem,evnt)
});
cruk.watermark.trigger(elem)
})
},trigger:function(elem,evnt){var watermark=elem.attr("data-watermark");
value=elem.val();
if(typeof evnt!=="undefined"){if((evnt.type=="submit"&&value==watermark)||(evnt.type=="focus"&&value==watermark)){elem.attr("value","");
elem.removeClass("watermark-active")
}else{if(evnt.type=="blur"&&value==""){elem.val(watermark);
elem.addClass("watermark-active")
}}}else{if(value==""){elem.val(watermark);
elem.addClass("watermark-active")
}}}},skip:{onload:function(){$(".skip, .to-top a").click(function(){var href=$(this).attr("href");
href=href.replace(document.location,"");
$(href).is("a")?$(href).focus():$(href).find("a:first").focus()
})
}},"search-filter":{onload:function(){$("[name=searchFilter]").find("input, select").change(function(){document.searchFilter.submit()
})
}},"page-tools":{onload:function(){var size;
var printer='<a href="#page-tools" class="print-page" title="'+language[lang].print+'" class="print"><span class="access">'+language[lang].print+"</span></a>";
if($("#page-tools").length>0){var par=document.getElementById("page-tools");
var scr=document.createElement("script");
scr.type="text/javascript";
scr.async=true;
scr.src="https://apis.google.com/js/plusone.js";
window.___gcfg={google_analytics:false,gwidget:{google_analytics:false}};
window.___cfg=window.___gcfg;
var s=document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(scr,s);
$.getScript(""+location.protocol+"//platform.twitter.com/widgets.js",function(){twttr.events.bind("tweet",function(event){_gaq.push(["_trackSocial","twitter","tweet",""+document.title+""])
})
});
setTimeout(function(){window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];
if(d.getElementById(id)){return
}js=d.createElement(s);
js.id=id;
js.src="//platform.twitter.com/widgets.js";
fjs.parentNode.insertBefore(js,fjs);
return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)
}})
}(document,"script","twitter-wjs"))
},250);
size="Small"
}if($("#print-big").length>0){$("#print-big").prepend(printer);
size="Large"
}$(".print").bind("click",function(){_gaq.push(["_trackEvent",""+document.title+"",""+size+"","Print"]);
if(window.navigator.appName=="Opera"){setTimeout("window.print()",50)
}else{window.print()
}return false
})
}},friends:{onload:function(){$("#friends ul li").bind("mouseenter",function(){cruk.friends.hover($(this))
})
},hover:function(e){$("#friends ul li").removeClass("hover");
e.addClass("hover")
}},button:{onload:function(){$(".lrg-button input, .lrg-button a, .sml-button input, .sml-button a").bind("focusin focusout",function(event){cruk.button.keyboard(event.type,$(this).parent("span").parent("span"))
})
},keyboard:function(eve,e){eve==="focusin"?e.addClass("focus"):e.removeClass("focus")
}},"cruk-sites":{onload:function(){var cruk_sites=$("#cruk-sites");
var $select=$('<form id="cruk-sites" action="/" class="cruk-sites" />');
var $option=$("<option />");
$option.attr("value","").html("Please choose&hellip;");
$select.append($option);
cruk_sites.find("a").each(function(){$option=$("<option />");
$option.attr("value",$(this).attr("href")).html($(this).html());
$select.append($option)
});
cruk_sites.replaceWith($select);
$select.fadeIn();
$("#cruk-sites").wrapInner('<div class="form-row"><div class="field"><select id="other-sites"></select></div></div>');
$("#cruk-sites .field").before('<label for="other-sites">Our other websites</label>');
$("#cruk-sites select").change(function(){var $url=$(this).val();
$("#cruk-sites").attr("action",$url).submit()
})
}},"step-tracker":{onload:function(){}},"site-structure":{onload:function(){$("#site-structure > li > ul > li > ul").each(function(i){var href="child-section-"+i,header=$(this).prev("h3"),description=language[lang]["show-pages"]+" "+header.children("a").text();
$(this).hide().attr({id:href});
header.children("a").css({backgroundImage:"none",padding:0});
header.before('<a href="#'+href+'" title="'+description+'" class="toggle-child"><span class="access"> '+description+"</span></a>");
header.prev(".toggle-child").bind("click",function(){cruk["site-structure"].onclick($(this),header.children("a").text());
return false
})
})
},onclick:function(e,context){var href=e.attr("href");
href=href.replace(document.location,"");
if(!e.hasClass("expanded")){var description=language[lang]["hide-pages"]+" "+context;
$(href).slideDown("fast");
e.addClass("expanded").attr({title:description}).children("span").text(description)
}else{var description=language[lang]["show-pages"]+" "+context;
$(href).slideUp("fast");
e.removeClass("expanded").attr({title:description}).children("span").text(description)
}}},"help-tip":{onload:function(){$(".help-tip").each(function(i){var id="help-tip-"+i,handler=$(this).prev(".help");
$(this).attr({id:id,role:"tooltip"});
handler.find("span:not(.bg)").append(' <a href="#'+id+'" class="helper" aria-describedby="'+id+'" aria-required="false"><span class="access">'+language[lang]["help-tip"]+" "+handler.text().toLowerCase()+"</span></a>")
});
$(".helper").bind("focusin mouseenter focusout mouseleave",function(event){cruk["help-tip"].toggle(event.type,$(this))
})
},toggle:function(eve,e){var tip=e.attr("href").replace(window.location.href,"");
if(eve==="focusin"||eve==="mouseenter"){var position=e.position(),x=position.left+e.width()+5,y=position.top-($(tip).height()/2)+9;
$(tip).css({left:x,top:y})
}else{$(tip).removeAttr("style")
}}},map:{onload:function(){if($(document).width()>850){$.getScript(cruk.variables["script-path"]+"swfobject.2.2-min.js",function(){if($.browser.mozilla&&$.browser.version.slice(0,3)=="1.9"){setTimeout(function(){cruk.map.setup()
},200)
}else{cruk.map.setup()
}})
}$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCfnWesE1iaMb4UK2m_2owW-AORa5eR0lA&sensor=false&callback=cruk.map.callback");
cruk.map["search-terms"]={};
$("#cruk-areas area").each(function(){var term=$(this).attr("alt");
cruk.map["search-terms"][term.toLowerCase()]=$(this).attr("href")
})
},callback:function(){if($.validator){cruk.map.validate()
}else{$.getScript(cruk.variables["script-path"]+"validation-library-min.js",function(){if($.browser.mozilla&&$.browser.version.slice(0,3)=="1.9"){setTimeout(function(){cruk.map.validate()
},200)
}else{cruk.map.validate()
}})
}},validate:function(){$("#map form").validate({messages:{"search":error.term},errorPlacement:function(error,element){error.insertAfter("#map label[for=search]")
},errorElement:"span",submitHandler:function(form){var searchterm=$("#search").val();
if(typeof String.prototype.trim!=="function"){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")
}
}searchterm=searchterm.trim().toLowerCase();
searchterm=="london"?searchterm="greater london":0;
if(cruk.map["search-terms"][searchterm]){document.location.href=cruk.map["search-terms"][searchterm];
return false
}else{var geocoder=new google.maps.Geocoder();
searchterm=searchterm+((searchterm.toLowerCase().indexOf("jersey")>-1||searchterm.toLowerCase().indexOf("guernsey")>-1)?"":", UK");
geocoder.geocode({"address":searchterm},function(results,status){if(status==google.maps.GeocoderStatus.OK){$("#lat").val(results[0].geometry.location.lat());
$("#long").val(results[0].geometry.location.lng())
}form.submit()
})
}}})
},setup:function(){var size=$("#map").attr("class");
size=size.replace("map ","");
size=$.trim(size.replace("widget-closed",""));
if(swfobject.getFlashPlayerVersion().major>9&&size!="map-tiny"){$("#flash-map").empty().prepend(cruk.variables.loader);
var width,height;
switch(size){case"map-sml":width=188;
height=124;
break;
case"map-med":width=290;
height=195;
break;
case"map-big":width=400;
height=360;
break
}setTimeout(function(){var imgpath=flashpath+"/"+size+".swf",flashvars={},params={};
params.wmode="transparent";
var attributes={};
attributes.id="flash-map";
swfobject.embedSWF(imgpath,"flash-map",width,height,"9.0.0",flashpath+"/expressInstall.swf",flashvars,params,attributes)
},500)
}}},"slide-show":{onload:function(){var delay=slides.delay||(slides.delay=8000),controls='<menu><ol id="slide-controls-secondary" class="slide-controls-secondary list-inline" role="listbox"',slide='<ul id="slide-show" class="slide-show list-plain">';
slides.no==2?controls+=' class="two"':0;
controls+=">";
for(var i=1;
i<=slides.no;
i++){controls+="<li><a ";
i==1?controls+='class="active-slide" aria-selected="true" ':controls+='aria-selected="false" ';
controls+='href="#slide-'+i+'" role="option" id="slide-control-'+i+'"><span class="active-indicator"></span><span class="access">'+slides["slide-"+i+""].linktext+"</span></a></li>";
slide+='<li id="slide-'+i+'" aria-labelledby="slide-control-'+i+'" ';
i!=1?slide+='style="display:none;" aria-hidden="true" ':slide+='aria-hidden="false" ';
slide+='class="slide"><figure>'+slides["slide-"+i+""].img;
slides["slide-"+i+""].caption!=""?slide+='<figcaption><span class="caption">'+slides["slide-"+i+""].caption+"</span></figcaption>":0;
slide+="</figure></li>"
}controls+="</ol></menu>";
slide+="</ul>";
var arrow_controls='<div id="slide-controls-primary" class="slide-controls-primary">'+'<a href="#" class="icon icon-slide-left prev">'+'<span class="access">Go to previous slide</span>'+"</a>"+'<a href="#" class="icon icon-slide-right next">'+'<span class="access">Go to next slide</span>'+"</a>"+"</div>";
$("#slide-show").parent().append(arrow_controls);
$("#slide-show").parent().append(controls);
$("#slide-show").replaceWith(slide);
if(!($(document).width()<=850&&$("#facebook-app").length===0)){cruk["slide-show"].id=setInterval(function(){cruk["slide-show"].play()
},delay)
}$("#slide-controls-secondary a").bind("click",function(){if(!$(this).hasClass("active-slide")){clearInterval(cruk["slide-show"].id);
cruk["slide-show"].play($(this))
}return false
});
$("#slide-controls-primary .icon").bind("click",function(e){e.preventDefault();
var controls_secondary=$("#slide-controls-secondary"),active=controls_secondary.find("li:has(.active-slide)"),go=$(e.currentTarget).has(".prev").length?active.prev().find("a"):active.next().find("a");
if(!go.length){go=$(e.currentTarget).has(".prev").length?controls_secondary.find("a").last():controls_secondary.find("a").first()
}go.click()
})
},play:function(e){var current=$("#slide-controls-secondary .active-slide").attr("href");
current=current.replace(document.location,"");
if(e){var next=e.attr("href");
next=next.replace(document.location,"");
next=parseInt(next.replace("#slide-",""))
}else{var next=current.replace("#slide-","");
next=parseInt(next);
next==slides.no?next=1:next=next+1
}var newslide="#slide-"+next,active="#slide-control-"+next;
$("#slide-controls-secondary a").removeAttr("class").attr({"aria-selected":"false"});
$(current).attr({"aria-hidden":"true"}).hide();
$(newslide).attr({"aria-hidden":"false"}).show();
$(active).addClass("active-slide").attr({"aria-selected":"true"})
}},"google-map":{onload:function(){$("#google-map").prepend(cruk.variables.loader);
setTimeout(function(){var location=new google.maps.LatLng(crukmap.latitude,crukmap.longitude),maptions={zoom:15,center:location,scrollwheel:false,mapTypeId:google.maps.MapTypeId.ROADMAP},map=new google.maps.Map(document.getElementById("google-map"),maptions);
setTimeout(function(){cruk["google-map"].icon(map,location,maptions)
},1500)
},1000)
},icon:function(map,location,maptions){var image=new google.maps.MarkerImage(crukmap.marker,new google.maps.Size(23,33),new google.maps.Point(0,0),new google.maps.Point(10,30)),shadow=new google.maps.MarkerImage(crukmap.shadow,new google.maps.Size(38,18),new google.maps.Point(0,0),new google.maps.Point(-2,15)),marker=new google.maps.Marker({position:location,map:map,shadow:shadow,icon:image,animation:google.maps.Animation.DROP});
var information='<div class="map-info" style="width:250px;padding:0 5px;">';
information+="<h3>"+crukmap.venue+"</h3>";
information+='<img src="'+crukmap.img+'" alt="'+crukmap.alt+'" style="float:left;border:1px solid #d8dfea;margin:0 10px 0 0;width:100px;height:100px;" />';
information+="<p>"+crukmap.address+"</p>";
information+="</div>";
var infowindow=new google.maps.InfoWindow({pixelOffset:new google.maps.Size(20,0),content:information});
setTimeout(function(){infowindow.open(map,marker)
},1000);
infowindow.on=true;
google.maps.event.addListener(marker,"click",function(){if(infowindow.on){infowindow.close();
map.panTo(location);
infowindow.on=false
}else{infowindow.open(map,marker);
infowindow.on=true
}});
google.maps.event.addListener(infowindow,"closeclick",function(){map.panTo(location);
infowindow.on=false
});
$("#google-map").prepend('<a href="#google-map" id="reset-map">Reset the map</a>');
$("#reset-map").click(function(){if(map.getStreetView().getVisible()){map.getStreetView().setVisible(false)
}infowindow.close();
infowindow.open(map,marker);
infowindow.on=true;
map.setOptions(maptions);
return false
})
}},"search-results-map":{onload:function(){var mapSize=$("#google-map").width();
$("#google-map").height(mapSize);
$("#search-results-tabs").show();
$("#tab-items #search-results-list-tab a").addClass("active-tab");
$("#search-results-map").hide();
$("#tab-items #search-results-list-tab a").click(function(){$("#tab-items #search-results-list-tab a").addClass("active-tab");
$("#tab-items #search-results-map-tab a").removeClass("active-tab");
$("#search-results-list").show();
$("#search-results-map").hide();
return false
});
$("#tab-items #search-results-map-tab a").click(function(){$("#tab-items #search-results-list-tab a").removeClass("active-tab");
$("#tab-items #search-results-map-tab a").addClass("active-tab");
$("#search-results-list").hide();
$("#search-results-map").show();
var locations=[];
var loc=-1;
$(".event","#events").each(function(){var name=$(this).children(".event-name").text(),details=$(this).children(".event-name").find("a").attr("href"),latitude=$(this).children(".event-latitude").text(),longitude=$(this).children(".event-longitude").text(),date=$(this).children(".event-date").text(),time=$(this).children(".event-time").text(),desc=$(this).children(".event-desc").text(),distance=$(this).children(".event-distance").html(),infoContainer=$(this).children(".event-info");
var info=[];
info[0]=infoContainer.find("a");
info[1]=infoContainer.find(".wrap > div")||"";
var enter_button=info[1].html();
if(info[1].attr("class")=="sml-button"){enter_button='<div class="sml-button">'+info[1].html()+"</div>"
}var event_title=$(info[0]).find("span.access").html();
if(event_title!=null){event_title=event_title.replace(/[0-9]?[0-9]k/,"");
if(loc<0||name!==locations[loc].name){loc++;
locations[loc]={};
locations[loc].name=name;
locations[loc].latitude=latitude;
locations[loc].longitude=longitude;
locations[loc].html="<h2>"+event_title+"</h2>"
}locations[loc].html+='<div class="em-entry">';
locations[loc].html+='<div class="em-synopsis">';
locations[loc].html+='<div class="event-date">'+date+"</div>";
locations[loc].html+='<div class="event-time">'+time+"</div>";
locations[loc].html+='<div class="event-desc">'+desc+"</div>";
locations[loc].html+='<div class="event-distance"><span class="label">Distance:</span> '+distance+"</div>";
locations[loc].html+="</div>";
locations[loc].html+='<div class="em-actions">';
locations[loc].html+=enter_button;
locations[loc].html+='<a class="event-details" href="'+details+'">Event details</a>';
locations[loc].html+="</div>";
locations[loc].html+="</div>"
}});
function createMarker(name,latlng,icon,shadow,html){var contentString=html;
var marker=new google.maps.Marker({position:latlng,map:map,icon:icon,shadow:shadow,title:name,zIndex:Math.round((latlng.lat())*100000)});
google.maps.event.addListener(marker,"click",function(){infowindow.setContent(contentString);
infowindow.open(map,marker);
$("#markerClick").trigger("click")
})
}var myOptions={zoom:7,center:new google.maps.LatLng(locations[0].latitude,locations[0].longitude),scrollwheel:false,mapTypeId:google.maps.MapTypeId.ROADMAP};
var map=new google.maps.Map(document.getElementById("google-map"),myOptions);
var icon=new google.maps.MarkerImage(crukmap.marker,new google.maps.Size(23,33),new google.maps.Point(0,0),new google.maps.Point(10,30));
var shadow=new google.maps.MarkerImage(crukmap.shadow,new google.maps.Size(38,18),new google.maps.Point(0,0),new google.maps.Point(-2,15));
var infowindow=new google.maps.InfoWindow({size:new google.maps.Size(350,100)});
for(loc in locations){var title=locations[loc].name;
var html='<div class="event-marker-wrap">'+locations[loc].html+"</div>";
var point=new google.maps.LatLng(locations[loc].latitude,locations[loc].longitude);
var marker=createMarker(title,point,icon,shadow,html)
}var bounds=new google.maps.LatLngBounds();
for(loc in locations){bounds.extend(new google.maps.LatLng(locations[loc].latitude,locations[loc].longitude))
}map.fitBounds(bounds);
$("#search-results-map #google-map").prepend('<a href="#google-map" id="reset-map">Reset the map</a>');
$("#reset-map").click(function(){if(map.getStreetView().getVisible()){map.getStreetView().setVisible(false)
}infowindow.close();
infowindow.open(map,marker);
infowindow.on=true;
map.setOptions(myOptions);
return false
});
return false
})
}},"email-friends":{clear:function(emailfriends){$("#email-friends input[type=text], #email-friends textarea").val("");
emailfriends.resetForm();
$("#email-friends input[type=checkbox]").attr({checked:false})
},submit:function(form){var content='<a href="#content" class="close-modal"><span class="access">'+language[lang].close+"</span></a>";
$("#ajax-fragment").remove();
$("#modal .wrap").prepend("<h2>"+language[lang]["please-wait"]+"</h2>"+cruk.variables["loader-sml"]);
var secure=location.protocol==="https:"?"?secure=true":"?secure=false";
$.ajax({type:"POST",url:form.attr("action")+secure,data:form.serialize(),dataType:"html",timeout:15000,error:function(){content+='<h2 id="modal-header">'+language[lang].sorry+"</h2><p>"+language[lang].error+'<div class="submit-row"><span class="lrg-button"><span><a href="'+form.attr("action")+'">'+language[lang]["continue"]+"</a></span></span></div></p>";
$("#modal .wrap").html(content).css({minHeight:0});
cruk.modal.close()
},success:function(data){$("#modal .wrap").html($(data).find("#ajax-fragment")).prepend(content).css({minHeight:0});
cruk.modal.close();
cruk.button.onload()
}})
},validate:function(){var emailfriends=$("#email-friends").validate({rules:{"contact-name":{lettersonly:true,minlength:2},"email-address":{minlength:7,email:true},"friends-addresses":{emails:true,required:true}},messages:{"contact-name":{required:"Please enter your first name.",lettersonly:"Please enter a valid first name.",minlength:"Please enter a valid first name."},"email-address":{required:"Please enter a your email address.",minlength:"Please enter a valid email address.",email:"Please enter a valid email address."},"friends-addresses":"Please enter valid email addresses and ensure they are separated by commas.",message:{required:"Please enter a message."}},focusInvalid:false,wrapper:'div class="error-msg"',errorPlacement:function(error,element){element.closest(".field").prepend(error)
},submitHandler:function(form){cruk["email-friends"].submit($("#email-friends"));
return false
}});
$("#email-friends .submit").prepend('<a id="clear-details" href="#contact-name">'+language[lang].clear+"</a>");
$("#clear-details").bind("click",function(){cruk["email-friends"].clear(emailfriends);
return false
});
$("#email-friends input, #email-friends textarea").bind("focusout",function(){$(this).valid()
})
}},modal:{onload:function(){$("#modal").length===0?$("body").append('<div id="modal" role="dialog" aria-labelledby="modal-header" style="display:none;"><div class="stroke"><div class="wrap"></div></div></div>'):0;
!$.modal?$.getScript(cruk.variables["script-path"]+"modal-min.js"):0;
$(".modal").attr({"aria-describedby":"modal"}).bind("click",function(){if(!($(this).hasClass("email")&&!!("ontouchstart" in window))){cruk.modal.onclick($(this));
return false
}})
},onclick:function(e){var content='<a href="#content" class="close-modal"><span class="access">'+language[lang].close+"</span></a>";
e.hasClass("lrg")?$("#modal").addClass("lrg"):0;
if(e.hasClass("fragment")){$("#modal .wrap").prepend(content+"<h2>"+language[lang]["please-wait"]+"</h2>"+cruk.variables["loader-sml"]);
$.ajax({type:"GET",url:e.attr("href"),data:{},dataType:"html",timeout:10000,error:function(data){content+='<h2 id="modal-header">'+language[lang].sorry+"</h2><p>"+language[lang].error+'<div class="submit-row"><span class="lrg-button"><span><a href="'+e.attr("href")+'">'+language[lang]["continue"]+"</a></span></span></div></p>";
$("#modal .wrap").html(content);
$("#modal-container").css("opacity",1);
cruk.modal.close()
},success:function(data){$("#modal .wrap").html($(data).find("#ajax-fragment")).prepend(content);
var modal=$("#modal-container"),wrap=modal.find(".wrap"),ajax_fragment_height=$("#ajax-fragment").height();
wrap.css({height:$(window).height()-(((wrap.outerHeight(true)-ajax_fragment_height)*2)+30),maxHeight:ajax_fragment_height});
cruk.modal.position();
if(e.hasClass("email")){if($.validator){cruk["email-friends"].validate()
}else{$.getScript(cruk.variables["script-path"]+"validation-library.js",function(){cruk["email-friends"].validate()
})
}}cruk.modal.close();
cruk.button.onload()
}})
}if(e.hasClass("remove")){content+='<form action="'+e.attr("href")+'" method="post"><div class="remove-from-basket"><h2>Remove the below?</h2>';
content+="<p>Please confirm you would like to remove the following:</p>";
content+='<ul><li><input type="checkbox" checked="checked" disabled="disabled" class="access" />';
content+='<label for="remove-entrant"><span class="access">Remove </span>'+e.children("span").text()+' <span class="access">from your order</span></label></li></ul>';
content+='<div class="submit-row">';
content+='<div class="lrg-button">';
content+='<input type="reset" class="close" value="Cancel" />';
content+="</div>";
content+='<div class="lrg-button">';
content+='<input type="submit" value="Remove" />';
content+="</div>";
content+="</div></div></form>";
$("#modal .wrap").prepend(content);
cruk.button.onload();
cruk.modal.close()
}$("#modal").modal({overlayId:"modal-overlay",containerId:"modal-container",modal:true,close:true,closeHTML:"",focus:true,containerCss:{"height":"100%","max-height":$(window).height()},onClose:function(){cruk.modal.remove()
},onShow:function(){return !e.hasClass("remove")?$("#modal-container").css("opacity",0):cruk.modal.position()
}})
},close:function(){$("#modal .close, #modal .close-modal").bind("click",function(){cruk.modal.remove();
return false
})
},remove:function(){$.modal.close();
$("#modal").removeClass("lrg");
$("#modal .wrap").empty()
},position:function(){var modal=$("#modal-container");
modal.css({height:"auto",top:($(window).height()-modal.find(".wrap").outerHeight(true))*0.5,opacity:1})
}},accordion:{onload:function(){$(".accordion-content").hide();
$(".accordion-header").each(function(i){var href="accordion-"+i;
$(this).wrapInner('<a href="#'+href+'" />').next(".accordion-content").attr({id:href})
});
$(".accordion-header a").bind("click",function(){cruk.accordion.onclick($(this).parent(".accordion-header"));
return false
})
},onclick:function(e){if(e.hasClass("active")){e.next(".accordion-content").slideUp("fast",function(){$(this).prev(".accordion-header").removeClass("active");
$(this).parents("li.active").removeClass("active")
})
}else{var accordion=e.closest(".accordion");
accordion.find(".accordion-content").slideUp("fast");
accordion.find(".accordion-header").removeClass("active");
e.addClass("active").next(".accordion-content").slideDown("fast");
e.parents("li").addClass("active")
}}},"external-links":{onload:function(){$(".external").append('<span class="access"> ('+language[lang]["new-window"]+")</span>").attr("target","_blank");
$(".popwin").bind("click",function(){cruk["external-links"].onclick($(this));
return false
})
},onclick:function(e){var options="toolbar=no, menubar=no, location=no, scrollbars=yes, status=0, resizable=0, width=800, height=600, left="+(screen.width-640)/2+", top="+(screen.height-600)/2;
window.open(e.attr("href"),"Share",options)
}}};
$(function(){$("#email-friends .submit-row a.link-padd").live("click",function(){if($("#modal-container").length){$.modal.close();
return false
}});
function attachEvent(element,evtId,handler){if(element.addEventListener){element.addEventListener(evtId,handler,false)
}else{if(element.attachEvent){var ieEvtId="on"+evtId;
element.attachEvent(ieEvtId,handler)
}else{var legEvtId="on"+evtId;
element[legEvtId]=handler
}}}function isPortrait(){return window.innerHeight>window.innerWidth
}function onBeforeZoom(evt){var viewportmeta=document.querySelector('meta[name="viewport"]');
if(viewportmeta){viewportmeta.content="width=max-device-width, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
}}function onAfterZoom(evt){var viewportmeta=document.querySelector('meta[name="viewport"]');
if(viewportmeta){viewportmeta.content="width=device-width"
}}function disableZoom(){var inputs=document.getElementsByTagName("input");
for(var i=0;
i<inputs.length;
i++){attachEvent(inputs[i],"focus",onBeforeZoom);
attachEvent(inputs[i],"blur",onAfterZoom)
}var inputs2=document.getElementsByTagName("select");
for(var i=0;
i<inputs2.length;
i++){attachEvent(inputs2[i],"focus",onBeforeZoom);
attachEvent(inputs2[i],"blur",onAfterZoom)
}var inputs3=document.getElementsByTagName("textarea");
for(var i=0;
i<inputs3.length;
i++){attachEvent(inputs3[i],"focus",onBeforeZoom);
attachEvent(inputs3[i],"blur",onAfterZoom)
}}window.addEventListener("resize",function(){if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)){var height=$(window).height();
var width=$(window).width();
if(width>height){var viewportmeta=document.querySelector('meta[name="viewport"]');
if(viewportmeta){viewportmeta.content="width=device-width"
}}else{attachEvent(window,"load",disableZoom)
}}},false);
if(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)){if(isPortrait()){attachEvent(window,"load",disableZoom)
}}$("script").each(function(){var source=$(this).attr("src");
if(typeof source!=="undefined"&&source!==false){if(/assets\/scripts\/js\/document(.*?).js/g.test(source)){cruk.variables["script-path"]=source.replace("document-min.js","");
cruk.variables["script-path"]=cruk.variables["script-path"].replace("document.js","")
}}});
cruk.onload()
});