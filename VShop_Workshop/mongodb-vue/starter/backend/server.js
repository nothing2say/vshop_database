/**
 * ===================================
 * V-Shop Backend - MongoDB + Express
 * ===================================
 * เวอร์ชันเฉลย - Finished Version
 * Port: 3001
 * ===================================
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vshop')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 200,
        message: 'V-Shop API (MongoDB) is running',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'API endpoint not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 500,
        message: 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 V-Shop API running on http://localhost:${PORT}`);
});
