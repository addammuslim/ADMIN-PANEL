<?php
/**
 * POST /api/products/create.php
 * Creates a new product using MySQLi prepared statement with validation & CSRF
 */

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/security.php';

// Accept JSON or form POST
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$name = trim($input['name'] ?? '');
$sku = trim($input['sku'] ?? '');
$slug = trim($input['slug'] ?? '');
$price = (float)($input['price'] ?? 0);
$salePrice = !empty($input['sale_price']) ? (float)$input['sale_price'] : null;
$costPrice = (float)($input['cost_price'] ?? 0);
$stock = (int)($input['stock'] ?? 0);
$lowStockThreshold = (int)($input['low_stock_threshold'] ?? 10);
$status = trim($input['status'] ?? 'In Stock');
$featured = !empty($input['featured']) ? 1 : 0;
$bestseller = !empty($input['bestseller']) ? 1 : 0;
$shortDescription = trim($input['short_description'] ?? '');
$mainImage = trim($input['main_image'] ?? '');

if (empty($name) || empty($sku)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Product name and unique SKU are required fields.'
    ]);
    exit;
}

if (empty($slug)) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
}

$stmt = $conn->prepare("
    INSERT INTO products (
        sku, name, slug, price, sale_price, cost_price, 
        stock, low_stock_threshold, status, featured, bestseller, 
        short_description, main_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    'sssdddiisssss',
    $sku,
    $name,
    $slug,
    $price,
    $salePrice,
    $costPrice,
    $stock,
    $lowStockThreshold,
    $status,
    $featured,
    $bestseller,
    $shortDescription,
    $mainImage
);

try {
    $stmt->execute();
    $insertId = $conn->insert_id;
    $stmt->close();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Product successfully stored in database.',
        'data' => [
            'id' => $insertId,
            'name' => $name,
            'sku' => $sku
        ]
    ]);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to insert product: ' . $e->getMessage()
    ]);
}
