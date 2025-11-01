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
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Log the input for debugging
error_log("Create user input: " . $rawInput);

// Validate JSON parsing
if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Invalid JSON input: ' . json_last_error_msg(), 400);
}

// Validate required fields
if (!isset($input['username']) || !isset($input['email']) || !isset($input['password']) || !isset($input['role'])) {
    $missing = [];
    if (!isset($input['username'])) $missing[] = 'username';
    if (!isset($input['email'])) $missing[] = 'email';
    if (!isset($input['password'])) $missing[] = 'password';
    if (!isset($input['role'])) $missing[] = 'role';
    sendError('Missing required fields: ' . implode(', ', $missing), 400);
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];
$fullName = isset($input['full_name']) ? trim($input['full_name']) : null;
$role = $input['role'];

// Validate role
if (!in_array($role, ['admin', 'editor'])) {
    sendError('Invalid role. Must be either admin or editor', 400);
}

// Validate username
if (strlen($username) < 3) {
    sendError('Username must be at least 3 characters long', 400);
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Invalid email address', 400);
}

// Validate password
if (strlen($password) < 8) {
    sendError('Password must be at least 8 characters long', 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendError('Database connection failed', 500);
    }

    // Check if username already exists
    $query = "SELECT id FROM automated_quiz_user WHERE username = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$username]);

    if ($stmt->fetch()) {
        sendError('Username already exists', 400);
    }

    // Check if email already exists
    $query = "SELECT id FROM automated_quiz_user WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        sendError('Email already exists', 400);
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

    // Insert new user
    $query = "INSERT INTO automated_quiz_user (username, email, password_hash, full_name, role, is_active, created_at)
              VALUES (?, ?, ?, ?, ?, 1, NOW())";
    $stmt = $db->prepare($query);
    $stmt->execute([$username, $email, $passwordHash, $fullName, $role]);

    $userId = $db->lastInsertId();

    sendSuccess([
        'message' => 'User created successfully',
        'user_id' => $userId
    ]);

} catch (PDOException $e) {
    error_log("Database error in create-user.php: " . $e->getMessage());
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in create-user.php: " . $e->getMessage());
    sendError('Server error: ' . $e->getMessage(), 500);
}
