<?php
/**
 * ===================================
 * API: Get Cart
 * ===================================
 * Method: GET
 * Auth: Required
 * Output: { "status": 200, "data": { "items": [...], "total": 1234.00 } }
 * ===================================
 */

session_start();

require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

requireGET();
requireLogin();

try {
    $userId = getCurrentUserId();

    // ดึงข้อมูลตะกร้าพร้อมข้อมูลสินค้า
    $sql = "SELECT
                c.id as cart_id,
                c.id as cart_item_id,
                c.quantity,
                c.added_at,
                p.id as product_id,
                p.name,
                p.price,
                p.stock,
                p.image_url,
                p.brand
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            ORDER BY c.added_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll();

    // คำนวณยอดรวม
    $subtotal = 0;
    foreach ($items as &$item) {
        $item['subtotal'] = $item['price'] * $item['quantity'];
        $subtotal += $item['subtotal'];
    }

    // ส่งผลลัพธ์ในรูปแบบที่ frontend ต้องการ
    sendResponse(200, 'Cart retrieved successfully', [
        'items' => $items,
        'item_count' => count($items),
        'summary' => [
            'subtotal' => $subtotal,
            'shipping_cost' => 0,
            'total' => $subtotal
        ]
    ]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
