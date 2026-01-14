# 🛒 V-Shop Workshop - MySQL + PHP

## 📋 ภาพรวม Workshop

Workshop นี้จะสอนนักเรียนสร้าง **ระบบจัดการสินค้า (Product Management)** สำหรับ Admin โดยใช้ **MySQL + PHP**

### 🎯 สิ่งที่นักเรียนจะได้เรียนรู้

| หัวข้อ | รายละเอียด |
|--------|------------|
| **SQL CRUD** | SELECT, INSERT, UPDATE, DELETE |
| **JOIN** | LEFT JOIN เพื่อดึงข้อมูลจากหลายตาราง |
| **Prepared Statements** | ป้องกัน SQL Injection |
| **RESTful API** | สร้าง API endpoints ด้วย PHP |
| **Frontend Integration** | เชื่อมต่อ API กับ JavaScript |

---

## 📁 โครงสร้างโฟลเดอร์

```
mysql-php/
├── starter/                 # 🎯 ไฟล์สำหรับนักเรียน (มี TODO)
│   ├── backend/
│   │   └── api/products/
│   │       ├── create.php   # เพิ่มสินค้า
│   │       ├── update.php   # แก้ไขสินค้า
│   │       ├── delete.php   # ลบสินค้า
│   │       └── get-one.php  # ดึงสินค้า 1 รายการ
│   └── frontend/
│       └── assets/js/
│           └── admin-products.js
│
└── finished/                # ✅ เฉลย (พร้อมคำอธิบาย)
    ├── backend/
    │   └── api/products/
    │       ├── create.php
    │       ├── update.php
    │       ├── delete.php
    │       └── get-one.php
    └── frontend/
        └── assets/js/
            └── admin-products.js
```

---

## 🚀 การติดตั้ง

### ขั้นตอนที่ 1: เตรียม XAMPP

1. เปิด XAMPP Control Panel
2. Start **Apache** และ **MySQL**

### ขั้นตอนที่ 2: สร้าง Database

1. เปิด phpMyAdmin: http://localhost/phpmyadmin
2. สร้าง Database ชื่อ `vshop`
3. Import ไฟล์ SQL จาก `database/vshop-schema.sql`
4. Import ไฟล์ SQL จาก `database/vshop-sample-data.sql`

### ขั้นตอนที่ 3: วางไฟล์

```
วางโฟลเดอร์ทั้งหมดไปที่:
C:\xampp\htdocs\vshop\  (Windows)
/Applications/XAMPP/htdocs/vshop/  (Mac)
```

### ขั้นตอนที่ 4: ทดสอบ

- Frontend: http://localhost/vshop/frontend/
- API Test: http://localhost/vshop/backend/api/products/get-all.php

---

## 📝 Challenge สำหรับนักเรียน

### 🔵 Challenge 1: SQL SELECT with JOIN

**ไฟล์:** `starter/backend/api/products/get-one.php`

**โจทย์:** เขียน SQL เพื่อดึงข้อมูลสินค้า 1 รายการ พร้อมชื่อหมวดหมู่

```php
// TODO: เติม SQL ให้ถูกต้อง
$sql = "SELECT
            p.*,
            c.____________ AS category_name
        FROM ____________ p
        LEFT JOIN ____________ c ON p.____________ = c.____________
        WHERE p.____________ = ?";
```

**Hint:**
- ใช้ `LEFT JOIN` เชื่อม `products` กับ `categories`
- `p.category_id = c.id`

---

### 🟢 Challenge 2: SQL INSERT

**ไฟล์:** `starter/backend/api/products/create.php`

**โจทย์:** เขียน SQL INSERT เพื่อเพิ่มสินค้าใหม่

```php
// TODO: เติม SQL INSERT
$sql = "INSERT INTO ____________ (____________, ____________, ...)
        VALUES (?, ?, ...)";
```

**Hint:**
- ต้องระบุชื่อ column ทั้งหมดที่ต้องการ insert
- จำนวน `?` ต้องเท่ากับจำนวน column

---

### 🟡 Challenge 3: SQL UPDATE

**ไฟล์:** `starter/backend/api/products/update.php`

**โจทย์:** เขียน SQL UPDATE เพื่อแก้ไขข้อมูลสินค้า

```php
// TODO: เติม SQL UPDATE
$sql = "UPDATE ____________ SET
            ____________ = ?,
            ____________ = ?
        WHERE ____________ = ?";
```

**Hint:**
- ต้องมี `WHERE` เสมอ ไม่งั้นจะ update ทุกแถว!
- ส่ง `id` เป็นค่าสุดท้ายใน execute()

---

### 🔴 Challenge 4: SQL DELETE

**ไฟล์:** `starter/backend/api/products/delete.php`

**โจทย์:** เขียน SQL DELETE เพื่อลบสินค้า

```php
// TODO: เติม SQL DELETE
$sql = "DELETE FROM ____________ WHERE ____________ = ?";
```

**⚠️ คำเตือน:** ต้องมี `WHERE` เสมอ! ไม่งั้นจะลบทั้งตาราง!

---

### 🟣 Challenge 5: Frontend API Calls

**ไฟล์:** `starter/frontend/assets/js/admin-products.js`

**โจทย์:** เขียน JavaScript เรียก API

```javascript
// TODO: เรียก API ดึงข้อมูลสินค้า
const response = await apiCall(`${API_ENDPOINTS.getProduct}?id=${productId}`, 'GET');

// TODO: เรียก API เพิ่มสินค้า
await apiCall(API_ENDPOINTS.createProduct, 'POST', productData);

// TODO: เรียก API ลบสินค้า
await apiCall(API_ENDPOINTS.deleteProduct, 'POST', { id: deleteProductId });
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/get-all.php` | ดึงรายการสินค้าทั้งหมด |
| GET | `/api/products/get-one.php?id=1` | ดึงสินค้า 1 รายการ |
| POST | `/api/products/create.php` | เพิ่มสินค้าใหม่ |
| POST | `/api/products/update.php` | แก้ไขสินค้า |
| POST | `/api/products/delete.php` | ลบสินค้า |

### Request/Response Format

**เพิ่มสินค้า (POST /api/products/create.php)**
```json
// Request
{
  "name": "iPhone 15 Pro",
  "description": "สมาร์ทโฟนรุ่นล่าสุด",
  "category_id": 1,
  "brand": "Apple",
  "price": 45900,
  "cost": 40000,
  "stock": 50,
  "model": "A3094",
  "image_url": "https://..."
}

// Response
{
  "status": 201,
  "message": "เพิ่มสินค้าสำเร็จ",
  "data": { "id": 14 }
}
```

---

## ✅ เฉลย (Answers)

### Challenge 1: get-one.php
```php
$sql = "SELECT
            p.*,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);
$product = $stmt->fetch();
```

### Challenge 2: create.php
```php
$sql = "INSERT INTO products (category_id, name, description, price, cost, stock, brand, model, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    $category_id, $name, $description,
    $price, $cost, $stock,
    $brand, $model, $image_url
]);
```

### Challenge 3: update.php
```php
$sql = "UPDATE products SET
            category_id = ?,
            name = ?,
            description = ?,
            price = ?,
            cost = ?,
            stock = ?,
            brand = ?,
            model = ?,
            image_url = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    $category_id, $name, $description,
    $price, $cost, $stock,
    $brand, $model, $image_url,
    $id
]);
```

### Challenge 4: delete.php
```php
$sql = "DELETE FROM products WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);
```

---

## 🔐 Security Best Practices

1. **Prepared Statements** - ใช้ `?` placeholder ป้องกัน SQL Injection
2. **Input Validation** - ตรวจสอบข้อมูลก่อน INSERT/UPDATE
3. **Authentication** - ตรวจสอบ login ก่อนทำ CRUD
4. **Authorization** - ตรวจสอบสิทธิ์ Admin

---

## 📞 ติดต่อ

- 📧 Email: view@vshop.com
- 📍 Location: ขอนแก่น ประเทศไทย
- 📱 Phone: 099-XXX-XXXX

---

**© 2026 V-Shop by View Zensei**
