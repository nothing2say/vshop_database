<?php
/**
 * ===================================
 * API: Add to Cart
 * ===================================
 * Method: POST
 * Auth: Required
 * Input: { "product_id": 1, "quantity": 1 }
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

    if (empty($input['product_id'])) {
        sendResponse(400, 'Product ID is required');
    }

    $productId = intval($input['product_id']);
    $quantity = isset($input['quantity']) ? intval($input['quantity']) : 1;

    if ($quantity < 1) {
        sendResponse(400, 'Quantity must be at least 1');
    }

    // ตรวจสอบว่าสินค้ามีอยู่จริงและมี stock
    $stmt = $pdo->prepare("SELECT id, name, stock FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();

    if (!$product) {
        sendResponse(404, 'Product not found');
    }

    if ($product['stock'] < $quantity) {
        sendResponse(400, 'ไม่มีสินค้าเพียงพอ (มี ' . $product['stock'] . ' ชิ้น)');
    }

    // ตรวจสอบว่ามีในตะกร้าแล้วหรือไม่
    $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$userId, $productId]);
    $existing = $stmt->fetch();

    if ($existing) {
        // มีอยู่แล้ว → อัปเดตจำนวน
        $newQuantity = $existing['quantity'] + $quantity;

        if ($product['stock'] < $newQuantity) {
            sendResponse(400, 'ไม่มีสินค้าเพียงพอ (มี ' . $product['stock'] . ' ชิ้น, ในตะกร้ามี ' . $existing['quantity'] . ' ชิ้น)');
        }

        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $existing['id']]);

        sendResponse(200, 'อัปเดตจำนวนในตะกร้าแล้ว', [
            'cart_id' => $existing['id'],
            'quantity' => $newQuantity
        ]);
    } else {
        // ยังไม่มี → เพิ่มใหม่
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $productId, $quantity]);

        sendResponse(201, 'เพิ่มสินค้าในตะกร้าแล้ว', [
            'cart_id' => $pdo->lastInsertId(),
            'quantity' => $quantity
        ]);
    }

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
