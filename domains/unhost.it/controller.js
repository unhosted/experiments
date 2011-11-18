exports.controller = (function() {
  function configure(setOptions) {
    console.log(setOptions);
  }
  return {
    configure: configure
  };
})();


////implementing $(document).ready(embody):
//document.addEventListener('DOMContentLoaded', function() {
//  document.removeEventListener('DOMContentLoaded', arguments.callee, false );
  var scripts = document.getElementsByTagName('script');
  for(i in scripts) {
    if((new RegExp(exports.config.jsFileName+'$')).test(scripts[i].src)) {
      var options = (new Function('return ' + scripts[i].innerHTML.replace(/\n|\r/g, '')))();
      exports.controller.configure(options);
    }
  }
//}, false);
