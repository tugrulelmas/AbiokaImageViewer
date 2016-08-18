var prevHref = "";
var isVisible = false;
var popupId = getId();
var imgId = getId();
var popup = "<div id='" + popupId + "' class='abioka-messagepop'><img id='" + imgId + "'></img></div>";
var loadingUrl = chrome.extension.getURL('loading.gif');
popup += "<div id='loading_" + popupId + "' class='abioka-messagepop abioka-messagepop-loading'><img src='" + loadingUrl + "'></img></div>"
$( "body" ).append(popup);

document.addEventListener('mousemove', function (e) {
  var srcElement = e.srcElement;
  if(srcElement.id === imgId)
    return;

  if (srcElement.nodeName == 'A' && (srcElement.hostname == "imgur.com" || srcElement.hostname == "i.imgur.com" || srcElement.hostname == "hizliresim.com" || srcElement.hostname == "i.hizliresim.com" )) {
    if(prevHref !== srcElement.href){
      var mouseHeight = event.pageY;
      var mouseWidth = event.pageX;
      var bodyHeight = $(window).scrollTop() + $(window).height();
      var windowHeight = $(window).height();
      var bodyWidth = $(window).width();

      $('#' + imgId).css('max-width', 'none');
      $('#' + imgId).css('max-height', 'none');

      setTimeout(function(){
        if(isVisible)
          return;

        $('#loading_' + popupId).css('left', mouseWidth);
        $('#loading_' + popupId).css('top', mouseHeight);
        $('#loading_' + popupId).css('display','inline');
      }, 1000);

      $('#' + imgId)
        .attr('src', 'http://littlethingsapi.abioka.com/api/imageviewer?url=' + srcElement.href)
        .one("load", function() {
          $('#' + popupId).css('left', mouseWidth);
          $('#' + popupId).css('top', mouseHeight);
          $('#' + popupId).css('display','inline');

          var bottom = bodyHeight - mouseHeight;
          var top = mouseHeight;

          var imageHeight = $('#' + imgId).height();
          if(imageHeight > bottom){
            if(windowHeight > imageHeight) {
              top = bodyHeight - imageHeight;
              if(imageHeight + 20 > bottom){
                top -= 20;
              }
            } else{
              top = $(window).scrollTop() + 20;
              $('#' + imgId).css('max-height', windowHeight - 40);
            }
          }

          var right = bodyWidth - mouseWidth;
          var left = mouseWidth;

          var imageWidth = $('#' + imgId).width();
          if(imageWidth > right){
            if(bodyWidth > imageWidth) {
              left = bodyWidth - imageWidth;
              if(imageWidth + 20 > right){
                left -= 20;
              }
            } else{
              left = 20;
              $('#' + imgId).css('max-width', bodyWidth - 40);
            }
          }

          $('#' + popupId).css('left', left);
          $('#' + popupId).css('top', top);
          $('#' + popupId).css('display','inline');
          $('#loading_' + popupId).css('display','none');
          isVisible = true;
        })
        .on("error", function() {
          closePopup();
        });
    }

    prevHref = srcElement.href;
  } else {
    prevHref = "";
    closePopup();
  }
}, false);

function closePopup(){
  $('#' + popupId).css('display','none');
  $('#loading_' + popupId).css('display','none');
  isVisible = false;
};

function getId(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}
