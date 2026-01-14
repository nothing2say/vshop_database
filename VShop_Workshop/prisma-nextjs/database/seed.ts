/**
 * ===================================
 * V-Shop Prisma Seed Script
 * ===================================
 * รันคำสั่ง: npx ts-node seed.ts
 * หรือเพิ่มใน package.json: "prisma:seed": "ts-node database/seed.ts"
 * © 2026 V-Shop by View Zensei
 * ===================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Clearing existing data...');
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    console.log('📁 Creating categories...');
    const smartphones = await prisma.category.create({
        data: { name: 'สมาร์ทโฟน', description: 'โทรศัพท์มือถือสมาร์ทโฟน', slug: 'smartphones' }
    });
    const laptops = await prisma.category.create({
        data: { name: 'แล็ปท็อป', description: 'คอมพิวเตอร์แล็ปท็อปและโน้ตบุ๊ก', slug: 'laptops' }
    });
    const tablets = await prisma.category.create({
        data: { name: 'แท็บเล็ต', description: 'แท็บเล็ตและ iPad', slug: 'tablets' }
    });
    const headphones = await prisma.category.create({
        data: { name: 'หูฟัง', description: 'หูฟังและอุปกรณ์เสียง', slug: 'headphones' }
    });
    const accessories = await prisma.category.create({
        data: { name: 'อุปกรณ์เสริม', description: 'อุปกรณ์เสริมและของตกแต่ง', slug: 'accessories' }
    });

    console.log('📦 Creating products...');
    await prisma.product.createMany({
        data: [
            {
                name: 'iPhone 15 Pro Max',
                description: 'สมาร์ทโฟนเรือธงรุ่นล่าสุดจาก Apple พร้อมชิป A17 Pro',
                categoryId: smartphones.id,
                brand: 'Apple',
                model: 'A3094',
                price: 52900,
                cost: 45000,
                stock: 25,
                sold: 150,
                imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'สมาร์ทโฟน Android ระดับพรีเมียม พร้อม S Pen',
                categoryId: smartphones.id,
                brand: 'Samsung',
                model: 'SM-S928',
                price: 47900,
                cost: 40000,
                stock: 30,
                sold: 120,
                imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'
            },
            {
                name: 'Google Pixel 8 Pro',
                description: 'สมาร์ทโฟนจาก Google พร้อม AI ขั้นสูง',
                categoryId: smartphones.id,
                brand: 'Google',
                model: 'GC3VE',
                price: 35900,
                cost: 30000,
                stock: 20,
                sold: 80,
                imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'
            },
            {
                name: 'MacBook Pro 14" M3 Pro',
                description: 'แล็ปท็อปสำหรับมืออาชีพ ชิป M3 Pro',
                categoryId: laptops.id,
                brand: 'Apple',
                model: 'MRX33',
                price: 74900,
                cost: 65000,
                stock: 15,
                sold: 45,
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
            },
            {
                name: 'MacBook Air 15" M3',
                description: 'แล็ปท็อปบางเบา จอใหญ่ 15 นิ้ว',
                categoryId: laptops.id,
                brand: 'Apple',
                model: 'MRXN3',
                price: 49900,
                cost: 42000,
                stock: 20,
                sold: 60,
                imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'
            },
            {
                name: 'Dell XPS 15',
                description: 'แล็ปท็อป Windows ระดับพรีเมียม',
                categoryId: laptops.id,
                brand: 'Dell',
                model: 'XPS9530',
                price: 59900,
                cost: 50000,
                stock: 12,
                sold: 35,
                imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'
            },
            {
                name: 'iPad Pro 12.9" M2',
                description: 'แท็บเล็ตสำหรับงานสร้างสรรค์',
                categoryId: tablets.id,
                brand: 'Apple',
                model: 'MNXR3',
                price: 44900,
                cost: 38000,
                stock: 18,
                sold: 55,
                imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
            },
            {
                name: 'iPad Air M2',
                description: 'แท็บเล็ตรุ่นกลางพร้อมชิป M2',
                categoryId: tablets.id,
                brand: 'Apple',
                model: 'MUWA3',
                price: 24900,
                cost: 20000,
                stock: 25,
                sold: 70,
                imageUrl: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400'
            },
            {
                name: 'AirPods Pro 2',
                description: 'หูฟังไร้สายพร้อม ANC',
                categoryId: headphones.id,
                brand: 'Apple',
                model: 'MQD83',
                price: 8990,
                cost: 7000,
                stock: 50,
                sold: 200,
                imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'หูฟังครอบหู ตัดเสียงรบกวนระดับโลก',
                categoryId: headphones.id,
                brand: 'Sony',
                model: 'WH1000XM5',
                price: 13990,
                cost: 11000,
                stock: 30,
                sold: 85,
                imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'
            },
            {
                name: 'AirPods Max',
                description: 'หูฟังครอบหูพรีเมียมจาก Apple',
                categoryId: headphones.id,
                brand: 'Apple',
                model: 'MGYH3',
                price: 19900,
                cost: 16000,
                stock: 15,
                sold: 40,
                imageUrl: 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400'
            },
            {
                name: 'Apple Watch Series 9',
                description: 'สมาร์ทวอทช์รุ่นใหม่ล่าสุด',
                categoryId: accessories.id,
                brand: 'Apple',
                model: 'MR933',
                price: 15900,
                cost: 13000,
                stock: 35,
                sold: 90,
                imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'
            }
        ]
    });

    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();

    console.log('');
    console.log('✅ Seed completed successfully!');
    console.log(`   - ${categoryCount} categories created`);
    console.log(`   - ${productCount} products created`);
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
