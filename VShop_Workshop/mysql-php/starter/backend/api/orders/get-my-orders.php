<?php
/**
 * ===================================
 * API: ดูคำสั่งซื้อของฉัน (Get My Orders)
 * ===================================
 * Method: GET
 * ต้อง Login: ใช่
 * หน้าที่: ดึงรายการคำสั่งซื้อของลูกค้าที่ login อยู่
 * ===================================
 */

// เริ่ม session ก่อนทำอะไรอื่น
session_start();

// นำเข้าไฟล์ที่จำเป็น
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่าเป็น GET และ login แล้ว
requireGET();
requireLogin();

try {
    $userId = getCurrentUserId();

    // ===================================
    // ขั้นตอนที่ 1: ดึงคำสั่งซื้อทั้งหมดของ user นี้
    // ===================================
    $sql = "SELECT id, order_number, total_amount, status, payment_method,
                   shipping_address, notes, created_at, paid_at, shipped_at, delivered_at
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll();

    // ===================================
    // ขั้นตอนที่ 2: ดึงรายการสินค้าในแต่ละ order
    // ===================================
    $sql = "SELECT oi.order_id, oi.quantity, oi.price, oi.subtotal,
                   p.id as product_id, p.name, p.image_url, p.brand
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?";

    $itemStmt = $pdo->prepare($sql);

    // วนลูปเพิ่ม items เข้าไปในแต่ละ order
    foreach ($orders as &$order) {
        $itemStmt->execute([$order['id']]);
        $order['items'] = $itemStmt->fetchAll();
    }

    // ===================================
    // ขั้นตอนที่ 3: ส่งผลลัพธ์กลับ
    // ===================================
    sendResponse(200, 'ดึงข้อมูลสำเร็จ', [
        'orders' => $orders,
        'total_orders' => count($orders)
    ]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
