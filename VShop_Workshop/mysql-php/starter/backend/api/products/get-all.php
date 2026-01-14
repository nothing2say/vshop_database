<?php
/**
 * ===================================
 * API: Get All Products (ดูสินค้าทั้งหมด)
 * ===================================
 * Method: GET
 * Query Parameters:
 *   - category_id (optional): กรองตามหมวดหมู่
 *   - search (optional): ค้นหาจากชื่อ
 *   - min_price (optional): ราคาขั้นต่ำ
 *   - max_price (optional): ราคาสูงสุด
 *   - sort (optional): เรียงลำดับ (price_asc, price_desc, newest, popular)
 *   - limit (optional): จำนวนสินค้าต่อหน้า (default: 20)
 *   - page (optional): หน้าที่ (default: 1)
 *
 * Output: { "status": 200, "data": [...], "pagination": {...} }
 * ===================================
 */

require_once '../../config/database.php';
require_once '../../includes/cors.php';

requireGET();

try {
    // ดึง query parameters
    $categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : null;
    $minPrice = isset($_GET['min_price']) ? floatval($_GET['min_price']) : null;
    $maxPrice = isset($_GET['max_price']) ? floatval($_GET['max_price']) : null;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;

    // คำนวณ offset สำหรับ pagination
    $offset = ($page - 1) * $limit;

    // ===================================
    // สร้าง SQL query แบบ dynamic
    // ===================================
    $sql = "SELECT
        p.*,
        c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1";

    $params = [];

    // เพิ่มเงื่อนไขตามที่ filter
    if ($categoryId) {
        $sql .= " AND p.category_id = ?";
        $params[] = $categoryId;
    }

    if ($search) {
        $sql .= " AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if ($minPrice) {
        $sql .= " AND p.price >= ?";
        $params[] = $minPrice;
    }

    if ($maxPrice) {
        $sql .= " AND p.price <= ?";
        $params[] = $maxPrice;
    }

    // เรียงลำดับ
    switch ($sort) {
        case 'price_asc':
            $sql .= " ORDER BY p.price ASC";
            break;
        case 'price_desc':
            $sql .= " ORDER BY p.price DESC";
            break;
        case 'popular':
            $sql .= " ORDER BY p.sold DESC, p.views DESC";
            break;
        case 'newest':
        default:
            $sql .= " ORDER BY p.created_at DESC";
            break;
    }

    // นับจำนวนทั้งหมด (สำหรับ pagination)
    $countSql = preg_replace('/SELECT.*FROM/s', 'SELECT COUNT(*) FROM', $sql);
    $countSql = preg_replace('/ORDER BY.*/s', '', $countSql);

    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalProducts = $countStmt->fetchColumn();

    // เพิ่ม LIMIT และ OFFSET
    $sql .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    // ดึงข้อมูลสินค้า
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // คำนวณข้อมูล pagination
    $totalPages = ceil($totalProducts / $limit);

    $response = [
        'products' => $products,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_products' => $totalProducts,
            'per_page' => $limit
        ]
    ];

    sendResponse(200, 'Products retrieved successfully', $response);

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}

// ===================================
// 💡 Learn with AI
// ===================================
// ถาม AI:
// 1. "อธิบาย SQL LIKE operator และ wildcard %"
// 2. "Pagination คืออะไร และทำไมต้องมี"
// 3. "LIMIT และ OFFSET ทำงานยังไง"
// 4. "Dynamic SQL Query มีความเสี่ยงอะไร"
// 5. "Full-Text Search ใน MySQL คืออะไร"
//
// 💡 ทดสอบ:
// GET http://localhost/vshop/backend-mysql/api/products/get-all.php
// GET http://localhost/vshop/backend-mysql/api/products/get-all.php?search=dell
// GET http://localhost/vshop/backend-mysql/api/products/get-all.php?category_id=1&sort=price_asc
// GET http://localhost/vshop/backend-mysql/api/products/get-all.php?min_price=10000&max_price=50000
// ===================================

?>
