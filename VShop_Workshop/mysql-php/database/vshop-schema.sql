-- ===================================
-- V-Shop Database Schema (MySQL)
-- ===================================
-- ระบบร้านค้าออนไลน์ V-Shop
-- 6 ตารางหลัก: users, categories, products, cart, orders, order_items
-- © 2026 V-Shop by View Zensei
-- ===================================

-- ลบ database เก่าถ้ามี (ระวัง: จะลบข้อมูลทั้งหมด!)
DROP DATABASE IF EXISTS vshop;

-- สร้าง database ใหม่
CREATE DATABASE vshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vshop;

-- ===================================
-- ตาราง 1: users (ผู้ใช้งาน)
-- ===================================
-- เก็บข้อมูลผู้ใช้งานทั้งหมด (แอดมิน + ลูกค้า)
-- ===================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสผู้ใช้',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT 'อีเมล (ใช้ login)',
  password VARCHAR(255) NOT NULL COMMENT 'รหัสผ่าน (hashed)',
  name VARCHAR(100) NOT NULL COMMENT 'ชื่อ-นามสกุล',
  phone VARCHAR(20) COMMENT 'เบอร์โทรศัพท์',
  address TEXT COMMENT 'ที่อยู่',
  role ENUM('admin', 'customer') DEFAULT 'customer' COMMENT 'บทบาท',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่แก้ไขล่าสุด',

  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB COMMENT='ตารางผู้ใช้งาน';

-- ===================================
-- ตาราง 2: categories (หมวดหมู่สินค้า)
-- ===================================
-- จัดกลุ่มสินค้า เช่น สมาร์ทโฟน, แล็ปท็อป, หูฟัง
-- ===================================

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสหมวดหมู่',
  name VARCHAR(100) UNIQUE NOT NULL COMMENT 'ชื่อหมวดหมู่',
  description TEXT COMMENT 'คำอธิบาย',
  slug VARCHAR(100) UNIQUE COMMENT 'URL-friendly name',
  image_url VARCHAR(500) COMMENT 'รูปภาพหมวดหมู่',
  display_order INT DEFAULT 0 COMMENT 'ลำดับการแสดงผล',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'เปิดใช้งาน',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_slug (slug),
  INDEX idx_display_order (display_order),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB COMMENT='หมวดหมู่สินค้า';

-- ===================================
-- ตาราง 3: products (สินค้า)
-- ===================================
-- เก็บข้อมูลสินค้าทั้งหมด
-- ===================================

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสสินค้า',
  category_id INT NOT NULL COMMENT 'หมวดหมู่',
  name VARCHAR(200) NOT NULL COMMENT 'ชื่อสินค้า',
  description TEXT COMMENT 'รายละเอียด',
  price DECIMAL(12, 2) NOT NULL COMMENT 'ราคา (บาท)',
  cost DECIMAL(12, 2) COMMENT 'ต้นทุน (สำหรับแอดมิน)',
  stock INT DEFAULT 0 COMMENT 'จำนวนในสต็อก',
  brand VARCHAR(100) COMMENT 'ยี่ห้อ',
  model VARCHAR(100) COMMENT 'รุ่น',
  image_url VARCHAR(500) COMMENT 'รูปภาพหลัก',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'เปิดขาย',
  views INT DEFAULT 0 COMMENT 'จำนวนคนดู',
  sold INT DEFAULT 0 COMMENT 'จำนวนที่ขายไปแล้ว',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,

  INDEX idx_category (category_id),
  INDEX idx_price (price),
  INDEX idx_stock (stock),
  INDEX idx_is_active (is_active),
  INDEX idx_brand (brand),
  INDEX idx_name (name),

  CHECK (price >= 0),
  CHECK (stock >= 0)
) ENGINE=InnoDB COMMENT='สินค้า';

-- ===================================
-- ตาราง 4: cart (ตะกร้าสินค้า)
-- ===================================
-- เก็บสินค้าที่ลูกค้าเลือกไว้ชั่วคราว
-- ===================================

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสตะกร้า',
  user_id INT NOT NULL COMMENT 'ผู้ใช้',
  product_id INT NOT NULL COMMENT 'สินค้า',
  quantity INT NOT NULL DEFAULT 1 COMMENT 'จำนวน',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่เพิ่ม',

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  UNIQUE KEY unique_user_product (user_id, product_id) COMMENT 'ห้ามซ้ำ',
  INDEX idx_user (user_id),

  CHECK (quantity > 0)
) ENGINE=InnoDB COMMENT='ตะกร้าสินค้า';

-- ===================================
-- ตาราง 5: orders (คำสั่งซื้อ)
-- ===================================
-- เก็บข้อมูลการสั่งซื้อทั้งหมด
-- ===================================

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสคำสั่งซื้อ',
  user_id INT NOT NULL COMMENT 'ผู้สั่งซื้อ',
  order_number VARCHAR(50) UNIQUE NOT NULL COMMENT 'เลขที่คำสั่งซื้อ (เช่น ORD-20260114-001)',
  total_amount DECIMAL(12, 2) NOT NULL COMMENT 'ยอดรวมทั้งหมด',
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT 'สถานะ',
  payment_method ENUM('credit_card', 'bank_transfer', 'cash_on_delivery', 'promptpay') COMMENT 'วิธีชำระเงิน',
  shipping_address TEXT NOT NULL COMMENT 'ที่อยู่จัดส่ง',
  notes TEXT COMMENT 'หมายเหตุ',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สั่งซื้อ',
  paid_at TIMESTAMP NULL COMMENT 'วันที่ชำระเงิน',
  shipped_at TIMESTAMP NULL COMMENT 'วันที่จัดส่ง',
  delivered_at TIMESTAMP NULL COMMENT 'วันที่ส่งถึง',

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

  INDEX idx_user (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),

  CHECK (total_amount >= 0)
) ENGINE=InnoDB COMMENT='คำสั่งซื้อ';

-- ===================================
-- ตาราง 6: order_items (รายการสินค้าในคำสั่งซื้อ)
-- ===================================
-- เก็บว่าแต่ละ order มีสินค้าอะไรบ้าง กี่ชิ้น
-- ===================================

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสรายการ',
  order_id INT NOT NULL COMMENT 'คำสั่งซื้อ',
  product_id INT NOT NULL COMMENT 'สินค้า',
  quantity INT NOT NULL COMMENT 'จำนวน',
  price DECIMAL(12, 2) NOT NULL COMMENT 'ราคา ณ เวลาซื้อ',
  subtotal DECIMAL(12, 2) NOT NULL COMMENT 'ยอดรวม (quantity × price)',

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,

  INDEX idx_order (order_id),
  INDEX idx_product (product_id),

  CHECK (quantity > 0),
  CHECK (price >= 0),
  CHECK (subtotal >= 0)
) ENGINE=InnoDB COMMENT='รายการสินค้าในคำสั่งซื้อ';

-- ===================================
-- VIEWS (มุมมองข้อมูล)
-- ===================================

-- View: สินค้าพร้อมข้อมูลหมวดหมู่
CREATE VIEW product_details AS
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.stock,
  p.brand,
  p.model,
  p.image_url,
  p.is_active,
  p.views,
  p.sold,
  c.id AS category_id,
  c.name AS category_name,
  c.slug AS category_slug
FROM products p
JOIN categories c ON p.category_id = c.id;

-- View: สรุปยอดขายแต่ละสินค้า
CREATE VIEW product_sales_summary AS
SELECT
  p.id,
  p.name,
  p.price,
  p.stock,
  p.sold,
  COUNT(DISTINCT oi.order_id) AS total_orders,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.subtotal) AS total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('paid', 'shipped', 'delivered')
GROUP BY p.id, p.name, p.price, p.stock, p.sold;

-- ===================================
-- สร้างเสร็จเรียบร้อย!
-- ===================================
-- ตารางทั้งหมด: 6 ตาราง
--   1. users        - ผู้ใช้งาน
--   2. categories   - หมวดหมู่
--   3. products     - สินค้า
--   4. cart         - ตะกร้า
--   5. orders       - คำสั่งซื้อ
--   6. order_items  - รายการในคำสั่งซื้อ
--
-- ลำดับต่อไป: รัน vshop-sample-data.sql
-- ===================================
