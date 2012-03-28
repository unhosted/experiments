var http = require('http'),
  errors = [];

function checkHttp(testName, reqOptions, reqBody, expected, cb) {
  var req = http.request(reqOptions, function(res) {
    if(res.statusCode != expected.statusCode) {
      cb(1, testName+' - status code '+res.statusCode+' instead of '+expected.statusCode);
      return;
    }
    res.setEncoding('utf8');
    var dataStr = '';
    res.on('data', function(chunk) {
      dataStr += chunk;
    });
    res.on('end', function() {
      if(dataStr.indexOf(expected.dataStr) == -1) {
        cb(2, testName+' - dataStr '+dataStr+' instead of '+expected.dataStr);
        return;
      }
      cb(null, testName+' - pass');
    });
  });
  req.on('error', function(e) {
    cb(3, testName+' - error: '+e.message);
  });
  req.write(reqBody);
  req.end();
}

function checkStoreBearerToken(testName, str) {
  checkHttp(testName, {
    host: 'mich.libredocs.org',
    port: 80,
    path: '/storeBearerToken',
    method: 'POST',
  }, str, {
    statusCode: 201,
    dataStr: 'ok'
  }, function(err, data) {
    if(err) {
      errors.push(data);
    }
    console.log(data);
  });
}

function checkWebsite(testName, host, str) {
  checkHttp(testName, {
    host: host,
    port: 80,
    path: '/',
    method: 'GET',
  }, '', {
    statusCode: 200,
    dataStr: str
  }, function(err, data) {
    if(err) {
      errors.push(data);
    }
    console.log(data);
  });
}

checkStoreBearerToken('storeBearerToken 5apps', '{"userAddress":"michiel@5apps.com","bearerToken":"db2e83efc029a92e037f4c68bc59cf73"}');
checkStoreBearerToken('storeBearerToken owncube', '{"userAddress":"michiel@owncube.com","bearerToken":"db2e83efc029a92e037f4c68bc59cf73"}');
checkWebsite('unhosted.org main page', 'unhosted.org', 'Unhosted: personal data freedom');
checkWebsite('libredocs.org main page', 'libredocs.org', 'liberate your ideas');

if(errors.length) {
  console.log('ALARM!');
  console.log(errors);
} else {
  console.log('no errors');
}
