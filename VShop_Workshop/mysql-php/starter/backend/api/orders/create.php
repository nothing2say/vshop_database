<?php
/**
 * ===================================
 * API: สร้างคำสั่งซื้อ (Create Order)
 * ===================================
 * Method: POST
 * ต้อง Login: ใช่
 * หน้าที่: แปลงตะกร้าสินค้าเป็นคำสั่งซื้อ
 *
 * Input: {
 *   "shipping_address": "ที่อยู่จัดส่ง",
 *   "payment_method": "credit_card|bank_transfer|cash_on_delivery",
 *   "notes": "หมายเหตุ (optional)"
 * }
 * ===================================
 */

// เริ่ม session ก่อนทำอะไรอื่น
session_start();

// นำเข้าไฟล์ที่จำเป็น
require_once '../../config/database.php';
require_once '../../includes/cors.php';
require_once '../../includes/auth-check.php';

// ตรวจสอบว่าเป็น POST และ login แล้ว
requirePOST();
requireLogin();

try {
    // ===================================
    // ขั้นตอนที่ 1: รับข้อมูลจาก frontend
    // ===================================
    $input = getJSONInput();
    $userId = getCurrentUserId();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (empty($input['shipping_address'])) {
        sendResponse(400, 'กรุณากรอกที่อยู่จัดส่ง');
    }

    if (empty($input['payment_method'])) {
        sendResponse(400, 'กรุณาเลือกวิธีชำระเงิน');
    }

    // ดึงค่าที่ส่งมา
    // shipping_address อาจเป็น object หรือ string
    $shippingAddress = $input['shipping_address'];
    if (is_array($shippingAddress)) {
        // ถ้าเป็น object ให้รวมเป็น string
        $shippingAddress = implode(', ', array_filter([
            $shippingAddress['full_name'] ?? '',
            $shippingAddress['phone'] ?? '',
            $shippingAddress['address'] ?? '',
            $shippingAddress['city'] ?? '',
            $shippingAddress['postal_code'] ?? ''
        ]));
    }
    $shippingAddress = sanitizeInput($shippingAddress);
    $paymentMethod = sanitizeInput($input['payment_method']);
    $notes = isset($input['notes']) ? sanitizeInput($input['notes']) : '';

    // ตรวจสอบว่า payment_method ถูกต้อง
    $validPayments = ['credit_card', 'bank_transfer', 'cash_on_delivery'];
    if (!in_array($paymentMethod, $validPayments)) {
        sendResponse(400, 'วิธีชำระเงินไม่ถูกต้อง');
    }

    // ===================================
    // ขั้นตอนที่ 2: ดึงสินค้าจากตะกร้า
    // ===================================
    $sql = "SELECT c.id, c.product_id, c.quantity,
                   p.name, p.price, p.stock
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll();

    // ถ้าตะกร้าว่าง ไม่สามารถสั่งซื้อได้
    if (empty($cartItems)) {
        sendResponse(400, 'ตะกร้าสินค้าว่างเปล่า');
    }

    // ===================================
    // ขั้นตอนที่ 3: ตรวจสอบ stock และคำนวณยอดรวม
    // ===================================
    $totalAmount = 0;

    foreach ($cartItems as $item) {
        // เช็คว่ามีสินค้าพอไหม
        if ($item['stock'] < $item['quantity']) {
            sendResponse(400, "สินค้า '{$item['name']}' มีไม่พอ (เหลือ {$item['stock']} ชิ้น)");
        }

        // คำนวณยอดรวม
        $totalAmount += $item['price'] * $item['quantity'];
    }

    // ===================================
    // ขั้นตอนที่ 4: สร้างเลขที่คำสั่งซื้อ
    // ===================================
    // Format: ORD-20250113-001, ORD-20250113-002, ...
    $orderNumber = generateOrderNumber($pdo);

    // ===================================
    // ขั้นตอนที่ 5: บันทึกคำสั่งซื้อ (ใช้ Transaction)
    // ===================================
    // Transaction = ทำหลายอย่างพร้อมกัน ถ้าอันใดพัง ยกเลิกทั้งหมด
    $pdo->beginTransaction();

    try {
        // 5.1 บันทึกข้อมูลคำสั่งซื้อหลัก
        $sql = "INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, notes)
                VALUES (?, ?, ?, 'pending', ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $userId,
            $orderNumber,
            $totalAmount,
            $paymentMethod,
            $shippingAddress,
            $notes
        ]);

        $orderId = $pdo->lastInsertId();

        // 5.2 บันทึกรายการสินค้าใน order_items
        $sql = "INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        foreach ($cartItems as $item) {
            $subtotal = $item['price'] * $item['quantity'];
            $stmt->execute([
                $orderId,
                $item['product_id'],
                $item['quantity'],
                $item['price'],
                $subtotal
            ]);
        }

        // 5.3 อัปเดต stock สินค้า (หักออก)
        $sql = "UPDATE products SET stock = stock - ?, sold = sold + ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        foreach ($cartItems as $item) {
            $stmt->execute([
                $item['quantity'],
                $item['quantity'],
                $item['product_id']
            ]);
        }

        // 5.4 ล้างตะกร้าของ user
        $sql = "DELETE FROM cart WHERE user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);

        // ยืนยัน Transaction
        $pdo->commit();

        // ===================================
        // ขั้นตอนที่ 6: ส่งผลลัพธ์กลับ
        // ===================================
        sendResponse(201, 'สั่งซื้อสำเร็จ!', [
            'order_id' => $orderId,
            'order_number' => $orderNumber,
            'total_amount' => $totalAmount,
            'item_count' => count($cartItems)
        ]);

    } catch (Exception $e) {
        // ถ้ามี error ยกเลิก Transaction ทั้งหมด
        $pdo->rollBack();
        throw $e;
    }

} catch (PDOException $e) {
    sendResponse(500, 'Database error: ' . $e->getMessage());
} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}
?>
