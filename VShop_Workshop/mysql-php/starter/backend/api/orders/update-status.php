<?php
/**
 * ===================================
 * API: อัปเดตสถานะคำสั่งซื้อ (Update Order Status) - Admin Only
 * ===================================
 * Method: POST
 * ต้อง Login: ใช่ (เฉพาะ Admin)
 * หน้าที่: เปลี่ยนสถานะคำสั่งซื้อ เช่น pending → paid → shipped → delivered
 *
 * Input: {
 *   "order_id": 1,
 *   "status": "paid|shipped|delivered|cancelled"
 * }
 * ===================================
 */

// เริ่ม session ก่อนทำอะไรอื่น
session_start();

// นำเข้าไฟล์ที่จำเป็น
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่าเป็น POST และเป็น Admin
requirePOST();
requireAdmin();

try {
    // ===================================
    // ขั้นตอนที่ 1: รับข้อมูลจาก frontend
    // ===================================
    $input = getJSONInput();

    if (empty($input['order_id']) || empty($input['status'])) {
        sendResponse(400, 'กรุณาระบุ order_id และ status');
    }

    $orderId = intval($input['order_id']);
    $newStatus = sanitizeInput($input['status']);

    // ตรวจสอบว่า status ถูกต้อง
    $validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($newStatus, $validStatuses)) {
        sendResponse(400, 'สถานะไม่ถูกต้อง');
    }

    // ===================================
    // ขั้นตอนที่ 2: ตรวจสอบว่า order มีอยู่จริง
    // ===================================
    $stmt = $pdo->prepare("SELECT id, status, order_number FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();

    if (!$order) {
        sendResponse(404, 'ไม่พบคำสั่งซื้อ');
    }

    // ===================================
    // ขั้นตอนที่ 3: อัปเดตสถานะ
    // ===================================
    // กำหนด timestamp field ที่ต้องอัปเดตตาม status
    $timestampField = '';
    switch ($newStatus) {
        case 'paid':
            $timestampField = 'paid_at';
            break;
        case 'shipped':
            $timestampField = 'shipped_at';
            break;
        case 'delivered':
            $timestampField = 'delivered_at';
            break;
    }

    // สร้าง SQL
    if ($timestampField) {
        $sql = "UPDATE orders SET status = ?, $timestampField = NOW() WHERE id = ?";
    } else {
        $sql = "UPDATE orders SET status = ? WHERE id = ?";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$newStatus, $orderId]);

    // ===================================
    // ขั้นตอนที่ 4: ส่งผลลัพธ์กลับ
    // ===================================
    // แปลง status เป็นภาษาไทย
    $statusText = [
        'pending' => 'รอชำระเงิน',
        'paid' => 'ชำระเงินแล้ว',
        'shipped' => 'จัดส่งแล้ว',
        'delivered' => 'ส่งถึงแล้ว',
        'cancelled' => 'ยกเลิก'
    ];

    sendResponse(200, 'อัปเดตสถานะสำเร็จ', [
        'order_id' => $orderId,
        'order_number' => $order['order_number'],
        'old_status' => $order['status'],
        'new_status' => $newStatus,
        'status_text' => $statusText[$newStatus]
    ]);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
