<?php
/**
 * ===================================
 * API: Login
 * ===================================
 * Method: POST
 * Input: { "email": "user@email.com", "password": "password123" }
 * Output: { "status": 200, "message": "Login successful", "data": {...} }
 * ===================================
 */

// เริ่ม session ก่อน (ต้องเรียกก่อน header อื่นๆ)
session_start();

// นำเข้าไฟล์ที่จำเป็น
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่าเป็น POST request
requirePOST();

try {
    // ดึงข้อมูลจาก request body (JSON)
    $input = getJSONInput();

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (empty($input['email']) || empty($input['password'])) {
        sendResponse(400, 'Email and password are required');
    }

    // Sanitize input
    $email = sanitizeInput($input['email']);
    $password = $input['password']; // ไม่ sanitize password เพราะอาจมีอักขระพิเศษ

    // ===================================
    // ค้นหา user จาก email
    // ===================================
    $stmt = $pdo->prepare("SELECT id, email, password, name, phone, address, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // ถ้าไม่เจอ user
    if (!$user) {
        sendResponse(401, 'Invalid email or password');
    }

    // ===================================
    // ตรวจสอบ password
    // ===================================
    // ใช้ password_verify() เพื่อเช็ค hashed password
    if (!password_verify($password, $user['password'])) {
        sendResponse(401, 'Invalid email or password');
    }

    // ===================================
    // Login สำเร็จ! เก็บข้อมูลใน session
    // ===================================
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['role'] = $user['role'];

    // ส่งข้อมูล user กลับไป (ไม่รวม password)
    $userData = [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'phone' => $user['phone'],
        'address' => $user['address'],
        'role' => $user['role']
    ];

    sendResponse(200, 'Login successful', $userData);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI:
// 1. "ทำไมต้อง hash password ก่อนเก็บใน database"
// 2. "password_hash() และ password_verify() ทำงานยังไง"
// 3. "อธิบาย bcrypt algorithm"
// 4. "Rainbow Table Attack คืออะไร"
// 5. "Two-Factor Authentication (2FA) คืออะไร"
//
// 💡 ทดสอบ API ด้วย Postman:
// POST http://localhost/vshop/backend-mysql/api/auth/login.php
// Body (JSON):
// {
//     "email": "admin@vshop.com",
//     "password": "password123"
// }
// ===================================

?>
