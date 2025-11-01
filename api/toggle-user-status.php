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
if (!isset($input['user_id']) || !isset($input['is_active'])) {
    sendError('Missing required fields', 400);
}

$userId = (int)$input['user_id'];
$isActive = (int)$input['is_active'];

// Validate is_active value
if (!in_array($isActive, [0, 1])) {
    sendError('Invalid is_active value. Must be 0 or 1', 400);
}

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

    // Update user status
    $query = "UPDATE automated_quiz_user SET is_active = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$isActive, $userId]);

    $action = $isActive ? 'activated' : 'deactivated';

    sendSuccess([
        'message' => "User '{$user['username']}' has been {$action} successfully",
        'user_id' => $userId,
        'is_active' => $isActive
    ]);

} catch (PDOException $e) {
    error_log("Database error in toggle-user-status.php: " . $e->getMessage());
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in toggle-user-status.php: " . $e->getMessage());
    sendError('Server error: ' . $e->getMessage(), 500);
}
