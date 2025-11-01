<?php
// Migration script to create authentication tables for quiz dashboard
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

    $results = [];

    // Create automated_quiz_user table
    $createUserTable = "CREATE TABLE IF NOT EXISTS `automated_quiz_user` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `username` varchar(100) NOT NULL,
        `email` varchar(255) NOT NULL,
        `password_hash` varchar(255) NOT NULL,
        `full_name` varchar(255) DEFAULT NULL,
        `role` enum('admin','editor') NOT NULL DEFAULT 'editor',
        `is_active` tinyint(1) NOT NULL DEFAULT 1,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `last_login` timestamp NULL DEFAULT NULL,
        `login_attempts` int(11) NOT NULL DEFAULT 0,
        `locked_until` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `username` (`username`),
        UNIQUE KEY `email` (`email`),
        KEY `is_active` (`is_active`),
        KEY `role` (`role`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    try {
        $db->exec($createUserTable);
        $results[] = 'automated_quiz_user table created successfully';
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "already exists") !== false) {
            $results[] = 'automated_quiz_user table already exists';
        } else {
            throw $e;
        }
    }

    // Insert default admin user
    // Password: admin123 (Change this immediately after setup!)
    $insertAdmin = "INSERT INTO `automated_quiz_user` (`username`, `email`, `password_hash`, `full_name`, `role`, `is_active`)
    SELECT 'admin', 'admin@fcilondon.co.uk', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin', 1
    WHERE NOT EXISTS (SELECT 1 FROM `automated_quiz_user` WHERE `username` = 'admin')";

    try {
        $db->exec($insertAdmin);
        if ($db->query("SELECT ROW_COUNT()")->fetchColumn() > 0) {
            $results[] = 'Default admin user created (username: admin, password: admin123)';
        } else {
            $results[] = 'Default admin user already exists';
        }
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "Duplicate entry") !== false) {
            $results[] = 'Default admin user already exists';
        } else {
            throw $e;
        }
    }

    // Create automated_quiz_sessions table
    $createSessionsTable = "CREATE TABLE IF NOT EXISTS `automated_quiz_sessions` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `user_id` int(11) NOT NULL,
        `session_token` varchar(255) NOT NULL,
        `ip_address` varchar(45) DEFAULT NULL,
        `user_agent` varchar(500) DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `expires_at` timestamp NULL DEFAULT NULL,
        `last_activity` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `session_token` (`session_token`),
        KEY `user_id` (`user_id`),
        KEY `expires_at` (`expires_at`),
        CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `automated_quiz_user` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    try {
        $db->exec($createSessionsTable);
        $results[] = 'automated_quiz_sessions table created successfully';
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "already exists") !== false) {
            $results[] = 'automated_quiz_sessions table already exists';
        } else {
            throw $e;
        }
    }

    // Create automated_quiz_login_logs table
    $createLoginLogsTable = "CREATE TABLE IF NOT EXISTS `automated_quiz_login_logs` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `user_id` int(11) DEFAULT NULL,
        `email_attempted` varchar(255) NOT NULL,
        `ip_address` varchar(45) DEFAULT NULL,
        `user_agent` varchar(500) DEFAULT NULL,
        `success` tinyint(1) NOT NULL DEFAULT 0,
        `failure_reason` varchar(255) DEFAULT NULL,
        `attempted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `user_id` (`user_id`),
        KEY `attempted_at` (`attempted_at`),
        KEY `email_attempted` (`email_attempted`),
        CONSTRAINT `fk_login_log_user` FOREIGN KEY (`user_id`) REFERENCES `automated_quiz_user` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    try {
        $db->exec($createLoginLogsTable);
        $results[] = 'automated_quiz_login_logs table created successfully';
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "already exists") !== false) {
            $results[] = 'automated_quiz_login_logs table already exists';
        } else {
            throw $e;
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Authentication tables setup completed',
        'details' => $results
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Migration failed: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
