var users = (function(){
  function getCharacters(cb) {
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
  function getContacts(cb) {
    getCharacters(function(characters) {
      for(var i in characters) {
        cb(characters[i]);
      }
    });
  }
  return {
    getCharacters: getCharacters,
    getContacts: getContacts
  };
})();
