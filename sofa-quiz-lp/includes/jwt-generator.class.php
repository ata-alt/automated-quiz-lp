<?php
/*
 * JWT Token Generator for PDF Generator API
 * 
 * Generates fresh JWT tokens that don't expire
 * 
 * Author: Gabriel Maturan
 * Date: 2025-01-XX
 */

class JWTGenerator
{
    private $apiKey;
    private $apiSecret;

    /**
     * Initialize JWT Generator
     * 
     * @param string $apiKey Your PDF Generator API Key
     * @param string $apiSecret Your PDF Generator API Secret
     */
    public function __construct($apiKey, $apiSecret)
    {
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
    }

    /**
     * Generate a fresh JWT token
     * 
     * @param int $expiryTime Token validity in seconds (default: 1 year)
     * @param string $subject Subject field (user email or identifier)
     * @return string JWT token
     */
    public function generateToken($expiryTime = 31536000, $subject = '')
    {
        // Header
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        // Payload - include sub field as required by API
        $payload = [
            'iss' => $this->apiKey,
            'sub' => $subject ?: $this->apiKey,  // Use subject if provided, otherwise use API key
            'exp' => time() + $expiryTime  // Token expires in specified time
        ];

        // Encode header
        $headerEncoded = $this->base64UrlEncode(json_encode($header));

        // Encode payload
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));

        // Create signature
        $signature = hash_hmac(
            'sha256',
            $headerEncoded . '.' . $payloadEncoded,
            $this->apiSecret,
            true
        );

        $signatureEncoded = $this->base64UrlEncode($signature);

        // Build JWT token
        $jwt = $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;

        return $jwt;
    }

    /**
     * Base64 URL encode
     * 
     * @param string $data Data to encode
     * @return string Encoded data
     */
    private function base64UrlEncode($data)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    /**
     * Decode JWT token (for debugging)
     * 
     * @param string $jwt JWT token
     * @return array Decoded payload
     */
    public function decodeToken($jwt)
    {
        $parts = explode('.', $jwt);

        if (count($parts) !== 3) {
            return false;
        }

        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);

        return $payload;
    }

    /**
     * Check if token is expired
     * 
     * @param string $jwt JWT token
     * @return bool True if expired
     */
    public function isTokenExpired($jwt)
    {
        $payload = $this->decodeToken($jwt);

        if (!$payload || !isset($payload['exp'])) {
            return true;
        }

        return time() >= $payload['exp'];
    }
}
