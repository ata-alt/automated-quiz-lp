-- Complete Database Setup for Automated Quiz System
-- This file contains all the required tables with the 'automated_' prefix

-- Drop existing tables if they exist (optional - be careful!)
-- DROP TABLE IF EXISTS automated_question_options;
-- DROP TABLE IF EXISTS automated_quiz_questions;
-- DROP TABLE IF EXISTS automated_quiz_content;
-- DROP TABLE IF EXISTS automated_quiz_results;
-- DROP TABLE IF EXISTS automated_product_quizzes;
-- DROP TABLE IF EXISTS automated_system_settings;

-- 1. Product Quizzes Table
CREATE TABLE IF NOT EXISTS automated_product_quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) DEFAULT '📦',
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_key (product_key),
    INDEX idx_active (is_active)
);

-- 2. Quiz Content Table (stores banner, gallery, etc.)
CREATE TABLE IF NOT EXISTS automated_quiz_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_key VARCHAR(50) NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    content_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_product_section (product_key, section_type),
    INDEX idx_product_key (product_key),
    INDEX idx_section_type (section_type),
    FOREIGN KEY (product_key) REFERENCES automated_product_quizzes(product_key) ON DELETE CASCADE
);

-- 3. Quiz Questions Table
CREATE TABLE IF NOT EXISTS automated_quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_key VARCHAR(50) NOT NULL,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_key (product_key),
    INDEX idx_question_order (question_order),
    FOREIGN KEY (product_key) REFERENCES automated_product_quizzes(product_key) ON DELETE CASCADE
);

-- 4. Question Options Table
CREATE TABLE IF NOT EXISTS automated_question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_key VARCHAR(10) NOT NULL,
    option_text TEXT NOT NULL,
    image_url VARCHAR(500),
    option_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_question_id (question_id),
    INDEX idx_option_order (option_order),
    FOREIGN KEY (question_id) REFERENCES automated_quiz_questions(id) ON DELETE CASCADE
);

-- 5. Quiz Results Table (for storing user submissions)
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

-- 6. System Settings Table
CREATE TABLE IF NOT EXISTS automated_system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
);

-- Insert default data

-- 1. Insert default product (sofa)
INSERT INTO automated_product_quizzes (product_key, name, emoji, description)
VALUES ('sofa', 'Sofa', '🛋️', 'Luxury sofa matching quiz')
ON DUPLICATE KEY UPDATE name = VALUES(name), emoji = VALUES(emoji);

-- 2. Insert default system settings
INSERT INTO automated_system_settings (setting_key, setting_value)
VALUES ('current_product', 'sofa')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- 3. Insert default content sections for sofa product
INSERT INTO automated_quiz_content (product_key, section_type, content_data) VALUES
('sofa', 'banner', '{"mainHeading":"Match Your Personality To A Luxury Sofa.","subHeading":"Try Our AI Tool","backgroundImage":"","mobileImage":""}'),
('sofa', 'showroom', '{"heading":"The largest luxury sofa showroom in London","image":""}'),
('sofa', 'luxury_content', '{"title":"Luxury Sofas, Redefined","introduction":"Experience the finest sofa collection.","subtitle":"Why Visit Our Showroom?","points":[],"conclusion":"<strong>Visit Us & Experience Luxury Firsthand</strong>"}'),
('sofa', 'gallery', '{"images":[{"src":"","alt":""},{"src":"","alt":""},{"src":"","alt":""}]}'),
('sofa', 'design_expert', '{"heading":"Avoid a design disaster.\\nTalk to an expert.","image":"","buttonText":"Book now","buttonLink":"/book-a-showroom-visit.html"}'),
('sofa', 'quiz_promo', '{"heading":"Take our lifestyle quiz & find the perfect sofa match.","features":["AI Matching algorithm","Searches over 2000 Luxury Sofas","Results Within 10 Minutes","Only Branded Italian Design","Exclusive Branded Italian Designs","Free Consultation Available"],"buttonText":"Try our Sofa Matching Quiz","buttonLink":"#quiz","images":[]}')
ON DUPLICATE KEY UPDATE content_data = VALUES(content_data);

-- 4. Insert default questions for sofa product
INSERT INTO automated_quiz_questions (product_key, question_order, question_text) VALUES
('sofa', 1, 'What best describes your needs for a sofa?'),
('sofa', 2, 'What style do you prefer?'),
('sofa', 3, 'What is your preferred size?')
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text);

-- 5. Insert default options for questions (get question IDs first)
SET @q1_id = (SELECT id FROM automated_quiz_questions WHERE product_key = 'sofa' AND question_order = 1 LIMIT 1);
SET @q2_id = (SELECT id FROM automated_quiz_questions WHERE product_key = 'sofa' AND question_order = 2 LIMIT 1);
SET @q3_id = (SELECT id FROM automated_quiz_questions WHERE product_key = 'sofa' AND question_order = 3 LIMIT 1);

INSERT INTO automated_question_options (question_id, option_key, option_text, option_order) VALUES
(@q1_id, 'a', 'Comfort and relaxation', 1),
(@q1_id, 'b', 'Style and aesthetics', 2),
(@q1_id, 'c', 'Durability and function', 3),
(@q2_id, 'a', 'Modern and contemporary', 1),
(@q2_id, 'b', 'Classic and traditional', 2),
(@q2_id, 'c', 'Minimalist and clean', 3),
(@q3_id, 'a', 'Compact for small spaces', 1),
(@q3_id, 'b', 'Medium size for most rooms', 2),
(@q3_id, 'c', 'Large sectional for big spaces', 3)
ON DUPLICATE KEY UPDATE option_text = VALUES(option_text);

-- Display confirmation message
SELECT 'Database setup completed successfully! All tables with automated_ prefix have been created.' as Status;