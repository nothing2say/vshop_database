<?php
/**
 * ===================================
 * API: Logout
 * ===================================
 * Method: POST
 * Output: { "status": 200, "message": "Logout successful" }
 * ===================================
 */

require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

requirePOST();
requireLogin(); // ต้อง login อยู่ก่อนถึงจะ logout ได้

try {
    // ลบ session ทั้งหมด
    logout();

    sendResponse(200, 'Logout successful');

} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}

?>
