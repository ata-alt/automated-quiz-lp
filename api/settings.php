<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getSettings($db);
        break;
    case 'POST':
    case 'PUT':
        updateSettings($db);
        break;
    default:
        sendError('Method not allowed', 405);
        break;
}

function getSettings($db) {
    try {
        $settingKey = $_GET['key'] ?? '';

        if ($settingKey) {
            // Get specific setting
            $query = "SELECT setting_value FROM system_settings WHERE setting_key = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$settingKey]);

            $result = $stmt->fetch();
            if ($result) {
                sendResponse(['value' => $result['setting_value']]);
            } else {
                sendError('Setting not found', 404);
            }
        } else {
            // Get all settings
            $query = "SELECT setting_key, setting_value FROM system_settings";
            $stmt = $db->prepare($query);
            $stmt->execute();

            $settings = [];
            while ($row = $stmt->fetch()) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }

            sendResponse(['settings' => $settings]);
        }
    } catch(Exception $e) {
        sendError('Failed to fetch settings: ' . $e->getMessage(), 500);
    }
}

function updateSettings($db) {
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['key']) || !isset($data['value'])) {
            sendError('Key and value are required');
        }

        $query = "
            INSERT INTO system_settings (setting_key, setting_value)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ";
        $stmt = $db->prepare($query);
        $stmt->execute([$data['key'], $data['value']]);

        sendResponse(['message' => 'Setting updated successfully']);
    } catch(Exception $e) {
        sendError('Failed to update setting: ' . $e->getMessage(), 500);
    }
}
?>