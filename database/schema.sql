-- Quiz Management Database Schema
-- Run this SQL to create the necessary tables

CREATE DATABASE IF NOT EXISTS automated_quiz;
USE automated_quiz;

-- Table for storing different product quizzes
CREATE TABLE automated_product_quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) DEFAULT '📦',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for storing quiz content sections
CREATE TABLE automated_quiz_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_key VARCHAR(50) NOT NULL,
    section_type ENUM('banner', 'showroom', 'luxury_content', 'gallery', 'design_expert', 'quiz_promo') NOT NULL,
    content_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_key) REFERENCES product_quizzes(product_key) ON DELETE CASCADE,
    UNIQUE KEY unique_product_section (product_key, section_type)
);

-- Table for storing quiz questions
CREATE TABLE automated_quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_key VARCHAR(50) NOT NULL,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_key) REFERENCES product_quizzes(product_key) ON DELETE CASCADE,
    UNIQUE KEY unique_product_question (product_key, question_order)
);

-- Table for storing question options
CREATE TABLE automated_question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_key VARCHAR(10) NOT NULL,
    option_text TEXT NOT NULL,
    image_url TEXT,
    option_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_question_option (question_id, option_key)
);

-- Table for storing current active product
CREATE TABLE automated_system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default sofa quiz
INSERT INTO automated_product_quizzes (product_key, name, emoji, description)
VALUES ('sofa', 'Sofa', '🛋️', 'Luxury sofa matching quiz');

-- Insert default current product setting
INSERT INTO automated_system_settings (setting_key, setting_value)
VALUES ('current_product', 'sofa');

-- Insert default sofa content sections
INSERT INTO automated_quiz_content (product_key, section_type, content_data) VALUES
('sofa', 'banner', JSON_OBJECT(
    'mainHeading', 'Match Your Personality To A Luxury Sofa.',
    'subHeading', 'Try Our AI Tool',
    'backgroundImage', '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/gallotti-and-radice-banner-1.jpg',
    'mobileImage', '../cdn-cgi/image/quality=60,f=auto/site-assets/images/luxury/luxury-banner-1-mobile.jpg'
)),
('sofa', 'showroom', JSON_OBJECT(
    'heading', 'The largest luxury sofa showroom in London',
    'image', '../cdn-cgi/image/quality=75,f=auto/site-assets/shoroomlndn.jpg'
)),
('sofa', 'luxury_content', JSON_OBJECT(
    'title', 'Luxury Sofas, Redefined',
    'introduction', 'A sofa is never just a sofa. It''s where you unwind after a long day, host spirited conversations, and perhaps—if it''s truly exquisite—fall hopelessly in love with your own living room. At FCI London, we don''t just sell sofas; we curate spaces of sophistication, tailored to those who appreciate life''s finer details.',
    'subtitle', 'Why Visit Our Showroom?',
    'points', JSON_ARRAY(
        JSON_OBJECT('title', '1. The Largest Collection in London', 'description', 'Why settle for standard when you can have the exceptional? Our showroom houses an unparalleled selection of luxury sofas, from timeless classics to contemporary masterpieces, all meticulously crafted by the world''s finest artisans.'),
        JSON_OBJECT('title', '2. Bespoke, Just for You', 'description', 'Luxury is personal. That''s why we offer fully customisable designs—every stitch, curve, and cushion tailored to your exacting standards. Whether it''s hand-stitched Italian leather or a sumptuous velvet that whispers elegance, we bring your vision to life.'),
        JSON_OBJECT('title', '3. The Touch Test', 'description', 'A sofa should never be chosen from a screen. It''s about how it feels—the depth of the cushioning, the smoothness of the upholstery, the perfect balance of support and indulgence. Our showroom invites you to experience craftsmanship in its truest form.'),
        JSON_OBJECT('title', '4. Design Expertise, on Demand', 'description', 'Our team of seasoned interior designers are at your service, ready to refine, reimagine, and elevate your space with tailored advice and creative insight. Whether you''re seeking a statement piece or an entire living room transformation, we make it effortless.'),
        JSON_OBJECT('title', '5. Instant Gratification', 'description', 'Impatience is a virtue when it comes to interiors. With many of our luxury sofas available for immediate delivery, there''s no need to wait months for perfection to arrive.')
    ),
    'conclusion', '<strong>Visit Us & Experience Luxury Firsthand</strong><br>Indulgence begins with a single step—or rather, a single seat. Visit our London showroom to immerse yourself in a world of impeccable design and let us help you find the sofa you never knew you needed.'
)),
('sofa', 'design_expert', JSON_OBJECT(
    'heading', 'Avoid a design disaster.\nTalk to an expert.',
    'image', '../cdn-cgi/image/quality=75,f=auto/site-assets/images/avoid-a-design-disaster.jpg',
    'buttonText', 'Book now',
    'buttonLink', '/book-a-showroom-visit.html'
)),
('sofa', 'quiz_promo', JSON_OBJECT(
    'heading', 'Take our lifestyle quiz & find the perfect sofa match.',
    'features', JSON_ARRAY('AI Matching algorithm', 'Searches over 2000 Luxury Sofas', 'Results Within 10 Minutes', 'Only Branded Italian Design', 'Exclusive Branded Italian Designs', 'Free Consultation Available'),
    'buttonText', 'Try our Sofa Matching Quiz',
    'buttonLink', '#sofaquiz',
    'images', JSON_ARRAY(
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-furniture-design-1.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-furniture-design-2.jpg',
        '../cdn-cgi/image/quality=75,f=auto/site-assets/images/fci-lp/luxury-furniture-design-3.jpg'
    )
));

-- Insert default sofa question
INSERT INTO automated_quiz_questions (product_key, question_order, question_text)
VALUES ('sofa', 1, 'What best describes your household?');

-- Insert default options for the question
INSERT INTO automated_question_options (question_id, option_key, option_text, image_url, option_order) VALUES
(1, 'a', 'Young kids—energetic, messy, and always moving', '/site-assets/images/sofa-quiz/young-kids-energetic-messy-and-always-moving.jpg', 1),
(1, 'b', 'Teenagers or young adults still at home', '/site-assets/images/sofa-quiz/teenagers-or-young-adults-still-at-home.jpg', 2),
(1, 'c', 'Just the two of us—calm and design-focused', '/site-assets/images/sofa-quiz/just-the-two-of-us-calm-and-design-focused.jpg', 3)
