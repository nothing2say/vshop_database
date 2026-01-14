<?php
/**
 * ===================================
 * API: เพิ่มสินค้าใหม่ (Create Product)
 * ===================================
 * Method: POST
 * Body: { name, description, category_id, brand, price, cost, stock, model, image_url }
 *
 * 🎯 Challenge: นักเรียนต้องเขียน SQL INSERT เอง!
 * ===================================
 */

session_start();
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่าเป็น Admin เท่านั้น
if (!isLoggedIn() || !isAdmin()) {
    sendResponse(403, 'เฉพาะ Admin เท่านั้น');
}

// รับข้อมูลจาก request body
$input = json_decode(file_get_contents('php://input'), true);

// Validate ข้อมูลที่จำเป็น
if (empty($input['name']) || empty($input['category_id']) || !isset($input['price']) || !isset($input['stock'])) {
    sendResponse(400, 'กรุณากรอกข้อมูลให้ครบถ้วน (name, category_id, price, stock)');
}

// ดึงข้อมูลจาก input
$name = trim($input['name']);
$description = trim($input['description'] ?? '');
$category_id = (int) $input['category_id'];
$brand = trim($input['brand'] ?? '');
$price = (float) $input['price'];
$cost = (float) ($input['cost'] ?? 0);
$stock = (int) $input['stock'];
$model = trim($input['model'] ?? '');
$image_url = trim($input['image_url'] ?? '');

try {
    // ===================================
    // 🎯 TODO: เขียน SQL INSERT เพิ่มสินค้า
    // ===================================
    //
    // 📝 Hint 1: ใช้ Prepared Statement เพื่อป้องกัน SQL Injection
    // 📝 Hint 2: ตาราง 'products' มีคอลัมน์:
    //    - category_id (INT)
    //    - name (VARCHAR)
    //    - description (TEXT)
    //    - price (DECIMAL)
    //    - cost (DECIMAL)
    //    - stock (INT)
    //    - brand (VARCHAR)
    //    - model (VARCHAR)
    //    - image_url (VARCHAR)
    //
    // 📝 Hint 3: ใช้ ? เป็น placeholder และส่งค่าใน array
    //
    // ตัวอย่าง SQL:
    // INSERT INTO products (col1, col2, ...) VALUES (?, ?, ...)
    //
    // ===================================

    // TODO: เขียน SQL statement
    $sql = "INSERT INTO products (____________, ____________, ____________, ____________, ____________, ____________, ____________, ____________, ____________)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // TODO: prepare และ execute
    $stmt = $pdo->____________($sql);

    $stmt->____________([
        ____________,  // category_id
        ____________,  // name
        ____________,  // description
        ____________,  // price
        ____________,  // cost
        ____________,  // stock
        ____________,  // brand
        ____________,  // model
        ____________   // image_url
    ]);

    // TODO: ดึง ID ที่เพิ่งสร้าง
    $newId = $pdo->____________();

    // ===================================

    sendResponse(201, 'เพิ่มสินค้าสำเร็จ', ['id' => $newId]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
