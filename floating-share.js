// floating-share.js
(function() {
    // ========== تحديد لون الخلفية حسب الصفحة ==========
function getPageThemeColor() {
    const path = window.location.pathname;
    if (path.includes('spices.html')) {
        return '#b87333'; // لون بني للبهارات
    } else if (path.includes('care.html') || path.includes('personal-care.html')) {
        return '#c77d9b'; // لون وردي للعناية
    } else {
        return '#2c5f2d'; // الأخضر الأساسي للموقع
    }
}
    function getShareData() {
        const url = window.location.href;
        let title = document.title;
        let text = '';

        // تحليل الصفحة الحالية
        if (url.includes('index.html') || url === window.location.origin + '/' || url.endsWith('/')) {
            text = '🌿 اكتشف عالم الطبيعة مع Elixir – أعشاب وزيوت طبيعية ومستحضرات ورد فاخرة. تسوق الآن واستشر ذكاءنا الاصطناعي مجاناً.';
            title = 'Elixir | جوهر الطبيعة بروح فلسطينية';
        } 
        else if (url.includes('herbs.html')) {
            text = '🌱 استكشف تشكيلتنا من الأعشاب الطبية الطبيعية في Elixir – نقاء وجودة من فلسطين.';
            title = 'Elixir | الأعشاب الطبيعية';
        }
        else if (url.includes('oils.html')) {
            text = '💧 تشكيلة الزيوت الطبيعية والعطرية في Elixir – مستخرجة بعناية لتغذية بشرتك وشعرك.';
            title = 'Elixir | الزيوت الطبيعية والعطرية';
        }
        else if (url.includes('spices.html')) {
            text = '🧂 بهارات Elixir – نكهات عالمية بلمسة فلسطينية أصلية.';
            title = 'Elixir | البهارات';
        }
        else if (url.includes('care.html') || url.includes('personal-care.html')) {
            text = '🌸 العناية بالبشرة والشعر بمستحضرات الورد الطبيعية – منتجات طبيعية وآمنة لجميع أنواع البشرة.';
            title = 'Elixir | العناية الشخصية ومستحضرات الورد';
        }
        else if (url.includes('packages.html')) {
            text = '🎁 باقات Elixir الحصرية – مجموعة متكاملة من منتجاتنا الطبيعية بأفضل الأسعار.';
            title = 'Elixir | البكجيات الحصرية';
        }
        else if (url.includes('product-details.html')) {
            const productName = document.querySelector('h1')?.innerText || document.querySelector('.product-name')?.innerText || document.querySelector('.oil-title')?.innerText || 'منتج Elixir';
            text = `🛍️ اكتشف منتج "${productName}" على Elixir – طبيعي 100% وجودة عالية.`;
            title = `Elixir | ${productName}`;
        }
        else if (url.includes('aboutelixir.html')) {
            text = '📖 تعرف على قصة Elixir – منصة تجمع بين التراث الفلسطيني في التداوي بالأعشاب وأحدث تقنيات الذكاء الاصطناعي.';
            title = 'Elixir | عن إكسير';
        }
        else if (url.includes('policies.html')) {
            text = '📜 سياسات Elixir – استبدال خلال 24 ساعة، استرجاع ممنوع، توصيل سريع، وخصوصية آمنة.';
            title = 'Elixir | سياسات المتجر';
        }
        else {
            text = '✨ تسوق أفضل المنتجات الطبيعية على Elixir – أعشاب، زيوت، ورد، وعطور.';
            title = 'Elixir | متجر الطبيعة';
        }

        return { title, text, url };
    }

    function createShareButton() {
        // منع ظهور الزر في صفحات معينة
        const excludePages = ['cart.html', 'wholesale-cart.html', 'checkout.html', 'wholesale-checkout.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (excludePages.includes(currentPage)) return;

        if (document.querySelector('.share-fixed-btn')) return;
        
        const btn = document.createElement('button');
        btn.className = 'share-fixed-btn';
        btn.innerHTML = '<i class="fas fa-share-alt"></i>';
        btn.setAttribute('aria-label', 'مشاركة');
        btn.style.display = 'none'; // إخفاء الزر عند بداية الصفحة
        document.body.appendChild(btn);
        const themeColor = getPageThemeColor();
           btn.style.backgroundColor = themeColor;
        btn.addEventListener('click', async () => {
            const { title, text, url } = getShareData();
            const shareData = { title, text, url };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        fallbackShare(text, url);
                    }
                }
            } else {
                fallbackShare(text, url);
            }
        });

        // ظهور الزر عند التمرير لأسفل
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    function fallbackShare(text, url) {
        const fullMessage = `${text}\n\n🔗 ${url}`;
        prompt('📋 انسخ الرابط والمحتوى وشاركه:', fullMessage);
    }

    // زر المشاركة يظهر بعد تحميل الصفحة
    createShareButton();
})();