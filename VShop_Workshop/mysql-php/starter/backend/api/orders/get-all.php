<?php
/**
 * ===================================
 * API: ดูคำสั่งซื้อทั้งหมด (Get All Orders) - Admin Only
 * ===================================
 * Method: GET
 * ต้อง Login: ใช่ (เฉพาะ Admin)
 * หน้าที่: ดึงรายการคำสั่งซื้อทั้งหมดในระบบ
 *
 * Query Parameters:
 *   - status: กรองตามสถานะ (pending, paid, shipped, delivered, cancelled)
 *   - page: หน้าที่ต้องการ (default: 1)
 *   - limit: จำนวนต่อหน้า (default: 20)
 * ===================================
 */

// เริ่ม session ก่อนทำอะไรอื่น
session_start();

// นำเข้าไฟล์ที่จำเป็น
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่าเป็น GET และเป็น Admin
requireGET();
requireAdmin();

try {
    // ===================================
    // ขั้นตอนที่ 1: รับ query parameters
    // ===================================
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : '';
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
    $offset = ($page - 1) * $limit;

    // ===================================
    // ขั้นตอนที่ 2: สร้าง SQL query
    // ===================================
    $whereClause = '';
    $params = [];

    // ถ้ามีการกรองตาม status
    if (!empty($status)) {
        $validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
        if (in_array($status, $validStatuses)) {
            $whereClause = 'WHERE o.status = ?';
            $params[] = $status;
        }
    }

    // ===================================
    // ขั้นตอนที่ 3: นับจำนวนทั้งหมด (สำหรับ pagination)
    // ===================================
    $countSql = "SELECT COUNT(*) as total FROM orders o $whereClause";
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($params);
    $totalOrders = $stmt->fetch()['total'];
    $totalPages = ceil($totalOrders / $limit);

    // ===================================
    // ขั้นตอนที่ 4: ดึงข้อมูล orders พร้อมข้อมูล user
    // ===================================
    $sql = "SELECT o.id, o.order_number, o.total_amount, o.status,
                   o.payment_method, o.shipping_address, o.notes,
                   o.created_at, o.paid_at, o.shipped_at, o.delivered_at,
                   u.id as user_id, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            $whereClause
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?";

    $params[] = $limit;
    $params[] = $offset;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    // ===================================
    // ขั้นตอนที่ 5: ดึงรายการสินค้าในแต่ละ order
    // ===================================
    $sql = "SELECT oi.order_id, oi.quantity, oi.price, oi.subtotal,
                   p.id as product_id, p.name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?";

    $itemStmt = $pdo->prepare($sql);

    foreach ($orders as &$order) {
        $itemStmt->execute([$order['id']]);
        $order['items'] = $itemStmt->fetchAll();
    }

    // ===================================
    // ขั้นตอนที่ 6: ส่งผลลัพธ์กลับ
    // ===================================
    sendResponse(200, 'ดึงข้อมูลสำเร็จ', [
        'orders' => $orders,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_orders' => $totalOrders,
            'per_page' => $limit
        ]
    ]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
