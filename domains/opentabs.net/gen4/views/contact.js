var contactView = (function() {
  function renderDialog(userAddress, obj) {
    var str =
       '  <form class="contactDialog">';
    if(obj.input) {
      str += '    <input id="dialogInput'+userAddress+'">';
    }
    for(var i in obj.actions) {
      str += '    <input type="submit" value="'+obj.actions[i]+'" onclick="contactAction(\''+userAddress+'\', \''+i+'\');">'
    }
    return str + '  </form>';
  }
  function renderContact(obj) {
    var str = '<div id="summary" class="summary">'
      +'  <div class="avatar">'
      +'    <img src="'+obj.avatar+'">'
      +'  </div>'
      +'  <div>'
      +'    '+obj.name
      +'  </div>'
      +'  <br>'
      +'  <div class="contactButtons" id="contactButtons'+obj.userAddress+'">';
    for(var i in obj.actions) {
      str +='      <input type="submit" value="'+obj.actions[i]
        +'" onclick="controller.contactAction(\''+obj.userAddress+'\', \''+i+'\');">';
    }
    str += '  </div>'
      +'  <div id="dialog'+obj.userAddress+'">'
      +renderDialog(obj.userAddress, obj.actions)
      +'  </div>'
      +'</div>';
    if(obj.notif) {
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
