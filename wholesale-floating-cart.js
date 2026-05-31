// wholesale-floating-cart.js
(function() {
    // تحديد لون الخلفية حسب الصفحة (يمكن تعديله حسب رغبتك)
    function getPageThemeColor() {
        const path = window.location.pathname;
        if (path.includes('spices.html')) {
            return '#b87333';
        } else if (path.includes('care.html') || path.includes('personal-care.html')) {
            return '#c77d9b';
        } else {
            return '#2c5f2d'; // الأخضر الأساسي للتاجر
        }
    }

    function createWholesaleFloatingCart() {
        if (document.querySelector('.wholesale-floating-cart-btn')) return;

        let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        
        // زر السلة العائم
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'wholesale-floating-cart-btn';
        floatingBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="wholesale-cart-badge">' + cart.reduce((s, i) => s + i.quantity, 0) + '</span>';
        document.body.appendChild(floatingBtn);

        const themeColor = getPageThemeColor();
        floatingBtn.style.backgroundColor = themeColor;

        // النافذة الجانبية
        const sidebar = document.createElement('div');
        sidebar.className = 'wholesale-cart-sidebar';
        sidebar.innerHTML = `
            <div class="wholesale-cart-header">
                <h3> سلة الجملة</h3>
                <button class="close-wholesale-cart">&times;</button>
            </div>
            <div class="wholesale-cart-items"></div>
            <div class="wholesale-cart-footer">
                <div class="wholesale-cart-total">الإجمالي: 0 ₪</div>
                <button class="wholesale-checkout-btn" onclick="window.location.href='wholesalecheckout.html'">إتمام طلب الجملة</button>
            </div>
        `;
        document.body.appendChild(sidebar);

        // طبقة خلفية داكنة
        const overlay = document.createElement('div');
        overlay.className = 'wholesale-overlay';
        document.body.appendChild(overlay);

        // فتح وإغلاق السلة
        floatingBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('show');
            hideShareButton(); // إخفاء زر المشاركة عند فتح السلة
            renderWholesaleCartSidebar();
        });
        sidebar.querySelector('.close-wholesale-cart').addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
            showShareButton(); // إظهار زر المشاركة عند إغلاق السلة
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
            showShareButton(); // إظهار زر المشاركة عند إغلاق السلة
        });
    }

    function updateWholesaleCartBadge() {
        const badge = document.querySelector('.wholesale-floating-cart-btn .wholesale-cart-badge');
        if (badge) {
            const cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            badge.innerText = total;
        }
    }

    function updateWholesaleCartVisibility() {
        const cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const btn = document.querySelector('.wholesale-floating-cart-btn');
        
        if (cart.length === 0) {
            if (btn) btn.remove();
        } else {
            if (!btn) createWholesaleFloatingCart();
            else updateWholesaleCartBadge();
        }
    }

    function renderWholesaleCartSidebar() {
        let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const container = document.querySelector('.wholesale-cart-sidebar .wholesale-cart-items');
        const totalSpan = document.querySelector('.wholesale-cart-sidebar .wholesale-cart-total');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="wholesale-empty-cart-message">🛒 سلة الجملة فارغة</div>';
            if (totalSpan) totalSpan.innerText = 'الإجمالي: 0 ₪';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            html += `
                <div class="wholesale-cart-item" data-index="${idx}">
                    <img class="wholesale-cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='asset/images/placeholder.png'">
                    <div class="wholesale-cart-item-info">
                        <div class="wholesale-cart-item-title">${item.name}</div>
                        <div class="wholesale-cart-item-price">${item.price} ₪</div>
                        <div class="wholesale-cart-item-quantity">
                            <button class="wholesale-qty-minus" data-idx="${idx}">-</button>
                            <span>${item.quantity}</span>
                            <button class="wholesale-qty-plus" data-idx="${idx}">+</button>
                        </div>
                        <button class="wholesale-remove-item" data-idx="${idx}">🗑️ إزالة</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        if (totalSpan) totalSpan.innerText = `الإجمالي: ${total} ₪`;

        container.querySelectorAll('.wholesale-qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
                if (cart[idx].quantity > 1) cart[idx].quantity--;
                else cart.splice(idx, 1);
                localStorage.setItem('elixir_wholesale_cart', JSON.stringify(cart));
                renderWholesaleCartSidebar();
                updateWholesaleCartBadge();
                updateWholesaleHeaderBadge();
                updateWholesaleCartVisibility();
            });
        });
        container.querySelectorAll('.wholesale-qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
                cart[idx].quantity++;
                localStorage.setItem('elixir_wholesale_cart', JSON.stringify(cart));
                renderWholesaleCartSidebar();
                updateWholesaleCartBadge();
                updateWholesaleHeaderBadge();
                updateWholesaleCartVisibility();
            });
        });
        container.querySelectorAll('.wholesale-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
                cart.splice(idx, 1);
                localStorage.setItem('elixir_wholesale_cart', JSON.stringify(cart));
                renderWholesaleCartSidebar();
                updateWholesaleCartBadge();
                updateWholesaleHeaderBadge();
                updateWholesaleCartVisibility();
            });
        });
    }

    function updateWholesaleHeaderBadge() {
        const cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const headerBadge = document.querySelector('.wholesale-cart-count'); // تأكدي أن الكلاس صحيح في الهيدر
        if (headerBadge) headerBadge.innerText = total;
    }

    // ========== دالة إظهار التوست ==========
    function showWholesaleToast(message, type = 'success') {
        const oldToast = document.querySelector('.wholesale-floating-toast-custom');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'wholesale-floating-toast-custom';
        const bgColor = type === 'success' ? '#2c5f2d' : '#e67e22';
        const icon = type === 'success' ? '✅' : '⚠️';
        
        toast.style.cssText = `
            position: fixed;
            bottom: 160px;
            right: 20px;
            z-index: 10000;
            background: ${bgColor};
            color: white;
            border-radius: 12px;
            padding: 12px 24px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            font-family: 'Cairo', sans-serif;
            direction: rtl;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.innerHTML = `${icon} ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========== دالة الإضافة إلى السلة (مع التحقق من التكرار) ==========
    window.addToWholesaleCartWithCheck = function(id, name, price, img) {
        let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const existing = cart.find(item => item.id == id);
        
        if (existing) {
            showWholesaleToast(`⚠️ المنتج "${name}" موجود بالفعل في سلة الجملة!`, 'warning');
            return;
        }
        
        cart.push({ id, name, price, img, quantity: 1 });
        localStorage.setItem('elixir_wholesale_cart', JSON.stringify(cart));
        
        updateWholesaleCartBadge();
        updateWholesaleHeaderBadge();
        updateWholesaleCartVisibility();
        
        showWholesaleToast(`✅ تمت إضافة ${name} إلى سلة الجملة`, 'success');
    };

    window.updateWholesaleFloatingCart = function() {
        updateWholesaleCartBadge();
        updateWholesaleCartVisibility();
    };

    // إخفاء وإظهار زر المشاركة (يجب أن تكون هذه الدوال موجودة في `floating-share.js` أو تعرف هنا)
    function hideShareButton() {
        const shareBtn = document.querySelector('.share-fixed-btn');
        if (shareBtn) shareBtn.style.display = 'none';
    }

    function showShareButton() {
        const shareBtn = document.querySelector('.share-fixed-btn');
        if (shareBtn) shareBtn.style.display = 'flex';
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateWholesaleCartBadge();
        updateWholesaleHeaderBadge();
        updateWholesaleCartVisibility();
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'elixir_wholesale_cart') {
                updateWholesaleCartBadge();
                updateWholesaleHeaderBadge();
                updateWholesaleCartVisibility();
                if (document.querySelector('.wholesale-cart-sidebar.open')) renderWholesaleCartSidebar();
            }
        });
    });
})();