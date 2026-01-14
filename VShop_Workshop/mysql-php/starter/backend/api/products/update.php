<?php
/**
 * ===================================
 * API: แก้ไขสินค้า (Update Product)
 * ===================================
 * Method: POST
 * Body: { id, name, description, category_id, brand, price, cost, stock, model, image_url }
 *
 * 🎯 Challenge: นักเรียนต้องเขียน SQL UPDATE เอง!
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

$input = json_decode(file_get_contents('php://input'), true);

// Validate
if (empty($input['id'])) {
    sendResponse(400, 'กรุณาระบุ ID สินค้า');
}

$id = (int) $input['id'];
$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');
$category_id = (int) ($input['category_id'] ?? 0);
$brand = trim($input['brand'] ?? '');
$price = (float) ($input['price'] ?? 0);
$cost = (float) ($input['cost'] ?? 0);
$stock = (int) ($input['stock'] ?? 0);
$model = trim($input['model'] ?? '');
$image_url = trim($input['image_url'] ?? '');

try {
    // ตรวจสอบว่าสินค้ามีอยู่จริง
    $checkSql = "SELECT id FROM products WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$id]);

    if (!$checkStmt->fetch()) {
        sendResponse(404, 'ไม่พบสินค้า');
    }

    // ===================================
    // 🎯 TODO: เขียน SQL UPDATE แก้ไขสินค้า
    // ===================================
    //
    // 📝 Hint: UPDATE table SET col1=?, col2=? WHERE id=?
    // 📝 อย่าลืมใส่ WHERE id=? เพื่อระบุว่าจะแก้ record ไหน!
    //
    // ===================================

    // TODO: เขียน SQL UPDATE
    $sql = "UPDATE products SET
                ____________ = ?,
                ____________ = ?,
                ____________ = ?,
                ____________ = ?,
                ____________ = ?,
                ____________ = ?,
                ____________ = ?,
                ____________ = ?,
                ____________ = ?
            WHERE ____________ = ?";

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
        ____________,  // image_url
        ____________   // id (สำหรับ WHERE)
    ]);

    // ===================================

    sendResponse(200, 'แก้ไขสินค้าสำเร็จ');

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
