<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getProducts($db);
        break;
    case 'POST':
        createProduct($db);
        break;
    case 'PUT':
        updateProduct($db);
        break;
    case 'DELETE':
        deleteProduct($db);
        break;
    default:
        sendError('Method not allowed', 405);
        break;
}

function getProducts($db)
{
    try {
        $query = "SELECT * FROM product_quizzes WHERE is_active = 1 ORDER BY created_at ASC";
        $stmt = $db->prepare($query);
        $stmt->execute();

        $products = $stmt->fetchAll();
        sendResponse(['products' => $products]);
    } catch (Exception $e) {
        sendError('Failed to fetch products: ' . $e->getMessage(), 500);
    }
}

function createProduct($db)
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['name']) || !isset($data['product_key'])) {
            sendError('Name and product_key are required');
        }

        // Check if product already exists
        $checkQuery = "SELECT id FROM product_quizzes WHERE product_key = ?";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute([$data['product_key']]);

        if ($checkStmt->fetch()) {
            sendError('Product with this key already exists');
        }

        // Insert new product
        $query = "INSERT INTO product_quizzes (product_key, name, emoji, description) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([
            $data['product_key'],
            $data['name'],
            $data['emoji'] ?? '📦',
            $data['description'] ?? ''
        ]);

        // Create default content sections for the new product
        createDefaultContent($db, $data['product_key'], $data['name']);

        sendResponse(['message' => 'Product created successfully', 'product_key' => $data['product_key']], 201);
    } catch (Exception $e) {
        sendError('Failed to create product: ' . $e->getMessage(), 500);
    }
}

function createDefaultContent($db, $productKey, $productName)
{
    $defaultSections = [
        [
            'section_type' => 'banner',
            'content_data' => json_encode([
                'mainHeading' => "Match Your Personality To A Luxury {$productName}.",
                'subHeading' => 'Try Our AI Tool',
                'backgroundImage' => '',
                'mobileImage' => ''
            ])
        ],
        [
            'section_type' => 'showroom',
            'content_data' => json_encode([
                'heading' => "The largest luxury " . strtolower($productName) . " showroom in London",
                'image' => ''
            ])
        ],
        [
            'section_type' => 'luxury_content',
            'content_data' => json_encode([
                'title' => "Luxury {$productName}, Redefined",
                'introduction' => "Experience the finest " . strtolower($productName) . " collection.",
                'subtitle' => 'Why Visit Our Showroom?',
                'points' => [],
                'conclusion' => '<strong>Visit Us & Experience Luxury Firsthand</strong>'
            ])
        ],
        [
            'section_type' => 'gallery',
            'content_data' => json_encode([
                'images' => [
                    ['src' => '', 'alt' => ''],
                    ['src' => '', 'alt' => ''],
                    ['src' => '', 'alt' => '']
                ]
            ])
        ],
        [
            'section_type' => 'design_expert',
            'content_data' => json_encode([
                'heading' => "Avoid a design disaster.\nTalk to an expert.",
                'image' => '',
                'buttonText' => 'Book now',
                'buttonLink' => '/book-a-showroom-visit.html'
            ])
        ],
        [
            'section_type' => 'quiz_promo',
            'content_data' => json_encode([
                'heading' => "Take our lifestyle quiz & find the perfect " . strtolower($productName) . " match.",
                'features' => [
                    'AI Matching algorithm',
                    "Searches over 2000 Luxury {$productName}",
                    'Results Within 10 Minutes',
                    'Only Branded Italian Design',
                    'Exclusive Branded Italian Designs',
                    'Free Consultation Available'
                ],
                'buttonText' => "Try our {$productName} Matching Quiz",
                'buttonLink' => '#quiz',
                'images' => []
            ])
        ]
    ];

    $query = "INSERT INTO quiz_content (product_key, section_type, content_data) VALUES (?, ?, ?)";
    $stmt = $db->prepare($query);

    foreach ($defaultSections as $section) {
        $stmt->execute([
            $productKey,
            $section['section_type'],
            $section['content_data']
        ]);
    }

    // Create default question
    $questionQuery = "INSERT INTO quiz_questions (product_key, question_order, question_text) VALUES (?, 1, ?)";
    $questionStmt = $db->prepare($questionQuery);
    $questionStmt->execute([
        $productKey,
        "What best describes your needs for " . strtolower($productName) . "?"
    ]);

    $questionId = $db->lastInsertId();

    // Create default options
    $optionQuery = "INSERT INTO question_options (question_id, option_key, option_text, option_order) VALUES (?, ?, ?, ?)";
    $optionStmt = $db->prepare($optionQuery);

    $defaultOptions = [
        ['a', 'Option A', 1],
        ['b', 'Option B', 2],
        ['c', 'Option C', 3],
    ];

    foreach ($defaultOptions as $option) {
        $optionStmt->execute([
            $questionId,
            $option[0],
            $option[1],
            $option[2]
        ]);
    }
}

function updateProduct($db)
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['product_key'])) {
            sendError('Product key is required');
        }

        $query = "UPDATE product_quizzes SET name = ?, emoji = ?, description = ? WHERE product_key = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([
            $data['name'] ?? '',
            $data['emoji'] ?? '📦',
            $data['description'] ?? '',
            $data['product_key']
        ]);

        sendResponse(['message' => 'Product updated successfully']);
    } catch (Exception $e) {
        sendError('Failed to update product: ' . $e->getMessage(), 500);
    }
}

function deleteProduct($db)
{
    try {
        $productKey = $_GET['product_key'] ?? '';

        if (empty($productKey)) {
            sendError('Product key is required');
        }

        if ($productKey === 'sofa') {
            sendError('Cannot delete the default sofa product');
        }

        // Start transaction to ensure data integrity
        $db->beginTransaction();

        // First, get all question IDs for this product to delete their options
        $questionQuery = "SELECT id FROM quiz_questions WHERE product_key = ?";
        $questionStmt = $db->prepare($questionQuery);
        $questionStmt->execute([$productKey]);
        $questionIds = $questionStmt->fetchAll(PDO::FETCH_COLUMN);

        // Delete question options for all questions of this product
        if (!empty($questionIds)) {
            $placeholders = str_repeat('?,', count($questionIds) - 1) . '?';
            $optionQuery = "DELETE FROM question_options WHERE question_id IN ($placeholders)";
            $optionStmt = $db->prepare($optionQuery);
            $optionStmt->execute($questionIds);
        }

        // Delete all quiz questions for this product
        $deleteQuestionsQuery = "DELETE FROM quiz_questions WHERE product_key = ?";
        $deleteQuestionsStmt = $db->prepare($deleteQuestionsQuery);
        $deleteQuestionsStmt->execute([$productKey]);

        // Delete all quiz content for this product
        $deleteContentQuery = "DELETE FROM quiz_content WHERE product_key = ?";
        $deleteContentStmt = $db->prepare($deleteContentQuery);
        $deleteContentStmt->execute([$productKey]);

        // Finally, delete the product itself
        $deleteProductQuery = "DELETE FROM product_quizzes WHERE product_key = ?";
        $deleteProductStmt = $db->prepare($deleteProductQuery);
        $deleteProductStmt->execute([$productKey]);

        // Commit the transaction
        $db->commit();

        sendResponse(['message' => 'Product and all related data deleted successfully']);
    } catch (Exception $e) {
        // Rollback transaction on error
        if ($db->inTransaction()) {
            $db->rollback();
        }
        sendError('Failed to delete product: ' . $e->getMessage(), 500);
    }
}
