var prevHref = "";
var popupId = getId();
var imgId = getId();
var popup = "<div id='" + popupId + "' class='abioka-messagepop'><img id='" + imgId + "'</img></div>"
$( "body" ).append(popup);

document.addEventListener('mousemove', function (e) {
  var srcElement = e.srcElement;

  if (srcElement.nodeName == 'A' && (srcElement.hostname == "imgur.com" || srcElement.hostname == "i.imgur.com" || srcElement.hostname == "hizliresim.com" || srcElement.hostname == "i.hizliresim.com" )) {
    if(prevHref !== srcElement.href){
      $('#' + imgId).attr('src', 'http://littlethingsapi.abioka.com/api/imageviewer?url=' + srcElement.href);
      $('#' + popupId).css('left', event.pageX);
      $('#' + popupId).css('top', event.pageY);
      $('#' + popupId).css('display','inline');
    }

    prevHref = srcElement.href;
  } else {
    prevHref = "";
    $('#' + popupId).css('display','none');
  }
}, false);

function getId(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}
