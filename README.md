# V-Shop Tutorial

คู่มือปฏิบัติสร้างระบบร้านค้าออนไลน์สำหรับผู้เริ่มต้น

## 📚 เกี่ยวกับโปรเจค

Tutorial นี้สอนการสร้างระบบร้านค้า ตั้งแต่เริ่มต้น ครอบคลุม:

- ออกแบบ Database
- สร้าง REST API
- เชื่อมต่อ Frontend กับ Backend
- Testing และ Deployment

## 🎯 กลุ่มเป้าหมาย

- นักเรียน/นักศึกษาที่เริ่มเรียน Database
- ผู้ที่ต้องการเรียนรู้การสร้าง Backend API
- ภาษาไทย พร้อมศัพท์เทคนิคภาษาอังกฤษ

---

## 📖 เนื้อหา (8 Modules)

| Module | หัวข้อ | เนื้อหา |
|--------|-------|---------|
| 1 | Database Design | ออกแบบตาราง, ERD, ความสัมพันธ์ |
| 2 | PHP Basics | PDO, CRUD Operations |
| 3 | API & Auth | REST API, Login, Register, Session |
| 4 | Products | Product Management API |
| 5 | Shopping | Cart, Checkout, Orders |
| 6 | Frontend Architecture | JavaScript, Data Flow |
| 7 | Connect Frontend | Hands-on Integration |
| 8 | Testing & Deploy | Postman, Debug, Security |

---

## 🛠️ Tech Stacks

### Main Track: MySQL + PHP

| เทคโนโลยี | หน้าที่ |
|----------|--------|
| **MySQL** | Relational Database |
| **PHP** | Backend API |
| **PDO** | Database Connection |
| **HTML/CSS/JS** | Frontend |
| **Session + bcrypt** | Authentication |

```
VShop_Workshop/mysql-php/
├── starter/     # โค้ดสำหรับฝึก (มี TODO)
├── finished/    # โค้ดเฉลย
└── database/
    ├── vshop-schema.sql      # Schema (6 ตาราง)
    └── vshop-sample-data.sql # ข้อมูลตัวอย่าง
```

---

### Optional: MongoDB + Vue.js

สำหรับผู้ที่อยากลอง NoSQL Database และ Modern Frontend Framework

| เทคโนโลยี | หน้าที่ |
|----------|--------|
| **MongoDB** | NoSQL Document Database |
| **Node.js + Express** | Backend API |
| **Mongoose** | ODM (Object Document Mapper) |
| **Vue.js 3** | Frontend Framework |
| **Vite** | Build Tool |

```
VShop_Workshop/mongodb-vue/
├── starter/     # โค้ดสำหรับฝึก
├── finished/    # โค้ดเฉลย
└── database/
    └── seed.js  # ข้อมูลตัวอย่าง
```

**เหมาะกับ:**
- ข้อมูลที่โครงสร้างยืดหยุ่น
- Rapid Prototyping
- Real-time Applications

---

### Optional: PostgreSQL + Prisma + Next.js

สำหรับผู้ที่อยากลอง Type-safe ORM และ React Framework

| เทคโนโลยี | หน้าที่ |
|----------|--------|
| **PostgreSQL** | Advanced SQL Database |
| **Prisma** | Type-safe ORM |
| **TypeScript** | Type-safe JavaScript |
| **Next.js 14** | React Framework |
| **Tailwind CSS** | Utility-first CSS |

```
VShop_Workshop/prisma-nextjs/
├── starter/     # โค้ดสำหรับฝึก
├── finished/    # โค้ดเฉลย
└── database/
    └── seed.ts  # ข้อมูลตัวอย่าง
```

**เหมาะกับ:**
- โปรเจค TypeScript
- ต้องการ Auto-complete และ Type Safety
- Team ขนาดใหญ่

---

## 🔄 เปรียบเทียบ Tech Stacks

| Feature | MySQL + PHP | MongoDB + Vue | PostgreSQL + Prisma |
|---------|-------------|---------------|---------------------|
| **Database** | SQL | NoSQL | SQL |
| **Schema** | Fixed | Flexible | Fixed + Migrations |
| **Language** | PHP | JavaScript | TypeScript |
| **ORM/ODM** | PDO | Mongoose | Prisma |
| **Frontend** | Vanilla JS | Vue.js | Next.js (React) |
| **Difficulty** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Advanced |
| **Port** | 80 (XAMPP) | 3001 | 3002 |

---

## 🚀 Quick Start

### MySQL + PHP (Main Track)

```bash
# 1. Start XAMPP (Apache + MySQL)
# 2. Import database
mysql -u root -p < vshop-schema.sql
mysql -u root -p < vshop-sample-data.sql

# 3. Copy files to htdocs
cp -r mysql-php/finished/backend /Applications/XAMPP/htdocs/vshop/

# 4. Open browser
open http://localhost/vshop/backend/api/products/get-all.php
```

### MongoDB + Vue.js

```bash
cd VShop_Workshop/mongodb-vue/finished

# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

### PostgreSQL + Prisma + Next.js

```bash
cd VShop_Workshop/prisma-nextjs/finished

# Backend
cd backend && npm install
npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

---

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vshop.com | password123 |
| Customer | somchai@email.com | password123 |

---

## 👤 Author

**View Zensei**

- GitHub: [@nothing2say](https://github.com/nothing2say)


## 📝 License

MIT License


---

© 2026 V-Shop by View Zensei
