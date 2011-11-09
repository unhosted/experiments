      function renderContact(obj) {
        var str = '<div id="summary" class="summary">'
          +'  <div class="avatar">'
          +'    <img src="'+obj.avatar+'">'
          +'  </div>'
          +'  <div>'
          +'    '+obj.name
          +'  </div>'
          +'  <br>'
          +'  <div class="contactButtons" id="contactButtons'+obj.contactId+'">';
        for(var i in obj.actions) {
          str +='      <input type="submit" value="'+obj.actions[i]
            +'" onclick="contactAction('+obj.contactId+', \''+i+'\');">';
        }
        str += '  </div>'
          +'  <form class="contactDialog" id="borrowDialog'+obj.contactId+'">'
          +'    <input id="borrowInput'+obj.contactId+'">'
          +'    <input type="submit" value="Borrow" class="borrowButton" onclick="borrowB('+obj.contactId+');">'
          +'    <input type="submit" value="x" class="cancelButton" onclick="cancelBB('+obj.contactId+');">'
          +'  </form>'
          +'  <form class="contactDialog" id="lendDialog'+obj.contactId+'">'
          +'    <input id="lendInput'+obj.contactId+'">'
          +'    <input type="submit" value="Lend" class="lendButton" onclick="lendB('+obj.contactId+');">'
          +'    <input type="submit" value="x" class="cancelButton" onclick="cancelLB('+obj.contactId+');">'
          +'  </form>'
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
