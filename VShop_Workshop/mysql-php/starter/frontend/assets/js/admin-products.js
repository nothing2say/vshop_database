/**
 * ===================================
 * V-Shop Admin - Products Management
 * ===================================
 * 🎯 Challenge: นักเรียนต้องเขียน API calls เอง!
 *
 * ฟังก์ชันที่ต้องทำ:
 * 1. loadProducts() - โหลดรายการสินค้า
 * 2. loadCategoriesForFilter() - โหลดหมวดหมู่
 * 3. openAddProductModal() - เปิด modal เพิ่มสินค้า
 * 4. openEditProductModal(id) - เปิด modal แก้ไขสินค้า
 * 5. handleProductSubmit(e) - บันทึกสินค้า
 * 6. openDeleteModal(id, name) - เปิด modal ยืนยันลบ
 * 7. confirmDelete() - ยืนยันลบสินค้า
 *
 * 📝 Hint: ดูตัวอย่าง API calls ใน api.js
 * ===================================
 */

(function() {
    const { formatPrice, getStockStatus, FALLBACK_IMAGE, API_ENDPOINTS } = window.VShopConfig;
    const { getAllProducts, getAllCategories, apiCall, showAlert, handleApiError } = window.VShopAPI;
    const { escapeHtml } = window.VShopAuth;

    let allCategories = [];
    let deleteProductId = null;

    // ===================================
    // 1. โหลดรายการสินค้า
    // ===================================
    async function loadProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

        try {
            // ✅ ฟังก์ชันนี้ทำไว้ให้แล้ว
            const response = await getAllProducts();
            const products = response.data?.products || [];
            displayProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">ไม่สามารถโหลดข้อมูลได้</td></tr>`;
        }
    }

    function displayProducts(products) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">ไม่มีสินค้า</td></tr>`;
            return;
        }

        let html = '';
        products.forEach(product => {
            const stockStatus = getStockStatus(parseInt(product.stock));
            const imageUrl = product.image_url || FALLBACK_IMAGE;

            html += `
                <tr>
                    <td><img src="${imageUrl}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;" onerror="this.src='${FALLBACK_IMAGE}'"></td>
                    <td><strong>${escapeHtml(product.name)}</strong>${product.brand ? `<br><small class="text-muted">${escapeHtml(product.brand)}</small>` : ''}</td>
                    <td>${escapeHtml(product.category_name || '-')}</td>
                    <td class="text-end">${formatPrice(parseFloat(product.price))}</td>
                    <td class="text-center"><span class="badge bg-${stockStatus.badge}">${product.stock} ชิ้น</span></td>
                    <td class="text-center">${product.sold || 0}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditProductModal(${product.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${product.id}, '${escapeHtml(product.name)}')"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    // ===================================
    // 2. โหลดหมวดหมู่
    // ===================================
    async function loadCategoriesForFilter() {
        try {
            const response = await getAllCategories();
            allCategories = response.data || [];
            updateCategoryDropdowns();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    function updateCategoryDropdowns() {
        const filterSelect = document.getElementById('filterCategory');
        const formSelect = document.getElementById('productCategory');

        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">ทุกหมวดหมู่</option>';
            allCategories.forEach(cat => {
                filterSelect.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
            });
        }

        if (formSelect) {
            formSelect.innerHTML = '<option value="">เลือกหมวดหมู่</option>';
            allCategories.forEach(cat => {
                formSelect.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
            });
        }
    }

    // ===================================
    // 3. เปิด Modal เพิ่มสินค้าใหม่
    // ===================================
    function openAddProductModal() {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productModalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>เพิ่มสินค้าใหม่';
        document.getElementById('imagePreview').src = FALLBACK_IMAGE;
        productModal.show();
    }

    // ===================================
    // 4. 🎯 TODO: เปิด Modal แก้ไขสินค้า
    // ===================================
    async function openEditProductModal(productId) {
        try {
            // 🎯 TODO: เรียก API ดึงข้อมูลสินค้า
            // Hint: ใช้ apiCall() หรือ fetch()
            // API Endpoint: API_ENDPOINTS.getProduct + '?id=' + productId
            //
            // ตัวอย่าง:
            // const response = await apiCall(`${API_ENDPOINTS.getProduct}?id=${productId}`, 'GET');
            // const product = response.data;

            // ===================================
            // TODO: เขียน code เรียก API ตรงนี้
            // ===================================

            // ตัวอย่างข้อมูลจำลอง (ลบเมื่อเขียนเสร็จ)
            const product = {
                id: productId,
                name: 'สินค้าตัวอย่าง',
                description: 'รายละเอียด',
                category_id: 1,
                brand: 'Brand',
                price: 1000,
                cost: 800,
                stock: 10,
                model: 'Model',
                image_url: ''
            };

            // ===================================

            // เติมข้อมูลในฟอร์ม
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productCategory').value = product.category_id;
            document.getElementById('productBrand').value = product.brand || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCost').value = product.cost || '';
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productModel').value = product.model || '';
            document.getElementById('productImage').value = product.image_url || '';

            document.getElementById('imagePreview').src = product.image_url || FALLBACK_IMAGE;
            document.getElementById('productModalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>แก้ไขสินค้า';
            productModal.show();

        } catch (error) {
            console.error('Error loading product:', error);
            showAlert('ไม่สามารถโหลดข้อมูลสินค้าได้', 'danger');
        }
    }

    // ===================================
    // 5. 🎯 TODO: บันทึกสินค้า (เพิ่ม/แก้ไข)
    // ===================================
    async function handleProductSubmit(e) {
        e.preventDefault();

        const productId = document.getElementById('productId').value;
        const isEdit = !!productId;

        const productData = {
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            category_id: parseInt(document.getElementById('productCategory').value),
            brand: document.getElementById('productBrand').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            cost: parseFloat(document.getElementById('productCost').value) || 0,
            stock: parseInt(document.getElementById('productStock').value),
            model: document.getElementById('productModel').value.trim(),
            image_url: document.getElementById('productImage').value.trim()
        };

        const submitBtn = document.getElementById('productSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>กำลังบันทึก...';

        try {
            if (isEdit) {
                // 🎯 TODO: เรียก API แก้ไขสินค้า
                // Hint: ใช้ apiCall(API_ENDPOINTS.updateProduct, 'POST', data)
                //
                // ===================================
                // TODO: เขียน code ตรงนี้
                // ===================================

                console.log('TODO: Update product', productId, productData);
                showAlert('แก้ไขสินค้าสำเร็จ (Demo)', 'success');

            } else {
                // 🎯 TODO: เรียก API เพิ่มสินค้า
                // Hint: ใช้ apiCall(API_ENDPOINTS.createProduct, 'POST', data)
                //
                // ===================================
                // TODO: เขียน code ตรงนี้
                // ===================================

                console.log('TODO: Create product', productData);
                showAlert('เพิ่มสินค้าสำเร็จ (Demo)', 'success');
            }

            productModal.hide();
            loadProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            showAlert(error.message || 'เกิดข้อผิดพลาด', 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>บันทึก';
        }
    }

    // ===================================
    // 6. เปิด Modal ยืนยันการลบ
    // ===================================
    function openDeleteModal(productId, productName) {
        deleteProductId = productId;
        document.getElementById('deleteProductName').textContent = productName;
        deleteModal.show();
    }

    // ===================================
    // 7. 🎯 TODO: ยืนยันลบสินค้า
    // ===================================
    async function confirmDelete() {
        if (!deleteProductId) return;

        try {
            // 🎯 TODO: เรียก API ลบสินค้า
            // Hint: ใช้ apiCall(API_ENDPOINTS.deleteProduct, 'POST', { id: deleteProductId })
            //
            // ===================================
            // TODO: เขียน code ตรงนี้
            // ===================================

            console.log('TODO: Delete product', deleteProductId);
            showAlert('ลบสินค้าสำเร็จ (Demo)', 'success');

            deleteModal.hide();
            loadProducts();

        } catch (error) {
            console.error('Error deleting product:', error);
            showAlert(error.message || 'เกิดข้อผิดพลาด', 'danger');
        }

        deleteProductId = null;
    }

    // Export
    window.loadProducts = loadProducts;
    window.loadCategoriesForFilter = loadCategoriesForFilter;
    window.openAddProductModal = openAddProductModal;
    window.openEditProductModal = openEditProductModal;
    window.handleProductSubmit = handleProductSubmit;
    window.openDeleteModal = openDeleteModal;
    window.confirmDelete = confirmDelete;

})();
