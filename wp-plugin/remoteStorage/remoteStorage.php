<?php
/*
Plugin Name: remoteStorage
Plugin URI: http://wordpress.org/#
Description: Add remoteStorage to your indie-web identity
Author: Michiel de Jong
Version: 0.1
Author URI: http://unhosted.org/
*/

class remoteStoragePlugin {
  function addXrdDiscovery($user = null) {
    echo "<Link rel='remoteStorage' api='CouchDB' \n"
      ."    auth='http://michiel.iriscouch.com:5984/cors/auth/modal.html'\n"
      ."    template='http://yourremotestorage.net/CouchDB/proxy/michiel.iriscouch.com/{category}/' />";
  }
}

add_action("webfinger_xrd", array('remoteStoragePlugin', 'addXrdDiscovery'));
