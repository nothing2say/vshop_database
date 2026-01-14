<?php
/**
 * ===================================
 * API: Clear Cart
 * ===================================
 * Method: POST
 * Auth: Required
 * ===================================
 */

session_start();

require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

requirePOST();
requireLogin();

try {
    $userId = getCurrentUserId();

    // ลบสินค้าทั้งหมดในตะกร้าของ user นี้
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->execute([$userId]);

    $deleted = $stmt->rowCount();

    sendResponse(200, 'ล้างตะกร้าแล้ว', ['deleted_items' => $deleted]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
