<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// GET
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT wp.id, wp.product_id, p.product_name, p.category, 
                   p.price as retail_price, wp.wholesale_price, 
                   p.image,
                   IFNULL(wp.hidden, 0) as hidden
            FROM wholesale_products wp
            INNER JOIN product p ON wp.product_id = p.product_id
            ORDER BY wp.id DESC
        ");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// POST
if ($method === 'POST') {
    // التحقق من وجود البيانات
    if (!isset($input['product_id']) || !isset($input['wholesale_price'])) {
        echo json_encode(['success' => false, 'error' => 'Missing product_id or wholesale_price']);
        exit;
    }
    
    $product_id = intval($input['product_id']);
    $wholesale_price = floatval($input['wholesale_price']);
    
    // التحقق من صحة السعر
    if ($wholesale_price <= 0) {
        echo json_encode(['success' => false, 'error' => 'Wholesale price must be greater than 0']);
        exit;
    }
    
    try {
        // التحقق من عدم التكرار
        $check = $pdo->prepare("SELECT id FROM wholesale_products WHERE product_id = ?");
        $check->execute([$product_id]);
        if ($check->rowCount() > 0) {
            echo json_encode(['success' => false, 'error' => 'Product already exists in wholesale list']);
            exit;
        }
        
        // إدراج المنتج الجديد
        $stmt = $pdo->prepare("INSERT INTO wholesale_products (product_id, wholesale_price) VALUES (?, ?)");
        $stmt->execute([$product_id, $wholesale_price]);
        
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Product added successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// PUT
if ($method === 'PUT') {
    if (!isset($input['id'])) {
        echo json_encode(['success' => false, 'error' => 'Missing id']);
        exit;
    }
    
    $id = intval($input['id']);
    
    try {
        if (isset($input['wholesale_price'])) {
            $wholesale_price = floatval($input['wholesale_price']);
            $stmt = $pdo->prepare("UPDATE wholesale_products SET wholesale_price = ? WHERE id = ?");
            $stmt->execute([$wholesale_price, $id]);
        }
        
        if (isset($input['hidden'])) {
            $hidden = $input['hidden'] ? 1 : 0;
            $stmt = $pdo->prepare("UPDATE wholesale_products SET hidden = ? WHERE id = ?");
            $stmt->execute([$hidden, $id]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Updated successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// DELETE
if ($method === 'DELETE') {
    if (!isset($input['id'])) {
        echo json_encode(['success' => false, 'error' => 'Missing id']);
        exit;
    }
    
    $id = intval($input['id']);
    
    try {
        $stmt = $pdo->prepare("DELETE FROM wholesale_products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Deleted successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?>
