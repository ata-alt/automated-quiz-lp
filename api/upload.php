<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit();
}

function sendSuccess($data) {
    echo json_encode(['status' => 'success', 'data' => $data]);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Only POST method allowed', 405);
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $error = $_FILES['image']['error'] ?? 'No file uploaded';
        sendError('File upload failed: ' . $error);
    }

    $file = $_FILES['image'];
    $uploadDir = '../uploaded-image/';

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = $file['type'];

    if (!in_array($fileType, $allowedTypes)) {
        sendError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    // Validate file size (max 10MB)
    $maxSize = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $maxSize) {
        sendError('File too large. Maximum size is 10MB.');
    }

    // Generate unique filename
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!$extension) {
        // Fallback based on mime type
        $mimeToExt = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp'
        ];
        $extension = $mimeToExt[$fileType] ?? 'jpg';
    }

    $filename = uniqid('img_', true) . '.' . $extension;
    $uploadPath = $uploadDir . $filename;

    // Create upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            sendError('Failed to create upload directory');
        }
    }

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        sendError('Failed to save uploaded file');
    }

    // Return the relative path from the root of the project
    $relativePath = 'uploaded-image/' . $filename;

    sendSuccess([
        'filename' => $filename,
        'path' => $relativePath,
        'url' => '../' . $relativePath,
        'size' => $file['size'],
        'type' => $fileType
    ]);

} catch (Exception $e) {
    error_log('Upload error: ' . $e->getMessage());
    sendError('Internal server error', 500);
}
?>