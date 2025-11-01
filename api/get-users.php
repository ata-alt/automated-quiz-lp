<?php
// Enable error reporting but don't display errors (log only)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once 'config/database.php';

// Set CORS headers
setCorsHeaders();

// Check if request is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendError('Database connection failed', 500);
    }

    // Get all users
    $query = "SELECT id, username, email, full_name, role, is_active, created_at, updated_at, last_login
              FROM automated_quiz_user
              ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Remove sensitive data and format response
    $usersFormatted = array_map(function($user) {
        return [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role' => $user['role'],
            'is_active' => (int)$user['is_active'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at'],
            'last_login' => $user['last_login']
        ];
    }, $users);

    sendSuccess([
        'users' => $usersFormatted,
        'total' => count($usersFormatted)
    ]);

} catch (PDOException $e) {
    error_log("Database error in get-users.php: " . $e->getMessage());
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in get-users.php: " . $e->getMessage());
    sendError('Server error: ' . $e->getMessage(), 500);
}
