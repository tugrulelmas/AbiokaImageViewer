var prevHref = "";
var isVisible = false;
var popupId = getId();
var imgId = getId();
var popup = "<div id='" + popupId + "' class='abioka-messagepop'><img id='" + imgId + "'></img></div>";
var loadingUrl = chrome.extension.getURL('loading.gif');
popup += "<div id='loading_" + popupId + "' class='abioka-messagepop abioka-messagepop-loading'><img src='" + loadingUrl + "'></img></div>";
popup += "<img style='display:none' id='temp_" + imgId + "'></img>";
appendToBody(popup);

var validHosts = ["imgur.com", "hizliresim.com", "pbs.twimg.com", "postimg.org", "tinypic.com"];
var baseUrl = "https://stream-viper.hyperdev.space/?url=";
var img = document.getElementById(imgId);
var isError = false;

document.addEventListener('mousemove', function (e) {
  var srcElement = e.srcElement;
  if(srcElement.id === imgId)
    return;

  if (srcElement.nodeName == 'A' && (validHosts.indexOf(srcElement.hostname) > -1 || validHosts.indexOf(srcElement.hostname.split('.').slice(-2).join('.')) > -1)) {
    if(prevHref !== srcElement.href){
      isError = false;
      var mouseHeight = event.pageY;
      var mouseWidth = event.pageX;

      css(imgId, 'max-width', 'none');
      css(imgId, 'max-height', 'none');

      setTimeout(function(){
        if(isVisible || isError)
          return;

        css('loading_' + popupId, 'left', mouseWidth + "px");
        css('loading_' + popupId, 'top', mouseHeight + "px");
        css('loading_' + popupId, 'display','inline');
      }, 1000);

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

          var imageHeight = img.offsetHeight;
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

          var imageWidth = img.offsetWidth;
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
    }

    prevHref = srcElement.href;
  } else {
    prevHref = "";
    closePopup();
  }
}, false);

// check the hyperdev is available now.
var tempImg = document.getElementById('temp_' + imgId);
tempImg.src = "https://cdn.hyperdev.com/c5a3c253-8ef5-4f27-bac0-6b98c09569f9%2Fsample.jpg";
tempImg.addEventListener('error', function() {
  // hyperdev is not available now.
  // use abioka server
  baseUrl = "http://littlethingsapi.abioka.com/api/imageviewer?url=";
}, false);

img.addEventListener('error', function() {
  closePopup();
  isError = true;
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
