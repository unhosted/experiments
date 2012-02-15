exports.saml = (function() {
  var zlib = require('zlib'),
    config = require('./config').config,
    redis = require('redis'),
    redisClient;
  function getAuthReqUrl() {
    var id='',
      issueInstant = '',
      assertionConsumerServiceUrl = '',
      issue = '',
      nameIdentifierFormat = '',
      idpSsoTargetUrl = '';
    var request = '<samlp:AuthnRequest xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\" ID=\"'+id
      +'\" Version=\"2.0\" IssueInstant=\"'+issueInstant
      +'\" ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" AssertionConsumerServiceURL=\"'+assertionConsumerServiceUrl
      +'\">'
      +'<saml:Issuer xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">'+issuer
      +'</saml:Issuer>\n'
      +'<samlp:NameIDPolicy xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\" Format=\"'+nameIdentifierFormat
      +'\" AllowCreate=\"true\"></samlp:NameIDPolicy>\n'
      +'<samlp:RequestedAuthnContext xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\" Comparison=\"exact\">'
      +'<saml:AuthnContextClassRef xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">'
      +'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></samlp:RequestedAuthnContext>\n'
      +'</samlp:AuthnRequest>';

    var deflatedRequest = zlib.deflate(new Buffer(request, 'binary')); // also another 'Buffer'
    var base64Request = deflatedRequest.toString('base64');
    var encodedRequest = urlencode(base64Request);
    return idpSsoTargetUrl+'?SAMLRequest='+encodedRequest;
  }
  return {
    getAuthReqUrl: getAuthReqUrl
  };
})();
