<?php
/**
 * ===================================
 * API: Register (สมัครสมาชิก)
 * ===================================
 * Method: POST
 * Input: { "email", "password", "name", "phone"?, "address"? }
 * Output: { "status": 201, "message": "Registration successful", "data": {...} }
 * ===================================
 */

require_once '../../config/database.php';
require_once '../../includes/cors.php';

requirePOST();

try {
    $input = getJSONInput();

    // ตรวจสอบข้อมูลบังคับ
    $required = ['email', 'password', 'name'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            sendResponse(400, "Field '$field' is required");
        }
    }

    // Sanitize input
    $email = sanitizeInput($input['email']);
    $name = sanitizeInput($input['name']);
    $phone = sanitizeInput($input['phone'] ?? '');
    $address = sanitizeInput($input['address'] ?? '');
    $password = $input['password'];

    // ตรวจสอบรูปแบบ email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(400, 'Invalid email format');
    }

    // ตรวจสอบความยาว password (อย่างน้อย 6 ตัว)
    if (strlen($password) < 6) {
        sendResponse(400, 'Password must be at least 6 characters');
    }

    // ===================================
    // ตรวจสอบว่า email ซ้ำหรือไม่
    // ===================================
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(400, 'Email already exists');
    }

    // ===================================
    // Hash password ก่อนเก็บ
    // ===================================
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // ===================================
    // เพิ่ม user ใหม่
    // ===================================
    $stmt = $pdo->prepare("
        INSERT INTO users (email, password, name, phone, address, role)
        VALUES (?, ?, ?, ?, ?, 'customer')
    ");

    $stmt->execute([
        $email,
        $hashedPassword,
        $name,
        $phone,
        $address
    ]);

    // ดึง ID ที่เพิ่งสร้าง
    $userId = $pdo->lastInsertId();

    // ===================================
    // Auto-login หลัง register สำเร็จ
    // ===================================
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['email'] = $email;
    $_SESSION['name'] = $name;
    $_SESSION['role'] = 'customer';

    // ส่งข้อมูลกลับ
    $userData = [
        'id' => $userId,
        'email' => $email,
        'name' => $name,
        'phone' => $phone,
        'address' => $address,
        'role' => 'customer'
    ];

    sendResponse(201, 'Registration successful', $userData);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI:
// 1. "Password strength requirements ที่ดีควรเป็นยังไง"
// 2. "อธิบาย FILTER_VALIDATE_EMAIL ใน PHP"
// 3. "lastInsertId() ทำงานยังไง"
// 4. "Auto-login หลัง register ปลอดภัยหรือไม่"
//
// 💡 ทดสอบ:
// POST http://localhost/vshop/backend-mysql/api/auth/register.php
// {
//     "email": "newuser@email.com",
//     "password": "password123",
//     "name": "ผู้ใช้ใหม่",
//     "phone": "081-234-5678",
//     "address": "123 ถนนสุขุมวิท"
// }
// ===================================

?>
