<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'elixir1';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['product_name'])) {
        echo json_encode(['success' => false, 'error' => 'اسم المنتج مطلوب']);
        exit;
    }
    
   $stmt = $pdo->prepare("INSERT INTO product (product_name, price, category, stock, image, description, usageinstructions, medical_warning) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([
    $input['product_name'],
    $input['price'],
    $input['category'],
    $input['stock'] ?? 0,
    $input['image'] ?? null,
    $input['description'] ?? '',
    $input['usageinstructions'] ?? '',
    $input['medical_warning'] ?? ''
]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
