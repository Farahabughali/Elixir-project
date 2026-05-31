// wholesale-search-modal.js - نفس نظام بحث الرئيسية بالضبط
function normalizeText(text) {
    if (!text) return "";
    return text.toString().toLowerCase()
        .replace(/ة/g, "ه")
        .replace(/أ/g, "ا")
        .replace(/إ/g, "ا")
        .replace(/آ/g, "ا")
        .replace(/ى/g, "ي");
}

const wholesaleCorrections = [
   { wrong: "زبت", correct: "زيت", category: "زيوت" },
    { wrong: "لندر", correct: "لافندر", category: "زيوت" },
    { wrong: "ورد جوري", correct: "زيت الورد الجوري", category: "زيوت" },
    { wrong: "بابنج", correct: "بابونج", category: "أعشاب" },
    { wrong: "زعتره", correct: "زعتر", category: "أعشاب" },
    { wrong: "بهر", correct: "بهارات", category: "بهارات" },
    { wrong: "صبون", correct: "صابون", category: "عناية" },
    { wrong: "غسيل", correct: "غسول", category: "عناية" },
    { wrong: "افريقي", correct: "الصابونة الافريقية", category: "عناية" },
    { wrong: "مردقوش", correct: "البردقوش", category: "أعشاب" },
    { wrong: "قزحه", correct: "الحبة السوداء", category: "أعشاب" },
    { wrong: "قزحة", correct: "الحبة السوداء", category: "أعشاب" },
    { wrong: "حبة البركة", correct: "الحبة السوداء", category: "أعشاب" },
    { wrong: "جنزبيل", correct: "الزنجبيل", category: "أعشاب" },
    { wrong: "الروزماري", correct: "زيت إكليل الجبل", category: "زيوت" },
    { wrong: "مرمية", correct: "زيت الميرمية", category: "زيوت" }


];

function getWholesaleCorrection(query) {
    const normalized = normalizeText(query);
    for (let cor of wholesaleCorrections) {
        if (normalized.includes(cor.wrong)) {
            return { correct: cor.correct, category: cor.category };
        }
    }
    return null;
}

function renderWholesaleSearchResults(searchTerm) {
    const resultsDiv = document.getElementById('wholesaleSearchResults');
    if (!resultsDiv) return;
    
    if (!searchTerm || searchTerm.trim() === "") {
        resultsDiv.innerHTML = '<div class="no-results">✨ ابدأ كتابة كلمة للبحث في متجر الجملة</div>';
        return;
    }

    // تأكدي إن البيانات موجودة
    if (typeof wholesaleSearchData === 'undefined') {
        resultsDiv.innerHTML = '<div class="no-results">❌ بيانات البحث لم يتم تحميلها</div>';
        console.error('wholesaleSearchData is not defined');
        return;
    }

    const normalizedTerm = normalizeText(searchTerm);
    let filtered = wholesaleSearchData.filter(p => {
        let inName = normalizeText(p.name).includes(normalizedTerm);
        let inCategory = normalizeText(p.category).includes(normalizedTerm);
        let inKeywords = p.keywords && p.keywords.some(k => normalizeText(k).includes(normalizedTerm));
        return inName || inCategory || inKeywords;
    });

    const correction = getWholesaleCorrection(searchTerm);
    let html = '';

    if (correction && filtered.length === 0) {
        html += `<div class="suggestion-text" data-suggest="${correction.correct}" data-cat="${correction.category}">
                    🤔 هل تقصد: <strong>${correction.correct}</strong>؟
                 </div>`;
    }

    if (filtered.length === 0 && !correction) {
        html += '<div class="no-results">❌ لا توجد نتائج. حاول كلمة أخرى مثل: لافندر، بابونج، زعتر</div>';
    } else {
        filtered.forEach(p => {
            html += `
                <div class="result-item" data-link="${p.link}">
                    <img class="result-img" src="${p.img}" alt="${p.name}" onerror="this.src='asset/images/placeholder.png'">
                    <div class="result-info">
                        <div class="result-name">${p.name}</div>
                        <div class="result-cat">${p.category}</div>
                    </div>
                    <div class="result-price">${p.price} ₪ (جملة)</div>
                </div>
            `;
        });
    }

    resultsDiv.innerHTML = html;

    document.querySelectorAll('#wholesaleSearchResults .result-item').forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = item.dataset.link;
        });
    });
    document.querySelectorAll('#wholesaleSearchResults .suggestion-text').forEach(sugg => {
        sugg.addEventListener('click', () => {
            const input = document.getElementById('wholesaleSearchInput');
            if (input) {
                input.value = sugg.dataset.suggest;
                renderWholesaleSearchResults(sugg.dataset.suggest);
            }
        });
    });
}

function openWholesaleSearchModal() {
    const modal = document.getElementById('wholesaleSearchModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        setTimeout(() => {
            const input = document.getElementById('wholesaleSearchInput');
            if (input) input.focus();
        }, 100);
    } else {
        console.error('Modal not found');
    }
}

function closeWholesaleSearchModal() {
    const overlay = document.getElementById('wholesaleSearchModal');
    if (overlay) {
        overlay.classList.remove('active');
        const input = document.getElementById('wholesaleSearchInput');
        if (input) {
            input.value = '';
        }
        const results = document.getElementById('wholesaleSearchResults');
        if (results) {
            results.innerHTML = '<div class="no-results">✨ ابدأ كتابة كلمة للبحث في متجر الجملة</div>';
        }
    }
}

// ربط الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('wholesaleSearchInput');
    if (input) {
        input.addEventListener('input', (e) => {
            renderWholesaleSearchResults(e.target.value);
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderWholesaleSearchResults(input.value);
            }
        });
    }
    
    const closeBtn = document.getElementById('closeWholesaleSearchBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeWholesaleSearchModal);
    }
    
    const overlay = document.getElementById('wholesaleSearchModal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeWholesaleSearchModal();
        });
    }
});

// جعل الدوال متاحة عالمياً
window.openWholesaleSearchModal = openWholesaleSearchModal;
window.closeWholesaleSearchModal = closeWholesaleSearchModal;

console.log('✅ wholesale-search-modal.js loaded - نفس نظام بحث الرئيسية');