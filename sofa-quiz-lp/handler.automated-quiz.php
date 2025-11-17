<?php
/*
 * Automated Quiz Results Handler
 *
 * POST Handler Service: Client POST endpoint
 * Processes quiz results from n8n webhook and sends personalized design guide
 *
 * Author: Gabriel Maturan
 * Date: 2025-11-03
 */

// Security: Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Invalid Request Method.');
}

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for webhook integration
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load database helper class
require_once(__DIR__ . "/../../../../includes/app.class.php");
$app = new app();

// ============================================
// STEP 1: RETRIEVE AND VALIDATE WEBHOOK DATA
// ============================================

// Get raw POST data
$rawData = file_get_contents('php://input');

// Log received data for debugging
error_log("Received webhook data: " . $rawData);

// Decode JSON data
$webhookData = json_decode($rawData, true);

// Validate JSON was received
if (!$webhookData) {
    http_response_code(400);
    echo json_encode([
        'error' => 'No data received or invalid JSON',
        'received' => $rawData
    ]);
    exit;
}

// Handle array response - get first item if it's an array
if (isset($webhookData[0]) && is_array($webhookData[0])) {
    $webhookData = $webhookData[0];
}

// ============================================
// STEP 2: EXTRACT AND SANITIZE USER DATA
// ============================================

// Extract user information with safe defaults
$userName = isset($webhookData['userName']) ? htmlspecialchars(trim($webhookData['userName'])) : '';
$userEmail = isset($webhookData['userEmail']) ? htmlspecialchars(trim($webhookData['userEmail'])) : '';
$userPhone = isset($webhookData['userPhone']) ? htmlspecialchars(trim($webhookData['userPhone'])) : '';
$imageUrl = isset($webhookData['imageUrl']) ? htmlspecialchars($webhookData['imageUrl']) : '';
$styleWords = isset($webhookData['styleWords']) ? $webhookData['styleWords'] : ['word1' => '', 'word2' => '', 'word3' => ''];
$profile = isset($webhookData['profile']) ? $webhookData['profile'] : [];

// ============================================
// STEP 3: VALIDATE REQUIRED FIELDS
// ============================================

$validationErrors = [];

// Validate user name
if (empty($userName)) {
    $validationErrors[] = 'User name is required';
} elseif (strlen($userName) > 255) {
    $validationErrors[] = 'User name is too long (max 255 characters)';
}

// Validate email
if (empty($userEmail)) {
    $validationErrors[] = 'Email is required';
} elseif (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    $validationErrors[] = 'Invalid email format';
} elseif (strlen($userEmail) > 255) {
    $validationErrors[] = 'Email is too long (max 255 characters)';
}

// Validate phone (optional but if provided, must be valid)
if (!empty($userPhone)) {
    $phoneLength = strlen($userPhone);
    if ($phoneLength < 6 || $phoneLength > 98) {
        $validationErrors[] = 'Phone number must be between 6 and 98 characters';
    }
}

// If validation fails, return error
if (!empty($validationErrors)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Validation failed',
        'errors' => $validationErrors
    ]);
    exit;
}

// ============================================
// STEP 4: PREPARE DATABASE RECORD
// ============================================
// COMMENTED OUT FOR TESTING - Uncomment when ready to save to database


$dbData = [
    'fname' => explode(' ', $userName)[0], // First name
    'lname' => isset(explode(' ', $userName)[1]) ? implode(' ', array_slice(explode(' ', $userName), 1)) : '', // Last name
    'email' => $userEmail,
    'phone' => $userPhone,
    'form' => 'automated-quiz'
];

// Add tracking data if available
if (isset($_COOKIE["hubspotutk"])) {
    $dbData['hubspotutk'] = $_COOKIE["hubspotutk"];
}

if (isset($_SERVER["REMOTE_ADDR"])) {
    $dbData['ip'] = $_SERVER['REMOTE_ADDR'];
}

if (isset($_SERVER["HTTP_REFERER"])) {
    $dbData['url'] = $_SERVER["HTTP_REFERER"];
}

if (isset($_COOKIE["firsturl"])) {
    $dbData['firsturl'] = $_COOKIE["firsturl"];
}

if (isset($_COOKIE["requesturi"])) {
    $dbData['requesturi'] = $_COOKIE["requesturi"];
}

if (isset($_COOKIE["querystring"])) {
    $dbData['querystring'] = $_COOKIE["querystring"];
}


// ============================================
// STEP 5: GENERATE EMAIL HTML
// ============================================

// Start output buffering to capture email template HTML
ob_start();
include("includes/email.automated-quiz.php");
$emailHtml = ob_get_clean();

// ============================================
// STEP 5B: GENERATE PDF ATTACHMENT
// ============================================

// Include PDF generator
require_once("includes/pdf-generator.automated-quiz.php");

// Initialize PDF error holder
$pdfError = null;

// Modify the layout for PDF version only (WITHOUT intro text)
$pdfHtml = preg_replace(
    '/<table[^>]*background-color:\s*#f7f7f7;[^>]*>\s*<tr>\s*<td[^>]*padding:[^>]*>\s*<!-- Main Container -->\s*<table[^>]*max-width:\s*600px;[^>]*box-shadow:[^>]*>/is',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
            <td align="center" style="padding: 0;">
                
                <!-- Main Container -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; max-width: 100%;">',
    $emailHtml
);

// Generate PDF from the modified HTML
$pdfData = generateQuizPDF($pdfHtml, $userName);

// ============================================
// STEP 5C: ADD INTRO TEXT TO EMAIL HTML ONLY
// ============================================

// Extract first name from userName
$firstName = explode(' ', $userName)[0];

// Create introductory text for email only
$introText = "
<table role='presentation' cellpadding='0' cellspacing='0' border='0' width='100%' style='background-color: #f7f7f7;'>
    <tr>
        <td align='center' style='padding: 0 0 40px 0;'>
            <table role='presentation' cellpadding='0' cellspacing='0' border='0' width='100%' style='background-color: #ffffff; max-width: 100%; box-shadow: 0 2px 20px rgba(0,0,0,0.08);'>
                <tr>
                    <td style='padding: 40px 40px; font-family: \"Gilroy\", \"Titillium Web\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif;'>
                        <p style='margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; line-height: 1.6; font-weight: 400; width: 100%;'>
                            Dear $firstName,
                        </p>
                        <p style='margin: 0 0 15px 0; color: #2e2e2e; font-size: 14px; line-height: 1.7; font-weight: 300; width: 100%;'>
            Thanks for taking our Design Style Psychology Test — a tiny but telling window into how your mind ticks when it comes to interiors.
        </p>
        <p style='margin: 0 0 15px 0; color: #2e2e2e; font-size: 14px; line-height: 1.7; font-weight: 300; width: 100%;'>
            Now, unlike the typical faffing-about-with-fabrics approach, we do things rather differently. We start with how you live, how your space works, and how we can make it all function beautifully. Aesthetics are important, of course — but they come later, once the science and structure are sound.
        </p>
        <p style='margin: 0 0 15px 0; color: #2e2e2e; font-size: 14px; line-height: 1.7; font-weight: 300; width: 100%;'>
            Our team has spent the last 40+ years building in-house tools, tech, and methods that frankly leave most retailers and decorators scrambling for their Pinterest boards. This test is a small part of that system — not gospel, but a useful nudge. It helps us spot where to challenge your instincts (gently, promise) and show you options you'd never have chosen, but might end up loving.
        </p>
        <p style='margin: 0; color: #2e2e2e; font-size: 14px; line-height: 1.7; font-weight: 300; width: 100%;'>
            You don't know what you don't know — until we do what we do. And we've been doing it since 1985.
        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
";

// Add intro text to email HTML only (PDF already generated above without it)
$emailHtml = $introText . $emailHtml;

// ============================================
// STEP 6: SEND EMAIL VIA SENDINBLUE
// ============================================

$emailData = [];
$emailData['sender'] = [
    'name' => 'FCI London',
    'email' => 'info@fcilondon.co.uk'
];
$emailData['to'] = [
    [
        'name' => $userName,
        'email' => $userEmail
    ]
];

// Testing mode - no BCC
// Production BCC list (commented out for testing):
// $emailData['bcc'] = [
//     ['name' => 'Frame Emails', 'email' => 'frameemails@fcilondon.co.uk'],
//     ['name' => 'Gazal', 'email' => 'tm@fcilondon.co.uk'],
//     ['name' => 'Leadership Team UK', 'email' => 'lt@fcilondon.co.uk']
// ];
$emailData['subject'] = 'Your Personalized Interior Design Action Guide - FCI London';
$emailData['htmlContent'] = $emailHtml;

// ============================================
// STEP 6B: ATTACH PDF TO EMAIL
// ============================================

// Attach PDF if generated successfully
if ($pdfData !== null && !empty($pdfData['content'])) {

    $emailData['attachment'] = [
        [
            'content' => base64_encode($pdfData['content']),
            'name' => $pdfData['filename'],
            'contentType' => 'application/pdf'
        ]
    ];

    error_log("PDF attachment included: " . $pdfData['filename']);
} else {
    error_log("PDF generation failed - email will be sent without attachment");
    $pdfError = 'PDF generation failed';
}

// Send email
try {
    $emailResult = $app->sendInBlueEmail($emailData);

    // Log email sent
    error_log("Email sent successfully to: " . $userEmail);
} catch (Exception $e) {
    // Log error
    error_log("Email sending failed: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'error' => 'Email sending failed',
        'message' => $e->getMessage()
    ]);
    exit;
}

// ============================================
// STEP 7: SAVE TO DATABASE
// ============================================
// COMMENTED OUT FOR TESTING - Uncomment when ready to save to database


$dbSaveStatus = false;
$dbError = null;

try {
    $app->add('leads', $dbData);
    $dbSaveStatus = true;

    // Log database insert
    error_log("Lead saved to database: " . $userEmail);
} catch (Exception $e) {
    // Log error but don't fail the request
    $dbError = $e->getMessage();
    error_log("Database insert failed: " . $dbError);
}


// ============================================
// STEP 8: RETURN SUCCESS RESPONSE
// ============================================

// Prepare comprehensive response data
$responseData = [
    'success' => true,
    'message' => 'Quiz results processed and email sent successfully',
    'timestamp' => date('Y-m-d H:i:s'),
    'user' => [
        'email' => $userEmail,
        'name' => $userName,
        'phone' => $userPhone
    ],
    'pdf' => [
        'generated' => ($pdfData !== null && isset($pdfData['content']) && isset($pdfData['filename'])),
        'filename' => $pdfData['filename'] ?? null,
        'size' => isset($pdfData['content']) ? strlen($pdfData['content']) : null,
        'attached' => isset($emailData['attachment']) && count($emailData['attachment']) > 0,
        'error' => $pdfError
    ],
    'email' => [
        'sent' => true,
        'to' => $userEmail,
        'subject' => $emailData['subject'],
        'hasAttachment' => isset($emailData['attachment']) && count($emailData['attachment']) > 0,
        'attachmentCount' => isset($emailData['attachment']) ? count($emailData['attachment']) : 0
    ],
    'database' => [
        'saved' => $dbSaveStatus,
        'error' => $dbError
    ]
];

// Helper function to format bytes (defined inline to avoid function redeclaration issues)
if (!function_exists('formatBytes')) {
    function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

// Add attachment details if available
if (isset($emailData['attachment']) && count($emailData['attachment']) > 0) {
    $responseData['email']['attachments'] = array_map(function ($att) {
        $contentSize = isset($att['content']) ? strlen($att['content']) : 0;
        return [
            'name' => $att['name'] ?? 'unknown',
            'contentType' => $att['contentType'] ?? 'unknown',
            'size' => $contentSize,
            'sizeFormatted' => formatBytes($contentSize)
        ];
    }, $emailData['attachment']);
}

http_response_code(200);
echo json_encode($responseData, JSON_PRETTY_PRINT);

// Log completion
error_log("Quiz handler completed successfully for: " . $userEmail);
error_log("Response data: " . json_encode($responseData));
