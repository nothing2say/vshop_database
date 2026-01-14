console.log('=== cart-sidebar.js loading ===');
/**
 * ===================================
 * V-Shop - Cart Sidebar (Offcanvas)
 * ===================================
 * แสดงตะกร้าสินค้าแบบ Sidebar เลื่อนออกมาจากขวา
 * - ดูรายการสินค้าในตะกร้า
 * - เพิ่ม/ลดจำนวน
 * - ลบสินค้า
 * - ไปหน้าชำระเงิน
 */

(function() {
    // รอให้โมดูลอื่นโหลดก่อน
    if (!window.VShopConfig || !window.VShopAPI || !window.VShopAuth) {
        console.error('Required modules not loaded for cart-sidebar!');
        return;
    }

    const { formatPrice, FALLBACK_IMAGE } = window.VShopConfig;
    const {
        getCart,
        updateCartItem,
        removeFromCart,
        showAlert,
        handleApiError
    } = window.VShopAPI;
    const { isLoggedIn, escapeHtml } = window.VShopAuth;

    // State เก็บข้อมูลตะกร้า
    let cartData = null;

    /**
     * โหลดข้อมูลตะกร้าแล้วแสดงใน Sidebar
     */
    async function loadCartSidebar() {
        console.log('loadCartSidebar: Loading...');

        const loadingEl = document.getElementById('cartSidebarLoading');
        const emptyEl = document.getElementById('cartSidebarEmpty');
        const contentEl = document.getElementById('cartSidebarContent');

        // ถ้ายังไม่ login ไม่ต้องโหลด
        if (!isLoggedIn()) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'block';
            if (contentEl) contentEl.style.display = 'none';
            return;
        }

        // แสดง loading
        if (loadingEl) loadingEl.style.display = 'block';
        if (emptyEl) emptyEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'none';

        try {
            const response = await getCart();
            console.log('loadCartSidebar: Response:', response);
            cartData = response.data;

            // ซ่อน loading
            if (loadingEl) loadingEl.style.display = 'none';

            // ตรวจสอบว่าตะกร้าว่างหรือไม่
            if (!cartData || !cartData.items || cartData.items.length === 0) {
                console.log('loadCartSidebar: Cart is empty');
                if (emptyEl) emptyEl.style.display = 'block';
                if (contentEl) contentEl.style.display = 'none';
                return;
            }

            // แสดงรายการสินค้า
            if (contentEl) contentEl.style.display = 'block';
            displayCartItems(cartData.items);
            displayCartSummary(cartData.summary);

        } catch (error) {
            console.error('loadCartSidebar error:', error);
            if (loadingEl) loadingEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'block';
            handleApiError(error);
        }
    }

    /**
     * แสดงรายการสินค้าใน Sidebar
     */
    function displayCartItems(items) {
        const itemsEl = document.getElementById('cartSidebarItems');
        if (!itemsEl) return;

        let html = '';

        items.forEach(item => {
            const imageUrl = item.image_url || FALLBACK_IMAGE;
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            const stock = parseInt(item.stock) || 999;
            const subtotal = price * quantity;
            const cartId = item.cart_item_id || item.cart_id || item.id;

            html += `
                <div class="cart-sidebar-item mb-3 pb-3 border-bottom">
                    <div class="d-flex">
                        <!-- รูปสินค้า -->
                        <img src="${imageUrl}" alt="${escapeHtml(item.name)}"
                             class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;"
                             onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}'">

                        <!-- ข้อมูลสินค้า -->
                        <div class="flex-grow-1">
                            <h6 class="mb-1 small">${escapeHtml(item.name)}</h6>
                            <p class="text-primary mb-1 small fw-bold">${formatPrice(price)}</p>

                            <!-- ปุ่มเพิ่ม/ลด -->
                            <div class="d-flex align-items-center">
                                <div class="btn-group btn-group-sm me-2">
                                    <button class="btn btn-outline-secondary" type="button"
                                            onclick="window.sidebarUpdateQty(${cartId}, ${quantity - 1})"
                                            ${quantity <= 1 ? 'disabled' : ''}>
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <span class="btn btn-outline-secondary disabled">${quantity}</span>
                                    <button class="btn btn-outline-secondary" type="button"
                                            onclick="window.sidebarUpdateQty(${cartId}, ${quantity + 1})"
                                            ${quantity >= stock ? 'disabled' : ''}>
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                                <button class="btn btn-sm btn-outline-danger"
                                        onclick="window.sidebarRemoveItem(${cartId})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>

                        <!-- ราคารวม -->
                        <div class="text-end">
                            <span class="fw-bold text-primary">${formatPrice(subtotal)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        itemsEl.innerHTML = html;
    }

    /**
     * แสดงสรุปราคาใน Sidebar
     */
    function displayCartSummary(summary) {
        const subtotalEl = document.getElementById('cartSidebarSubtotal');
        const shippingEl = document.getElementById('cartSidebarShipping');
        const totalEl = document.getElementById('cartSidebarTotal');

        if (!summary) return;

        const subtotal = parseFloat(summary.subtotal) || 0;
        const shipping = parseFloat(summary.shipping_cost) || 0;
        const total = parseFloat(summary.total) || subtotal;

        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (shippingEl) {
            shippingEl.innerHTML = shipping === 0
                ? '<span class="text-success">ฟรี</span>'
                : formatPrice(shipping);
        }
        if (totalEl) totalEl.textContent = formatPrice(total);
    }

    /**
     * เพิ่ม/ลดจำนวนสินค้า
     */
    async function sidebarUpdateQty(cartId, newQuantity) {
        console.log('sidebarUpdateQty:', cartId, newQuantity);

        if (newQuantity < 1) {
            // ถ้าจำนวนเป็น 0 = ลบออก
            sidebarRemoveItem(cartId);
            return;
        }

        try {
            await updateCartItem(cartId, newQuantity);
            await loadCartSidebar();
            // อัปเดต badge ด้วย
            if (window.VShopAuth && window.VShopAuth.updateCartBadge) {
                window.VShopAuth.updateCartBadge();
            }
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * ลบสินค้าออกจากตะกร้า
     */
    async function sidebarRemoveItem(cartId) {
        console.log('sidebarRemoveItem:', cartId);

        if (!confirm('ต้องการลบสินค้านี้?')) {
            return;
        }

        try {
            await removeFromCart(cartId);
            showAlert('ลบสินค้าแล้ว', 'success');
            await loadCartSidebar();
            // อัปเดต badge ด้วย
            if (window.VShopAuth && window.VShopAuth.updateCartBadge) {
                window.VShopAuth.updateCartBadge();
            }
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * ไปหน้าชำระเงิน
     */
    function sidebarCheckout() {
        if (!cartData || !cartData.items || cartData.items.length === 0) {
            showAlert('ไม่มีสินค้าในตะกร้า', 'warning');
            return;
        }
        window.location.href = 'checkout.html';
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // เมื่อเปิด offcanvas ให้โหลดข้อมูลใหม่
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.addEventListener('show.bs.offcanvas', () => {
                console.log('Cart sidebar opening, loading data...');
                loadCartSidebar();
            });
        }

        // ปุ่มชำระเงิน
        const checkoutBtn = document.getElementById('sidebarCheckoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', sidebarCheckout);
        }
    }

    // Initialize เมื่อ DOM โหลดเสร็จ
    document.addEventListener('DOMContentLoaded', setupEventListeners);

    // Export functions สำหรับใช้ใน onclick
    window.sidebarUpdateQty = sidebarUpdateQty;
    window.sidebarRemoveItem = sidebarRemoveItem;
    window.loadCartSidebar = loadCartSidebar;

    console.log('cart-sidebar.js loaded');
})();
