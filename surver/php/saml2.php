<?php
require('./predis/lib/Predis/Autoloader.php');
require('config.php');
Predis\Autoloader::register();
$redis = new Predis\Client(array(
  'scheme' => 'tcp',
  'host' => $config['redisHost'],
  'port' => $config['redisPort'],
  'password' => $config['redisPwd']
  )
);

require('xmlseclibs.php');
$documentStr = base64_decode($_POST['SAMLResponse']);
$document = new DOMDocument();
$document->loadXML($documentStr);

$x509certificate = "-----BEGIN CERTIFICATE-----\n"
  ."MIIDTzCCAjegAwIBAgIJAOsqdXuE6utjMA0GCSqGSIb3DQEBBQUAMD4xCzAJBgNVB\n"
  ."AYTAk5MMRAwDgYDVQQKDAdTVVJGbmV0MR0wGwYDVQQDDBREZW1vIElEUCBDZXJ0aW\n"
  ."ZpY2F0ZTAeFw0xMTAxMzExOTA1MThaFw0yMTAxMzAxOTA1MThaMD4xCzAJBgNVBAY\n"
  ."TAk5MMRAwDgYDVQQKDAdTVVJGbmV0MR0wGwYDVQQDDBREZW1vIElEUCBDZXJ0aWZp\n"
  ."Y2F0ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALL2uqg9rxlT6eoyR\n"
  ."XEbi8GRgt3UeP/9WcvgAzgmqTIBu8OayadDC1erXadEALz7016O9QYOb24clL9Spu\n"
  ."4CR53/cERuoUHN3J3Pq2cmN5PPMMfzWPl37ufgxDbmYH5+lecRWoktrEaWN94LyfD\n"
  ."oZlUhlkOgAD3PlScOsbf1AMersSCw7p//R43mxRgYXKC+cGvkMeI4gnS3C/0AjpFo\n"
  ."L6YFWtlbNq+9VUBp5hxPk0QrOAjETde2DNOSYIP3yycAxfd6mIj1FnPpTutr1UnH3\n"
  ."sM2rWHnItfZeRAD510nB20Ex+gu9hyxVfeBNrdcbjItPEM5BgDqA3Amsy5vhTgKni\n"
  ."cCAwEAAaNQME4wHQYDVR0OBBYEFPlK/XTb2W9xaEwRyOLqxGb+SEbZMB8GA1UdIwQ\n"
  ."YMBaAFPlK/XTb2W9xaEwRyOLqxGb+SEbZMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcN\n"
  ."AQEFBQADggEBAG7AKmx3xAa+NSb8QnalCnTxghkc/2tv6o5hi5y9gp1NZ+l2ZSDdv\n"
  ."OGIwU/6WXvEqXv30ErANNubZ9pOviJg9muuhIc5HKtFTta48XUscXViG7X4iPOX0R\n"
  ."+J5pHPwiIQxUppv08Mpv00g49tEdghb/6nHJVJ9hrz33UJUN3K6NtA29sgUaznzUS\n"
  ."ruqhEVliolRskw8RUebZRiryQi2Fj/HIuLe9PcXB8HlqFi8DpUCuStyDU/dKe4cpj\n"
  ."1wpuGpqbpH3iWiBV5AG1nj1CejGglKKmjiV4fMLvE6EnxIH+5Hk4n6VsCpyUXHtJc\n"
  ."qvnWQLMa4oaCShGiv+gukjwVRkOc4k=\n"
  ."-----END CERTIFICATE-----\n";

    function validateNumAssertions($document){
      $rootNode = $document; //->documentElement->ownerDocument;
      $assertionNodes = $rootNode->getElementsByTagName('Assertion');
      return ($assertionNodes->length == 1);
    }

    function validateTimestamps($document){
      $rootNode = $document;
      $timestampNodes = $rootNode->getElementsByTagName('Conditions');
      for($i=0;$i<$timestampNodes->length;$i++){
        $nbAttribute = $timestampNodes->item($i)->attributes->getNamedItem("NotBefore");
        $naAttribute = $timestampNodes->item($i)->attributes->getNamedItem("NotOnOrAfter");
        if($nbAttribute && strtotime($nbAttribute->textContent) > time()){
            return false;
        }
        if($naAttribute && strtotime($naAttribute->textContent) <= time()){
            return false;
        }
      }
      return true;
    }
 
    function is_valid($document, $x509certificate) {
      $objXMLSecDSig = new XMLSecurityDSig();

      $objDSig = $objXMLSecDSig->locateSignature($document);
      if (! $objDSig) {
        throw new Exception("Cannot locate Signature Node");
      }
      $objXMLSecDSig->canonicalizeSignedInfo();
      $objXMLSecDSig->idKeys = array('ID');

      $retVal = $objXMLSecDSig->validateReference();
      if (! $retVal) {
        throw new Exception("Reference Validation Failed");
      }

      $objKey = $objXMLSecDSig->locateKey();
      if (! $objKey ) {
       throw new Exception("We have no idea about the key");
      }
      $key = NULL;

      $singleAssertion = validateNumAssertions($document);
      if (!$singleAssertion){
        throw new Exception("Only one SAMLAssertion allowed");
      }

      $validTimestamps = validateTimestamps($document);
      if (!$validTimestamps){
        throw new Exception("SAMLAssertion conditions not met");
      }

      $objKeyInfo = XMLSecEnc::staticLocateKeyInfo($objKey, $objDSig);

      $objKey->loadKey($x509certificate, FALSE, true);

      $result = $objXMLSecDSig->verify($objKey);
      return $result;
    }
function genToken() {
  return mt_rand().mt_rand().mt_rand().mt_rand().mt_rand();
}

if(is_valid($document, $x509certificate)) {
  $token = genToken();
  $categories = json_encode(explode(',', $_COOKIE['scope'])); 
  $redis->set('token:'.$_COOKIE['userId'].':'.$token, $categories);
  //echo 'redis->set(token:'.$_COOKIE['userId'].':'.$token.', '.$categories;
  //echo 'Location: '.$_COOKIE['redirectUri'].'#access_token='.urlencode($token);
  header('Location: '.$_COOKIE['redirectUri'].'#access_token='.urlencode($token));
} else {
  echo '<!DOCTYPE html><head><meta charset="utf-8"><title>No go</title></head><body>'
    .'Sorry, no access.'
    .'</body></html>';
}

