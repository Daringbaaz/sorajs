var soralink = {
    sora_included_links: "",
    sora_excluded_links: "",
}
soralink.rmProtocol = function(href) {
    var result = href;
    if (href.indexOf('https://') === 0) result = href.replace("https://", "");
    if (href.indexOf('http://') === 0) result = href.replace("http://", "");
    if (href.indexOf('//') === 0) result = href.replace("//", "");
    return result;
}
soralink.commaToArray = function(str){
    var array = str.replace(/\s+/g, "").split(",");
    return array.filter(function (el) {
      return el != null && el != "";
    });
}

soralink.buildLink = function(href){
    return soralink.me() + '?r=' + btoa(href);
}
soralink.in = function(needle, sourceArray){
	var inside = sourceArray.filter(function(e){
		if (e.indexOf('*') !== -1){
			e = e.replace('.', '\\.').replace('*', '.*');
			var reg = new RegExp(e);
			return needle.match(e) !== null;
		}
		return soralink.rmProtocol(needle).trim().indexOf(e) === 0;
	});
	return inside.length >= 1;	
}
soralink.shouldWeDoThat = function(url){
    if (this.in(url, this.sora_excluded_links)) return false
    if (this.sora_included_links.length < 1) return true;
    if (this.in(url, this.sora_included_links)) return true;
    return false;
}
soralink.me = function(){
    var jsscript = document.getElementsByTagName("script"); 
    for (var i = 0; i < jsscript.length; i++) { 
        var pattern = /assets\/js\/soralink\.js/i;
        if ( pattern.test( jsscript[i].getAttribute("src") ) ) {
            var dUrl = jsscript[i].getAttribute("src");
            dUrl = dUrl.split('wp-content/')[0];
            return dUrl;
        }
    }
}
soralink.run = function(){
    this.sora_included_links = this.commaToArray(typeof(sora_included_links)!="undefined"?sora_included_links:"");
    this.sora_excluded_links = this.commaToArray(window.location.hostname + ',' + (typeof(sora_excluded_links)!="undefined"?sora_excluded_links:""));
    var elementsArray = document.querySelectorAll("a[href]");
    elementsArray.forEach(function(elem) {
        var href = elem.href;
        if (soralink.shouldWeDoThat(href) == false) return;
        elem.href = soralink.buildLink(href);
    });
    
}