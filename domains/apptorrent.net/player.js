/* player.js for appTorrent app objects. AGPL-licensed by the Unhosted project */

function Player() {
  return {
    play: function(appTorrent) {
        /////////////////
       // extract css //
      /////////////////
      for(var fileName in appTorrent.css) {
        var cssRulesNoClosingAccolade = appTorrent.css[fileName].replace(new RegExp( '[\\n\\r]', 'g' ), '').split('}')
        for(var i in cssRulesNoClosingAccolade) {
          if(cssRulesNoClosingAccolade[i].length) {
            document.getElementsByTagName('style')[0].sheet.insertRule(cssRulesNoClosingAccolade[i] + '}', i)
          }
        }
      }

        ////////////////
       // extract js //
      ////////////////
      for(var fileName in appTorrent.js) {
         var script= document.createElement('script')
         script.type= 'text/javascript'
         script.id= fileName
         script.innerHTML = appTorrent.js[fileName]
         document.getElementsByTagName('head')[0].appendChild(script)
      }

        //////////////////
       // extract html //
      //////////////////
      document.body.innerHTML = appTorrent.html
    }
  };
};
