<?php
/**
 * ===================================
 * Database Configuration & Connection
 * ===================================
 * ไฟล์นี้ใช้เชื่อมต่อกับ MySQL database
 * ===================================
 */

// ตั้งค่า Error Reporting (แสดง error ทั้งหมดเพื่อ debug)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ตั้งค่า Timezone เป็นไทย
date_default_timezone_set('Asia/Bangkok');

// ===================================
// การตั้งค่า Database
// ===================================
// 💡 ถ้าใช้ XAMPP ค่าเหล่านี้ใช้ได้เลย
// ถ้าติดตั้ง MySQL แบบ custom อาจต้องเปลี่ยน
// ===================================

define('DB_HOST', 'localhost');      // ที่อยู่ MySQL server
define('DB_NAME', 'vshop');      // ชื่อ database
define('DB_USER', 'root');           // username (XAMPP default = root)
define('DB_PASS', '');               // password (XAMPP default = ว่างเปล่า)
define('DB_CHARSET', 'utf8mb4');     // character set (รองรับภาษาไทย + emoji)

// ===================================
// สร้างการเชื่อมต่อ (Connection)
// ===================================

try {
    // สร้าง PDO object (PHP Data Objects)
    // PDO = วิธีเชื่อมต่อ database ที่ปลอดภัย
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            // ตั้งค่าเพิ่มเติม
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,  // แสดง error แบบละเอียด
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  // ดึงข้อมูลเป็น array
            PDO::ATTR_EMULATE_PREPARES => false,  // ใช้ prepared statements จริงๆ (ปลอดภัยกว่า)
        ]
    );

    // ถ้าเชื่อมต่อสำเร็จ (ไม่มี error)
    // echo "✅ Database connected successfully!<br>";
    // 💡 Comment บรรทัดบนออกเมื่อใช้งานจริง (ไม่ต้องแสดง message)

} catch (PDOException $e) {
    // ถ้าเชื่อมต่อไม่สำเร็จ (มี error)
    die("❌ Database connection failed: " . $e->getMessage());
    // die() = หยุดการทำงานของ script ทันที
}

// ===================================
// ฟังก์ชันช่วยเหลือ (Helper Functions)
// ===================================

/**
 * ฟังก์ชันสำหรับส่ง JSON response
 * ใช้บ่อยมากในการทำ API
 */
function sendResponse($status, $message, $data = null) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');

    $response = [
        'status' => $status,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * ฟังก์ชันตรวจสอบว่าเป็น POST request หรือไม่
 */
function requirePOST() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(405, 'Method not allowed. Please use POST request.');
    }
}

/**
 * ฟังก์ชันตรวจสอบว่าเป็น GET request หรือไม่
 */
function requireGET() {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendResponse(405, 'Method not allowed. Please use GET request.');
    }
}

/**
 * ฟังก์ชันดึงข้อมูล JSON จาก request body
 * ใช้เวลาส่งข้อมูลแบบ JSON
 */
function getJSONInput() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        sendResponse(400, 'Invalid JSON format');
    }

    return $data;
}

/**
 * ฟังก์ชัน sanitize input (ทำความสะอาดข้อมูล)
 * ป้องกัน XSS attack
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

/**
 * ฟังก์ชันสร้าง Order Number แบบ unique
 * Format: ORD-YYYYMMDD-XXX
 */
function generateOrderNumber($pdo) {
    $date = date('Ymd');
    $prefix = "ORD-{$date}-";

    // หาเลขท้ายสุดของวันนี้
    $stmt = $pdo->prepare("SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$prefix . '%']);
    $last = $stmt->fetch();

    if ($last) {
        // มี order ในวันนี้แล้ว → เพิ่มเลข
        $lastNumber = intval(substr($last['order_number'], -3));
        $newNumber = $lastNumber + 1;
    } else {
        // ยังไม่มี order วันนี้ → เริ่มที่ 1
        $newNumber = 1;
    }

    return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI เพื่อเรียนรู้เพิ่มเติม:
//
// 1. "อธิบาย PDO ใน PHP และทำไมปลอดภัยกว่า mysqli"
// 2. "SQL Injection คืออะไร และ Prepared Statements ป้องกันยังไง"
// 3. "ความแตกต่างระหว่าง $_POST และ file_get_contents('php://input')"
// 4. "อธิบาย HTTP Status Codes (200, 400, 401, 404, 500)"
// 5. "XSS Attack คืออะไร และวิธีป้องกัน"
// ===================================

?>
