var oauth = (function() {
  function gup(name) {
    name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
    var regexS = '[\\?&]'+name+'=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null) {
      return "";
    } else {
      return decodeURIComponent(results[1]);
    }
  }
  function authorize(host, usr, pwd, scope, redirectUri) {
    var categories=scope.split(',');
    categoryCreator(host, usr, pwd, categories, 'myfavouritesandwich.org', function(token) {
      window.location=redirectUri+'#access_token='+encodeURIComponent(token);
    });
  }
  function allow() {
    var userAddress= gup('user_address');
    navigator.id.get(function(assertion) {
      if(assertion) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/getPwd', true);
        xhr.onreadystatechange = function() {
          if(xhr.readyState==4) {
            if(xhr.status == 200) {
              var credentials
              try {
                credentials = JSON.parse(xhr.responseText);
              } catch(e) {
                alert('sorry');
              }
              authorize(credentials.host, credentials.usr, credentials.pwd, gup('scope'), gup('redirect_uri'));
            } else {
              alert('sorry');
            }
          }
        };
        xhr.send(assertion);
      } else {
        alert('no assertion');
      }
    }, {
      requiredEmail: userAddress
    });
  }
  function getClientIdHtml() {
    return (gup('redirect_uri').split('/')[2]);
  }
  function getCategoriesHtml() {
    var cats = gup('scope').split(',');
    if(cats.length==0) {
      return '(?)';
    } else {
      var first = '<em>'+cats[0]+'</em>';
      if(cats.length==1) {
        return first;
      }
      var last = ' and <em>'+cats[cats.length-1]+'</em>';
      if(cats.length==2) {
        return first+last;//no commas here
      }
      for(var i=1; i<cats.length-1;i++) {
        first += ', <em>'+cats[0]+'</em>';
      }
      return first+','+last;
    }
  }
  return {
    allow: allow,
    getClientIdHtml: getClientIdHtml,
    getCategoriesHtml: getCategoriesHtml
  };
})();
