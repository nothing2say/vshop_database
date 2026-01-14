console.log('=== config.js loading ===');
/**
 * ===================================
 * V-Shop - Configuration
 * ===================================
 */

(function() {
    // API Base URL
    const API_BASE = 'http://nothing2say-mpro.local/db68/vshop/backend/api';

    // API Endpoints
    const API_ENDPOINTS = {
        login: `${API_BASE}/auth/login.php`,
        register: `${API_BASE}/auth/register.php`,
        logout: `${API_BASE}/auth/logout.php`,
        checkAuth: `${API_BASE}/auth/check.php`,
        getAllProducts: `${API_BASE}/products/get-all.php`,
        getProduct: `${API_BASE}/products/get-one.php`,
        createProduct: `${API_BASE}/products/create.php`,
        updateProduct: `${API_BASE}/products/update.php`,
        deleteProduct: `${API_BASE}/products/delete.php`,
        getAllCategories: `${API_BASE}/categories/get-all.php`,
        getCart: `${API_BASE}/cart/get.php`,
        addToCart: `${API_BASE}/cart/add.php`,
        updateCartItem: `${API_BASE}/cart/update.php`,
        removeFromCart: `${API_BASE}/cart/remove.php`,
        clearCart: `${API_BASE}/cart/clear.php`,
        createOrder: `${API_BASE}/orders/create.php`,
        getMyOrders: `${API_BASE}/orders/get-my-orders.php`,
        getAllOrders: `${API_BASE}/orders/get-all.php`,
        updateOrderStatus: `${API_BASE}/orders/update-status.php`,
    };

    const DEFAULT_IMAGE = 'assets/images/product-placeholder.png';
    // Fallback image เป็น data URI - ใช้ได้แม้ไม่มี internet
    // แสดงกล่องสีเทาพร้อมไอคอนรูปภาพ
    const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    const PRODUCTS_PER_PAGE = 12;
    const CART_STORAGE_KEY = 'vshop_cart';
    const USER_STORAGE_KEY = 'vshop_user';
    const TOAST_DURATION = 3000;

    function formatPrice(price) {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(price);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    function getStockStatus(stock) {
        if (stock <= 0) {
            return { text: 'สินค้าหมด', class: 'stock-out', badge: 'danger' };
        } else if (stock <= 5) {
            return { text: `เหลือ ${stock} ชิ้น`, class: 'stock-low', badge: 'warning' };
        } else {
            return { text: 'มีสินค้า', class: 'stock-in', badge: 'success' };
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===================================
    // Helper Functions เพิ่มเติม
    // ===================================

    // แสดงวันที่แบบสั้น (ไม่มีเวลา)
    function formatDateShort(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    // แปลงสถานะคำสั่งซื้อเป็นภาษาไทย + สี badge
    function getOrderStatus(status) {
        const statusMap = {
            pending: { text: 'รอชำระเงิน', badge: 'bg-warning text-dark', icon: 'clock' },
            paid: { text: 'ชำระเงินแล้ว', badge: 'bg-info', icon: 'credit-card' },
            shipped: { text: 'จัดส่งแล้ว', badge: 'bg-primary', icon: 'truck' },
            delivered: { text: 'ส่งถึงแล้ว', badge: 'bg-success', icon: 'check-circle' },
            cancelled: { text: 'ยกเลิก', badge: 'bg-danger', icon: 'x-circle' }
        };
        return statusMap[status] || { text: status, badge: 'bg-secondary', icon: 'question-circle' };
    }

    // แปลงวิธีชำระเงินเป็นภาษาไทย
    function getPaymentMethodText(method) {
        const methodMap = {
            credit_card: 'บัตรเครดิต/เดบิต',
            bank_transfer: 'โอนเงินผ่านธนาคาร',
            cash_on_delivery: 'ชำระเงินปลายทาง'
        };
        return methodMap[method] || method;
    }

    // Export - ส่งออกทุกอย่างให้ใช้ได้ทั่ว app
    window.VShopConfig = {
        // Settings
        API_BASE,
        API_ENDPOINTS,
        DEFAULT_IMAGE,
        FALLBACK_IMAGE,
        PRODUCTS_PER_PAGE,
        CART_STORAGE_KEY,
        USER_STORAGE_KEY,
        TOAST_DURATION,

        // Format helpers
        formatPrice,
        formatDate,
        formatDateShort,

        // Status helpers
        getStockStatus,
        getOrderStatus,
        getPaymentMethodText,

        // Utilities
        debounce
    };

    console.log('config.js loaded, VShopConfig:', window.VShopConfig);
})();
