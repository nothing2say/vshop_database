<?php
/**
 * ===================================
 * API: Get All Categories (ดูหมวดหมู่ทั้งหมด)
 * ===================================
 * Method: GET
 * Output: { "status": 200, "data": [...] }
 * ===================================
 */

require_once '../../config/database.php';
require_once '../../includes/cors.php';

requireGET();

try {
    // ดึงหมวดหมู่ทั้งหมด
    $sql = "SELECT id, name, description FROM categories ORDER BY name ASC";
    $stmt = $pdo->query($sql);
    $categories = $stmt->fetchAll();

    sendResponse(200, 'Categories retrieved successfully', $categories);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI:
// 1. "อธิบาย SQL ORDER BY clause"
// 2. "ทำไมต้อง fetchAll() แทนที่จะ fetch() อันเดียว"
// ===================================

?>
