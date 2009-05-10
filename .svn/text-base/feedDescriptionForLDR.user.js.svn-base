// ==UserScript==
// @name          Feed description for LDR
// @namespace     http://blog.tkmr.org/javascripts/feedDescriptionLDRSubscribe.user.js
// @description   Show feed description for LDR subscribe page (http://reader.livedoor.com/subscribe/*)
// @include       http://reader.livedoor.com/subscribe/*
// ==/UserScript==
//
// auther:  tkmr http://blog.tkmr.org/
// version: 0.1 - 2007/11/04

(function() {
  //max display feed items
  var max_display_items = 4;
	
  if (typeof unsafeWindow == 'undefined') {
    window.unsafeWindow = window;
  }
  var FD = {
    feed: function(url, node){
      this.url = url;
	  var htmlNode = node;
      this.read = function(){
        FD.read(this.url, function(xmlDoc){
          if(xmlDoc.getElementsByTagName("feed").length > 0){
            //Atom
            var xpath = "//myns:entry/myns:title";
            var ns = function() {return 'http://www.w3.org/2005/Atom';}
          }else{
            if(xmlDoc.getElementsByTagName("RDF").length > 0){
              //RSS 1.0
              var xpath = "//myns:item/myns:title";
              var ns = function() {return 'http://purl.org/rss/1.0/';}								
            }else{
              //RSS 2.0
              var xpath = "//item/title";
              var ns = null;
            }
          }
          var ite = xmlDoc.evaluate(xpath, xmlDoc, ns, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
          var node = ite.iterateNext();
          var div = document.createElement("div");
          //div.innerHTML = "<strong>feed description</strong>";
          var count = 0;
          while(node && count < max_display_items){
            div.innerHTML += "<div>"+node.textContent+"</div>";
            node = ite.iterateNext();
            count += 1;
          }
          div.style.margin = "3px 0px 0px 11px";
          htmlNode.parentNode.appendChild(div);
        });
      }
    },
		
    read: function(url, doOnLoad){
      GM_xmlhttpRequest({method: "GET", url: url, onload: function(res){
        doOnLoad((new DOMParser).parseFromString(res.responseText, "application/xml"));
      }});
    },
	
    feedCreate: function(){
      var feedLinks = document.evaluate("//a[@class='feedlink']", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      var node = feedLinks.iterateNext();
      while(node){
        var feed = new FD.feed(node.href, node);
        feed.read();
        node = feedLinks.iterateNext();
      }
    },

    log: function(message){
      GM_log(message);
    }
  }

  var onload = unsafeWindow.onload;
  unsafeWindow.onload = function(){
    FD.feedCreate();
    if(typeof(onload)=="function"){ onload(); }		
  }
})();