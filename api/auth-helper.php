<?php

/**
 * Authentication Helper Functions
 * Use this file to handle database-based authentication
 */

class AuthHelper
{
    private $db;
    private $max_login_attempts = 5;
    private $lockout_duration = 900; // 15 minutes in seconds

    public function __construct($pdo_connection)
    {
        $this->db = $pdo_connection;
    }

    /**
     * Authenticate user with email and password
     * @param string $email
     * @param string $password
     * @return array|false Returns user data on success, false on failure
     */
    public function authenticate($email, $password)
    {
        // Check if account is locked
        if ($this->isAccountLocked($email)) {
            return ['error' => 'Account is temporarily locked. Please try again later.'];
        }

        // Get user from database
        $stmt = $this->db->prepare("
            SELECT id, username, email, password_hash, full_name, role, is_active
            FROM automated_quiz_user
            WHERE email = :email AND is_active = 1
        ");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        // Verify password
        if ($user && password_verify($password, $user['password_hash'])) {
            // Reset login attempts
            $this->resetLoginAttempts($user['id']);

            // Update last login
            $this->updateLastLogin($user['id']);

            // Log successful login
            $this->logLoginAttempt($user['id'], $email, true);

            // Remove password hash from returned data
            unset($user['password_hash']);

            return $user;
        } else {
            // Increment failed login attempts
            if ($user) {
                $this->incrementLoginAttempts($user['id']);
                $this->logLoginAttempt($user['id'], $email, false, 'Invalid password');
            } else {
                $this->logLoginAttempt(null, $email, false, 'User not found');
            }

            return false;
        }
    }

    /**
     * Check if account is locked due to too many failed attempts
     */
    private function isAccountLocked($email)
    {
        $stmt = $this->db->prepare("
            SELECT login_attempts, locked_until
            FROM automated_quiz_user
            WHERE email = :email
        ");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user) return false;

        // Check if locked and lock period hasn't expired
        if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
            return true;
        }

        // If lock period expired, reset it
        if ($user['locked_until'] && strtotime($user['locked_until']) <= time()) {
            $this->unlockAccount($email);
        }

        return false;
    }

    /**
     * Increment failed login attempts
     */
    private function incrementLoginAttempts($user_id)
    {
        $stmt = $this->db->prepare("
            UPDATE automated_quiz_user
            SET login_attempts = login_attempts + 1,
                locked_until = CASE
                    WHEN login_attempts + 1 >= :max_attempts THEN DATE_ADD(NOW(), INTERVAL :lockout_seconds SECOND)
                    ELSE NULL
                END
            WHERE id = :user_id
        ");
        $stmt->execute([
            'max_attempts' => $this->max_login_attempts,
            'lockout_seconds' => $this->lockout_duration,
            'user_id' => $user_id
        ]);
    }

    /**
     * Reset login attempts on successful login
     */
    private function resetLoginAttempts($user_id)
    {
        $stmt = $this->db->prepare("
            UPDATE automated_quiz_user
            SET login_attempts = 0, locked_until = NULL
            WHERE id = :user_id
        ");
        $stmt->execute(['user_id' => $user_id]);
    }

    /**
     * Unlock account
     */
    private function unlockAccount($email)
    {
        $stmt = $this->db->prepare("
            UPDATE automated_quiz_user
            SET login_attempts = 0, locked_until = NULL
            WHERE email = :email
        ");
        $stmt->execute(['email' => $email]);
    }

    /**
     * Update last login timestamp
     */
    private function updateLastLogin($user_id)
    {
        $stmt = $this->db->prepare("
            UPDATE automated_quiz_user
            SET last_login = NOW()
            WHERE id = :user_id
        ");
        $stmt->execute(['user_id' => $user_id]);
    }

    /**
     * Log login attempt for security monitoring
     */
    private function logLoginAttempt($user_id, $email, $success, $failure_reason = null)
    {
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $stmt = $this->db->prepare("
            INSERT INTO automated_quiz_login_logs
            (user_id, email_attempted, ip_address, user_agent, success, failure_reason)
            VALUES (:user_id, :email, :ip_address, :user_agent, :success, :failure_reason)
        ");
        $stmt->execute([
            'user_id' => $user_id,
            'email' => $email,
            'ip_address' => $ip_address,
            'user_agent' => $user_agent,
            'success' => $success ? 1 : 0,
            'failure_reason' => $failure_reason
        ]);
    }

    /**
     * Create a new user (for admin panel)
     * @param array $user_data
     * @return int|false Returns user ID on success, false on failure
     */
    public function createUser($username, $email, $password, $full_name = null)
    {
        // Hash password
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare("
            INSERT INTO automated_quiz_user
            (username, email, password_hash, full_name)
            VALUES (:username, :email, :password_hash, :full_name)
        ");

        if ($stmt->execute([
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash,
            'full_name' => $full_name
        ])) {
            return $this->db->lastInsertId();
        }

        return false;
    }

    /**
     * Update user password
     */
    public function updatePassword($user_id, $new_password)
    {
        $password_hash = password_hash($new_password, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare("
            UPDATE automated_quiz_user
            SET password_hash = :password_hash, updated_at = NOW()
            WHERE id = :user_id
        ");

        return $stmt->execute([
            'password_hash' => $password_hash,
            'user_id' => $user_id
        ]);
    }

    /**
     * Deactivate user account
     */
    public function deactivateUser($user_id)
    {
        $stmt = $this->db->prepare("
            UPDATE automated_quiz_user
            SET is_active = 0, updated_at = NOW()
            WHERE id = :user_id
        ");

        return $stmt->execute(['user_id' => $user_id]);
    }

    /**
     * Get user by ID
     */
    public function getUserById($user_id)
    {
        $stmt = $this->db->prepare("
            SELECT id, username, email, full_name, is_active, created_at, last_login
            FROM automated_quiz_user
            WHERE id = :user_id
        ");
        $stmt->execute(['user_id' => $user_id]);

        return $stmt->fetch();
    }
}

/**
 * Helper function to generate a secure password hash
 * Use this to manually create password hashes if needed
 */
function generatePasswordHash($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}
