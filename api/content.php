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
        getContent($db);
        break;
    case 'POST':
    case 'PUT':
        saveContent($db);
        break;
    default:
        sendError('Method not allowed', 405);
        break;
}

function getContent($db)
{
    try {
        $productKey = $_GET['product_key'] ?? 'sofa';

        // Get all content sections for the product
        $query = "SELECT section_type, content_data FROM automated_quiz_content WHERE product_key = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$productKey]);

        $sections = $stmt->fetchAll();
        $content = [];

        foreach ($sections as $section) {
            $content[$section['section_type']] = json_decode($section['content_data'], true);
        }

        // Get questions and options
        $questionsQuery = "
            SELECT q.id, q.question_order, q.question_text,
                   o.option_key, o.option_text, o.image_url, o.option_order
            FROM automated_quiz_questions q
            LEFT JOIN automated_question_options o ON q.id = o.question_id
            WHERE q.product_key = ?
            ORDER BY q.question_order, o.option_order
        ";
        $questionsStmt = $db->prepare($questionsQuery);
        $questionsStmt->execute([$productKey]);

        $questionsData = $questionsStmt->fetchAll();
        $questions = [];

        foreach ($questionsData as $row) {
            $qId = $row['id'];

            if (!isset($questions[$qId])) {
                $questions[$qId] = [
                    'id' => $row['question_order'],
                    'text' => $row['question_text'],
                    'options' => []
                ];
            }

            if ($row['option_key']) {
                $questions[$qId]['options'][] = [
                    'id' => $row['option_key'],
                    'text' => $row['option_text'],
                    'image' => $row['image_url'] ?? ''
                ];
            }
        }

        $content['questions'] = array_values($questions);

        sendResponse(['content' => $content]);
    } catch (Exception $e) {
        sendError('Failed to fetch content: ' . $e->getMessage(), 500);
    }
}

function saveContent($db)
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        $productKey = $data['product_key'] ?? 'sofa';

        $db->beginTransaction();

        // Save content sections
        if (isset($data['sections'])) {
            foreach ($data['sections'] as $sectionType => $sectionData) {
                $query = "
                    INSERT INTO automated_quiz_content (product_key, section_type, content_data)
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE content_data = VALUES(content_data)
                ";
                $stmt = $db->prepare($query);
                $stmt->execute([
                    $productKey,
                    $sectionType,
                    json_encode($sectionData)
                ]);
            }
        }

        // Save questions
        if (isset($data['questions'])) {
            // Delete existing questions and options for this product
            $deleteOptionsQuery = "
                DELETE o FROM automated_question_options o
                INNER JOIN automated_quiz_questions q ON o.question_id = q.id
                WHERE q.product_key = ?
            ";
            $deleteOptionsStmt = $db->prepare($deleteOptionsQuery);
            $deleteOptionsStmt->execute([$productKey]);

            $deleteQuestionsQuery = "DELETE FROM automated_quiz_questions WHERE product_key = ?";
            $deleteQuestionsStmt = $db->prepare($deleteQuestionsQuery);
            $deleteQuestionsStmt->execute([$productKey]);

            // Insert new questions
            foreach ($data['questions'] as $index => $question) {
                $questionQuery = "
                    INSERT INTO automated_quiz_questions (product_key, question_order, question_text)
                    VALUES (?, ?, ?)
                ";
                $questionStmt = $db->prepare($questionQuery);
                $questionStmt->execute([
                    $productKey,
                    $index + 1,
                    $question['text']
                ]);

                $questionId = $db->lastInsertId();

                // Insert options for this question
                if (isset($question['options'])) {
                    foreach ($question['options'] as $optionIndex => $option) {
                        $optionQuery = "
                            INSERT INTO automated_question_options (question_id, option_key, option_text, image_url, option_order)
                            VALUES (?, ?, ?, ?, ?)
                        ";
                        $optionStmt = $db->prepare($optionQuery);
                        $optionStmt->execute([
                            $questionId,
                            $option['id'],
                            $option['text'],
                            $option['image'] ?? '',
                            $optionIndex + 1
                        ]);
                    }
                }
            }
        }

        $db->commit();
        sendResponse(['message' => 'Content saved successfully']);
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Failed to save content: ' . $e->getMessage(), 500);
    }
}
