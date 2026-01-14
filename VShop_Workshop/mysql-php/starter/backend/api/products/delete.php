<?php
/**
 * ===================================
 * API: ลบสินค้า (Delete Product)
 * ===================================
 * Method: POST
 * Body: { id }
 *
 * 🎯 Challenge: นักเรียนต้องเขียน SQL DELETE เอง!
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

if (empty($input['id'])) {
    sendResponse(400, 'กรุณาระบุ ID สินค้า');
}

$id = (int) $input['id'];

try {
    // ตรวจสอบว่าสินค้ามีอยู่จริง
    $checkSql = "SELECT id, name FROM products WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$id]);
    $product = $checkStmt->fetch();

    if (!$product) {
        sendResponse(404, 'ไม่พบสินค้า');
    }

    // ===================================
    // 🎯 TODO: เขียน SQL DELETE ลบสินค้า
    // ===================================
    //
    // 📝 Hint: DELETE FROM table WHERE id = ?
    // ⚠️ ระวัง! ต้องมี WHERE เสมอ ไม่งั้นจะลบหมดทั้งตาราง!
    //
    // ===================================

    // TODO: เขียน SQL DELETE
    $sql = "____________ FROM ____________ WHERE ____________ = ?";

    // TODO: prepare และ execute
    $stmt = $pdo->____________($sql);
    $stmt->____________([____________]);

    // ===================================

    sendResponse(200, 'ลบสินค้า "' . $product['name'] . '" สำเร็จ');

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
