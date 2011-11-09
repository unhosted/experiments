var contactView = (function() {
  function renderContact(obj) {
    var str = '<div class="summary">'
      +'  <div class="avatar">'
      +'    <img src="'+obj.avatar+'">'
      +'  </div>'
      +'  <div>'
      +'    '+obj.name
      +'  </div>'
      +'  <br>';
    if(obj.actions) {
      var paramsSpec='{}';
      str += '  <div class="contactButtons" >';
      if(obj.actions.input) {
        var uniqueStr = obj.userAddress.replace('@', ':');
        paramsSpec = '{text: document.getElementById(\'input_'+uniqueStr+'\').value}';
        str += '    <input id="input_'+uniqueStr+'">';
      }
      for(var i in obj.actions) {
        if(i != 'input') {
          str +='      <input type="submit" value="'+obj.actions[i]
            +'" onclick="controller.contactAction(\''+obj.userAddress+'\', \''+i
            +'\', '+paramsSpec+');">';
        }
      }
    }
    str += '  </div>'//end contactButtons
      +'</div>';//end summary
    if(obj.notif) {//TODO: add tabActions in here
       var notifs = '<div class="notifList"><h4>Notif:</h4><ul>';
      for(var j in obj.notif) {
        notifs += '<li>'+obj.notif[j].icon+obj.notif[j].description+'</li>';
      }
      str += notifs+'</ul></div>';
    }
    if(obj.track) {
      var tracks = '<div class="trackList"><h4>Track:</h4><ul>';
      for(var j in obj.track) {
        tracks += '<li>'+obj.track[j].icon+obj.track[j].description+'</li>';
      }
      str += tracks+'</ul></div>';
    }
    return str;
  }
  return {
    renderContact: renderContact,
  };
})();
