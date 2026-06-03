<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'elixir1';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // استخدم product_id بدلاً من id
    $stmt = $pdo->query("SELECT product_id, product_name, category, price FROM product ORDER BY product_id DESC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
