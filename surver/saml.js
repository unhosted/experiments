exports.saml = (function() {
  var zlib = require('zlib'),
    config = require('./config').config,
    redis = require('redis'),
    redisClient;
  function getAuthReqUrl() {
    var request =
      '<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"\n'
      '                    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"\n'
      '                    ID="_8458820a428d12d12d7dded7418ee109d28a4dd9b8"\n'
      '                    Version="2.0"\n'
      '                    IssueInstant="2012-02-15T10:59:40Z"\n'
      '                    Destination="https://frkosp.wind.surfnet.nl/sspidp/saml2/idp/SSOService.php"\n'
      '                    AssertionConsumerServiceURL="https://frkosp.wind.surfnet.nl/sspsp/module.php/saml/sp/saml2-acs.php/default-sp"\n'
      '                    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"\n'
      '                    >\n'
      '    <saml:Issuer>https://frkosp.wind.surfnet.nl/sspsp/module.php/saml/sp/metadata.php/default-sp</saml:Issuer>\n'
      '    <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient"\n'
      '                        AllowCreate="true"\n'
      '                        />\n'
      '</samlp:AuthnRequest>\n';

    var deflatedRequest = zlib.deflate(new Buffer(request, 'binary')); // also another 'Buffer'
    var base64Request = deflatedRequest.toString('base64');
    var encodedRequest = urlencode(base64Request);
    return idpSsoTargetUrl+'?SAMLRequest='+encodedRequest;
  }
  return {
    getAuthReqUrl: getAuthReqUrl
  };
})();
