exports.handler = (function() {
   
  function serve(req, res, staticsMap) {
    res.writeHead(200, {});
    res.write('mich.rs');
    res.end();
  }

  return {
    serve: serve
  };
})();
