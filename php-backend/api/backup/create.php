<?php
/**
 * POST /api/backup/create.php
 * Generates an SQL database dump file in PHP Native without external tools
 */

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

$backupDir = __DIR__ . '/../../backups/';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

$filename = 'auramaster_backup_' . date('Y-m-d_His') . '.sql';
$filepath = $backupDir . $filename;

$handle = fopen($filepath, 'w+');
if (!$handle) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to create backup file in storage.']);
    exit;
}

fwrite($handle, "-- AuraMaster Automated Database Backup\n");
fwrite($handle, "-- Generated: " . date('Y-m-d H:i:s') . "\n");
fwrite($handle, "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n");

$tablesResult = $conn->query("SHOW TABLES");
$tables = [];
while ($row = $tablesResult->fetch_row()) {
    $tables[] = $row[0];
}

foreach ($tables as $table) {
    // Structure
    $createResult = $conn->query("SHOW CREATE TABLE `$table`");
    $createRow = $createResult->fetch_row();
    fwrite($handle, "DROP TABLE IF EXISTS `$table`;\n");
    fwrite($handle, $createRow[1] . ";\n\n");

    // Data
    $dataResult = $conn->query("SELECT * FROM `$table`");
    while ($dataRow = $dataResult->fetch_assoc()) {
        $escapedValues = array_map(function($val) use ($conn) {
            return $val === null ? 'NULL' : "'" . $conn->real_escape_string($val) . "'";
        }, array_values($dataRow));

        $sql = "INSERT INTO `$table` VALUES (" . implode(", ", $escapedValues) . ");\n";
        fwrite($handle, $sql);
    }
    fwrite($handle, "\n");
}

fwrite($handle, "SET FOREIGN_KEY_CHECKS = 1;\n");
fclose($handle);

$filesize = filesize($filepath);

echo json_encode([
    'status' => 'success',
    'message' => 'Database backup archive created successfully.',
    'backup' => [
        'filename' => $filename,
        'size' => round($filesize / 1024, 2) . ' KB',
        'tables_count' => count($tables),
        'created_at' => date('Y-m-d H:i:s')
    ]
]);
