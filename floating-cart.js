// floating-cart.js
(function() {
    // تحديد لون الخلفية حسب الصفحة
function getPageThemeColor() {
    const path = window.location.pathname;
    if (path.includes('spices.html')) {
        return '#b87333'; // لون بني للبهارات
    } else if (path.includes('care.html') || path.includes('personal-care.html')) {
        return '#c77d9b'; // لون وردي للعناية
    } else {
        return '#2c5f2d'; // الأخضر الأساسي
    }
}
  function createFloatingCart() {
    // ✅ إزالة الشرط الذي يمنع إنشاء الزر إذا كانت السلة فارغة
    // let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
    // if (cart.length === 0) return;

    if (document.querySelector('.floating-cart-btn')) return;

    let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
    
    // زر السلة العائم
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'floating-cart-btn';
    floatingBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="cart-badge">' + cart.reduce((s, i) => s + i.quantity, 0) + '</span>';
    document.body.appendChild(floatingBtn);
    
const themeColor = getPageThemeColor();
floatingBtn.style.backgroundColor = themeColor;
    // النافذة الجانبية
    const sidebar = document.createElement('div');
    sidebar.className = 'cart-sidebar';
    sidebar.innerHTML = `
        <div class="cart-header">
            <h3> سلة التسوق</h3>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-total">الإجمالي: 0 ₪</div>
            <button class="checkout-btn" onclick="window.location.href='checkout.html'">إتمام الشراء</button>
        </div>
    `;
    document.body.appendChild(sidebar);

    // طبقة خلفية داكنة
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // فتح وإغلاق السلة
    floatingBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('show');
        hideShareButton(); // إخفاء زر المشاركة عند فتح السلة
        renderCartSidebar();
    });
    sidebar.querySelector('.close-cart').addEventListener('click', () => {
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

    function updateFloatingCartBadge() {
        const badge = document.querySelector('.floating-cart-btn .cart-badge');
        if (badge) {
            const cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            badge.innerText = total;
        }
    }

    // ✅ دالة للتحكم في ظهور/اختفاء السلة العائمة
    function updateFloatingCartVisibility() {
        const cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
        const btn = document.querySelector('.floating-cart-btn');
        
        if (cart.length === 0) {
            // إخفاء الزر إذا وجد
            if (btn) btn.remove();
        } else {
            // إظهار الزر إذا لم يكن موجودًا
            if (!btn) createFloatingCart();
            else {
                // تحديث العداد إذا كان الزر موجودًا
                updateFloatingCartBadge();
            }
        }
    }

    function renderCartSidebar() {
        let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
        const container = document.querySelector('.cart-sidebar .cart-items');
        const totalSpan = document.querySelector('.cart-sidebar .cart-total');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="empty-cart-message">🛒 سلتك فارغة</div>';
            if (totalSpan) totalSpan.innerText = 'الإجمالي: 0 ₪';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            html += `
                <div class="cart-item" data-index="${idx}">
                    <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='asset/images/placeholder.png'">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} ₪</div>
                        <div class="cart-item-quantity">
                            <button class="qty-minus" data-idx="${idx}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-plus" data-idx="${idx}">+</button>
                        </div>
                        <button class="remove-item" data-idx="${idx}">🗑️ إزالة</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        if (totalSpan) totalSpan.innerText = `الإجمالي: ${total} ₪`;

        container.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
                if (cart[idx].quantity > 1) cart[idx].quantity--;
                else cart.splice(idx, 1);
                localStorage.setItem('elixir_cart', JSON.stringify(cart));
                renderCartSidebar();
                updateFloatingCartBadge();
                updateHeaderCartBadge();
                updateFloatingCartVisibility(); // ✅ تحديث الظهور
            });
        });
        container.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
                cart[idx].quantity++;
                localStorage.setItem('elixir_cart', JSON.stringify(cart));
                renderCartSidebar();
                updateFloatingCartBadge();
                updateHeaderCartBadge();
                updateFloatingCartVisibility(); // ✅ تحديث الظهور
            });
        });
        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
                cart.splice(idx, 1);
                localStorage.setItem('elixir_cart', JSON.stringify(cart));
                renderCartSidebar();
                updateFloatingCartBadge();
                updateHeaderCartBadge();
                updateFloatingCartVisibility(); // ✅ تحديث الظهور
            });
        });
    }

    function updateHeaderCartBadge() {
        const cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const headerBadge = document.querySelector('.cart-count');
        if (headerBadge) headerBadge.innerText = total;
    }

    // ========== دالة إظهار التوست ==========
    function showToast(message, type = 'success') {
        const oldToast = document.querySelector('.floating-toast-custom');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'floating-toast-custom';
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
    window.addToCartWithCheck = function(id, name, price, img) {
        let cart = JSON.parse(localStorage.getItem('elixir_cart') || '[]');
        const existing = cart.find(item => item.id == id);
        
        if (existing) {
            showToast(`⚠️ المنتج "${name}" موجود بالفعل في سلتك!`, 'warning');
            return;
        }
        
        cart.push({ id, name, price, img, quantity: 1 });
        localStorage.setItem('elixir_cart', JSON.stringify(cart));
        
        updateFloatingCartBadge();
        updateHeaderCartBadge();
        updateFloatingCartVisibility(); // ✅ إظهار السلة بعد الإضافة الأولى
        
        showToast(`✅ تمت إضافة ${name} بنجاح، يتمنى ${name} أن ينال إعجابكم 😊`, 'success');
    };

    window.updateFloatingCart = function() {
        updateFloatingCartBadge();
        updateFloatingCartVisibility();
    };

    document.addEventListener('DOMContentLoaded', () => {
        // ✅ لا ننشئ السلة عند التحميل (لأنها فارغة غالبًا)
        // createFloatingCart(); ← تم إزالة هذا السطر
        updateFloatingCartBadge();
        updateHeaderCartBadge();
        updateFloatingCartVisibility(); // ✅ يتحقق من وجود منتجات ويعرض السلة إذا لزم الأمر
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'elixir_cart') {
                updateFloatingCartBadge();
                updateHeaderCartBadge();
                updateFloatingCartVisibility();
                if (document.querySelector('.cart-sidebar.open')) renderCartSidebar();
            }
        });
    });
    // إخفاء زر المشاركة عند فتح السلة
function hideShareButton() {
    const shareBtn = document.querySelector('.share-fixed-btn');
    if (shareBtn) shareBtn.style.display = 'none';
}

// إظهار زر المشاركة عند إغلاق السلة
function showShareButton() {
    const shareBtn = document.querySelector('.share-fixed-btn');
    if (shareBtn) shareBtn.style.display = 'flex';
}

})();