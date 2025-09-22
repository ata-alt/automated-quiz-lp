<?php
// Set proper headers first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple test response
$response = [
    'status' => 'success',
    'message' => 'PHP is working!',
    'method' => $_SERVER['REQUEST_METHOD'],
    'time' => date('Y-m-d H:i:s'),
    'php_version' => phpversion()
];

// Set success status code
http_response_code(200);
echo json_encode($response);
exit();
?>