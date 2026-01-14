console.log('=== auth.js loading ===');
/**
 * ===================================
 * V-Shop - Authentication Helper
 * ===================================
 */

(function() {
    const { USER_STORAGE_KEY } = window.VShopConfig;

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getCurrentUser() {
        try {
            const userStr = localStorage.getItem(USER_STORAGE_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error('Error getting user:', e);
            return null;
        }
    }

    function saveUser(user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    function removeUser() {
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    function isLoggedIn() {
        return getCurrentUser() !== null;
    }

    function isAdmin() {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    }

    /**
     * อัปเดตจำนวนสินค้าใน cart badge
     */
    async function updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (!cartBadge) return;

        // ถ้ายังไม่ login ไม่ต้องโหลด
        if (!isLoggedIn()) {
            cartBadge.textContent = '0';
            cartBadge.style.display = 'none';
            return;
        }

        try {
            // เรียก API ดึงข้อมูลตะกร้า
            if (window.VShopAPI && window.VShopAPI.getCart) {
                const response = await window.VShopAPI.getCart();
                const itemCount = response.data?.item_count || 0;

                cartBadge.textContent = itemCount;
                cartBadge.style.display = itemCount > 0 ? 'inline-block' : 'none';
            }
        } catch (error) {
            console.error('Error updating cart badge:', error);
            cartBadge.textContent = '0';
        }
    }

    /**
     * Update navigation UI based on auth status
     * - ถ้า login แล้ว: แสดงชื่อ user + dropdown menu
     * - ถ้า admin: แสดงลิงก์ไป Admin Dashboard
     * - ถ้ายังไม่ login: แสดงปุ่ม Login/Register
     */
    function updateNavUI() {
        console.log('updateNavUI called');
        const userNav = document.getElementById('userNav');
        const cartNav = document.getElementById('cartNav');
        const user = getCurrentUser();

        console.log('Current user:', user);

        if (!userNav) {
            console.warn('userNav element not found');
            return;
        }

        if (user) {
            // ========== USER LOGGED IN ==========
            console.log('User logged in, showing user menu');

            let menuItems = `
                <li class="dropdown-header">
                    <small class="text-muted">${escapeHtml(user.email)}</small>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item" href="orders.html">
                        <i class="bi bi-box-seam me-2"></i>คำสั่งซื้อของฉัน
                    </a>
                </li>
            `;

            // Admin link
            if (user.role === 'admin') {
                menuItems += `
                    <li>
                        <a class="dropdown-item text-primary fw-bold" href="admin.html">
                            <i class="bi bi-speedometer2 me-2"></i>Admin Dashboard
                        </a>
                    </li>
                `;
            }

            menuItems += `
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item text-danger" href="#" id="logoutBtn">
                        <i class="bi bi-box-arrow-right me-2"></i>ออกจากระบบ
                    </a>
                </li>
            `;

            userNav.innerHTML = `
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle text-white d-flex align-items-center"
                       href="#" role="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle me-2"></i>
                        <span>${escapeHtml(user.name || user.email)}</span>
                        ${user.role === 'admin' ? '<span class="badge bg-warning ms-2">Admin</span>' : ''}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        ${menuItems}
                    </ul>
                </div>
            `;

            // Show cart for logged in users
            if (cartNav) cartNav.style.display = 'block';

            // Update cart badge
            updateCartBadge();

            // Add logout event
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }

        } else {
            // ========== NOT LOGGED IN ==========
            console.log('User not logged in, showing login/register buttons');

            userNav.innerHTML = `
                <a class="btn btn-outline-light btn-sm me-2" href="login.html">
                    <i class="bi bi-box-arrow-in-right me-1"></i>เข้าสู่ระบบ
                </a>
                <a class="btn btn-light btn-sm" href="register.html">
                    <i class="bi bi-person-plus me-1"></i>สมัครสมาชิก
                </a>
            `;

            // Hide cart for guests
            if (cartNav) cartNav.style.display = 'none';
        }
    }

    async function handleLogout(e) {
        if (e) e.preventDefault();

        try {
            if (window.VShopAPI && window.VShopAPI.logoutUser) {
                await window.VShopAPI.logoutUser();
            }
        } catch (error) {
            console.error('Logout API error:', error);
        }

        removeUser();

        if (window.VShopAPI && window.VShopAPI.showAlert) {
            window.VShopAPI.showAlert('ออกจากระบบสำเร็จ', 'success');
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    function requireAuth(adminOnly = false) {
        const user = getCurrentUser();
        const overlay = document.getElementById('authCheckOverlay');

        if (!user) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return false;
        }

        if (adminOnly && user.role !== 'admin') {
            window.location.href = 'login.html?error=unauthorized';
            return false;
        }

        if (overlay) overlay.remove();
        return true;
    }

    // Promise สำหรับรอ auth check เสร็จ
    let authReadyResolve;
    const authReady = new Promise(resolve => {
        authReadyResolve = resolve;
    });

    async function initAuth() {
        console.log('initAuth called');

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const protectedPages = ['cart.html', 'checkout.html', 'orders.html'];
        const adminPages = ['admin.html'];
        const user = getCurrentUser();

        try {
            // ถ้ามี user ใน localStorage ให้ตรวจสอบกับ server
            if (user && window.VShopAPI && window.VShopAPI.checkAuth) {
                try {
                    console.log('Verifying session with server...');
                    const response = await window.VShopAPI.checkAuth();

                    // อัปเดต localStorage ด้วยข้อมูลล่าสุดจาก server
                    if (response.data) {
                        console.log('Session valid, updating user data');
                        saveUser(response.data);
                    }
                } catch (error) {
                    console.log('Session invalid, clearing user data:', error.message);
                    // Session หมดอายุหรือไม่ถูกต้อง - ล้างข้อมูล
                    removeUser();

                    // ถ้าอยู่ในหน้าที่ต้อง login ให้ redirect
                    if (protectedPages.includes(currentPage) || adminPages.includes(currentPage)) {
                        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
                        // ต้อง resolve ก่อน redirect เพื่อไม่ให้ pending
                        authReadyResolve(false);
                        return;
                    }
                }
            }

            // อัปเดต UI
            updateNavUI();

            // ตรวจสอบสิทธิ์เข้าหน้า protected
            if (protectedPages.includes(currentPage)) {
                requireAuth(false);
            }

            if (adminPages.includes(currentPage)) {
                requireAuth(true);
            }
        } catch (err) {
            console.error('initAuth error:', err);
        } finally {
            // แจ้งว่า auth check เสร็จแล้ว - ต้อง resolve เสมอ
            console.log('Auth check complete');
            authReadyResolve(true);
        }
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        if (!email || !password) {
            window.VShopAPI.showAlert('กรุณากรอกอีเมลและรหัสผ่าน', 'warning');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>กำลังเข้าสู่ระบบ...';

            const response = await window.VShopAPI.loginUser(email, password);
            saveUser(response.data);
            window.VShopAPI.showAlert('เข้าสู่ระบบสำเร็จ', 'success');

            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'index.html';
                window.location.href = redirect;
            }, 800);

        } catch (error) {
            console.error('Login error:', error);
            window.VShopAPI.showAlert(error.message || 'เข้าสู่ระบบไม่สำเร็จ', 'danger');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        if (!name || !email || !password) {
            window.VShopAPI.showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            window.VShopAPI.showAlert('รหัสผ่านไม่ตรงกัน', 'danger');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>กำลังสมัคร...';

            const response = await window.VShopAPI.registerUser({ name, email, password });
            saveUser(response.data);
            window.VShopAPI.showAlert('สมัครสมาชิกสำเร็จ', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);

        } catch (error) {
            console.error('Register error:', error);
            window.VShopAPI.showAlert(error.message || 'สมัครสมาชิกไม่สำเร็จ', 'danger');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    function togglePasswordVisibility(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (!input || !icon) return;

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('bi-eye', 'bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('bi-eye-slash', 'bi-eye');
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initAuth);

    // Export
    window.VShopAuth = {
        getCurrentUser,
        saveUser,
        removeUser,
        isLoggedIn,
        isAdmin,
        updateNavUI,
        updateCartBadge,
        handleLogout,
        requireAuth,
        initAuth,
        authReady,  // Promise ที่ resolve เมื่อ auth check เสร็จ
        handleLoginSubmit,
        handleRegisterSubmit,
        togglePasswordVisibility,
        escapeHtml
    };

    console.log('auth.js loaded, VShopAuth:', window.VShopAuth);
})();
