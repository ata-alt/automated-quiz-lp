<?php
require_once 'config/database.php';

setCorsHeaders();

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendError("Database connection failed", 500);
    }
} catch (Exception $e) {
    sendError("Database connection error: " . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        storeQuizResult($db);
        break;
    case 'GET':
        getQuizResults($db);
        break;
    case 'DELETE':
        deleteQuizResult($db);
        break;
    default:
        sendError("Method not allowed", 405);
        break;
}

function storeQuizResult($db)
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        // Validate required fields
        if (!isset($input['name']) || !isset($input['email']) || !isset($input['answers'])) {
            sendError("Missing required fields: name, email, and answers are required", 400);
        }

        $name = trim($input['name']);
        $email = trim($input['email']);
        $phone = isset($input['phone']) ? trim($input['phone']) : null;
        $product_key = isset($input['product_key']) ? trim($input['product_key']) : null;
        $answers = $input['answers'];

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError("Invalid email format", 400);
        }

        // Validate answers is array
        if (!is_array($answers)) {
            sendError("Answers must be an array", 400);
        }

        // Prepare SQL statement
        $query = "INSERT INTO automated_quiz_results (name, email, phone, product_key, quiz_answers)
                  VALUES (:name, :email, :phone, :product_key, :quiz_answers)";

        $stmt = $db->prepare($query);

        // Bind parameters
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':product_key', $product_key);
        $quiz_answers_json = json_encode($answers);
        $stmt->bindParam(':quiz_answers', $quiz_answers_json);

        if ($stmt->execute()) {
            $result_id = $db->lastInsertId();
            sendResponse([
                'success' => true,
                'message' => 'Quiz result stored successfully',
                'result_id' => $result_id
            ], 201);
        } else {
            sendError("Failed to store quiz result", 500);
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendError("Database error occurred", 500);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        sendError("An error occurred while storing the quiz result", 500);
    }
}

function getQuizResults($db)
{
    try {
        // Get parameters for filtering/pagination
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
        $product_key = isset($_GET['product_key']) ? trim($_GET['product_key']) : null;

        // Build query
        $query = "SELECT id, name, email, phone, product_key, quiz_answers, created_at
                  FROM automated_quiz_results";
        $params = [];

        if ($product_key) {
            $query .= " WHERE product_key = :product_key";
            $params[':product_key'] = $product_key;
        }

        $query .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);

        // Bind parameters
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        $results = $stmt->fetchAll();

        // Decode JSON answers for each result
        foreach ($results as &$result) {
            $result['quiz_answers'] = json_decode($result['quiz_answers'], true);
        }

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM automated_quiz_results";
        if ($product_key) {
            $countQuery .= " WHERE product_key = :product_key";
        }

        $countStmt = $db->prepare($countQuery);
        if ($product_key) {
            $countStmt->bindValue(':product_key', $product_key);
        }
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];

        sendResponse([
            'success' => true,
            'results' => $results,
            'pagination' => [
                'limit' => $limit,
                'offset' => $offset,
                'total' => intval($total)
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendError("Database error occurred", 500);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        sendError("An error occurred while retrieving quiz results", 500);
    }
}

function deleteQuizResult($db)
{
    try {
        // Get the result ID from the URL path
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        $resultId = end($pathParts);

        // If no ID in path, check for 'id' parameter
        if (!is_numeric($resultId)) {
            $resultId = isset($_GET['id']) ? intval($_GET['id']) : null;
        } else {
            $resultId = intval($resultId);
        }

        // Validate result ID
        if (!$resultId || $resultId <= 0) {
            sendError("Invalid or missing result ID", 400);
        }

        // Check if result exists
        $checkQuery = "SELECT id FROM automated_quiz_results WHERE id = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':id', $resultId, PDO::PARAM_INT);
        $checkStmt->execute();

        if ($checkStmt->rowCount() === 0) {
            sendError("Quiz result not found", 404);
        }

        // Delete the result
        $deleteQuery = "DELETE FROM automated_quiz_results WHERE id = :id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':id', $resultId, PDO::PARAM_INT);

        if ($deleteStmt->execute()) {
            sendResponse([
                'success' => true,
                'message' => 'Quiz result deleted successfully',
                'deleted_id' => $resultId
            ]);
        } else {
            sendError("Failed to delete quiz result", 500);
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendError("Database error occurred", 500);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        sendError("An error occurred while deleting the quiz result", 500);
    }
}
