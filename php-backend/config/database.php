<?php
/**
 * AuraMaster - Master Reusable Admin Panel
 * Database Connection via PHP Native + MySQLi
 * Prepared Statements Only (No PDO as per architectural requirements)
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'auramaster_db');
define('DB_PORT', getenv('DB_PORT') ?: 3306);

// Enable MySQLi error reporting in development
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, (int)DB_PORT);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failure: ' . $e->getMessage()
    ]);
    exit;
}

/**
 * Helper to close connection cleanly at shutdown
 */
function closeDbConnection() {
    global $conn;
    if ($conn instanceof mysqli) {
        $conn->close();
    }
}
register_shutdown_function('closeDbConnection');
