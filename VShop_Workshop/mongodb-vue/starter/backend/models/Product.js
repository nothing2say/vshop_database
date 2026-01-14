/**
 * ===================================
 * MongoDB Model: Product
 * ===================================
 * ใช้ Mongoose สำหรับสร้าง Schema
 * เวอร์ชันเฉลย - Finished Version
 * ===================================
 */

const mongoose = require('mongoose');

/**
 * Product Schema
 * กำหนดโครงสร้างข้อมูลสินค้า
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'กรุณาระบุชื่อสินค้า'],
        trim: true,
        maxlength: [200, 'ชื่อสินค้าไม่เกิน 200 ตัวอักษร']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'รายละเอียดไม่เกิน 2000 ตัวอักษร']
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [100, 'ชื่อแบรนด์ไม่เกิน 100 ตัวอักษร']
    },
    price: {
        type: Number,
        required: [true, 'กรุณาระบุราคา'],
        min: [0, 'ราคาต้องไม่ติดลบ']
    },
    cost: {
        type: Number,
        default: 0,
        min: [0, 'ต้นทุนต้องไม่ติดลบ']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'จำนวนสต็อกต้องไม่ติดลบ']
    },
    sold: {
        type: Number,
        default: 0,
        min: [0, 'จำนวนขายต้องไม่ติดลบ']
    },
    model: {
        type: String,
        trim: true,
        maxlength: [100, 'รุ่นไม่เกิน 100 ตัวอักษร']
    },
    image_url: {
        type: String,
        trim: true
    }
}, {
    timestamps: true, // เพิ่ม createdAt, updatedAt อัตโนมัติ
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate สำหรับดึงข้อมูล category
productSchema.virtual('category', {
    ref: 'Category',
    localField: 'category_id',
    foreignField: '_id',
    justOne: true
});

// Index สำหรับการค้นหา
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
