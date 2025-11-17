<?php
/*
 * PDF Generator API Helper Class
 * 
 * Handles PDF generation using PDF Generator API v4
 * Documentation: https://docs.pdfgeneratorapi.com/v4/
 * 
 * Author: Gabriel Maturan
 * Date: 2025-01-XX
 */

class PDFGeneratorAPI
{
    private $apiKey;
    private $workspace;
    private $baseUrl = 'https://us1.pdfgeneratorapi.com/api/v4';

    /**
     * Initialize PDF Generator API
     * 
     * @param string $apiKey Your PDF Generator API key
     * @param string $workspace Your workspace identifier
     */
    public function __construct($apiKey, $workspace = '')
    {
        $this->apiKey = $apiKey;
        $this->workspace = $workspace;
    }

    /**
     * Generate PDF from HTML content using API v4 Conversion endpoint
     * 
     * @param string $htmlContent The HTML content to convert
     * @param array $options Additional options (paper_size, landscape, margin, etc.)
     * @return array Returns array with PDF data and success status
     */
    public function generateFromHTML($htmlContent, $options = [])
    {
        // Default options for PDF Generator API v4 Conversion endpoint
        $defaultOptions = [
            'paper_size' => 'a4',        // a3, a4, a5, letter, legal
            'landscape' => false,         // false = portrait, true = landscape
            'margin_top' => '20mm',
            'margin_right' => '10mm',
            'margin_bottom' => '10mm',
            'margin_left' => '10mm'
        ];

        $options = array_merge($defaultOptions, $options);

        // Use the correct conversion endpoint for HTML to PDF
        $endpoint = $this->baseUrl . '/conversion/html2pdf';

        // Prepare data according to API v4 specs
        $data = [
            'content' => $htmlContent,    // API v4 uses 'content' not 'html'
            'paper_size' => $options['paper_size'],
            'landscape' => $options['landscape'],
            'margin_top' => $options['margin_top'],
            'margin_right' => $options['margin_right'],
            'margin_bottom' => $options['margin_bottom'],
            'margin_left' => $options['margin_left'],
            'output' => 'base64'          // Request base64 output
        ];

        // Add filename if provided
        if (isset($options['filename'])) {
            $data['filename'] = $options['filename'];
        }

        // Make API request
        $result = $this->makeRequest($endpoint, 'POST', $data);

        // Check for successful response
        if ($result && isset($result['response'])) {
            return [
                'success' => true,
                'pdf_base64' => $result['response'],
                'pdf_binary' => base64_decode($result['response'])
            ];
        }

        // Return error details
        return [
            'success' => false,
            'error' => isset($result['error']) ? $result['error'] : 'Unknown error',
            'http_code' => isset($result['http_code']) ? $result['http_code'] : 0,
            'raw_response' => isset($result) ? json_encode($result) : null
        ];
    }

    /**
     * Generate PDF from template
     * 
     * @param string $templateId Template ID from your PDF Generator account
     * @param array $data Data to merge with template
     * @param array $options Additional options
     * @return array Returns array with PDF data and success status
     */
    public function generateFromTemplate($templateId, $data = [], $options = [])
    {
        $endpoint = $this->baseUrl . '/templates/' . $templateId . '/output';

        $requestData = [
            'data' => $data,
            'format' => $options['format'] ?? 'pdf',
            'output' => $options['output'] ?? 'base64'
        ];

        if (!empty($this->workspace)) {
            $requestData['workspace'] = $this->workspace;
        }

        $result = $this->makeRequest($endpoint, 'POST', $requestData);

        if ($result && isset($result['response'])) {
            return [
                'success' => true,
                'pdf_base64' => $result['response'],
                'pdf_binary' => base64_decode($result['response'])
            ];
        }

        return [
            'success' => false,
            'error' => isset($result['error']) ? $result['error'] : 'Unknown error',
            'http_code' => isset($result['http_code']) ? $result['http_code'] : 0
        ];
    }

    /**
     * Make HTTP request to PDF Generator API
     * 
     * @param string $endpoint API endpoint URL
     * @param string $method HTTP method (GET, POST, etc.)
     * @param array $data Request data
     * @return array Response data with error handling
     */
    private function makeRequest($endpoint, $method = 'GET', $data = [])
    {
        $ch = curl_init();

        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];

        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120); // 2 minutes timeout for PDF generation

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        curl_close($ch);

        if ($error) {
            error_log("PDF Generator API cURL Error: " . $error);
            return ['error' => 'cURL Error: ' . $error, 'http_code' => $httpCode];
        }

        if ($httpCode !== 200 && $httpCode !== 201) {
            error_log("PDF Generator API HTTP Error: " . $httpCode . " - " . $response);
            return ['error' => $response, 'http_code' => $httpCode];
        }

        $result = json_decode($response, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("PDF Generator API JSON Error: " . json_last_error_msg());
            return ['error' => 'JSON decode error: ' . json_last_error_msg(), 'http_code' => $httpCode, 'raw_response' => $response];
        }

        return $result;
    }

    /**
     * Save PDF to file
     * 
     * @param string $pdfBinary Binary PDF data
     * @param string $filepath Full path where to save the PDF
     * @return bool Success status
     */
    public function savePDFToFile($pdfBinary, $filepath)
    {
        try {
            $result = file_put_contents($filepath, $pdfBinary);
            return $result !== false;
        } catch (Exception $e) {
            error_log("Failed to save PDF: " . $e->getMessage());
            return false;
        }
    }
}
