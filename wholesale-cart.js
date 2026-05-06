// wholesale-cart.js
(function() {
    function createWholesaleCart() {
        if (document.querySelector('.wholesale-floating-cart')) return;

        let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        if (cart.length === 0) return;

        // زر السلة العائم
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'wholesale-floating-cart';
        floatingBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="wholesale-cart-badge">' + cart.reduce((s, i) => s + i.quantity, 0) + '</span>';
        document.body.appendChild(floatingBtn);

        // النافذة الجانبية
        const sidebar = document.createElement('div');
        sidebar.className = 'wholesale-cart-sidebar';
        sidebar.innerHTML = `
            <div class="wholesale-cart-header">
                <h3>🛒 سلة الجملة</h3>
                <button class="close-wholesale-cart">&times;</button>
            </div>
            <div class="wholesale-cart-items"></div>
            <div class="wholesale-cart-footer">
                <div class="wholesale-cart-total">الإجمالي: 0 ₪</div>
                <button class="wholesale-checkout-btn">إتمام طلب الجملة</button>
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
            renderWholesaleCartSidebar();
        });
        sidebar.querySelector('.close-wholesale-cart').addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    function updateWholesaleCartBadge() {
        const badge = document.querySelector('.wholesale-floating-cart .wholesale-cart-badge');
        if (badge) {
            const cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            badge.innerText = total;
        }
    }

    function renderWholesaleCartSidebar() {
        let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const container = document.querySelector('.wholesale-cart-items');
        const totalSpan = document.querySelector('.wholesale-cart-total');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="wholesale-empty-cart">🛒 سلة الجملة فارغة</div>';
            if (totalSpan) totalSpan.innerText = 'الإجمالي: 0 ₪';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            html += `
                <div class="wholesale-cart-item" data-index="${idx}">
                    <img class="wholesale-cart-img" src="${item.img}" alt="${item.name}" onerror="this.src='asset/images/placeholder.png'">
                    <div class="wholesale-cart-info">
                        <div class="wholesale-cart-title">${item.name}</div>
                        <div class="wholesale-cart-price">${item.price} ₪</div>
                        <div class="wholesale-cart-quantity">
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

        // أحداث الأزرار
        container.querySelectorAll('.wholesale-qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
                if (cart[idx].quantity > 1) cart[idx].quantity--;
                else cart.splice(idx, 1);
                localStorage.setItem('elixir_wholesale_cart', JSON.stringify(cart));
                renderWholesaleCartSidebar();
                updateWholesaleCartBadge();
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
                updateWholesaleCartVisibility();
            });
        });
        document.querySelector('.wholesale-checkout-btn')?.addEventListener('click', () => {
            alert('شكراً لتسوقك مع Elixir (طلب جملة). سيتم التواصل معك قريباً.');
        });
    }

    function updateWholesaleCartVisibility() {
        const cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const btn = document.querySelector('.wholesale-floating-cart');
        if (cart.length === 0) {
            if (btn) btn.remove();
        } else {
            if (!btn) createWholesaleCart();
            else updateWholesaleCartBadge();
        }
    }

    window.addToWholesaleCart = function(id, name, price, img) {
        let cart = JSON.parse(localStorage.getItem('elixir_wholesale_cart') || '[]');
        const existing = cart.find(item => item.id === id);
        if (existing) existing.quantity++;
        else cart.push({ id, name, price, img, quantity: 1 });
        localStorage.setItem('elixir_wholesale_cart', JSON.stringify(cart));
        updateWholesaleCartBadge();
        updateWholesaleCartVisibility();
        showWholesaleToast(` تمت إضافة ${name} إلى سلة الجملة`);
    };

    function showWholesaleToast(message) {
        const oldToast = document.querySelector('.wholesale-toast');
        if (oldToast) oldToast.remove();
        const toast = document.createElement('div');
        toast.className = 'wholesale-toast';
        toast.style.cssText = `
            position: fixed; bottom: 130px; right: 20px; z-index: 10000;
            background: #2c5f2d; color: white; border-radius: 12px;
            padding: 10px 20px; font-family: 'Cairo', sans-serif;
            direction: rtl; font-size: 0.9rem;
            transform: translateX(100%); transition: transform 0.3s ease;
        `;
        toast.innerHTML = `✅ ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateWholesaleCartVisibility();
    });
})();