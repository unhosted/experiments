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
  //TODO: add Couch Pimper and proxy (for now it's only the editable webfinger entry)
  static function onWebfingerXrd($user = null) {
    $options = get_option('remoteStorage');
    echo "<Link rel='remoteStorage' api='{$options['api']}' \n"
      ."    auth='{$options['auth']}'\n"
      ."    template='{$options['template']}' />";
  }

  static function onAdminMenu() {
    add_options_page('remoteStorage Options', 'remoteStorage', 'manage_options', 'remoteStorage', array('remoteStoragePlugin', 'showPluginOptions'));
  }

  static function showPluginOptions() {
    //not sure if this is needed:
    if (!current_user_can('manage_options'))  {
      wp_die( __('You do not have sufficient permissions to access this page.') );
    }
    echo '<div class="wrap"><form method="post" action="options.php">';
    settings_fields('remoteStorage');
    //this gives an error, don't know why:
    //do_settings_sections('remoteStorage_main');
    //doing it manually in showPluginOptionsText instead (see below)
    echo '<p class="submit"><input type="submit" class="button-primary" value="Save Changes" /></p>';
    echo '</form></div>';
  }
  static function showPluginOptionsText() {
    echo "Fill in the details of your remote storage:<br>";
    
    //untested:
    //if(!get_option('remoteStorage')) {
    //  update_option('remoteStorage', array(
    //      'template' => 'http://yourremotestorage.net/CouchDB/proxy/YOU.SOMEWHERE.COM/{category}/',
    //      'auth' => 'http://YOU.SOMEWHERE.COM/cors/auth/modal.html',
    //      'api' => 'CouchDB'
    //    )
    //  );
    //}
    
    //this should be possible with the do_settings_sections call in showPluginOptions (see above, but it errors saying function templateField not found):
    self::templateField();
    self::authField();
    self::apiField();
  }
  static function validateOptions($options) {
    //TODO: put some validation here
    return $options;
  }
  static function templateField() {
    $options = get_option('remoteStorage');
    echo "Template: <input id='remoteStorageTemplate' name='remoteStorage[template]' size='40' type='text' value='{$options['template']}' /><br>";
  }
  static function authField() {
    $options = get_option('remoteStorage');
    echo "Auth: <input id='remoteStorageAuth' name='remoteStorage[auth]' size='40' type='text' value='{$options['auth']}' /><br>";
  }
  static function apiField() {
    $options = get_option('remoteStorage');
    echo "Api: <input id='remoteStorageApi' name='remoteStorage[api]' size='40' type='text' value='{$options['api']}' /><br>";
  }
  static function onAdminInit() {
    register_setting( 'remoteStorage', 'remoteStorage', array('remoteStoragePlugin', 'validateOptions'));
    add_settings_section('remoteStorage_main', 'Your remoteStorage details', array('remoteStoragePlugin', 'showPluginOptionsText'), 'remoteStorage');
    add_settings_field('remoteStorage_main', 'template', array('remoteStoragePlugin', 'templateField'), 'remotestorage', 'remoteStorage_main');
    add_settings_field('remoteStorage_main', 'auth', array('remoteStoragePlugin', 'authField'), 'remotestorage', 'remoteStorage_main');
    add_settings_field('remoteStorage_main', 'api', array('remoteStoragePlugin', 'apiField'), 'remotestorage', 'remoteStorage_main');
  }
}
add_action("webfinger_xrd", array('remoteStoragePlugin', 'onWebfingerXrd'));
add_action('admin_menu', array('remoteStoragePlugin', 'onAdminMenu'));
add_action('admin_init', array('remoteStoragePlugin', 'onAdminInit'));

