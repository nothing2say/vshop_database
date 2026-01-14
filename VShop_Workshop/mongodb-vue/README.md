# 🍃 V-Shop Workshop - MongoDB + Vue.js

## 📋 ภาพรวม

Workshop นี้สอนสร้างระบบจัดการสินค้าด้วย **MongoDB + Node.js + Vue.js**

### 🎯 สิ่งที่จะได้เรียนรู้

| หัวข้อ | รายละเอียด |
|--------|------------|
| **MongoDB** | NoSQL Document Database |
| **Mongoose** | ODM สำหรับ MongoDB |
| **Express.js** | Web Framework สำหรับ Node.js |
| **Vue.js 3** | Progressive JavaScript Framework |
| **Dark Mode** | การทำ Theme Switching |

---

## 📁 โครงสร้างโฟลเดอร์

```
mongodb-vue/
├── starter/                 # 🎯 ไฟล์สำหรับนักเรียน (มี TODO)
│   ├── backend/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── frontend/
│
└── finished/                # ✅ เฉลย (พร้อมคำอธิบาย)
    ├── backend/
    │   ├── models/
    │   │   ├── Product.js
    │   │   └── Category.js
    │   ├── routes/
    │   │   ├── products.js
    │   │   └── categories.js
    │   ├── server.js
    │   ├── package.json
    │   └── .env.example
    └── frontend/
        ├── src/
        │   ├── App.vue
        │   ├── main.js
        │   ├── components/
        │   │   └── ProductsAdmin.vue
        │   └── assets/
        │       └── main.css
        ├── index.html
        ├── package.json
        └── vite.config.js
```

---

## 🚀 วิธีการรัน (How to Run)

### ขั้นตอนที่ 1: ติดตั้ง MongoDB

**Option A: MongoDB Local**
```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# ดาวน์โหลดจาก https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud)**
1. สมัครบัญชีที่ https://www.mongodb.com/atlas
2. สร้าง Cluster ฟรี
3. คัดลอก Connection String

---

### ขั้นตอนที่ 2: รัน Backend

```bash
# เข้าไปที่โฟลเดอร์ backend
cd mongodb-vue/finished/backend

# ติดตั้ง dependencies
npm install

# คัดลอกไฟล์ .env
cp .env.example .env

# แก้ไข .env (ถ้าใช้ MongoDB Atlas)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vshop

# รัน server
npm run dev
```

✅ Backend จะรันที่: **http://localhost:3001**

---

### ขั้นตอนที่ 3: รัน Frontend

```bash
# เปิด Terminal ใหม่
cd mongodb-vue/finished/frontend

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

✅ Frontend จะรันที่: **http://localhost:5173**

---

## 🔧 Environment Variables

สร้างไฟล์ `.env` ใน backend/:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/vshop

# Server Port
PORT=3001
```

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | ดึงรายการสินค้าทั้งหมด |
| GET | /api/products/:id | ดึงสินค้า 1 รายการ |
| POST | /api/products | เพิ่มสินค้าใหม่ |
| PUT | /api/products/:id | แก้ไขสินค้า |
| DELETE | /api/products/:id | ลบสินค้า |
| GET | /api/categories | ดึงหมวดหมู่ |

---

## 🎯 Challenges สำหรับนักเรียน

### Challenge: Mongoose CRUD

เติม code ใน `starter/backend/routes/products.js`:

```javascript
// 🎯 TODO: ดึงสินค้าทั้งหมด
const products = await Product.____________()
    .____________('category_id', 'name');

// 🎯 TODO: ดึงสินค้า 1 รายการ
const product = await Product.____________(req.params.id);

// 🎯 TODO: สร้างสินค้าใหม่
const product = new Product({ ... });
await product.____________();

// 🎯 TODO: ลบสินค้า
await Product.____________(req.params.id);
```

---

## 🎨 UI Features

- ✅ **Dark Mode** - คลิกปุ่ม 🌙/☀️ เพื่อสลับ Theme
- ✅ **Stats Dashboard** - แสดงจำนวนสินค้าทั้งหมด/มีสต็อก/หมด
- ✅ **Responsive** - รองรับ Mobile/Tablet/Desktop
- ✅ **Modern Design** - Gradient, Shadows, Animations

---

## 🔄 เปรียบเทียบ SQL vs MongoDB

| SQL (MySQL) | MongoDB (Mongoose) |
|-------------|-------------------|
| `SELECT * FROM products` | `Product.find()` |
| `SELECT * WHERE id = ?` | `Product.findById(id)` |
| `INSERT INTO products` | `new Product().save()` |
| `UPDATE products SET` | `Product.findByIdAndUpdate()` |
| `DELETE FROM products` | `Product.findByIdAndDelete()` |
| `JOIN` | `.populate()` |

---

## 📞 ติดต่อ

- 📧 Email: view@vshop.com
- 📍 Location: ขอนแก่น ประเทศไทย
- 📱 Phone: 099-XXX-XXXX

---

**© 2026 V-Shop by View Zensei**
