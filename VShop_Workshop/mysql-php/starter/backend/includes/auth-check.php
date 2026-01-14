<?php
/**
 * ===================================
 * Authentication Check
 * ===================================
 * ตรวจสอบว่า user login แล้วหรือยัง
 * ใช้ session เก็บข้อมูล user
 * ===================================
 */

// เริ่ม session (ต้องเรียกก่อนใช้ $_SESSION)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * ฟังก์ชันตรวจสอบว่า login แล้วหรือยัง
 * @return bool true ถ้า login แล้ว, false ถ้ายัง
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * ฟังก์ชันบังคับให้ต้อง login ก่อนใช้งาน
 * ถ้ายัง login จะส่ง error 401
 */
function requireLogin() {
    if (!isLoggedIn()) {
        sendResponse(401, 'Unauthorized. Please login first.');
    }
}

/**
 * ฟังก์ชันตรวจสอบว่าเป็น admin หรือไม่
 * @return bool true ถ้าเป็น admin, false ถ้าไม่ใช่
 */
function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * ฟังก์ชันบังคับให้ต้องเป็น admin
 * ถ้าไม่ใช่ admin จะส่ง error 403
 */
function requireAdmin() {
    requireLogin();

    if (!isAdmin()) {
        sendResponse(403, 'Forbidden. Admin access only.');
    }
}

/**
 * ฟังก์ชันดึง user_id ที่ login อยู่
 * @return int|null user_id หรือ null ถ้ายัง login
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * ฟังก์ชันดึงข้อมูล user ที่ login อยู่
 * @return array ข้อมูล user
 */
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'],
        'email' => $_SESSION['email'],
        'name' => $_SESSION['name'],
        'role' => $_SESSION['role']
    ];
}

/**
 * ฟังก์ชัน logout
 */
function logout() {
    session_start();
    session_unset();
    session_destroy();
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI:
// 1. "Session ใน PHP คืออะไร และทำงานยังไง"
// 2. "ความแตกต่างระหว่าง Session และ Cookie"
// 3. "JWT Token คืออะไร และดีกว่า Session ยังไง"
// 4. "HTTP Status Code 401 vs 403 ต่างกันยังไง"
// 5. "Session Hijacking คืออะไร และป้องกันยังไง"
// ===================================

?>
