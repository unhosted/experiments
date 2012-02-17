<?php
  if($_GET['user_id'] == 'alice@surf.unhosted.org') {
    $useSaml=true;
    setcookie('userId', $_GET['user_id']);
    setcookie('scope', $_GET['scope']);
    setcookie('redirectUri', $_GET['redirect_uri']);
  } else {
    $useSaml=false;
  }
?>
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title>No go</title>
    <script src="http://browserid.org/include.js"></script>
    <script>
      function gup(name) {
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regexS = '[\\?&]'+name+'=([^&#]*)';
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if(results == null) {
          return '';
        } else {
         return decodeURIComponent(results[1]);
        }
      }

      function signinWithBrowserID() {
        navigator.id.get(function(assertion) {
          document.getElementById('assertion').value=assertion;
          document.getElementById('scope').value=JSON.stringify(gup('scope').split(','));
          document.getElementById('redirectUri').value=gup('redirect_uri');
          document.getElementById('browseridForm').submit();
        }, {
          requiredEmail: gup('user_id')
        });
      }
    </script>
  </head>
  <body>
    <form id="browseridForm" action="http://surf.unhosted.org/_browserid" method="POST">
      <input type="hidden" id="assertion" name="assertion">
      <input type="hidden" id="scope" name="scope">
      <input type="hidden" id="redirectUri" name="redirectUri">
    </form>
    <p>Do you want to allow <?php echo $_GET['redirect_uri']; ?> to access your <?php echo $_GET['scope']; ?> categories?</p>
    <input type="submit" value="Allow" onclick="<?php
if($useSaml) {
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
  echo 'window.location = \'http://frkosp.wind.surfnet.nl/sspidp/saml2/idp/SSOService.php?SAMLRequest='.$encoded_request.'\';';
} else {
  echo 'signinWithBrowserID();';
}
?>">
  </body>
</html>
