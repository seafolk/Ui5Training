<?php

require 'vendor/autoload.php';
use Parse\ParseClient;

ParseClient::initialize('APPLICATION ID', 'REST API KEY', 'MASTER KEY');