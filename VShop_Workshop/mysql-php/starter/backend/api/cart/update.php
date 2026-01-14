<?php
/**
 * ===================================
 * API: Update Cart Item
 * ===================================
 * Method: POST
 * Auth: Required
 * Input: { "cart_id": 1, "quantity": 2 }
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

    if (empty($input['cart_id']) || !isset($input['quantity'])) {
        sendResponse(400, 'Cart ID and quantity are required');
    }

    $cartId = intval($input['cart_id']);
    $quantity = intval($input['quantity']);

    // ตรวจสอบว่า cart item นี้เป็นของ user นี้
    $stmt = $pdo->prepare("SELECT c.id, c.product_id, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?");
    $stmt->execute([$cartId, $userId]);
    $cartItem = $stmt->fetch();

    if (!$cartItem) {
        sendResponse(404, 'Cart item not found');
    }

    if ($quantity <= 0) {
        // ถ้าจำนวน 0 หรือต่ำกว่า → ลบออก
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
        $stmt->execute([$cartId]);
        sendResponse(200, 'ลบสินค้าออกจากตะกร้าแล้ว');
    }

    if ($quantity > $cartItem['stock']) {
        sendResponse(400, 'ไม่มีสินค้าเพียงพอ (มี ' . $cartItem['stock'] . ' ชิ้น)');
    }

    // อัปเดตจำนวน
    $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
    $stmt->execute([$quantity, $cartId]);

    sendResponse(200, 'อัปเดตตะกร้าแล้ว', ['quantity' => $quantity]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
