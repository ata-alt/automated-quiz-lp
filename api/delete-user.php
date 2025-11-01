<?php
// Enable error reporting but don't display errors (log only)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once 'config/database.php';

// Set CORS headers
setCorsHeaders();

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['user_id'])) {
    sendError('Missing required field: user_id', 400);
}

$userId = (int)$input['user_id'];

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendError('Database connection failed', 500);
    }

    // Check if user exists
    $query = "SELECT id, username FROM automated_quiz_user WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        sendError('User not found', 404);
    }

    // Prevent deleting yourself (optional safety check)
    // You would need to add session checking here if you want this feature
    // For now, we'll allow deletion

    // Delete user
    $query = "DELETE FROM automated_quiz_user WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        sendSuccess([
            'message' => "User '{$user['username']}' has been deleted successfully",
            'user_id' => $userId
        ]);
    } else {
        sendError('Failed to delete user', 500);
    }

} catch (PDOException $e) {
    error_log("Database error in delete-user.php: " . $e->getMessage());
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in delete-user.php: " . $e->getMessage());
    sendError('Server error: ' . $e->getMessage(), 500);
}
