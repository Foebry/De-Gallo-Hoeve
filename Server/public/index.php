<?php
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );


// header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Credentials");
    die();
}

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\ErrorHandler\Debug;
use Symfony\Component\HttpFoundation\Request;

//FOR PRODUCTION
// $install_path = "/eindwerk";
// $vendor_folder_parent = "/system";

//CHANGE PATH FOR PRODUCTION
require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

//CHANGE PATH FOR PRODUCTION
return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};


if ($_SERVER['APP_DEBUG']) {
    umask(0000);

    Debug::enable();
}

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);