-- Create quiz_results table for storing user quiz submissions
CREATE TABLE IF NOT EXISTS automated_quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    product_key VARCHAR(50),
    quiz_answers JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_product_key (product_key),
    INDEX idx_created_at (created_at)
);