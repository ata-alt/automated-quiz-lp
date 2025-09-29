<?php
// Database setup script - run this once to set up missing tables and data
require_once 'config/database.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$results = [];
$errors = [];

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        die(json_encode(['error' => 'Database connection failed']));
    }

    // 1. Drop emoji column if it exists
    try {
        $dropEmojiColumn = "ALTER TABLE automated_product_quizzes DROP COLUMN emoji";
        $db->exec($dropEmojiColumn);
        $results[] = "✅ Emoji column removed from product table";
    } catch (Exception $e) {
        // Column might not exist
        $results[] = "ℹ️ Emoji column already removed or doesn't exist";
    }

    // 2. Create automated_quiz_results table if it doesn't exist
    $createResultsTable = "CREATE TABLE IF NOT EXISTS automated_quiz_results (
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
    )";

    if ($db->exec($createResultsTable) !== false) {
        $results[] = "✅ automated_quiz_results table created/verified";
    } else {
        $errors[] = "Failed to create automated_quiz_results table";
    }

    // 3. Check if products table is empty and add default data if needed
    $checkProducts = $db->query("SELECT COUNT(*) as count FROM automated_product_quizzes");
    $productCount = $checkProducts->fetch()['count'];

    if ($productCount == 0) {
        // Insert default product (sofa)
        $insertProduct = "INSERT INTO automated_product_quizzes (product_key, name, description, is_active)
                         VALUES ('sofa', 'Sofa', 'Luxury sofa matching quiz', 1)";

        if ($db->exec($insertProduct) !== false) {
            $results[] = "✅ Default sofa product added";

            // Insert default content sections for sofa
            $contentSections = [
                ['sofa', 'banner', '{"mainHeading":"Match Your Personality To A Luxury Sofa.","subHeading":"Try Our AI Tool","backgroundImage":"","mobileImage":""}'],
                ['sofa', 'showroom', '{"heading":"The largest luxury sofa showroom in London","image":""}'],
                ['sofa', 'luxury_content', '{"title":"Luxury Sofas, Redefined","introduction":"Experience the finest sofa collection.","subtitle":"Why Visit Our Showroom?","points":[],"conclusion":"<strong>Visit Us & Experience Luxury Firsthand</strong>"}'],
                ['sofa', 'gallery', '{"images":[{"src":"","alt":""},{"src":"","alt":""},{"src":"","alt":""}]}'],
                ['sofa', 'design_expert', '{"heading":"Avoid a design disaster.\\nTalk to an expert.","image":"","buttonText":"Book now","buttonLink":"/book-a-showroom-visit.html"}'],
                ['sofa', 'quiz_promo', '{"heading":"Take our lifestyle quiz & find the perfect sofa match.","features":["AI Matching algorithm","Searches over 2000 Luxury Sofas","Results Within 10 Minutes","Only Branded Italian Design","Exclusive Branded Italian Designs","Free Consultation Available"],"buttonText":"Try our Sofa Matching Quiz","buttonLink":"#quiz","images":[]}']
            ];

            $contentStmt = $db->prepare("INSERT INTO automated_quiz_content (product_key, section_type, content_data) VALUES (?, ?, ?)");
            foreach ($contentSections as $section) {
                try {
                    $contentStmt->execute($section);
                } catch (Exception $e) {
                    // Ignore duplicate entries
                }
            }
            $results[] = "✅ Default content sections added";

            // Insert default questions
            $questions = [
                ['sofa', 1, 'What best describes your needs for a sofa?'],
                ['sofa', 2, 'What style do you prefer?'],
                ['sofa', 3, 'What is your preferred size?']
            ];

            $questionStmt = $db->prepare("INSERT INTO automated_quiz_questions (product_key, question_order, question_text) VALUES (?, ?, ?)");
            $questionIds = [];

            foreach ($questions as $question) {
                try {
                    $questionStmt->execute($question);
                    $questionIds[] = $db->lastInsertId();
                } catch (Exception $e) {
                    // Get existing question IDs if they already exist
                    $existingStmt = $db->prepare("SELECT id FROM automated_quiz_questions WHERE product_key = ? AND question_order = ?");
                    $existingStmt->execute([$question[0], $question[1]]);
                    $existing = $existingStmt->fetch();
                    if ($existing) {
                        $questionIds[] = $existing['id'];
                    }
                }
            }
            $results[] = "✅ Default questions added";

            // Insert options for questions
            if (count($questionIds) >= 3) {
                $options = [
                    [$questionIds[0], 'a', 'Comfort and relaxation', 1],
                    [$questionIds[0], 'b', 'Style and aesthetics', 2],
                    [$questionIds[0], 'c', 'Durability and function', 3],
                    [$questionIds[1], 'a', 'Modern and contemporary', 1],
                    [$questionIds[1], 'b', 'Classic and traditional', 2],
                    [$questionIds[1], 'c', 'Minimalist and clean', 3],
                    [$questionIds[2], 'a', 'Compact for small spaces', 1],
                    [$questionIds[2], 'b', 'Medium size for most rooms', 2],
                    [$questionIds[2], 'c', 'Large sectional for big spaces', 3]
                ];

                $optionStmt = $db->prepare("INSERT INTO automated_question_options (question_id, option_key, option_text, option_order) VALUES (?, ?, ?, ?)");
                foreach ($options as $option) {
                    try {
                        $optionStmt->execute($option);
                    } catch (Exception $e) {
                        // Ignore duplicate entries
                    }
                }
                $results[] = "✅ Default options added";
            }
        } else {
            $errors[] = "Failed to insert default product";
        }
    } else {
        $results[] = "ℹ️ Products already exist in database (count: $productCount)";
    }

    // 4. Check/add system settings
    $checkSettings = $db->query("SELECT COUNT(*) as count FROM automated_system_settings WHERE setting_key = 'current_product'");
    $settingsCount = $checkSettings->fetch()['count'];

    if ($settingsCount == 0) {
        $insertSetting = "INSERT INTO automated_system_settings (setting_key, setting_value) VALUES ('current_product', 'sofa')";
        if ($db->exec($insertSetting) !== false) {
            $results[] = "✅ Default system settings added";
        }
    } else {
        $results[] = "ℹ️ System settings already configured";
    }

    // Final status check
    $tables = [
        'automated_product_quizzes',
        'automated_quiz_content',
        'automated_quiz_results',
        'automated_quiz_questions',
        'automated_question_options',
        'automated_system_settings'
    ];

    $tableStatus = [];
    foreach ($tables as $table) {
        try {
            $stmt = $db->query("SELECT COUNT(*) as count FROM $table");
            $count = $stmt->fetch()['count'];
            $tableStatus[$table] = "EXISTS (rows: $count)";
        } catch (Exception $e) {
            $tableStatus[$table] = "ERROR: " . $e->getMessage();
        }
    }

    echo json_encode([
        'status' => count($errors) == 0 ? 'success' : 'partial',
        'results' => $results,
        'errors' => $errors,
        'table_status' => $tableStatus,
        'message' => count($errors) == 0 ? 'Database setup completed successfully!' : 'Setup completed with some errors'
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Setup failed: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>