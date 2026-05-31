// search-modal.js
function normalizeText(text) {
    return text.toLowerCase()
        .replace(/ة/g, "ه")
        .replace(/أ/g, "ا")
        .replace(/إ/g, "ا")
        .replace(/آ/g, "ا")
        .replace(/ى/g, "ي");
}

const corrections = [
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

function getCorrection(query) {
    const normalized = normalizeText(query);
    for (let cor of corrections) {
        if (normalized.includes(cor.wrong)) {
            return { correct: cor.correct, category: cor.category };
        }
    }
    return null;
}

function renderSearchResults(searchTerm) {
    const resultsDiv = document.getElementById('searchResults');
    if (!searchTerm || searchTerm.trim() === "") {
        resultsDiv.innerHTML = '<div class="no-results">✨ ابدأ كتابة كلمة للبحث</div>';
        return;
    }

    const normalizedTerm = normalizeText(searchTerm);
    let filtered = allProductsForSearch.filter(p => {
        let inName = normalizeText(p.name).includes(normalizedTerm);
        let inCategory = normalizeText(p.category).includes(normalizedTerm);
        let inKeywords = p.keywords && p.keywords.some(k => normalizeText(k).includes(normalizedTerm));
        return inName || inCategory || inKeywords;
    });

    const correction = getCorrection(searchTerm);
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
                    <div class="result-price">${p.price} ₪</div>
                </div>
            `;
        });
    }

    resultsDiv.innerHTML = html;

    document.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = item.dataset.link;
        });
    });
    document.querySelectorAll('.suggestion-text').forEach(sugg => {
        sugg.addEventListener('click', () => {
            const input = document.getElementById('searchInput');
            if (input) {
                input.value = sugg.dataset.suggest;
                renderSearchResults(sugg.dataset.suggest);
            }
        });
    });
}

function openSearchModal() {
    const overlay = document.getElementById('searchModalOverlay');
    if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => {
            const input = document.getElementById('searchInput');
            if (input) input.focus();
        }, 100);
    }
}

function closeSearchModal() {
    const overlay = document.getElementById('searchModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        const input = document.getElementById('searchInput');
        if (input) {
            input.value = '';
        }
        const results = document.getElementById('searchResults');
        if (results) {
            results.innerHTML = '<div class="no-results">✨ ابدأ كتابة كلمة للبحث</div>';
        }
    }
}

// ربط الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    if (input) {
        // البحث أثناء الكتابة
        input.addEventListener('input', (e) => {
            renderSearchResults(e.target.value);
        });
        // البحث عند الضغط على Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderSearchResults(input.value);
            }
        });
    }
    
    const closeBtn = document.getElementById('closeSearchBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSearchModal);
    }
    
    const overlay = document.getElementById('searchModalOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSearchModal();
        });
    }
});

// جعل الدوال متاحة عالمياً
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;