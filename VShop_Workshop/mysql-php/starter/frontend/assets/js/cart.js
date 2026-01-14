console.log('=== cart.js loading ===');
/**
 * ===================================
 * V-Shop - Cart Page Logic
 * ===================================
 * จัดการหน้าตะกร้าสินค้า (cart.html)
 */

(function() {
    // รอให้ VShopConfig และ VShopAPI โหลดก่อน
    if (!window.VShopConfig || !window.VShopAPI || !window.VShopAuth) {
        console.error('Required modules not loaded!');
        return;
    }

    const { DEFAULT_IMAGE, FALLBACK_IMAGE, formatPrice } = window.VShopConfig;
    const {
        getCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        showAlert,
        handleApiError
    } = window.VShopAPI;
    const { escapeHtml } = window.VShopAuth;

    // State
    let cartData = null;
    let itemToRemove = null;

    /**
     * Initialize cart page
     */
    async function initCart() {
        console.log('initCart: Starting...');
        try {
            // ลบ auth overlay ออกเลย
            const overlay = document.getElementById('authCheckOverlay');
            if (overlay) overlay.remove();

            await loadCart();
            setupEventListeners();
            console.log('initCart: Complete!');
        } catch (error) {
            console.error('Cart initialization error:', error);
            handleApiError(error);
        }
    }

    /**
     * Load cart from API
     */
    async function loadCart() {
        console.log('loadCart: Starting...');
        try {
            const spinner = document.getElementById('loadingSpinner');
            const cartContent = document.getElementById('cartContent');
            const emptyCart = document.getElementById('emptyCart');

            if (spinner) spinner.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'none';

            // Call API
            console.log('loadCart: Calling API...');
            const response = await getCart();
            console.log('loadCart: Response:', response);

            cartData = response.data;

            if (spinner) spinner.style.display = 'none';

            // Check if cart is empty
            if (!cartData || !cartData.items || cartData.items.length === 0) {
                console.log('loadCart: Cart is empty');
                if (emptyCart) emptyCart.style.display = 'block';
                if (cartContent) cartContent.style.display = 'none';
                return;
            }

            // Display cart
            console.log('loadCart: Displaying', cartData.items.length, 'items');
            if (cartContent) cartContent.style.display = 'block';
            displayCartItems(cartData.items);
            displayCartSummary(cartData.summary);

        } catch (error) {
            console.error('loadCart error:', error);
            const spinner = document.getElementById('loadingSpinner');
            const emptyCart = document.getElementById('emptyCart');

            if (spinner) spinner.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';

            handleApiError(error);
        }
    }

    /**
     * Display cart items
     */
    function displayCartItems(items) {
        console.log('displayCartItems:', items);
        const cartItemsList = document.getElementById('cartItemsList');
        const cartItemCount = document.getElementById('cartItemCount');

        if (!cartItemsList) {
            console.error('cartItemsList element not found!');
            return;
        }

        if (!items || items.length === 0) {
            cartItemsList.innerHTML = '<p class="text-center text-muted p-4">ไม่มีสินค้าในตะกร้า</p>';
            if (cartItemCount) cartItemCount.textContent = '0';
            return;
        }

        if (cartItemCount) cartItemCount.textContent = items.length;

        let html = '';

        items.forEach((item, index) => {
            console.log('Item', index, ':', item);

            const imageUrl = item.image_url || FALLBACK_IMAGE;
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            const stock = parseInt(item.stock) || 999;
            const subtotal = price * quantity;
            const cartId = item.cart_item_id || item.cart_id || item.id;

            html += `
                <div class="cart-item p-3 border-bottom">
                    <div class="row align-items-center">
                        <!-- Product Image -->
                        <div class="col-3 col-md-2">
                            <img src="${imageUrl}" class="img-fluid rounded" alt="${escapeHtml(item.name)}"
                                 style="max-height: 80px; object-fit: cover;"
                                 onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}'">
                        </div>

                        <!-- Product Info -->
                        <div class="col-9 col-md-4">
                            <h6 class="mb-1">${escapeHtml(item.name)}</h6>
                            ${item.brand ? `<small class="text-muted">${escapeHtml(item.brand)}</small>` : ''}
                            <p class="text-primary mb-0 fw-bold">${formatPrice(price)}</p>
                        </div>

                        <!-- Quantity Control -->
                        <div class="col-6 col-md-3 mt-2 mt-md-0">
                            <div class="input-group input-group-sm">
                                <button class="btn btn-outline-secondary" type="button"
                                        onclick="window.cartUpdateQuantity(${cartId}, ${quantity - 1})"
                                        ${quantity <= 1 ? 'disabled' : ''}>
                                    <i class="bi bi-dash"></i>
                                </button>
                                <input type="text" class="form-control text-center" value="${quantity}" readonly
                                       style="max-width: 50px;">
                                <button class="btn btn-outline-secondary" type="button"
                                        onclick="window.cartUpdateQuantity(${cartId}, ${quantity + 1})"
                                        ${quantity >= stock ? 'disabled' : ''}>
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            ${stock <= 5 ? `<small class="text-warning">เหลือ ${stock} ชิ้น</small>` : ''}
                        </div>

                        <!-- Subtotal & Remove -->
                        <div class="col-6 col-md-3 text-end mt-2 mt-md-0">
                            <p class="fw-bold text-primary mb-1">${formatPrice(subtotal)}</p>
                            <button class="btn btn-sm btn-outline-danger"
                                    onclick="window.cartRemoveItem(${cartId})">
                                <i class="bi bi-trash"></i> ลบ
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItemsList.innerHTML = html;
        console.log('displayCartItems: Done');
    }

    /**
     * Display cart summary
     */
    function displayCartSummary(summary) {
        console.log('displayCartSummary:', summary);

        const subtotalEl = document.getElementById('subtotal');
        const shippingCostEl = document.getElementById('shippingCost');
        const totalEl = document.getElementById('total');

        if (!summary) {
            console.warn('No summary data');
            return;
        }

        const subtotal = parseFloat(summary.subtotal) || 0;
        const shippingCost = parseFloat(summary.shipping_cost) || 0;
        const total = parseFloat(summary.total) || subtotal;

        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (shippingCostEl) {
            shippingCostEl.innerHTML = shippingCost === 0
                ? '<span class="text-success">ฟรี</span>'
                : formatPrice(shippingCost);
        }
        if (totalEl) totalEl.textContent = formatPrice(total);
    }

    /**
     * Update cart item quantity
     */
    async function cartUpdateQuantity(cartId, newQuantity) {
        console.log('cartUpdateQuantity:', cartId, newQuantity);

        if (newQuantity < 1) {
            // ถ้าจำนวน 0 = ลบออก
            cartRemoveItem(cartId);
            return;
        }

        try {
            await updateCartItem(cartId, newQuantity);
            await loadCart();
            showAlert('อัปเดตจำนวนสินค้าแล้ว', 'success');
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Remove item from cart
     */
    async function cartRemoveItem(cartId) {
        console.log('cartRemoveItem:', cartId);

        if (!confirm('ต้องการลบสินค้านี้ออกจากตะกร้า?')) {
            return;
        }

        try {
            await removeFromCart(cartId);
            await loadCart();
            showAlert('ลบสินค้าออกจากตะกร้าแล้ว', 'success');
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Clear entire cart
     */
    async function handleClearCart() {
        if (!confirm('ต้องการล้างสินค้าทั้งหมดในตะกร้า?')) {
            return;
        }

        try {
            await clearCart();
            await loadCart();
            showAlert('ล้างตะกร้าสินค้าแล้ว', 'success');
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Handle checkout
     */
    function handleCheckout() {
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
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', handleClearCart);
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initCart);

    // Export functions for onclick handlers
    window.cartUpdateQuantity = cartUpdateQuantity;
    window.cartRemoveItem = cartRemoveItem;

    console.log('cart.js loaded');
})();
