/**
 * ===================================
 * MongoDB Model: Category
 * ===================================
 * เวอร์ชันเฉลย - Finished Version
 * ===================================
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'กรุณาระบุชื่อหมวดหมู่'],
        trim: true,
        unique: true,
        maxlength: [100, 'ชื่อหมวดหมู่ไม่เกิน 100 ตัวอักษร']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'รายละเอียดไม่เกิน 500 ตัวอักษร']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

// สร้าง slug อัตโนมัติจากชื่อ
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
