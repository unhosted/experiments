<?php
/*
Plugin Name: remoteStorage
Plugin URI: http://github.com/unhosted/experiments/tree/master/wp-plugin/
Description: Add remoteStorage to your indie-web identity
Author: Michiel de Jong
Version: 0.1
Author URI: http://unhosted.org/
*/

class remoteStoragePlugin {
  function onWebfingerXrd($user = null) {
    echo "<Link rel='remoteStorage' api='CouchDB' \n"
      ."    auth='http://michiel.iriscouch.com:5984/cors/auth/modal.html'\n"
      ."    template='http://yourremotestorage.net/CouchDB/proxy/michiel.iriscouch.com/{category}/' />";
  }

  function onAdminMenu() {
    add_options_page('remoteStorage Options', 'remoteStorage', 'manage_options', 'remoteStorage', array('remoteStoragePlugin', 'showPluginOptions'));
  }

  function showPluginOptions() {
    if (!current_user_can('manage_options'))  {
      wp_die( __('You do not have sufficient permissions to access this page.') );
    }
    echo '<div class="wrap"><form method="post" action="options.php">';
    echo '</form></div>';
  }
}

add_action("webfinger_xrd", array('remoteStoragePlugin', 'onWebfingerXrd'));
add_action('admin_menu', array('remoteStoragePlugin', 'onAdminMenu'));

