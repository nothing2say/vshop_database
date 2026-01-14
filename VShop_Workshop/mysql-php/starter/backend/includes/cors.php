<?php
/**
 * ===================================
 * CORS Headers Configuration
 * ===================================
 * CORS = Cross-Origin Resource Sharing
 * ใช้เมื่อ Frontend (เช่น localhost:5500) เรียก Backend (localhost:80)
 * ===================================
 */

// อนุญาตให้ทุก domain เรียกใช้ API
// ⚠️ ในระบบจริงควรระบุ domain เฉพาะ
header('Access-Control-Allow-Origin: *');

// อนุญาต methods ที่ใช้ได้
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// อนุญาต headers ที่ส่งมาได้
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// กำหนด Content-Type เป็น JSON
header('Content-Type: application/json; charset=utf-8');

// จัดการ Preflight Request (OPTIONS method)
// Browser จะส่ง OPTIONS มาก่อนเพื่อเช็คว่าสามารถเรียก API ได้หรือไม่
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI:
// 1. "CORS คืออะไร และทำไมต้องมี"
// 2. "Preflight Request คืออะไร"
// 3. "Same-Origin Policy คืออะไร"
// 4. "Access-Control-Allow-Origin: * มีความเสี่ยงอย่างไร"
// ===================================

?>
