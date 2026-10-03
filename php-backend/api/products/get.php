<?php
/**
 * GET /api/products/get.php
 * Fetches paginated products with filtering & search via Prepared Statements
 */

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$status = isset($_GET['status']) ? trim($_GET['status']) : '';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 10;
$offset = ($page - 1) * $limit;

// Build dynamic WHERE clause safely
$whereClauses = [];
$params = [];
$types = '';

if ($search !== '') {
    $whereClauses[] = "(p.name LIKE ? OR p.sku LIKE ?)";
    $like = "%" . $search . "%";
    $params[] = $like;
    $params[] = $like;
    $types .= 'ss';
}

if ($category !== '' && $category !== 'all') {
    $whereClauses[] = "c.name = ?";
    $params[] = $category;
    $types .= 's';
}

if ($status !== '' && $status !== 'all') {
    $whereClauses[] = "p.status = ?";
    $params[] = $status;
    $types .= 's';
}

$whereSql = count($whereClauses) > 0 ? "WHERE " . implode(" AND ", $whereClauses) : "";

// Count total
$countSql = "SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id $whereSql";
$countStmt = $conn->prepare($countSql);
if (!empty($params)) {
    $countStmt->bind_param($types, ...$params);
}
$countStmt->execute();
$countResult = $countStmt->get_result();
$totalRecords = $countResult->fetch_assoc()['total'] ?? 0;
$countStmt->close();

// Query paginated data
$dataSql = "
    SELECT 
        p.id, p.sku, p.name, p.slug, p.price, p.sale_price, p.cost_price, 
        p.stock, p.low_stock_threshold, p.status, p.featured, p.bestseller, 
        p.main_image, p.sold_count, p.created_at,
        c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    $whereSql
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
";

$dataStmt = $conn->prepare($dataSql);
$dataTypes = $types . 'ii';
$dataParams = array_merge($params, [$limit, $offset]);
$dataStmt->bind_param($dataTypes, ...$dataParams);
$dataStmt->execute();
$result = $dataStmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}
$dataStmt->close();

echo json_encode([
    'status' => 'success',
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => (int)$totalRecords,
        'pages' => ceil($totalRecords / $limit)
    ],
    'data' => $products
]);
