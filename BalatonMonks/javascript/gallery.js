// JavaScript Document
dojo.require("dojo.parser");	// find widgets		

dojo.addOnLoad(function(){
	//Initialize the first SlideShow with an ItemFileReadStore
	dojo.parser.parse(dojo.body());
	imageItemStore.fetch({
						 query: {},
						 onItem: showThumbnail,
						 onComplete: thumbnailsLoaded
						 });
						 
});

var thumbTemplate = "<img class='thumbnail unselected' src='%thumbnail%' id='%id%' lrgImg='%large%' title='%title%'/>";
var largeTemplate = "<img src='%large%' title='%title%'/><p>%title%</p>";
var htmlBuffer = "";
var idCtr = 0;
var selectedThumb = null;
			
function showThumbnail(myItem, request) {
	var html = thumbTemplate;
	html = html.replace(/%thumbnail%/, myItem['thumb']);
	html = html.replace(/%id%/, "thumb"+idCtr);
	idCtr = idCtr + 1;
	html = html.replace(/%large%/, myItem['large']);
	html = html.replace(/%title%/, myItem['title']);
	htmlBuffer += html;
}
function thumbnailsLoaded(nullity, request) {
	dojo.byId("thumbnails").innerHTML = htmlBuffer;
	var thumbnails = dojo.query(".thumbnail");
	for (var i = 0; i < thumbnails.length; i++) {
		dojo.connect(thumbnails[i], "onclick", 'thumbnailSelect');
		dojo.connect(thumbnails[i], "onmouseover", 'thumbnailOver');
		dojo.connect(thumbnails[i], "onmouseout", 'thumbnailOut');
	}
	if (thumbnails.length > 0) {
		thumbnailSelect({ currentTarget: thumbnails[0] });
	}
}
function thumbnailSelect(evt) {
	if (selectedThumb) {
		dojo.removeClass(selectedThumb, "selected");
		dojo.addClass(selectedThumb, "unselected");
	}
	selectedThumb = evt.currentTarget;
	dojo.removeClass(selectedThumb, "unselected");
	dojo.addClass(selectedThumb, "selected");
	var html = largeTemplate;
	html = html.replace(/%large%/g, selectedThumb.getAttribute("lrgImg"));
	html = html.replace(/%title%/g, selectedThumb.getAttribute("title"));
	dojo.byId("largeImg").innerHTML = html;
}
function thumbnailOver(evt) {
	if (evt.currentTarget !== selectedThumb) {
		dojo._setOpacity(evt.currentTarget, .5);
	}
}
function thumbnailOut(evt) {
	dojo._setOpacity(evt.currentTarget, .999);	// another IE idiocy
}