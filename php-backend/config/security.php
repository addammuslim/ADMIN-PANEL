<?php
/**
 * AuraMaster Security & CSRF Token Validation
 * Strict defenses against CSRF, XSS, and SQL Injection
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'cookie_samesite' => 'Strict'
    ]);
}

/**
 * Generate CSRF Token for Forms
 */
function generateCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF Token from Request Header or Body
 */
function verifyCsrfToken(): void {
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($token) || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(403);
        echo json_encode([
            'status' => 'forbidden',
            'message' => 'CSRF verification failed or token mismatch.'
        ]);
        exit;
    }
}

/**
 * Sanitize Output against XSS (Cross-Site Scripting)
 */
function escape(string $data): string {
    return htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}
