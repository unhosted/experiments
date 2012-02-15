<?php

require('./predis/lib/Predis/Autoloader.php');
require('config.php');
Predis\Autoloader::register();
$redis = new Predis\Client(array(
  'scheme' => 'tcp',
  'host' => $config['redisHost'],
  'port' => $config['redisPort']
  )
);
$redis->set('from', 'predizzz');
echo $redis->get('from');
