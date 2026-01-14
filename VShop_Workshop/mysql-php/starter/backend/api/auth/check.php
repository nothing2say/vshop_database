<?php
/**
 * ===================================
 * API: ตรวจสอบสถานะ Login (Check Auth)
 * ===================================
 * Method: GET
 * หน้าที่: ตรวจสอบว่า session ยังใช้งานได้อยู่หรือไม่
 *         ถ้าใช้ได้ ส่งข้อมูล user กลับไป
 *         ถ้าไม่ได้ ส่ง 401
 * ===================================
 */

// เริ่ม session ก่อนทำอะไรอื่น
session_start();

// นำเข้าไฟล์ที่จำเป็น
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่า login อยู่หรือไม่
if (!isLoggedIn()) {
    sendResponse(401, 'Not logged in');
}

// ดึงข้อมูล user จาก database เพื่อให้ได้ข้อมูลล่าสุด
try {
    $userId = getCurrentUserId();

    $sql = "SELECT id, email, name, phone, address, role, created_at
            FROM users WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        // User ถูกลบออกจาก database แล้ว
        sendResponse(401, 'User not found');
    }

    // อัปเดต session ด้วยข้อมูลล่าสุด (เช่น role อาจเปลี่ยน)
    $_SESSION['role'] = $user['role'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['email'] = $user['email'];

    // ส่งข้อมูล user กลับ (ไม่รวม password)
    sendResponse(200, 'Session valid', $user);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
}
?>
