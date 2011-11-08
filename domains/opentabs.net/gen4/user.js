var user = function(){
    getCharacters: function(cb) {
      var names = ['Butch', 'Zed', 'Marcellus', 'Jules', 'Mia', 'Fabienne', 'Vincent'];
      var characters = [];
      for(var i in names) {
        characters.push({
	  name: names[i],
	  userAddress: names[i].toLowerCase()+'@opentabs.net',
	  avatar:'http://opentabs.net/screens/avatars/'+names[i].toLowerCase()
	});
      }

      cb(characters);
    }
})();
