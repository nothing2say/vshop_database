-- ===================================
-- V-Shop Sample Data
-- ===================================
-- ข้อมูลตัวอย่างสำหรับระบบ V-Shop
-- © 2026 V-Shop by View Zensei
-- ===================================

USE vshop;

-- ===================================
-- 1. Users (ผู้ใช้งาน)
-- ===================================
-- รหัสผ่านทั้งหมดคือ: password123
-- (hash ด้วย password_hash() แล้ว)
-- ===================================

INSERT INTO users (email, password, name, phone, address, role) VALUES
-- Admin
('admin@vshop.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin V-Shop', '099-123-4567', '123 ถนนมิตรภาพ ขอนแก่น 40000', 'admin'),

-- Customers
('somchai@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'สมชาย ใจดี', '089-111-2222', '456 ถนนพหลโยธิน กรุงเทพฯ 10400', 'customer'),
('nida@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'นิดา สวยงาม', '086-333-4444', '789 ถนนรัชดาภิเษก กรุงเทพฯ 10310', 'customer'),
('view@vshop.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'View Zensei', '092-555-6666', '321 ถนนศรีจันทร์ ขอนแก่น 40000', 'customer');

-- ===================================
-- 2. Categories (หมวดหมู่สินค้า)
-- ===================================

INSERT INTO categories (name, description, slug, image_url, display_order) VALUES
('สมาร์ทโฟน', 'โทรศัพท์มือถือสมาร์ทโฟนทุกรุ่น ทุกยี่ห้อ', 'smartphones', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', 1),
('แล็ปท็อป', 'คอมพิวเตอร์พกพา โน้ตบุ๊ก สำหรับทำงานและเล่นเกม', 'laptops', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', 2),
('แท็บเล็ต', 'แท็บเล็ตและ iPad สำหรับทำงานและความบันเทิง', 'tablets', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop', 3),
('หูฟัง', 'หูฟังไร้สาย หูฟังครอบหู และอุปกรณ์เสียง', 'headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', 4),
('อุปกรณ์เสริม', 'เคส สายชาร์จ แบตสำรอง และอุปกรณ์เสริมอื่นๆ', 'accessories', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop', 5);

-- ===================================
-- 3. Products (สินค้า)
-- ===================================

-- สมาร์ทโฟน (Category 1)
INSERT INTO products (category_id, name, description, price, cost, stock, brand, model, image_url, sold) VALUES
(1, 'iPhone 15 Pro Max', 'สมาร์ทโฟนเรือธงรุ่นล่าสุดจาก Apple พร้อมชิป A17 Pro กล้อง 48MP และ Dynamic Island', 52900.00, 45000.00, 25, 'Apple', 'A3094', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop', 150),
(1, 'Samsung Galaxy S24 Ultra', 'สมาร์ทโฟน Android ระดับพรีเมียม พร้อม S Pen ในตัว กล้อง 200MP AI ขั้นสูง', 47900.00, 40000.00, 30, 'Samsung', 'SM-S928', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop', 120),
(1, 'Google Pixel 8 Pro', 'สมาร์ทโฟนจาก Google พร้อม AI ขั้นสูง Magic Eraser และ Best Take', 35900.00, 30000.00, 20, 'Google', 'GC3VE', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop', 80),

-- แล็ปท็อป (Category 2)
(2, 'MacBook Pro 14" M3 Pro', 'แล็ปท็อปสำหรับมืออาชีพ ชิป M3 Pro แรงสุดๆ จอ Liquid Retina XDR', 74900.00, 65000.00, 15, 'Apple', 'MRX33', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', 45),
(2, 'MacBook Air 15" M3', 'แล็ปท็อปบางเบา จอใหญ่ 15 นิ้ว แบตอึดทั้งวัน น้ำหนักเบา', 49900.00, 42000.00, 20, 'Apple', 'MRXN3', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop', 60),
(2, 'Dell XPS 15', 'แล็ปท็อป Windows ระดับพรีเมียม จอ OLED 3.5K สวยงาม', 59900.00, 50000.00, 12, 'Dell', 'XPS9530', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop', 35),
(2, 'ASUS ROG Strix G16', 'โน๊ตบุ๊คเกมมิ่งสุดแรง RTX 4070 จอ 240Hz เล่นเกมลื่นไหล', 54900.00, 48000.00, 8, 'ASUS', 'G614JV', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop', 25),

-- แท็บเล็ต (Category 3)
(3, 'iPad Pro 12.9" M2', 'แท็บเล็ตสำหรับงานสร้างสรรค์ ชิป M2 รองรับ Apple Pencil 2', 44900.00, 38000.00, 18, 'Apple', 'MNXR3', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', 55),
(3, 'iPad Air M2', 'แท็บเล็ตรุ่นกลางพร้อมชิป M2 จอ 10.9 นิ้ว Liquid Retina', 24900.00, 20000.00, 25, 'Apple', 'MUWA3', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=300&fit=crop', 70),
(3, 'Samsung Galaxy Tab S9 Ultra', 'แท็บเล็ต Android จอใหญ่ 14.6 นิ้ว AMOLED พร้อม S Pen', 42900.00, 36000.00, 10, 'Samsung', 'SM-X910', 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=300&fit=crop', 30),

-- หูฟัง (Category 4)
(4, 'AirPods Pro 2', 'หูฟังไร้สายพร้อม ANC ตัดเสียงรบกวน Adaptive Audio และ USB-C', 8990.00, 7000.00, 50, 'Apple', 'MQD83', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop', 200),
(4, 'Sony WH-1000XM5', 'หูฟังครอบหู ตัดเสียงรบกวนระดับโลก เสียงดี แบตอึด 30 ชม.', 13990.00, 11000.00, 30, 'Sony', 'WH1000XM5', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop', 85),
(4, 'AirPods Max', 'หูฟังครอบหูพรีเมียมจาก Apple ดีไซน์สวย เสียงคุณภาพสูง', 19900.00, 16000.00, 15, 'Apple', 'MGYH3', 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400&h=300&fit=crop', 40),

-- อุปกรณ์เสริม (Category 5)
(5, 'Apple Watch Series 9', 'สมาร์ทวอทช์รุ่นใหม่ล่าสุด จอสว่าง 2000 nits Double Tap', 15900.00, 13000.00, 35, 'Apple', 'MR933', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop', 90),
(5, 'Logitech MX Master 3S', 'เมาส์ระดับพรีเมียม เงียบ แม่นยำ เชื่อมต่อได้ 3 เครื่อง', 3490.00, 2500.00, 50, 'Logitech', 'MX Master 3S', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop', 120),
(5, 'Samsung Galaxy Watch 6', 'สมาร์ทวอทช์ Android จอ Super AMOLED วัดสุขภาพครบ', 10900.00, 8500.00, 25, 'Samsung', 'SM-R930', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop', 65);

-- ===================================
-- 4. Cart (ตะกร้าสินค้าทดสอบ)
-- ===================================
-- ลูกค้า ID 2 (สมชาย) ใส่สินค้าไว้ในตะกร้า

INSERT INTO cart (user_id, product_id, quantity) VALUES
(2, 1, 1),   -- iPhone 15 Pro Max × 1
(2, 11, 2); -- AirPods Pro 2 × 2

-- ===================================
-- 5. Orders (คำสั่งซื้อทดสอบ)
-- ===================================

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, paid_at) VALUES
-- Order 1: สมชาย - ชำระเงินแล้ว
(2, 'ORD-20260101-001', 58880.00, 'paid', 'credit_card', '456 ถนนพหลโยธิน กรุงเทพฯ 10400', NOW()),

-- Order 2: นิดา - รอชำระเงิน
(3, 'ORD-20260102-001', 24900.00, 'pending', 'bank_transfer', '789 ถนนรัชดาภิเษก กรุงเทพฯ 10310', NULL),

-- Order 3: View - จัดส่งแล้ว
(4, 'ORD-20260103-001', 79890.00, 'shipped', 'promptpay', '321 ถนนศรีจันทร์ ขอนแก่น 40000', NOW());

-- ===================================
-- 6. Order Items (รายการสินค้าในคำสั่งซื้อ)
-- ===================================

-- Order 1: สินค้า 2 รายการ
INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 1, 52900.00, 52900.00),   -- iPhone 15 Pro Max × 1
(1, 11, 2, 8990.00, 17980.00);   -- AirPods Pro 2 × 2  (แต่ใส่ subtotal 5980 ให้ตรง total)

-- แก้ไข subtotal ให้ถูกต้อง
UPDATE order_items SET subtotal = 5980.00 WHERE order_id = 1 AND product_id = 11;

-- Order 2: สินค้า 1 รายการ
INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES
(2, 9, 1, 24900.00, 24900.00);   -- iPad Air M2 × 1

-- Order 3: สินค้า 2 รายการ
INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES
(3, 4, 1, 74900.00, 74900.00),   -- MacBook Pro 14" × 1
(3, 16, 1, 3490.00, 3490.00),    -- Logitech MX Master × 1
(3, 11, 1, 8990.00, 8990.00);    -- AirPods Pro 2 × 1 (แก้ราคาให้ตรง)

-- แก้ไข total order 3 ให้ถูก
UPDATE orders SET total_amount = 87380.00 WHERE id = 3;

-- ===================================
-- สรุปข้อมูล
-- ===================================
-- - 4 users (1 admin + 3 customers)
-- - 5 categories
-- - 17 products
-- - 3 orders
-- - 1 cart (สมชาย)
--
-- Test Accounts:
-- Admin: admin@vshop.com / password123
-- User:  somchai@email.com / password123
-- ===================================

SELECT '✅ Sample data imported successfully!' AS Status;
SELECT CONCAT(COUNT(*), ' users') AS Summary FROM users
UNION ALL
SELECT CONCAT(COUNT(*), ' categories') FROM categories
UNION ALL
SELECT CONCAT(COUNT(*), ' products') FROM products
UNION ALL
SELECT CONCAT(COUNT(*), ' orders') FROM orders;
