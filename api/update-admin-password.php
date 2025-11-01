<?php
/**
 * Update Admin Password Script
 * This script generates a new password hash and updates the database
 */

require_once 'config/database.php';

// Generate new password hash for 'admin123'
$password = 'admin123';
$new_hash = password_hash($password, PASSWORD_BCRYPT);

echo "<h2>Password Update Utility</h2>";
echo "<p><strong>Password:</strong> " . htmlspecialchars($password) . "</p>";
echo "<p><strong>New Hash:</strong> <code>" . htmlspecialchars($new_hash) . "</code></p>";

// Verify the hash works
if (password_verify($password, $new_hash)) {
    echo "<p style='color: green;'><strong>✓ Hash Verification: PASSED</strong></p>";
} else {
    echo "<p style='color: red;'><strong>✗ Hash Verification: FAILED</strong></p>";
    exit;
}

echo "<hr>";

// Connect to database and update
try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        echo "<p style='color: red;'><strong>✗ Database connection failed!</strong></p>";
        exit;
    }

    // Update the admin user password
    $stmt = $db->prepare("
        UPDATE automated_quiz_user
        SET password_hash = :password_hash,
            login_attempts = 0,
            locked_until = NULL
        WHERE email = 'admin@fcilondon.co.uk'
    ");

    $stmt->execute(['password_hash' => $new_hash]);

    echo "<p style='color: green; font-size: 18px;'><strong>✓ Password Updated Successfully!</strong></p>";
    echo "<p>The admin password has been reset to: <strong>admin123</strong></p>";
    echo "<p>Login attempts have been reset to 0</p>";
    echo "<p>Account lockout has been cleared</p>";

    echo "<hr>";
    echo "<h3>Verify Database Entry</h3>";

    // Fetch and verify
    $stmt = $db->prepare("SELECT id, username, email, password_hash, login_attempts, locked_until FROM automated_quiz_user WHERE email = 'admin@fcilondon.co.uk'");
    $stmt->execute();
    $user = $stmt->fetch();

    if ($user) {
        echo "<p><strong>User ID:</strong> " . $user['id'] . "</p>";
        echo "<p><strong>Username:</strong> " . $user['username'] . "</p>";
        echo "<p><strong>Email:</strong> " . $user['email'] . "</p>";
        echo "<p><strong>Login Attempts:</strong> " . $user['login_attempts'] . "</p>";
        echo "<p><strong>Locked Until:</strong> " . ($user['locked_until'] ?? 'Not locked') . "</p>";

        echo "<hr>";
        echo "<h3>Password Verification Test</h3>";

        if (password_verify('admin123', $user['password_hash'])) {
            echo "<p style='color: green; font-size: 16px;'><strong>✓ PASSWORD VERIFICATION: SUCCESS!</strong></p>";
            echo "<p>You can now login with:<br>";
            echo "Email: <strong>admin@fcilondon.co.uk</strong><br>";
            echo "Password: <strong>admin123</strong></p>";
        } else {
            echo "<p style='color: red;'><strong>✗ PASSWORD VERIFICATION: FAILED</strong></p>";
            echo "<p>Something went wrong. Please try running this script again.</p>";
        }
    } else {
        echo "<p style='color: red;'><strong>✗ User not found in database!</strong></p>";
        echo "<p>Please make sure you've run the create_automated_quiz_user.sql file first.</p>";
    }

} catch (Exception $e) {
    echo "<p style='color: red;'><strong>✗ Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "<hr>";
echo "<p style='color: #666; font-size: 12px;'><strong>Note:</strong> For security, delete this file after use.</p>";
?>
