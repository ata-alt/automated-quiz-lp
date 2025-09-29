<?php
// Migration script to drop emoji column from automated_product_quizzes table
require_once 'config/database.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        die(json_encode(['error' => 'Database connection failed']));
    }

    // Drop the emoji column if it exists
    $dropColumn = "ALTER TABLE automated_product_quizzes DROP COLUMN emoji";

    try {
        $db->exec($dropColumn);
        echo json_encode([
            'status' => 'success',
            'message' => 'Emoji column successfully removed from automated_product_quizzes table'
        ], JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "Can't DROP") !== false || strpos($e->getMessage(), "Unknown column") !== false) {
            echo json_encode([
                'status' => 'info',
                'message' => 'Emoji column does not exist or has already been removed'
            ], JSON_PRETTY_PRINT);
        } else {
            throw $e;
        }
    }

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Migration failed: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>