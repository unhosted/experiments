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
    add_options_page('remoteStorage Options', 'remoteStorage Plugin', 'manage_options', 'remoteStorage', array('remoteStoragePlugin', 'showPluginOptions'));
  }

  function showPluginOptions() {
    if (!current_user_can('manage_options'))  {
      wp_die( __('You do not have sufficient permissions to access this page.') );
    }
    echo '<div class="wrap"><form method="post" action="options.php">';
    settings_fields('remoteStorage');
    do_settings_section('remoteStorage');
    echo '<p class="submit"><input type="submit" class="button-primary" value="<?php _e(\'Save Changes\') ?>" /></p>';
    echo '</form></div>';
  }
  function showPluginOptionsText() {
    echo "I wonder where this text will show up";
  }
  function validateOptions() {
    return true;
  }
  function templateField() {
    $options = get_option('remoteStorage');
    echo "<input id='remoteStorageTemplate' name='remoteStorage[template]' size='40' type='text' value='{$options['template']}' />";
  }
  function authField() {
    $options = get_option('remoteStorage');
    echo "<input id='remoteStorageAuth' name='remoteStorage[auth]' size='40' type='text' value='{$options['auth']}' />";
  }
  function apiField() {
    $options = get_option('remoteStorage');
    echo "<input id='remoteStorageApi' name='remoteStorage[api]' size='40' type='text' value='{$options['api']}' />";
  }
  function onAdminInit() {
    register_setting( 'remoteStorage', 'xrdLinkAttr', array('remoteStoragePlugin', 'validateOptions'));
    add_settings_section('remoteStorage_main', 'Your remoteStorage details', array('remoteStoragePlugin', 'showPluginOptionsText'), 'remoteStorage');
    add_settings_field('remoteStorageAttrTemplate', 'template', array('remoteStoragePlugin', 'templateField'), 'remotestorage', 'remoteStorage_main');
    add_settings_field('remoteStorageAttrAuth', 'auth', array('remoteStoragePlugin', 'authField'), 'remotestorage', 'remoteStorage_main');
    add_settings_field('remoteStorageAttrApi', 'api', array('remoteStoragePlugin', 'apiField'), 'remotestorage', 'remoteStorage_main');
  }
}

add_action("webfinger_xrd", array('remoteStoragePlugin', 'onWebfingerXrd'));
add_action('admin_menu', array('remoteStoragePlugin', 'onAdminMenu'));
add_action('admin_init', array('remoteStoragePlugin', 'onAdminInit'));

