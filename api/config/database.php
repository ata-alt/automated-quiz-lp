<?php
// Database configuration
class Database
{
    private $dbHOST = 'localhost';
    private $dbUSER = 'root';
    private $dbPASS = '';
    private $dbBASE = 'automated_quiz';
    private $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->dbHOST . ";dbname=" . $this->dbBASE . ";charset=utf8",
                $this->dbUSER,
                $this->dbPASS,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8 COLLATE utf8_unicode_ci"
                )
            );
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}


// CORS headers for API
function setCorsHeaders()
{
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Cache control headers to prevent caching
    header("Cache-Control: no-cache, no-store, must-revalidate");
    header("Pragma: no-cache");
    header("Expires: 0");

    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Response helper functions
function sendResponse($data, $status_code = 200)
{
    http_response_code($status_code);
    echo json_encode($data);
    exit();
}

function sendError($message, $status_code = 400)
{
    http_response_code($status_code);
    echo json_encode(['error' => $message]);
    exit();
}
