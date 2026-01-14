console.log('=== api.js loading ===');
/**
 * ===================================
 * V-Shop - API Helper Functions
 * ===================================
 */

(function() {
    const { API_ENDPOINTS, TOAST_DURATION } = window.VShopConfig;

    async function apiCall(url, method = 'GET', body = null) {
        console.log('apiCall:', method, url, body);
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (body && method !== 'GET') {
                options.body = JSON.stringify(body);
            }

            if (body && method === 'GET') {
                const params = new URLSearchParams(body);
                url = `${url}?${params.toString()}`;
            }

            console.log('Fetching:', url);
            const response = await fetch(url, options);
            const data = await response.json();
            console.log('Response:', data);

            if (!response.ok || data.status >= 400) {
                throw new Error(data.message || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth APIs
    async function loginUser(email, password) {
        return await apiCall(API_ENDPOINTS.login, 'POST', { email, password });
    }

    async function registerUser(userData) {
        return await apiCall(API_ENDPOINTS.register, 'POST', userData);
    }

    async function logoutUser() {
        return await apiCall(API_ENDPOINTS.logout, 'POST');
    }

    // ตรวจสอบว่า session ยังใช้งานได้หรือไม่
    async function checkAuth() {
        return await apiCall(API_ENDPOINTS.checkAuth, 'GET');
    }

    // Product APIs
    async function getAllProducts(filters = {}) {
        return await apiCall(API_ENDPOINTS.getAllProducts, 'GET', filters);
    }

    async function getProduct(productId) {
        return await apiCall(`${API_ENDPOINTS.getProduct}?id=${productId}`, 'GET');
    }

    // Category APIs
    async function getAllCategories() {
        return await apiCall(API_ENDPOINTS.getAllCategories, 'GET');
    }

    // Cart APIs
    async function getCart() {
        return await apiCall(API_ENDPOINTS.getCart, 'GET');
    }

    async function addToCart(productId, quantity = 1) {
        return await apiCall(API_ENDPOINTS.addToCart, 'POST', {
            product_id: productId,
            quantity
        });
    }

    // อัปเดตจำนวนสินค้าในตะกร้า
    async function updateCartItem(cartId, quantity) {
        return await apiCall(API_ENDPOINTS.updateCartItem, 'POST', {
            cart_id: cartId,
            quantity
        });
    }

    // ลบสินค้าออกจากตะกร้า
    async function removeFromCart(cartId) {
        return await apiCall(API_ENDPOINTS.removeFromCart, 'POST', {
            cart_id: cartId
        });
    }

    // ล้างตะกร้าทั้งหมด
    async function clearCart() {
        return await apiCall(API_ENDPOINTS.clearCart, 'POST');
    }

    // ===================================
    // Order APIs (คำสั่งซื้อ)
    // ===================================

    // สร้างคำสั่งซื้อจากตะกร้า
    async function createOrder(orderData) {
        return await apiCall(API_ENDPOINTS.createOrder, 'POST', orderData);
    }

    // ดูคำสั่งซื้อของฉัน
    async function getMyOrders() {
        return await apiCall(API_ENDPOINTS.getMyOrders, 'GET');
    }

    // ดูคำสั่งซื้อทั้งหมด (Admin)
    async function getAllOrders(filters = {}) {
        return await apiCall(API_ENDPOINTS.getAllOrders, 'GET', filters);
    }

    // อัปเดตสถานะคำสั่งซื้อ (Admin)
    async function updateOrderStatus(orderId, status) {
        return await apiCall(API_ENDPOINTS.updateOrderStatus, 'POST', {
            order_id: orderId,
            status
        });
    }

    // UI Helpers
    function showAlert(message, type = 'info', duration = TOAST_DURATION) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alertId = 'alert-' + Date.now();
        const icons = {
            success: 'check-circle-fill',
            danger: 'exclamation-triangle-fill',
            warning: 'exclamation-circle-fill',
            info: 'info-circle-fill'
        };

        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${alertId}">
                <i class="bi bi-${icons[type] || 'info-circle-fill'}"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        alertContainer.insertAdjacentHTML('beforeend', alertHTML);

        if (duration > 0) {
            setTimeout(() => {
                const alert = document.getElementById(alertId);
                if (alert) alert.remove();
            }, duration);
        }
    }

    function showLoading(show = true) {
        const spinner = document.getElementById('loadingSpinner');
        const content = document.getElementById('productsGrid');

        if (spinner) spinner.style.display = show ? 'block' : 'none';
        if (content) content.style.display = show ? 'none' : 'flex';
    }

    function handleApiError(error) {
        console.error('API Error:', error);
        showAlert(error.message || 'เกิดข้อผิดพลาด', 'danger');
    }

    // Export - ส่งออก functions ทั้งหมดให้ใช้ได้ทั่ว app
    window.VShopAPI = {
        // Core
        apiCall,

        // Auth (การยืนยันตัวตน)
        loginUser,
        registerUser,
        logoutUser,
        checkAuth,

        // Products (สินค้า)
        getAllProducts,
        getProduct,

        // Categories (หมวดหมู่)
        getAllCategories,

        // Cart (ตะกร้า)
        getCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,

        // Orders (คำสั่งซื้อ)
        createOrder,
        getMyOrders,
        getAllOrders,
        updateOrderStatus,

        // UI Helpers
        showAlert,
        showLoading,
        handleApiError
    };

    console.log('api.js loaded, VShopAPI:', window.VShopAPI);
})();
