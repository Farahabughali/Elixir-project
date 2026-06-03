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
    
    if (empty($input['id'])) {
        echo json_encode(['success' => false, 'error' => 'ID المنتج مطلوب']);
        exit;
    }
    
    $stmt = $pdo->prepare("UPDATE product SET product_name = ?, price = ?, category = ?, stock = ?, image = ?, description = ?, usageinstructions = ?, medical_warning = ? WHERE product_id = ?");
    $stmt->execute([
        $input['product_name'],
        $input['price'],
        $input['category'],
        $input['stock'] ?? 0,
        $input['image'] ?? null,
        $input['description'] ?? '',
        $input['usageinstructions'] ?? '',
        $input['medical_warning'] ?? '',
        $input['id']
    ]);
    
    echo json_encode(['success' => true]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
