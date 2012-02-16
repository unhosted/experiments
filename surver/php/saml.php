<?php
  setcookie('scope', $_GET['scope']);
  setcookie('redirectUri', $_GET['redirect_uri']);
?>
<!DOCTYPE html>
  <head>
  <meta charset="utf-8">
  <title>No go</title>
  </head>
  <body>
    <p>Do you want to allow <?php echo $_GET['redirect_uri']; ?> to access your <?php echo $_GET['scope']; ?> categories?</p>
    <input type="submit" value="Allow" onclick="window.location= '<?php

  $request = "<samlp:AuthnRequest xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\"\n"
      ."                    xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\"\n"
      ."                    ID=\"_8458820a428d12d12d7dded7418ee10928a4dd9b8\"\n"
      ."                    Version=\"2.0\"\n"
      ."                    IssueInstant=\"2012-02-15T10:59:41Z\"\n"
      ."                    Destination=\"https://frkosp.wind.surfnet.nl/sspidp/saml2/idp/SSOService.php\"\n"
      ."                    AssertionConsumerServiceURL=\"http://surf.unhosted.org:81/saml2.php\"\n"
      ."                    ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\"\n"
      ."                    >\n"
      ."    <saml:Issuer>http://surf.unhosted.org:81/saml.php</saml:Issuer>\n"
      ."    <samlp:NameIDPolicy Format=\"urn:oasis:names:tc:SAML:2.0:nameid-format:transient\"\n"
      ."                        AllowCreate=\"true\"\n"
      ."                        />\n"
      ."</samlp:AuthnRequest>\n";
  $deflated_request = gzdeflate($request);
  $base64_request = base64_encode($deflated_request);
  $encoded_request = urlencode($base64_request);
  echo "http://frkosp.wind.surfnet.nl/sspidp/saml2/idp/SSOService.php?SAMLRequest=".$encoded_request;

?>';">
  </body>
</html>
