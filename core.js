var prevHref = "";
var isVisible = false;
var popupId = getId();
var imgId = getId();
var popup = "<div id='" + popupId + "' class='abioka-messagepop'><img id='" + imgId + "'></img></div>";
var loadingUrl = chrome.extension.getURL('loading.gif');
popup += "<div id='loading_" + popupId + "' class='abioka-messagepop abioka-messagepop-loading'><img src='" + loadingUrl + "'></img></div>"
appendToBody(popup);

var validHosts = ["imgur.com", "hizliresim.com", "pbs.twimg.com", "postimg.org", "tinypic.com"];

var xmlHttp = null;
var baseUrl = "http://littlethingsapi.abioka.com/api/imageviewer?url=";

chrome.storage.local.get('abiokaBaseUrl', function(result){
  if(!result || !result.abiokaBaseUrl){
      xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = SetLocalStorage;
      xmlHttp.open( "GET", "https://stream-viper.hyperdev.space/echo", true );
      xmlHttp.send( null );
    } else {
      baseUrl = result.abiokaBaseUrl;
    }
});

function SetLocalStorage() {
  if (xmlHttp.status == 200 ) {
    baseUrl = "https://stream-viper.hyperdev.space/?url=";
  }
  chrome.storage.local.set({'abiokaBaseUrl': baseUrl});
}

document.addEventListener('mousemove', function (e) {
  var srcElement = e.srcElement;
  if(srcElement.id === imgId)
    return;

  if (srcElement.nodeName == 'A' && (validHosts.indexOf(srcElement.hostname) > -1 || validHosts.indexOf(srcElement.hostname.split('.').slice(-2).join('.')) > -1)) {
    if(prevHref !== srcElement.href){
      var mouseHeight = event.pageY;
      var mouseWidth = event.pageX;

      css(imgId, 'max-width', 'none');
      css(imgId, 'max-height', 'none');

      setTimeout(function(){
        if(isVisible)
          return;

        css('loading_' + popupId, 'left', mouseWidth + "px");
        css('loading_' + popupId, 'top', mouseHeight + "px");
        css('loading_' + popupId, 'display','inline');
      }, 1000);

      var img = document.getElementById(imgId);
      var url = getUrl(srcElement.hostname, srcElement.href, srcElement.pathname);
      img.src = baseUrl + url;
      img.addEventListener('load', function() {
          var bodyHeight = window.scrollY + document.documentElement.clientHeight;
          var windowHeight = document.documentElement.clientHeight;
          var bodyWidth = document.documentElement.clientWidth;

          css(popupId, 'left', mouseWidth + "px");
          css(popupId, 'top', mouseHeight + "px");
          css(popupId, 'display','inline');

          var bottom = bodyHeight - mouseHeight;
          var top = mouseHeight;

          var imageHeight = document.getElementById(imgId).offsetHeight;
          if(imageHeight > bottom){
            if(windowHeight > imageHeight) {
              top = bodyHeight - imageHeight;
              if(imageHeight + 20 > bottom){
                top -= 20;
              }
            } else{
              top = window.scrollY + 20;
              css(imgId, 'max-height', windowHeight - 40 + "px");
            }
          }

          var right = bodyWidth - mouseWidth;
          var left = mouseWidth;

          var imageWidth = document.getElementById(imgId).offsetWidth;
          if(imageWidth > right){
            if(bodyWidth > imageWidth) {
              left = bodyWidth - imageWidth;
              if(imageWidth + 20 > right){
                left -= 20;
              }
            } else{
              left = 20;
              css(imgId, 'max-width', bodyWidth - 40 + "px");
            }
          }

          css(popupId, 'left', left + "px");
          css(popupId, 'top', top + "px");
          css(popupId, 'display','inline');
          css('loading_' + popupId, 'display','none');
          isVisible = true;
        }, false);

        img.addEventListener('error', function() {
          closePopup();
        }, false);
    }

    prevHref = srcElement.href;
  } else {
    prevHref = "";
    closePopup();
  }
}, false);

function closePopup(){
  css(popupId, 'display','none');
  css('loading_' + popupId, 'display','none');
  isVisible = false;
};

function appendToBody(html){
  document.body.insertAdjacentHTML('beforeend', html);
}

function css(id, key, value){
  document.getElementById(id).style[key] = value;
}

function getId(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

function getUrl(hostname, fullUrl, pathName){
  var result = fullUrl;
  if(hostname === "imgur.com"){
    result = "http://i.imgur.com/" + pathName.substr(pathName.indexOf('gallery/') + 'gallery/'.length) + ".png";
  } else if(hostname === "hizliresim.com"){
    result = "http://i.hizliresim.com/" + pathName + ".png";
  }
  return result;
}
