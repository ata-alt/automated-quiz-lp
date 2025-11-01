<?php
// Migration script to add question_title column to automated_quiz_questions table
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

    // Add the question_title column if it doesn't exist
    $addColumn = "ALTER TABLE automated_quiz_questions
                  ADD COLUMN question_title VARCHAR(255) DEFAULT '' AFTER question_order";

    try {
        $db->exec($addColumn);

        // Update existing questions to have empty title (backward compatible)
        $updateExisting = "UPDATE automated_quiz_questions
                          SET question_title = ''
                          WHERE question_title IS NULL";
        $db->exec($updateExisting);

        echo json_encode([
            'status' => 'success',
            'message' => 'question_title column successfully added to automated_quiz_questions table'
        ], JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "Duplicate column name") !== false) {
            echo json_encode([
                'status' => 'info',
                'message' => 'question_title column already exists in automated_quiz_questions table'
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
