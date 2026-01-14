console.log('=== shop.js loading ===');
/**
 * ===================================
 * V-Shop - Shop Page Logic
 * ===================================
 */

(function() {
    console.log('shop.js IIFE starting...');
    console.log('VShopConfig:', window.VShopConfig);
    console.log('VShopAPI:', window.VShopAPI);
    console.log('VShopAuth:', window.VShopAuth);

    const {
        DEFAULT_IMAGE,
        FALLBACK_IMAGE,
        PRODUCTS_PER_PAGE,
        formatPrice,
        getStockStatus,
        debounce
    } = window.VShopConfig;

    const {
        getAllProducts,
        getAllCategories,
        addToCart,
        showAlert,
        showLoading,
        handleApiError
    } = window.VShopAPI;

    const { isLoggedIn, escapeHtml } = window.VShopAuth;

    let currentPage = 1;
    let currentFilters = {};
    let allCategories = [];

    async function initShop() {
        console.log('initShop: Starting...');
        try {
            console.log('initShop: Loading categories...');
            await loadCategories();

            console.log('initShop: Loading products...');
            await loadProducts();

            console.log('initShop: Setting up events...');
            setupEventListeners();

            console.log('initShop: Complete!');
        } catch (error) {
            console.error('Shop initialization error:', error);
            handleApiError(error);
        }
    }

    async function loadCategories() {
        try {
            console.log('loadCategories: Calling API...');
            const response = await getAllCategories();
            console.log('loadCategories: Response:', response);
            allCategories = response.data || [];

            const categoryMenu = document.getElementById('categoryMenu');
            if (categoryMenu) {
                let html = '<li><a class="dropdown-item" href="#" data-category="">ทั้งหมด</a></li>';
                html += '<li><hr class="dropdown-divider"></li>';

                allCategories.forEach(cat => {
                    html += `<li><a class="dropdown-item" href="#" data-category="${cat.id}">${escapeHtml(cat.name)}</a></li>`;
                });

                categoryMenu.innerHTML = html;

                categoryMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const categoryId = e.target.dataset.category;
                        document.getElementById('filterCategory').value = categoryId;
                        applyFilters();
                    });
                });
            }

            const filterCategory = document.getElementById('filterCategory');
            if (filterCategory) {
                allCategories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.name;
                    filterCategory.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async function loadProducts(page = 1) {
        try {
            showLoading(true);
            currentPage = page;

            const params = {
                page: currentPage,
                limit: PRODUCTS_PER_PAGE,
                ...currentFilters
            };

            console.log('loadProducts: Calling API with params:', params);
            const response = await getAllProducts(params);
            console.log('loadProducts: Response:', response);

            displayProducts(response.data.products || []);
            displayPagination(response.data.pagination || {});

            const productCount = document.getElementById('productCount');
            if (productCount && response.data.pagination) {
                const { total_products, current_page, per_page } = response.data.pagination;
                const perPage = per_page || PRODUCTS_PER_PAGE;
                const start = ((current_page - 1) * perPage) + 1;
                const end = Math.min(current_page * perPage, total_products);
                productCount.textContent = `แสดง ${start}-${end} จาก ${total_products} รายการ`;
            }

            showLoading(false);
        } catch (error) {
            showLoading(false);
            handleApiError(error);
        }
    }

    function displayProducts(products) {
        const productsGrid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');

        if (!productsGrid) return;

        if (!products || products.length === 0) {
            productsGrid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        let html = '';
        products.forEach(product => {
            const stockStatus = getStockStatus(parseInt(product.stock));
            // Use product image or fallback
            const imageUrl = product.image_url || FALLBACK_IMAGE;

            html += `
                <div class="col">
                    <div class="card product-card h-100">
                        <img src="${imageUrl}" class="card-img-top" alt="${escapeHtml(product.name)}"
                             style="height: 200px; object-fit: cover;"
                             onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}'">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                ${product.brand ? `<small class="text-muted">${escapeHtml(product.brand)}</small>` : '<span></span>'}
                                <span class="badge bg-${stockStatus.badge}">
                                    ${parseInt(product.stock) > 0 ? product.stock + ' ชิ้น' : 'หมด'}
                                </span>
                            </div>
                            <h6 class="card-title">${escapeHtml(product.name)}</h6>
                            <p class="text-primary fw-bold mb-2">${formatPrice(parseFloat(product.price))}</p>
                            <div class="mt-auto">
                                <button class="btn btn-primary btn-sm w-100"
                                        onclick="window.handleAddToCart(${product.id})"
                                        ${parseInt(product.stock) <= 0 ? 'disabled' : ''}>
                                    <i class="bi bi-cart-plus"></i> หยิบใส่ตะกร้า
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        productsGrid.innerHTML = html;
    }

    function displayPagination(pagination) {
        const paginationEl = document.getElementById('pagination');
        if (!paginationEl || !pagination) return;

        const { current_page, total_pages } = pagination;

        if (total_pages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        let html = '';
        html += `<li class="page-item ${current_page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="window.loadProducts(${current_page - 1}); return false;">«</a>
        </li>`;

        for (let i = 1; i <= total_pages; i++) {
            html += `<li class="page-item ${i === current_page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="window.loadProducts(${i}); return false;">${i}</a>
            </li>`;
        }

        html += `<li class="page-item ${current_page === total_pages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="window.loadProducts(${current_page + 1}); return false;">»</a>
        </li>`;

        paginationEl.innerHTML = html;
    }

    function applyFilters() {
        const categoryId = document.getElementById('filterCategory')?.value || '';
        const minPrice = document.getElementById('minPrice')?.value || '';
        const maxPrice = document.getElementById('maxPrice')?.value || '';
        const sortBy = document.getElementById('sortBy')?.value || 'newest';
        const searchInput = document.getElementById('searchInput')?.value.trim() || '';

        currentFilters = {};
        if (categoryId) currentFilters.category_id = categoryId;
        if (minPrice) currentFilters.min_price = parseFloat(minPrice);
        if (maxPrice) currentFilters.max_price = parseFloat(maxPrice);
        if (sortBy) currentFilters.sort = sortBy;
        if (searchInput) currentFilters.search = searchInput;

        loadProducts(1);
    }

    function clearFilters() {
        const filterCategory = document.getElementById('filterCategory');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const sortBy = document.getElementById('sortBy');
        const searchInput = document.getElementById('searchInput');

        if (filterCategory) filterCategory.value = '';
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        if (sortBy) sortBy.value = 'newest';
        if (searchInput) searchInput.value = '';

        currentFilters = {};
        loadProducts(1);
    }

    async function handleAddToCart(productId) {
        if (!isLoggedIn()) {
            showAlert('กรุณาเข้าสู่ระบบก่อนหยิบสินค้าใส่ตะกร้า', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            }, 1500);
            return;
        }

        try {
            await addToCart(productId, 1);
            showAlert('เพิ่มสินค้าในตะกร้าแล้ว', 'success');

            // อัปเดต cart badge
            if (window.VShopAuth && window.VShopAuth.updateCartBadge) {
                window.VShopAuth.updateCartBadge();
            }
        } catch (error) {
            handleApiError(error);
        }
    }

    function setupEventListeners() {
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', applyFilters);

        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);

        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                applyFilters();
            });
        }

        const sortBy = document.getElementById('sortBy');
        if (sortBy) sortBy.addEventListener('change', applyFilters);

        // เพิ่ม event listener สำหรับ category filter
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) filterCategory.addEventListener('change', applyFilters);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initShop);

    // Export functions for onclick handlers
    window.handleAddToCart = handleAddToCart;
    window.loadProducts = loadProducts;

    console.log('shop.js IIFE complete');
})();
