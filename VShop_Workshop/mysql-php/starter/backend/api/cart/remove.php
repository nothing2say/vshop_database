<?php
/**
 * ===================================
 * API: Remove from Cart
 * ===================================
 * Method: POST
 * Auth: Required
 * Input: { "cart_id": 1 }
 * ===================================
 */

session_start();

require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

requirePOST();
requireLogin();

try {
    $input = getJSONInput();
    $userId = getCurrentUserId();

    if (empty($input['cart_id'])) {
        sendResponse(400, 'Cart ID is required');
    }

    $cartId = intval($input['cart_id']);

    // ตรวจสอบว่า cart item นี้เป็นของ user นี้
    $stmt = $pdo->prepare("SELECT id FROM cart WHERE id = ? AND user_id = ?");
    $stmt->execute([$cartId, $userId]);

    if (!$stmt->fetch()) {
        sendResponse(404, 'Cart item not found');
    }

    // ลบออกจากตะกร้า
    $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
    $stmt->execute([$cartId]);

    sendResponse(200, 'ลบสินค้าออกจากตะกร้าแล้ว');

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
