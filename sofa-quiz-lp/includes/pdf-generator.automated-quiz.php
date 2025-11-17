<?php

/**
 * PDF Generator for Automated Quiz Results
 * 
 * Generates PDF version of the personalized design guide
 * Uses PDF Generator API v4 with JWT authentication
 * 
 * Author: Gabriel Maturan
 * Date: 2025-01-14
 */

// Load configuration
$config = require_once(__DIR__ . '/config/pdf-config.php');

// Load JWT Generator class
require_once(__DIR__ . '/jwt-generator.class.php');

// Load PDF Generator API class
require_once(__DIR__ . '/pdf-generator-api.class.php');

/**
 * Generate Quiz PDF from HTML content
 * 
 * @param string $htmlContent The HTML content to convert
 * @param string $userName User's name for filename
 * @return array|null Returns array with PDF data or null on failure
 */
function generateQuizPDF($htmlContent, $userName = 'User')
{
    global $config;

    try {
        // Initialize response array
        $response = [
            'content' => null,
            'filename' => null,
            'error' => null
        ];

        // Get configuration
        $pdfConfig = $config['pdf_generator'];

        // Generate JWT token if dynamic JWT is enabled
        $apiKey = $pdfConfig['api_key'];

        if ($pdfConfig['use_dynamic_jwt']) {
            $jwtGenerator = new JWTGenerator(
                $pdfConfig['api_key'],
                $pdfConfig['api_secret']
            );

            // Generate fresh token with user email as subject
            $apiKey = $jwtGenerator->generateToken(
                $pdfConfig['jwt_expiry'],
                $userName
            );

            error_log("Generated JWT token for PDF generation");
        }

        // Initialize PDF Generator API
        $pdfGenerator = new PDFGeneratorAPI($apiKey, $pdfConfig['workspace']);

        // Prepare HTML content
        $htmlContent = prepareHTMLForPDF($htmlContent);

        // Set PDF options
        $pdfOptions = [
            'paper_size' => $pdfConfig['options']['paper_size'],
            'landscape' => $pdfConfig['options']['landscape'],
            'margin_top' => $pdfConfig['options']['margin_top'],
            'margin_right' => $pdfConfig['options']['margin_right'],
            'margin_bottom' => $pdfConfig['options']['margin_bottom'],
            'margin_left' => $pdfConfig['options']['margin_left'],
            'filename' => generatePDFFilename($userName)
        ];

        // Generate PDF
        $result = $pdfGenerator->generateFromHTML($htmlContent, $pdfOptions);

        if ($result['success']) {
            // Get PDF binary data
            $pdfContent = $result['pdf_binary'];

            // Generate filename
            $filename = generatePDFFilename($userName);

            // Save to file if storage path is configured
            if (!empty($pdfConfig['storage_path'])) {
                $filepath = rtrim($pdfConfig['storage_path'], '/') . '/' . $filename;

                // Create directory if it doesn't exist
                $dir = dirname($filepath);
                if (!is_dir($dir)) {
                    mkdir($dir, 0755, true);
                    error_log("Created directory: " . $dir);
                }

                // Save PDF to file
                if ($pdfGenerator->savePDFToFile($pdfContent, $filepath)) {
                    error_log("PDF saved to: " . $filepath);
                } else {
                    error_log("Failed to save PDF to file");
                }
            }

            // Return PDF data
            $response['content'] = $pdfContent;
            $response['filename'] = $filename;

            error_log("PDF generated successfully: " . $filename . " (Size: " . strlen($pdfContent) . " bytes)");

            return $response;
        } else {
            // Log error
            $errorMessage = isset($result['error']) ? $result['error'] : 'Unknown error';
            error_log("PDF generation failed: " . $errorMessage);

            if (isset($result['raw_response'])) {
                error_log("Raw API response: " . $result['raw_response']);
            }

            $response['error'] = $errorMessage;

            // Check if we should continue without PDF
            if ($pdfConfig['continue_without_pdf']) {
                error_log("Continuing without PDF attachment as per configuration");
                return null;
            } else {
                throw new Exception("PDF generation failed: " . $errorMessage);
            }
        }
    } catch (Exception $e) {
        error_log("PDF generation exception: " . $e->getMessage());

        // Check if we should continue without PDF
        if (isset($pdfConfig['continue_without_pdf']) && $pdfConfig['continue_without_pdf']) {
            return null;
        } else {
            throw $e;
        }
    }
}

/**
 * Prepare HTML content for PDF conversion
 * 
 * @param string $html Raw HTML content
 * @return string Prepared HTML
 */
function prepareHTMLForPDF($html)
{
    // Ensure HTML has proper structure
    if (strpos($html, '<!DOCTYPE html>') === false) {
        $html = '<!DOCTYPE html>' . $html;
    }

    // Convert special characters that might cause issues
    $html = str_replace('€', '&euro;', $html);
    $html = str_replace('£', '&pound;', $html);
    $html = str_replace('•', '&bull;', $html);
    // Ensure all images have absolute URLs
    $html = convertRelativeToAbsoluteUrls($html);

    return $html;
}
/**
 * Convert relative URLs to absolute URLs in HTML
 * 
 * @param string $html HTML content
 * @return string HTML with absolute URLs
 */
function convertRelativeToAbsoluteUrls($html)
{
    // Define base URL for FCI London
    $baseUrl = 'https://www.fcilondon.co.uk';

    // Convert relative image sources
    $patterns = [
        '/<img([^>]*?)src=["\'](?!http|https|\/\/)([^"\']+)["\']/' => '<img$1src="' . $baseUrl . '/$2"',
        '/<link([^>]*?)href=["\'](?!http|https|\/\/)([^"\']+)["\']/' => '<link$1href="' . $baseUrl . '/$2"'
    ];

    foreach ($patterns as $pattern => $replacement) {
        $html = preg_replace($pattern, $replacement, $html);
    }

    return $html;
}

/**
 * Generate PDF filename
 * 
 * @param string $userName User's name
 * @return string Generated filename
 */
function generatePDFFilename($userName)
{
    global $config;

    // Clean user name for filename
    $cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $userName);
    $cleanName = substr($cleanName, 0, 30); // Limit length

    // Generate timestamp
    $timestamp = date('Y-m-d_His');

    // Use configured pattern or default
    $pattern = isset($config['email']['pdf_attachment_name'])
        ? $config['email']['pdf_attachment_name']
        : 'FCI_Design_Guide_{name}_{timestamp}.pdf';

    // Replace placeholders
    $filename = str_replace(
        ['{name}', '{timestamp}', '{date}'],
        [$cleanName, $timestamp, date('Y-m-d')],
        $pattern
    );

    // Ensure it ends with .pdf
    if (substr($filename, -4) !== '.pdf') {
        $filename .= '.pdf';
    }

    return $filename;
}
