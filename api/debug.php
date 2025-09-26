<?php
// Debug script to check PHP and database connectivity

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$debug = [
    'php_version' => phpversion(),
    'server_method' => $_SERVER['REQUEST_METHOD'],
    'timestamp' => date('Y-m-d H:i:s'),
    'database_test' => null,
    'pdo_available' => extension_loaded('pdo'),
    'pdo_mysql_available' => extension_loaded('pdo_mysql'),
    'current_directory' => __DIR__,
    'database_config' => null
];

// Test database connection
try {
    require_once 'config/database.php';

    $database = new Database();
    $db = $database->getConnection();

    if ($db) {
        // Test query
        $stmt = $db->query("SELECT 1 as test");
        $result = $stmt->fetch();

        if ($result && $result['test'] == 1) {
            $debug['database_test'] = 'SUCCESS - Database connected and responding';

            // Check if tables exist
            $tables = ['automated_product_quizzes', 'automated_quiz_content', 'automated_quiz_results', 'automated_quiz_questions', 'automated_question_options', 'automated_system_settings'];
            $existing_tables = [];

            foreach ($tables as $table) {
                try {
                    $stmt = $db->query("SELECT COUNT(*) FROM $table");
                    $count = $stmt->fetchColumn();
                    $existing_tables[$table] = "EXISTS (rows: $count)";
                } catch (Exception $e) {
                    $existing_tables[$table] = "NOT EXISTS - " . $e->getMessage();
                }
            }

            $debug['tables'] = $existing_tables;
        } else {
            $debug['database_test'] = 'ERROR - Database connected but query failed';
        }
    } else {
        $debug['database_test'] = 'ERROR - Could not connect to database';
    }
} catch (Exception $e) {
    $debug['database_test'] = 'ERROR - ' . $e->getMessage();
}

// Check database config
try {
    $config_file = __DIR__ . '/config/database.php';
    if (file_exists($config_file)) {
        $debug['database_config'] = 'Config file exists';
    } else {
        $debug['database_config'] = 'Config file NOT found at: ' . $config_file;
    }
} catch (Exception $e) {
    $debug['database_config'] = 'Error checking config: ' . $e->getMessage();
}

echo json_encode($debug, JSON_PRETTY_PRINT);
