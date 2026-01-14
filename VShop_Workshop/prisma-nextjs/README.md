# 🔷 V-Shop Workshop - PostgreSQL + Prisma + Next.js

## 📋 ภาพรวม

Workshop นี้สอนสร้างระบบจัดการสินค้าด้วย **PostgreSQL + Prisma ORM + Next.js (React)**

### 🎯 สิ่งที่จะได้เรียนรู้

| หัวข้อ | รายละเอียด |
|--------|------------|
| **PostgreSQL** | Relational Database ขั้นสูง |
| **Prisma** | Type-safe ORM สมัยใหม่ |
| **Next.js 14** | React Framework (App Router) |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS Framework |
| **Dark Mode** | Theme Switching with Tailwind |

---

## 📁 โครงสร้างโฟลเดอร์

```
prisma-nextjs/
├── starter/                 # 🎯 ไฟล์สำหรับนักเรียน (มี TODO)
│   ├── backend/
│   └── frontend/
│
└── finished/                # ✅ เฉลย (พร้อมคำอธิบาย)
    ├── backend/
    │   ├── prisma/
    │   │   └── schema.prisma
    │   ├── server.js
    │   ├── package.json
    │   └── .env.example
    └── frontend/
        ├── src/
        │   ├── app/
        │   │   ├── layout.tsx
        │   │   ├── page.tsx
        │   │   └── globals.css
        │   └── components/
        │       └── ProductsAdmin.tsx
        ├── package.json
        ├── tailwind.config.js
        ├── tsconfig.json
        └── next.config.js
```

---

## 🚀 วิธีการรัน (How to Run)

### ขั้นตอนที่ 1: ติดตั้ง PostgreSQL

**Option A: PostgreSQL Local**
```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# สร้าง database
createdb vshop

# Windows
# ดาวน์โหลดจาก https://www.postgresql.org/download/
```

**Option B: Docker**
```bash
docker run --name vshop-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=vshop \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: Supabase (Cloud)**
1. สมัครที่ https://supabase.com
2. สร้าง Project ใหม่
3. คัดลอก Connection String

---

### ขั้นตอนที่ 2: รัน Backend

```bash
# เข้าไปที่โฟลเดอร์ backend
cd prisma-nextjs/finished/backend

# ติดตั้ง dependencies
npm install

# คัดลอกไฟล์ .env
cp .env.example .env

# แก้ไข .env ให้ตรงกับ PostgreSQL ของคุณ
# DATABASE_URL="postgresql://username:password@localhost:5432/vshop"

# Generate Prisma Client
npx prisma generate

# รัน Migration (สร้างตาราง)
npx prisma migrate dev --name init

# (Optional) เปิด Prisma Studio ดูข้อมูล
npx prisma studio

# รัน server
npm run dev
```

✅ Backend จะรันที่: **http://localhost:3002**
✅ Prisma Studio จะรันที่: **http://localhost:5555**

---

### ขั้นตอนที่ 3: รัน Frontend

```bash
# เปิด Terminal ใหม่
cd prisma-nextjs/finished/frontend

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

✅ Frontend จะรันที่: **http://localhost:3000**

---

## 🔧 Environment Variables

### Backend (.env)

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/vshop?schema=public"

# Server Port
PORT=3002
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

### Challenge: Prisma CRUD

เติม code ใน `starter/backend/server.js`:

```javascript
// 🎯 TODO: ดึงสินค้าทั้งหมด
const products = await prisma.product.____________({
    include: { category: true }
});

// 🎯 TODO: ดึงสินค้า 1 รายการ
const product = await prisma.product.____________({
    where: { id: parseInt(req.params.id) }
});

// 🎯 TODO: สร้างสินค้าใหม่
const product = await prisma.product.____________({
    data: { name, price, ... }
});

// 🎯 TODO: แก้ไขสินค้า
await prisma.product.____________({
    where: { id },
    data: { name, price, ... }
});

// 🎯 TODO: ลบสินค้า
await prisma.product.____________({
    where: { id }
});
```

---

## 🎨 UI Features

- ✅ **Dark Mode** - คลิกปุ่ม 🌙/☀️ เพื่อสลับ Theme
- ✅ **Stats Dashboard** - การ์ดแสดงสถิติสวยงาม
- ✅ **Responsive** - รองรับทุกขนาดหน้าจอ
- ✅ **Tailwind CSS** - Modern utility-first styling
- ✅ **TypeScript** - Type-safe components
- ✅ **Animations** - Smooth transitions

---

## 🔄 เปรียบเทียบ SQL vs Prisma

| SQL (MySQL/PHP) | Prisma |
|-----------------|--------|
| `SELECT * FROM products` | `prisma.product.findMany()` |
| `SELECT * WHERE id = ?` | `prisma.product.findUnique({ where: { id } })` |
| `INSERT INTO products` | `prisma.product.create({ data: {...} })` |
| `UPDATE products SET` | `prisma.product.update({ where, data })` |
| `DELETE FROM products` | `prisma.product.delete({ where: { id } })` |
| `JOIN` | `include: { category: true }` |

---

## 📦 Prisma Schema

```prisma
model Product {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  categoryId  Int?      @map("category_id")
  price       Decimal
  stock       Int       @default(0)
  
  // Relations
  category    Category? @relation(fields: [categoryId], references: [id])
  
  @@map("products")
}
```

---

## 🛠️ Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name <name>

# Reset database
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Format schema
npx prisma format
```

---

## 📞 ติดต่อ

- 📧 Email: view@vshop.com
- 📍 Location: ขอนแก่น ประเทศไทย
- 📱 Phone: 099-XXX-XXXX

---

**© 2026 V-Shop by View Zensei**
