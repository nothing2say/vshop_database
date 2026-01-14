/**
 * ===================================
 * MongoDB Routes: Products
 * ===================================
 * 🎯 Challenge: นักเรียนต้องเขียน CRUD Operations เอง!
 *
 * Mongoose Methods ที่ต้องใช้:
 * - find() - ดึงข้อมูลหลายรายการ
 * - findById() - ดึงข้อมูล 1 รายการ
 * - save() - บันทึกข้อมูลใหม่
 * - findByIdAndUpdate() - อัปเดตข้อมูล
 * - findByIdAndDelete() - ลบข้อมูล
 * ===================================
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * GET /api/products
 * ดึงรายการสินค้าทั้งหมด
 */
router.get('/', async (req, res) => {
    try {
        // ===================================
        // 🎯 TODO: ดึงสินค้าทั้งหมดจาก MongoDB
        // ===================================
        //
        // 📝 Hint: ใช้ Product.find() และ .populate()
        //
        // const products = await Product.____________()
        //     .____________('category_id', 'name')
        //     .sort({ createdAt: -1 });
        //
        // ===================================

        const products = []; // TODO: Replace with actual query

        res.json({
            status: 200,
            message: 'ดึงรายการสินค้าสำเร็จ',
            data: { products }
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            status: 500,
            message: 'Database error: ' + error.message
        });
    }
});

/**
 * GET /api/products/:id
 * ดึงข้อมูลสินค้า 1 รายการ
 */
router.get('/:id', async (req, res) => {
    try {
        // ===================================
        // 🎯 TODO: ดึงสินค้า 1 รายการ
        // ===================================
        //
        // 📝 Hint: ใช้ Product.findById(req.params.id)
        //
        // const product = await Product.____________(req.params.____________);
        //
        // ===================================

        const product = null; // TODO: Replace with actual query

        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'ไม่พบสินค้า'
            });
        }

        res.json({
            status: 200,
            message: 'ดึงข้อมูลสินค้าสำเร็จ',
            data: product
        });

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            status: 500,
            message: 'Database error: ' + error.message
        });
    }
});

/**
 * POST /api/products
 * เพิ่มสินค้าใหม่
 */
router.post('/', async (req, res) => {
    try {
        const { name, description, category_id, brand, price, cost, stock, model, image_url } = req.body;

        // Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({
                status: 400,
                message: 'กรุณาระบุชื่อสินค้า'
            });
        }

        // ===================================
        // 🎯 TODO: สร้างสินค้าใหม่และบันทึก
        // ===================================
        //
        // 📝 Hint:
        // 1. สร้าง instance ใหม่: new Product({ ... })
        // 2. บันทึก: await product.save()
        //
        // const product = new Product({
        //     name: name.trim(),
        //     description: ____________,
        //     category_id: ____________,
        //     brand: ____________,
        //     price: ____________,
        //     cost: ____________,
        //     stock: ____________,
        //     model: ____________,
        //     image_url: ____________
        // });
        //
        // await product.____________();
        //
        // ===================================

        console.log('TODO: Create product', req.body);

        res.status(201).json({
            status: 201,
            message: 'เพิ่มสินค้าสำเร็จ (Demo)',
            data: { id: 'demo-id' }
        });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            status: 500,
            message: 'Database error: ' + error.message
        });
    }
});

/**
 * PUT /api/products/:id
 * แก้ไขสินค้า
 */
router.put('/:id', async (req, res) => {
    try {
        // ===================================
        // 🎯 TODO: ค้นหาและอัปเดตสินค้า
        // ===================================
        //
        // 📝 Hint: ใช้ findById() แล้ว update fields
        // หรือใช้ findByIdAndUpdate()
        //
        // const product = await Product.____________(req.params.id);
        //
        // if (!product) {
        //     return res.status(404)...
        // }
        //
        // product.name = req.body.name;
        // product.price = req.body.price;
        // ... อัปเดต field อื่นๆ
        //
        // await product.____________();
        //
        // ===================================

        console.log('TODO: Update product', req.params.id, req.body);

        res.json({
            status: 200,
            message: 'แก้ไขสินค้าสำเร็จ (Demo)'
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            status: 500,
            message: 'Database error: ' + error.message
        });
    }
});

/**
 * DELETE /api/products/:id
 * ลบสินค้า
 */
router.delete('/:id', async (req, res) => {
    try {
        // ===================================
        // 🎯 TODO: ลบสินค้า
        // ===================================
        //
        // 📝 Hint: ใช้ Product.findByIdAndDelete()
        //
        // const product = await Product.____________(req.params.id);
        //
        // if (!product) {
        //     return res.status(404)...
        // }
        //
        // ===================================

        console.log('TODO: Delete product', req.params.id);

        res.json({
            status: 200,
            message: 'ลบสินค้าสำเร็จ (Demo)'
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            status: 500,
            message: 'Database error: ' + error.message
        });
    }
});

module.exports = router;
