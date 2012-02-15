<?php
require('xmlseclibs.php');
$document = base64_decode($_POST['SAMLResponse']);
echo htmlentities($document);
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
 
    function is_valid($document) {
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
echo is_valid($document);
