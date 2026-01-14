/**
 * ===================================
 * V-Shop MongoDB Seed Script
 * ===================================
 * รันคำสั่ง: node seed.js
 * © 2026 V-Shop by View Zensei
 * ===================================
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '../finished/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vshop';

// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    slug: { type: String, unique: true }
}, { timestamps: true });

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: String,
    model: String,
    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    image_url: String
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Create Categories
        console.log('📁 Creating categories...');
        const categories = await Category.insertMany([
            { name: 'สมาร์ทโฟน', description: 'โทรศัพท์มือถือสมาร์ทโฟน', slug: 'smartphones' },
            { name: 'แล็ปท็อป', description: 'คอมพิวเตอร์แล็ปท็อปและโน้ตบุ๊ก', slug: 'laptops' },
            { name: 'แท็บเล็ต', description: 'แท็บเล็ตและ iPad', slug: 'tablets' },
            { name: 'หูฟัง', description: 'หูฟังและอุปกรณ์เสียง', slug: 'headphones' },
            { name: 'อุปกรณ์เสริม', description: 'อุปกรณ์เสริมและของตกแต่ง', slug: 'accessories' }
        ]);

        const catMap = {};
        categories.forEach(c => catMap[c.slug] = c._id);

        // Create Products
        console.log('📦 Creating products...');
        await Product.insertMany([
            {
                name: 'iPhone 15 Pro Max',
                description: 'สมาร์ทโฟนเรือธงรุ่นล่าสุดจาก Apple พร้อมชิป A17 Pro',
                category_id: catMap['smartphones'],
                brand: 'Apple',
                model: 'A3094',
                price: 52900,
                cost: 45000,
                stock: 25,
                sold: 150,
                image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'สมาร์ทโฟน Android ระดับพรีเมียม พร้อม S Pen',
                category_id: catMap['smartphones'],
                brand: 'Samsung',
                model: 'SM-S928',
                price: 47900,
                cost: 40000,
                stock: 30,
                sold: 120,
                image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'
            },
            {
                name: 'MacBook Pro 14" M3 Pro',
                description: 'แล็ปท็อปสำหรับมืออาชีพ ชิป M3 Pro',
                category_id: catMap['laptops'],
                brand: 'Apple',
                model: 'MRX33',
                price: 74900,
                cost: 65000,
                stock: 15,
                sold: 45,
                image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
            },
            {
                name: 'MacBook Air 15" M3',
                description: 'แล็ปท็อปบางเบา จอใหญ่ 15 นิ้ว',
                category_id: catMap['laptops'],
                brand: 'Apple',
                model: 'MRXN3',
                price: 49900,
                cost: 42000,
                stock: 20,
                sold: 60,
                image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'
            },
            {
                name: 'iPad Pro 12.9" M2',
                description: 'แท็บเล็ตสำหรับงานสร้างสรรค์',
                category_id: catMap['tablets'],
                brand: 'Apple',
                model: 'MNXR3',
                price: 44900,
                cost: 38000,
                stock: 18,
                sold: 55,
                image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
            },
            {
                name: 'AirPods Pro 2',
                description: 'หูฟังไร้สายพร้อม ANC',
                category_id: catMap['headphones'],
                brand: 'Apple',
                model: 'MQD83',
                price: 8990,
                cost: 7000,
                stock: 50,
                sold: 200,
                image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'หูฟังครอบหู ตัดเสียงรบกวนระดับโลก',
                category_id: catMap['headphones'],
                brand: 'Sony',
                model: 'WH1000XM5',
                price: 13990,
                cost: 11000,
                stock: 30,
                sold: 85,
                image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'
            },
            {
                name: 'Apple Watch Series 9',
                description: 'สมาร์ทวอทช์รุ่นใหม่ล่าสุด',
                category_id: catMap['accessories'],
                brand: 'Apple',
                model: 'MR933',
                price: 15900,
                cost: 13000,
                stock: 35,
                sold: 90,
                image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'
            }
        ]);

        console.log('');
        console.log('✅ Seed completed successfully!');
        console.log(`   - ${categories.length} categories created`);
        console.log(`   - 8 products created`);
        console.log('');

    } catch (error) {
        console.error('❌ Seed failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
