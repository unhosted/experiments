      function renderContact(obj) {
        return '<div id="summary" class="summary">'
          +'  <div class="avatar">'
          +'    <img src="'+obj.avatar+'">'
          +'  </div>'
          +'  <div>'
          +'    '+obj.name
          +'  </div>'
          +'  <br>'
          +'  <div class="contactButtons" id="contactButtons'+obj.contactId+'">'
          +'      <input type="submit" value="borrow" onclick="borrowA('+obj.contactId+');">'
          +'      <input type="submit" value="lend" onclick="lendA('+obj.contactId+');">'
          +'  </div>'
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
        //dead code:
        var tabLists = makeTabLists(contacts[i].tabs);
        if(tabLists.notif.length) {
           var notifs = '<div class="notifList"><h4>Notif:</h4><ul>';
          for(var j in tabLists.notif) {
            notifs += '<li>'+tabLists.notif[j].icon+tabLists.notif[j].description+'</li>';
          }
          li.innerHTML += notifs+'</ul></div>';
        }
        if(tabLists.track.length) {
           var tracks = '<div class="trackList"><h4>Track:</h4><ul>';
          for(var j in tabLists.track) {
            tracks += '<li>'+tabLists.track[j].icon+tabLists.track[j].description+'</li>';
          }
          li.innerHTML += tracks+'</ul></div>';
        }
        return '<h2>'+obj.name+'</h2>';
      }
