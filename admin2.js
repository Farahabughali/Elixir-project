
// ---------- البيانات الأساسية ----------
let products = [];
let packagesList = [];
let employees = [];
let wholesalers = [];
let orders = [];

// ---------- البيانات الجديدة ----------
let categories = [];
let offers = [];
let settings = {};
let wholesaleProductsList = [];

// ========== إدارة طلبات التوظيف ==========
let careersApplications = [];
let currentCareerFilter = 'all';



// تحميل طلبات التوظيف
function loadCareers() {
    const stored = localStorage.getItem('elixir_careers');
    if (stored) careersApplications = JSON.parse(stored);
    else careersApplications = [];
    renderCareers();
}

// حفظ طلبات التوظيف
function saveCareers() {
    localStorage.setItem('elixir_careers', JSON.stringify(careersApplications));
}

// إضافة طلب توظيف جديد (يُستدعى من صفحة التقديم)
function addCareerApplication(application) {
    application.id = Date.now();
    application.status = 'new';
    application.date = new Date().toISOString();
    careersApplications.unshift(application); // الأحدث أولاً
    saveCareers();
    renderCareers();
    showToast(`✅ تم استلام طلب التوظيف من ${application.name}`, "success");
}

// عرض طلبات التوظيف
function renderCareers() {
    const container = document.getElementById('careersContainer');
    const noMsg = document.getElementById('noCareersMessage');
    if (!container) return;
    
    let filtered = careersApplications;
    if (currentCareerFilter !== 'all') {
        filtered = careersApplications.filter(app => app.jobType === currentCareerFilter);
    }
    
    if (filtered.length === 0) {
        if (noMsg) noMsg.classList.remove('hidden');
        container.innerHTML = '';
        return;
    }
    
    if (noMsg) noMsg.classList.add('hidden');
    
    const jobTypeNames = {
        'content': '🎥 مقدمة محتوى',
        'packaging': '📦 تعبئة وتغليف',
        'orders': '🛒 تجهيز الطلبات',
        'other': '📢 وظائف أخرى'
    };
    
    const statusNames = {
        'new': '🆕 جديد',
        'reviewing': '👀 قيد المراجعة',
        'accepted': '✅ مقبول',
        'rejected': '❌ مرفوض'
    };
    
    const statusColors = {
        'new': 'bg-blue-100 text-blue-700',
        'reviewing': 'bg-yellow-100 text-yellow-700',
        'accepted': 'bg-green-100 text-green-700',
        'rejected': 'bg-red-100 text-red-700'
    };
    
    let html = '';
    for (let app of filtered) {
        // عرض الملفات المرفوعة إذا وجدت
        let attachmentsHtml = '';
        if (app.videoUrl) {
            attachmentsHtml += `<a href="${app.videoUrl}" target="_blank" class="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-xl text-xs ml-2"><i class="fas fa-video ml-1"></i> مشاهدة الفيديو</a>`;
        }
        if (app.portfolioUrl) {
            attachmentsHtml += `<a href="${app.portfolioUrl}" target="_blank" class="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-xl text-xs"><i class="fas fa-image ml-1"></i> معرض الأعمال</a>`;
        }
        
        html += `
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-5">
                    <div class="flex flex-wrap justify-between items-start gap-3 pb-3 mb-3 border-b border-slate-100">
                        <div>
                            <span class="text-elixir font-bold text-lg">📋 ${app.name}</span>
                            <span class="text-sm text-slate-400 mr-3"><i class="fas fa-calendar-alt ml-1"></i> ${new Date(app.date).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status]}">${statusNames[app.status]}</span>
                            <select onchange="updateCareerStatus(${app.id}, this.value)" class="text-xs border rounded-lg p-1 bg-white">
                                <option value="new" ${app.status === 'new' ? 'selected' : ''}>🆕 جديد</option>
                                <option value="reviewing" ${app.status === 'reviewing' ? 'selected' : ''}>👀 قيد المراجعة</option>
                                <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>✅ مقبول</option>
                                <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>❌ مرفوض</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fas fa-user ml-1"></i> الاسم</p>
                            <p class="font-bold text-slate-700">${app.name}</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fas fa-calendar ml-1"></i> العمر</p>
                            <p class="font-bold text-slate-700">${app.age || 'غير محدد'}</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fas fa-map-marker-alt ml-1"></i> المدينة</p>
                            <p class="font-bold text-slate-700">${app.city || 'غير محدد'}</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fas fa-briefcase ml-1"></i> نوع الوظيفة</p>
                            <p class="font-bold text-slate-700">${jobTypeNames[app.jobType] || app.jobType}</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fas fa-star ml-1"></i> المهارات</p>
                            <p class="font-bold text-slate-700">${app.skills || 'غير محددة'}</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fas fa-phone ml-1"></i> رقم الهاتف</p>
                            <p class="font-bold text-slate-700 dir-ltr">${app.phone || 'غير محدد'}</p>
                        </div>
                        ${app.instagram ? `<div class="bg-slate-50 p-3 rounded-xl">
                            <p class="text-xs text-slate-400 mb-1"><i class="fab fa-instagram ml-1"></i> إنستغرام</p>
                            <p class="font-bold text-slate-700">${app.instagram}</p>
                        </div>` : ''}
                    </div>
                    
                    ${app.message ? `
                    <div class="bg-slate-50 p-3 rounded-xl mb-4">
                        <p class="text-xs text-slate-400 mb-1"><i class="fas fa-comment ml-1"></i> رسالة إضافية</p>
                        <p class="text-slate-600 text-sm">${app.message}</p>
                    </div>
                    ` : ''}
                    
                    ${attachmentsHtml ? `
                    <div class="bg-slate-50 p-3 rounded-xl mb-4">
                        <p class="text-xs text-slate-400 mb-1"><i class="fas fa-paperclip ml-1"></i> المرفقات</p>
                        <div class="flex flex-wrap gap-2">${attachmentsHtml}</div>
                    </div>
                    ` : ''}
                    
                    <div class="flex justify-end gap-3 mt-3 pt-2 border-t border-slate-100">
                        <button onclick="deleteCareer(${app.id})" class="text-red-500 hover:text-red-700 text-sm">
                            <i class="fas fa-trash-alt ml-1"></i> حذف الطلب
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// تحديث حالة الطلب
function updateCareerStatus(id, newStatus) {
    const app = careersApplications.find(a => a.id === id);
    if (app) {
        app.status = newStatus;
        saveCareers();
        renderCareers();
        showToast(`✅ تم تحديث حالة الطلب`, "success");
    }
}

// حذف طلب
function deleteCareer(id) {
    customConfirm("هل تريد حذف هذا الطلب نهائياً؟", () => {
        careersApplications = careersApplications.filter(a => a.id !== id);
        saveCareers();
        renderCareers();
        showToast("🗑️ تم حذف الطلب", "success");
    });
}

// فلتر الطلبات
function filterCareers(type) {
    currentCareerFilter = type;
    renderCareers();
    
    // تحديث شكل أزرار الفلتر
    document.querySelectorAll('.filter-career-btn').forEach(btn => {
        btn.classList.remove('bg-elixir', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    const activeBtn = document.querySelector(`.filter-career-btn[onclick="filterCareers('${type}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
        activeBtn.classList.add('bg-elixir', 'text-white');
    }
}

// تحديث الطلبات
function refreshCareers() {
    loadCareers();
    showToast("🔄 تم تحديث طلبات التوظيف", "success");
}

// تصدير إلى Excel
function exportCareersToExcel() {
    let data = [['الاسم', 'العمر', 'المدينة', 'نوع الوظيفة', 'المهارات', 'رقم الهاتف', 'إنستغرام', 'الحالة', 'تاريخ التقديم']];
    careersApplications.forEach(app => {
        data.push([
            app.name,
            app.age || '',
            app.city || '',
            app.jobType || '',
            app.skills || '',
            app.phone || '',
            app.instagram || '',
            app.status || '',
            new Date(app.date).toLocaleDateString('ar-EG')
        ]);
    });
    
    let csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `careers_applications_${new Date().toISOString().slice(0,19)}.csv`;
    link.click();
    URL.revokeObjectURL(link);
    showToast("📊 تم تصدير الطلبات إلى Excel", "success");
}




// دالة لتحديد ألوان البكجات حسب الفئة
function getPackageColorsByCategory(category) {
    const colorMap = {
        'نشاط': { bg: '#fff3e0', btn: '#ef6c00' },
        'ورد': { bg: '#fce4ec', btn: '#c2185b' },
        'بهارات': { bg: '#efebe9', btn: '#8d6e63' },
        'نضارة': { bg: '#e0f7fa', btn: '#00838f' },
        'هدوء': { bg: '#e8eaf6', btn: '#3949ab' },
        'عناية': { bg: '#ffe0f0', btn: '#d81b60' },
        'شفاء': { bg: '#e0f2e0', btn: '#43a047' },
        'شعر': { bg: '#fef3e8', btn: '#c47a3a' }
    };
    return colorMap[category] || { bg: '#ffffff', btn: '#438e56' };
}

// ---------- تحميل البيانات ----------
// ---------- تحميل البيانات ----------
async function loadAllData() {
    // ✅ أولاً: تحميل المنتجات من قاعدة البيانات (انتظر حتى تنتهي)
    await loadProductsFromDatabase();
    console.log("✅ تم تحميل المنتجات من DB:", products.length);

     updateCategoryChart();  
    
    
    // باقي التحميلات من localStorage
    const storedPackages = localStorage.getItem('elixir_packages');
    const storedEmployees = localStorage.getItem('elixir_employees');
    const storedWholesalers = localStorage.getItem('elixir_wholesalers');
    const storedOrders = localStorage.getItem('elixir_orders');
    const storedCategories = localStorage.getItem('elixir_categories');
    const storedOffers = localStorage.getItem('elixir_offers');
    const storedSettings = localStorage.getItem('elixir_settings');
    loadCareers();

    // تحميل المجموعات
    if (storedPackages) packagesList = JSON.parse(storedPackages);
    else packagesList = [
        { id: 101, name: "مجموعة الاسترخاء التام", price: 15.0, description: "لافندر، زيت الأرغان، شمعة", itemsCount: 3, active: true, featured: false, image: "", longDescription: "", category: "نشاط", bgColor: "#fff3e0", btnColor: "#ef6c00" },
        { id: 102, name: "مجموعة النضارة المغربية", price: 22.0, description: "طين مغربي، ليفة، صابون", itemsCount: 4, active: true, featured: false, image: "", longDescription: "", category: "نضارة", bgColor: "#e0f7fa", btnColor: "#00838f" }
    ];

    // تحميل الموظفين
    if (storedEmployees) employees = JSON.parse(storedEmployees);
    else employees = [
        { id: 101, name: "سارة أحمد", role: "مديرة المخزون", tasks: [] },
        { id: 102, name: "محمد خالد", role: "مسؤول التغليف", tasks: [] }
    ];

    // تحميل تجار الجملة
    if (storedWholesalers) wholesalers = JSON.parse(storedWholesalers);
    else wholesalers = [];

    // تحميل الطلبات
    if (storedOrders) orders = JSON.parse(storedOrders);
    else {
        orders = [
            { id: 1001, customer: "ريما الحسن", items: [{name: "لافندر مجفف", qty: 2, price: 5.0}], total: 10.0, date: "2025-04-01", status: "pending", assignedTo: null },
            { id: 1002, customer: "ليلى عرفات", items: [{name: "زيت الأرغان", qty: 1, price: 12.5}], total: 12.5, date: "2025-04-02", status: "processing", assignedTo: null },
            { id: 1003, customer: "نور الشرق", items: [{name: "صابون الغار", qty: 3, price: 4.0}], total: 12.0, date: "2025-04-03", status: "shipped", assignedTo: null },
        ];
    }

    // تحميل الفئات
  // تحميل الفئات (ثابتة - لا تتغير)
categories = [
    { id: 1, name: "أعشاب طبيعية", icon: "fa-leaf" },
    { id: 2, name: "زيوت مركزة", icon: "fa-oil-can" },
    { id: 3, name: "منتجات عناية", icon: "fa-heart" },
    { id: 4, name: "بهارات", icon: "fa-mortar-pestle" }
];
// تجاهل storedCategories نهائياً

    // تحميل العروض
    if (storedOffers) offers = JSON.parse(storedOffers);
    else offers = [];

    // تحميل السلايدر
    if (storedSliders) sliders = JSON.parse(storedSliders);
    else sliders = [];

    // تحميل الإعدادات
    if (storedSettings) settings = JSON.parse(storedSettings);
    else settings = {
        returnPolicy: "",
        termsOfUse: "",
        privacyPolicy: ""
    };
    
    updateAllCategoriesDropdowns();
    loadWholesaleProductsList();
    
    // عرض باقي الجداول
    renderPackages();
    renderEmployeesCards();
    renderWholesalers();
    renderOrdersCards();
    renderOffers();
    loadSettings();
}

// ========== حساب المنتجات الأكثر مبيعاً من الطلبات ==========
function getBestSellingProductsFromOrders(limit = 5) {
    // قاموس لتجميع الكميات المباعة لكل منتج
    let salesMap = new Map();
    
    // المرور على جميع الطلبات
    orders.forEach(order => {
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const productName = item.name;
                const quantity = item.qty || item.quantity || 1;
                
                if (salesMap.has(productName)) {
                    salesMap.set(productName, salesMap.get(productName) + quantity);
                } else {
                    salesMap.set(productName, quantity);
                }
            });
        }
    });
    
    // تحويل الخريطة إلى مصفوفة وترتيبها تنازلياً حسب الكمية
    let sortedProducts = Array.from(salesMap.entries())
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
    
    return sortedProducts;
}

// ---------- حفظ البيانات ----------
function saveAllData() {
    localStorage.setItem('elixir_products', JSON.stringify(products));
    localStorage.setItem('elixir_packages', JSON.stringify(packagesList));
    localStorage.setItem('elixir_employees', JSON.stringify(employees));
    localStorage.setItem('elixir_wholesalers', JSON.stringify(wholesalers));
    localStorage.setItem('elixir_orders', JSON.stringify(orders));
    localStorage.setItem('elixir_categories', JSON.stringify(categories));
    localStorage.setItem('elixir_offers', JSON.stringify(offers));
    localStorage.setItem('elixir_settings', JSON.stringify(settings));
    localStorage.setItem('elixir_shipping', JSON.stringify(shippingCompanies));
    localStorage.setItem('elixir_activity_log', JSON.stringify(activityLog));
}

// ---------- رسائل التنبيه والتأكيد ----------
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    const bgClass = type === 'success' ? 'toast-modern bg-[#1e3a2c]' : 'toast-modern bg-red-800';
    toast.className = `${bgClass} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md`;
    toast.innerHTML = `<i class="fas ${icon} text-lg"></i><span class="font-bold text-sm">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function customConfirm(message, onConfirm, onCancel) {
    const existingOverlay = document.querySelector('.custom-confirm-overlay');
    if (existingOverlay) existingOverlay.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] custom-confirm-overlay';
    overlay.innerHTML = `
        <div class="bg-white rounded-3xl p-8 w-96 text-center shadow-2xl transform transition-all duration-200 scale-95">
            <div class="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-exclamation-triangle text-amber-500 text-3xl"></i>
            </div>
            <p class="text-slate-700 font-bold text-lg mb-6">${message}</p>
            <div class="flex gap-4">
                <button id="confirmYes" class="flex-1 bg-elixir text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all duration-200 shadow-md">نعم</button>
                <button id="confirmNo" class="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all duration-200">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    const modalContent = overlay.querySelector('.bg-white');
    setTimeout(() => {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
    
    const yesBtn = overlay.querySelector('#confirmYes');
    const noBtn = overlay.querySelector('#confirmNo');
    
    yesBtn.onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    noBtn.onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    };
}

// ---------- عرض المنتجات ----------
// ---------- عرض المنتجات ----------
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    products.forEach(prod => {
        // تأكد أن السعر رقم
        if (typeof prod.price !== 'number') {
            prod.price = parseFloat(prod.price) || 0;
        }
        const catClass = prod.category === 'أعشاب طبيعية' ? 'bg-emerald-50 text-elixir' : (prod.category === 'زيوت مركزة' ? 'bg-blue-50 text-blue-500' : (prod.category === 'منتجات عناية' ? 'bg-purple-50 text-purple-500' : 'bg-orange-50 text-orange-600'));
        const warningHtml = prod.warnings ? `<span class="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">${prod.warnings}</span>` : '-';
        const stockClass = prod.stock <= 0 ? 'text-red-600 font-bold' : (prod.stock < 5 ? 'text-amber-600' : 'text-green-700');
        
        const hasImage = prod.image && prod.image !== "";
const imageHtml = hasImage 
    ? `<img src="${prod.image}" class="w-12 h-12 object-cover rounded-lg border shadow-sm cursor-pointer hover:opacity-80 transition" onclick="openImagePreview('${prod.image}'); event.stopPropagation();" title="اضغط لتكبير الصورة">` 
    : '<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><i class="fas fa-image"></i></div>';
        
        tbody.insertAdjacentHTML('beforeend', `
            <tr class="border-b hover:bg-slate-50 ${!prod.active ? 'opacity-60 bg-gray-50' : ''}">
               <td class="py-3"><div class="flex items-center gap-3">${imageHtml}<div><div class="font-bold">${prod.name}</div><div class="text-[10px] text-slate-400">${(prod.description || '').substring(0, 60)}</div></div></div></td>
<td><span class="${catClass} px-3 py-1 rounded-xl text-xs">${prod.category}</span></td>
<td>${prod.price.toFixed(2)} ₪</td>
<td class="${stockClass} font-bold">${prod.stock !== undefined ? prod.stock : 0}</td>
<td class="text-left">
   <i class="fas ${prod.active == 1 ? 'fa-eye' : 'fa-eye-slash'} ${prod.active == 1 ? 'text-elixir' : 'text-gray-400'} cursor-pointer ml-2 hover:text-elixir transition" onclick="toggleProductActive(${prod.product_id || prod.id})" title="${prod.active == 1 ? 'تعطيل المنتج' : 'تفعيل المنتج'}"></i>
    
    <i class="fas fa-tag text-blue-500 cursor-pointer ml-2 hover:text-blue-600 transition" onclick="openOfferModalFromAdmin(${prod.id})" title="إضافة إلى العروض 🏷️"></i>
    <i class="fas fa-edit text-slate-500 hover:text-elixir cursor-pointer ml-2" onclick="editProduct(${prod.id})"></i>
    <i class="fas fa-trash-alt text-slate-500 hover:text-red-500 cursor-pointer" onclick="deleteProduct(${prod.id})"></i>
</td>
             </tr>
        `);
    });
    document.getElementById('totalProductsCount').innerText = products.length;
    document.getElementById('outOfStockCounter').innerText = products.filter(p => p.stock === 0).length;
    const totalTasks = employees.reduce((s, e) => s + e.tasks.length, 0);
    document.getElementById('activeTasksCount').innerText = totalTasks;
}

// ---------- عرض الطلبات ----------
function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    orders.forEach(order => {
       // داخل دالة renderOrdersCards، بدل switch الحالي بهذا:
let statusText = '';
let statusClass = '';
switch(order.status) {
    case 'pending': 
        statusText = ' قيد المعالجة'; 
        statusClass = 'bg-yellow-100 text-yellow-700'; 
        break;
    case 'processing': 
        statusText = ' قيد التجهيز'; 
        statusClass = 'bg-blue-100 text-blue-700'; 
        break;
    case 'ready': 
        statusText = ' تم التجهيز'; 
        statusClass = 'bg-green-100 text-green-700'; 
        break;
    case 'shipped': 
        statusText = ' تم الشحن'; 
        statusClass = 'bg-purple-100 text-purple-700'; 
        break;
    case 'delivered': 
        statusText = ' تم التسليم'; 
        statusClass = 'bg-emerald-100 text-emerald-700'; 
        break;
    case 'returned': 
        statusText = '↩ تم الإرجاع'; 
        statusClass = 'bg-red-100 text-red-700'; 
        break;
    default: 
        statusText = '📋 جديد'; 
        statusClass = 'bg-gray-100 text-gray-700';
}
        const itemsSummary = order.items.map(item => `${item.name} (${item.qty})`).join(', ');

        let employeeSelect = `<select onchange="updateOrderAssignment(${order.id}, this.value)" class="text-xs border rounded-lg p-1 bg-white">`;
        employeeSelect += `<option value="">-- غير مسند --</option>`;
        employees.forEach(emp => {
            const selected = (order.assignedTo == emp.id) ? 'selected' : '';
            employeeSelect += `<option value="${emp.id}" ${selected}>${emp.name} (${emp.role})</option>`;
        });
        employeeSelect += `</select>`;

        tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-b hover:bg-slate-50">
                <td class="p-3 font-mono">#${order.id}</td>
                <td class="p-3 font-medium">${order.customer}</td>
                <td class="p-3 text-sm max-w-xs truncate" title="${itemsSummary}">${itemsSummary}</td>
                <td class="p-3 font-bold text-elixir">${order.total.toFixed(2)} ₪</td>
                <td class="p-3">${new Date(order.date).toLocaleDateString('ar-EG')}</td>
                <td class="p-3"><span class="${statusClass} px-3 py-1 rounded-full text-xs font-bold">${statusText}</span></td>
                <td class="p-3 flex gap-2">
                    ${employeeSelect}
                    <button onclick="showOrderDetails(${order.id})" class="text-blue-500 hover:text-blue-700" title="تفاصيل"><i class="fas fa-eye"></i></button>
                    <button onclick="deleteOrder(${order.id})" class="text-red-500 hover:text-red-700" title="حذف الطلب"><i class="fas fa-trash-alt"></i></button>
                </td>
            </table>
        `);
    });
    document.getElementById('ordersCount').innerText = orders.length + ' طلب';
}

function showOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const content = `
        <p><strong>رقم الطلب:</strong> #${order.id}</p>
        <p><strong>العميل:</strong> ${order.customer}</p>
        <p><strong>التاريخ:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
        <p><strong>الحالة:</strong> ${order.status}</p>
        <p><strong>الإجمالي:</strong> ${order.total} ₪</p>
        <hr class="my-3">
        <h4 class="font-bold">المنتجات:</h4>
        <ul class="list-disc mr-5">
            ${order.items.map(item => `<li>${item.name} × ${item.qty} = ${(item.price * item.qty).toFixed(2)} ₪</li>`).join('')}
        </ul>
    `;
    document.getElementById('orderDetailsContent').innerHTML = content;
    document.getElementById('orderDetailsModal').classList.remove('hidden');
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.add('hidden');
}

function exportOrderToPDF() {
    showToast("سيتم تصدير الطلب إلى PDF (ميزة ستُربط مع PHP لاحقاً)", "info");
}

window.updateOrderStatus = function(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveAllData();
        renderOrdersTable();
        showToast(`تم تحديث حالة الطلب #${orderId} إلى ${newStatus}`, "success");
    }
};

window.updateOrderAssignment = function(orderId, employeeId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const empId = employeeId ? parseInt(employeeId) : null;
        order.assignedTo = empId;
        saveAllData();
        renderOrdersTable();
        const empName = empId ? (employees.find(e => e.id === empId)?.name || 'موظف') : 'غير مسند';
        showToast(`تم تعيين الطلب #${orderId} إلى ${empName}`, "success");
    }
};

window.deleteOrder = function(orderId) {
    customConfirm("هل تريد حذف هذا الطلب نهائياً؟", () => {
        orders = orders.filter(o => o.id !== orderId);
        saveAllData();
        renderOrdersTable();
        showToast("تم حذف الطلب", "success");
    });
};

// ---------- دوال المنتجات ----------
function openProductModal(productId = null) {
     updateAllCategoriesDropdowns();
    const modal = document.getElementById('productModal');
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) previewContainer.classList.add('hidden');
    const fileInput = document.getElementById('productImage');
    if (fileInput) fileInput.value = '';
    
    if (productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            document.getElementById('modalTitle').innerText = "تعديل المنتج";
            document.getElementById('editProductId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productUsage').value = product.usage || '';
            document.getElementById('productWarnings').value = product.warnings || '';
            document.getElementById('productDescription').value = product.description || '';
            // تعبئة التصنيف الفرعي للمنتج عند التعديل
           const subCategorySelect = document.getElementById('productSubCategory');
          if (subCategorySelect && product.subCategory) {
           subCategorySelect.value = product.subCategory;
            }
            if (previewContainer && product.image && product.image.startsWith('data:image')) {
                const imgPreview = document.getElementById('imagePreview');
                if (imgPreview) imgPreview.src = product.image;
                previewContainer.classList.remove('hidden');
            }
        }
    } else {
        document.getElementById('modalTitle').innerText = "إضافة منتج جديد";
        document.getElementById('editProductId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = categories.length > 0 ? categories[0].name : '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productStock').value = 10;
        document.getElementById('productUsage').value = '';
        document.getElementById('productWarnings').value = '';
        if (previewContainer) {
            document.getElementById('imagePreview').src = '';
            previewContainer.classList.add('hidden');
        }
    }
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

async function saveProduct() {
    const saveButton = document.querySelector('#productModal button.bg-elixir');
    if (saveButton.disabled) return;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i> جاري الحفظ...';
    
    try {
        const id = document.getElementById('editProductId').value;
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value) || 0;
        const usage = document.getElementById('productUsage').value;
        const warnings = document.getElementById('productWarnings').value;
        const description = document.getElementById('productDescription').value;
        
        let imageBase64 = '';
        const fileInput = document.getElementById('productImage');
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            imageBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        } else if (id) {
            const existingProduct = products.find(p => p.id == id);
            if (existingProduct && existingProduct.image) imageBase64 = existingProduct.image;
        }

        if (!name || isNaN(price)) {
            showToast("يرجى إدخال اسم المنتج وسعر صحيح", "error");
            saveButton.disabled = false;
            saveButton.innerHTML = 'حفظ';
            return;
        }

        // 🔥 هنا التصحيح: if واحد فقط
        if (id) {
            // تعديل منتج موجود
            const response = await fetch('api/update_product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    product_name: name,
                    price: price,
                    category: category,
                    stock: stock,
                    image: imageBase64,
                    description: description,
                    usageinstructions: usage,
                    medical_warning: warnings
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast("✅ تم تحديث المنتج", "success");
                await loadProductsFromDatabase();
                renderProductsTable();
                refreshStats();
                closeProductModal();
            } else {
                showToast("❌ خطأ في التحديث: " + result.error, "error");
            }
        } else {
            // إضافة منتج جديد
            const response = await fetch('api/add_product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: name,
                    price: price,
                    category: category,
                    stock: stock,
                    image: imageBase64,
                    description: description,
                    usageinstructions: usage,
                    medical_warning: warnings
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast(`✅ تم إضافة "${name}" إلى قاعدة البيانات`, "success");
                
                await loadProductsFromDatabase();
                renderProductsTable();
                refreshStats();
                updateAllCategoriesDropdowns();
                
                // ✅ إضافة المنتج إلى جديدنا تلقائياً (لمدة 7 أيام)
                let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals') || '[]');
                
                let section = "herbs";
                let catText = "منتج طبيعي";
                if (category === "أعشاب طبيعية") { section = "herbs"; catText = "عشبة طبية"; }
                else if (category === "زيوت مركزة") { section = "oils"; catText = "زيت عطري"; }
                else if (category === "بهارات") { section = "spices"; catText = "بهارات عربية"; }
                else if (category === "منتجات عناية") { section = "care"; catText = "عناية شخصية"; }
                
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 7);
                
                newArrivals.push({
                    id: result.id,
                    name: name,
                    price: price,
                    img: imageBase64 || "asset/images/placeholder.png",
                    category: category,
                    section: section,
                    catText: catText,
                    desc: description || usage || "منتج طبيعي 100%",
                    addedAt: new Date().toISOString(),
                    expiryDate: expiryDate.toISOString()
                });
                
                localStorage.setItem('elixir_new_arrivals', JSON.stringify(newArrivals));
                showToast(`✅ تم إضافة "${name}" إلى جديدنا لمدة 7 أيام ✨`, "success");
                
                closeProductModal();
            } else {
                showToast("❌ خطأ: " + (result.error || "لم يتم إضافة المنتج"), "error");
            }
        }
        
    } catch (error) {
        console.error("خطأ:", error);
        showToast("حدث خطأ: " + error.message, "error");
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = 'حفظ';
    }
}


window.editProduct = function(productId) {
    openProductModal(productId);
};

window.deleteProduct = function(productId) {
    customConfirm("⚠️ هل تريد حذف هذا المنتج نهائياً؟", async () => {
        // إظهار loader
        showToast("جاري الحذف...", "info");
        
        try {
            // 1. حذف من قاعدة البيانات
            const response = await fetch('api/delete_product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 2. ✅ حذف العروض المرتبطة من localStorage
                let offers = JSON.parse(localStorage.getItem('elixir_offers') || '[]');
                let filteredOffers = offers.filter(o => o.productId != productId && o.productId != productId);
                localStorage.setItem('elixir_offers', JSON.stringify(filteredOffers));
                console.log(`✅ تم حذف ${offers.length - filteredOffers.length} عرض مرتبط بالمنتج`);
                
                // 3. حذف من جديدنا
                let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals') || '[]');
                let filteredNew = newArrivals.filter(n => n.id != productId);
                localStorage.setItem('elixir_new_arrivals', JSON.stringify(filteredNew));
                
                // 4. إعادة تحميل المنتجات وعرض الجدول
                await loadProductsFromDatabase();
                renderProductsTable();
                refreshStats();
                
                showToast(`✅ تم حذف المنتج وجميع عروضه بنجاح`, "success");
                addToActivityLog(`تم حذف المنتج رقم ${productId} وجميع عروضه`);
                
                // 5. ✅ تحديث صفحة العروض إذا كانت مفتوحة (اختياري)
                if (typeof renderOffers === 'function') {
                    renderOffers();
                }
            } else {
                showToast("❌ خطأ في الحذف: " + result.error, "error");
            }
        } catch(err) {
            console.error("خطأ:", err);
            showToast("❌ خطأ في الاتصال بالخادم", "error");
        }
    });
};


// ========== إدارة المنتجات الأكثر مبيعاً ==========
let bestSellingProducts = [];

function loadBestSelling() {
    const stored = localStorage.getItem('elixir_best_selling_products');
    if (stored) bestSellingProducts = JSON.parse(stored);
    else bestSellingProducts = [];
    renderBestSellingList();
}

function saveBestSelling() {
    localStorage.setItem('elixir_best_selling_products', JSON.stringify(bestSellingProducts));
}

// إضافة منتج إلى قائمة الأكثر مبيعاً
function addToBestSelling(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // التحقق إذا كان المنتج موجود بالفعل
    if (bestSellingProducts.some(p => p.id === productId)) {
        showToast(`المنتج "${product.name}" موجود بالفعل في قائمة الأكثر مبيعاً`, "error");
        return;
    }
    
    bestSellingProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        addedAt: new Date().toISOString()
    });
    
    saveBestSelling();
    renderBestSellingList();
    showToast(`✅ تم إضافة "${product.name}" إلى الأكثر مبيعاً`, "success");
    addToActivityLog(`تم إضافة المنتج "${product.name}" إلى قائمة الأكثر مبيعاً`);
}

// إزالة منتج من قائمة الأكثر مبيعاً
function removeFromBestSelling(productId) {
    const product = bestSellingProducts.find(p => p.id === productId);
    if (!product) return;
    
    customConfirm(`هل تريد إزالة "${product.name}" من قائمة الأكثر مبيعاً؟`, () => {
        bestSellingProducts = bestSellingProducts.filter(p => p.id !== productId);
        saveBestSelling();
        renderBestSellingList();
        showToast(`تم إزالة "${product.name}" من الأكثر مبيعاً`, "success");
        addToActivityLog(`تم إزالة المنتج "${product.name}" من قائمة الأكثر مبيعاً`);
    });
}

function updateBestSellingCount() {
    const countSpan = document.getElementById('bestSellingCount');
    if (countSpan) {
        countSpan.innerText = bestSellingProducts.length;
    }
}

// عرض قائمة الأكثر مبيعاً
function renderBestSellingList() {
    const container = document.getElementById('bestSellingList');
    if (!container) return;
    
    if (bestSellingProducts.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 py-6">لا توجد منتجات في قائمة الأكثر مبيعاً</div>';
        return;
    }
    
    container.innerHTML = bestSellingProducts.map((product, idx) => `
        <div class="flex items-center justify-between bg-gradient-to-r from-amber-50 to-white p-4 rounded-2xl border border-amber-200">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                    <i class="fas fa-trophy"></i>
                </div>
                <div>
                    <p class="font-bold text-elixir">${product.name}</p>
                    <p class="text-sm text-slate-500">${product.price} ₪ | ${product.category || 'غير مصنف'}</p>
                    <p class="text-xs text-slate-400">أضيف في: ${new Date(product.addedAt).toLocaleDateString('ar-EG')}</p>
                </div>
            </div>
            <button onclick="removeFromBestSelling(${product.id})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition">
                <i class="fas fa-trash-alt ml-1"></i> إزالة
            </button>
        </div>
    `).join('');
     updateBestSellingCount();
}


// تبديل حالة الأكثر مبيعاً للمنتج (من زر في جدول المنتجات)
function toggleBestSelling(productId) {
    if (bestSellingProducts.some(p => p.id === productId)) {
        removeFromBestSelling(productId);
    } else {
        addToBestSelling(productId);
    }
}

// التحقق إذا كان المنتج في قائمة الأكثر مبيعاً
function isBestSelling(productId) {
    return bestSellingProducts.some(p => p.id === productId);
}


// ---------- عرض المجموعات ----------
// ---------- عرض المجموعات ----------
// ========== عرض المجموعات - مع زر إضافة للعروض ==========
function renderPackages() {
    const container = document.getElementById('packagesGridContainer');
    if (!container) return;
    if (packagesList.length === 0) { 
        container.innerHTML = '<div class="text-center py-20 text-slate-400">لا توجد مجموعات</div>'; 
        return; 
    }
    
    container.innerHTML = packagesList.map(pkg => `
        <div class="border p-5 rounded-3xl flex gap-5 bg-white package-card ${!pkg.active ? 'opacity-60 bg-gray-100' : ''}">
            <div class="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center overflow-hidden">
                ${pkg.image ? `<img src="${pkg.image}" class="w-full h-full object-cover">` : `<i class="fas fa-gift text-2xl text-elixir"></i>`}
            </div>
            <div class="flex-grow">
                <div class="flex justify-between">
                    <div>
                        <h4 class="font-bold">${pkg.name}</h4>
                        ${pkg.featured ? '<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full mr-2">★ الأكثر مبيعاً</span>' : ''}
                        ${!pkg.active ? '<span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mr-2">غير مفعل</span>' : ''}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="togglePackageFeatured(${pkg.id})" class="text-gray-500 hover:text-yellow-500"><i class="fas fa-${pkg.featured ? 'star' : 'star-o'}"></i></button>
                        <button onclick="togglePackageActive(${pkg.id})" class="${pkg.active ? 'text-green-500' : 'text-gray-400'}"><i class="fas fa-${pkg.active ? 'eye' : 'eye-slash'}"></i></button>
                        <!-- زر إضافة إلى العروض 🏷️ -->
                        <button onclick="openOfferModalForPackage(${pkg.id})" class="text-blue-500 hover:text-blue-600 transition" title="إضافة إلى العروض">
                            <i class="fas fa-tag"></i>
                        </button>
                        <i class="fas fa-edit cursor-pointer hover:text-elixir" onclick="editPackage(${pkg.id})"></i>
                        <i class="fas fa-trash-alt cursor-pointer hover:text-red-500" onclick="deletePackage(${pkg.id})"></i>
                    </div>
                </div>
                <p class="text-xs text-slate-500 mt-2">${pkg.description}</p>
                <div class="mt-3 flex justify-between">
                    <span class="text-[10px] bg-slate-100 px-2 py-1 rounded">${pkg.itemsCount} منتج</span>
                    <span class="text-elixir font-bold">${pkg.price.toFixed(2)} ₪</span>
                </div>
            </div>
        </div>
    `).join('');
}


function togglePackageActive(packageId) {
    const pkg = packagesList.find(p => p.id === packageId);
    if (pkg) {
        pkg.active = !pkg.active;
        
        // ✅ إذا تم التعطيل، احذف العروض وجديدنا المرتبطة بهذا البكج
        if (!pkg.active) {
            // حذف العروض المرتبطة
            let offers = JSON.parse(localStorage.getItem('elixir_offers') || '[]');
            let filteredOffers = offers.filter(o => !(o.productId === packageId && o.section === "packages"));
            localStorage.setItem('elixir_offers', JSON.stringify(filteredOffers));
            
            // حذف من جديدنا
            let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals') || '[]');
            let filteredNew = newArrivals.filter(n => !(n.id === packageId && n.section === "packages"));
            localStorage.setItem('elixir_new_arrivals', JSON.stringify(filteredNew));
            
            showToast(`⛔ تم تعطيل البكج "${pkg.name}" وإزالة عروضه`, "warning");
        } else {
            showToast(`✅ تم تفعيل البكج "${pkg.name}"`, "success");
        }
        
        saveAllData();
        renderPackages();
    }
}

function togglePackageFeatured(packageId) {
    const pkg = packagesList.find(p => p.id === packageId);
    if (pkg) {
        pkg.featured = !pkg.featured;
        saveAllData();
        renderPackages();
        showToast(pkg.featured ? "⭐ تم تعيين البكج كالأكثر مبيعاً" : "✨ تم إزالة البكج من المميزات", "success");
    }
}

function openPackageModal(id = null) {
    const modal = document.getElementById('packageModal');
    const previewContainer = document.getElementById('packageImagePreviewContainer');
    if (previewContainer) previewContainer.classList.add('hidden');
    const fileInput = document.getElementById('packageImage');
    if (fileInput) fileInput.value = '';
    
    if (id) {
        const pkg = packagesList.find(p => p.id === id);
        if (pkg) {
            document.getElementById('packageModalTitle').innerText = "تعديل المجموعة";
            document.getElementById('editPackageId').value = pkg.id;
            document.getElementById('packageName').value = pkg.name;
            document.getElementById('packagePrice').value = pkg.price;
            document.getElementById('packageDesc').value = pkg.description || '';
            document.getElementById('packageLongDesc').value = pkg.longDescription || '';
            document.getElementById('packageItemsCount').value = pkg.itemsCount;
            document.getElementById('packageCategory').value = pkg.category || 'نشاط';
            if (pkg.image && pkg.image.startsWith('data:image')) {
                document.getElementById('packageImagePreview').src = pkg.image;
                previewContainer.classList.remove('hidden');
            }
        }
    } else {
        document.getElementById('packageModalTitle').innerText = "إضافة مجموعة جديدة";
        document.getElementById('editPackageId').value = '';
        document.getElementById('packageName').value = '';
        document.getElementById('packagePrice').value = '';
        document.getElementById('packageDesc').value = '';
        document.getElementById('packageLongDesc').value = '';
        document.getElementById('packageItemsCount').value = '';
        if (previewContainer) {
            document.getElementById('packageImagePreview').src = '';
            previewContainer.classList.add('hidden');
        }
    }
    modal.classList.remove('hidden');
}

function closePackageModal() { document.getElementById('packageModal').classList.add('hidden'); }

async function savePackage() {
    const editId = document.getElementById('editPackageId').value;
    const name = document.getElementById('packageName').value.trim();
    const price = parseFloat(document.getElementById('packagePrice').value);
    const desc = document.getElementById('packageDesc').value.trim();
    const longDesc = document.getElementById('packageLongDesc').value.trim();
    const items = parseInt(document.getElementById('packageItemsCount').value) || 0;
    const category = document.getElementById('packageCategory').value;
    const colors = getPackageColorsByCategory(category);
    const bgColor = colors.bg;
    const btnColor = colors.btn;
    
    let imageBase64 = '';
    const fileInput = document.getElementById('packageImage');
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        imageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    } else if (editId) {
        const existingPkg = packagesList.find(p => p.id == editId);
        if (existingPkg && existingPkg.image) imageBase64 = existingPkg.image;
    }

    if (!name || isNaN(price)) { showToast("يرجى ملء البيانات", "error"); return; }
    
    if (editId) {
        const idx = packagesList.findIndex(p => p.id == editId);
        if (idx !== -1) {
            packagesList[idx] = { 
                ...packagesList[idx], 
                name, 
                price, 
                description: desc, 
                longDescription: longDesc, 
                itemsCount: items, 
                image: imageBase64,
                category: category,
                bgColor: bgColor,
                btnColor: btnColor
            };
            showToast("تم تحديث المجموعة", "success");
        }
    } else {
    const newId = packagesList.length > 0 ? Math.max(...packagesList.map(p => p.id)) + 1 : 101;
    packagesList.push({ 
        id: newId, 
        name, 
        price, 
        description: desc, 
        longDescription: longDesc, 
        itemsCount: items, 
        active: true, 
        featured: false, 
        image: imageBase64, 
        category: category, 
        bgColor: bgColor, 
        btnColor: btnColor,
        addedAt: new Date().toISOString()
    });
    showToast("تمت إضافة المجموعة", "success");
    
    // ✅ إضافة البكج تلقائياً إلى جديدنا
    let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals') || '[]');
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    newArrivals.push({
        id: newId,
        name: name,
        price: price,
        img: imageBase64 || "asset/images/placeholder.png",
        category: category,
        section: "packages",
        catText: "🎁 بكج مميز",
        desc: desc || "بكج متكامل",
        bgColor: bgColor,
        btnColor: btnColor,
        addedAt: new Date().toISOString(),
        expiryDate: expiryDate.toISOString()
    });
    
    localStorage.setItem('elixir_new_arrivals', JSON.stringify(newArrivals));
    showToast(`✅ تم إضافة "${name}" إلى جديدنا تلقائياً ✨`, "success");
}
    
    // هذي أهم سطرين - يحفظون البكج في localStorage عشان يظهر في صفحة البكجات
    localStorage.setItem('elixir_packages', JSON.stringify(packagesList));
    
    renderPackages();
    closePackageModal();
    saveAllData();
}

window.editPackage = function(id) { openPackageModal(id); };
window.deletePackage = function(id) {
    customConfirm("هل تريد حذف هذه المجموعة نهائياً؟", () => {
        packagesList = packagesList.filter(p => p.id !== id);
        renderPackages();
        saveAllData();
        showToast("تم حذف المجموعة", "success");
    });
};

// ---------- عرض الموظفين والمهام ----------
function renderEmployeesCards() {
    const container = document.getElementById('employeesCardsContainer');
    if (!container) return;
    
    if (employees.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 py-10">لا يوجد موظفين، أضف موظف جديد</div>';
        return;
    }
    
    container.innerHTML = employees.map(emp => `
        <div class="bg-slate-50 rounded-3xl p-5 shadow-sm border">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-elixir text-white flex items-center justify-center text-xl">${emp.name[0]}</div>
                    <div>
                        <h4 class="font-bold">${emp.name}</h4>
                        <p class="text-xs text-slate-500">${emp.role}</p>
                        <p class="text-xs text-elixir mt-1" dir="ltr">📧 ${emp.email || 'غير محدد'}</p>
                    </div>
                </div>
                <button onclick="openManualTaskModal(${emp.id})" class="bg-white text-elixir border border-elixir text-xs px-3 py-1 rounded-full hover:bg-elixir hover:text-white transition">
                    <i class="fas fa-plus ml-1"></i> إضافة مهمة
                </button>
            </div>
            <div class="mt-3">
                <div class="bg-amber-50 p-2 rounded-xl mb-2">
                    <p class="text-xs text-amber-700"><i class="fas fa-key ml-1"></i> كلمة المرور: <span dir="ltr">••••••</span></p>
                </div>
            </div>
            <div class="mt-3 max-h-56 overflow-y-auto space-y-2">
                ${emp.tasks && emp.tasks.length ? emp.tasks.map((t, idx) => `<div class="task-item bg-white p-2 rounded-xl flex justify-between"><span class="text-xs">${t.desc}</span><div><button onclick="completeTask(${emp.id}, ${idx})" class="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full">إنجاز</button> <button onclick="deleteTask(${emp.id}, ${idx})" class="bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded-full"><i class="fas fa-trash"></i></button></div></div>`).join('') : '<div class="text-center text-slate-400 text-xs py-3">✨ لا مهام</div>'}
            </div>
            <div class="mt-4 text-left">
                <button onclick="deleteEmployee(${emp.id})" class="text-red-400 text-xs"><i class="fas fa-user-minus"></i> حذف الموظف</button>
                <button onclick="resetEmployeePassword(${emp.id})" class="text-amber-600 text-xs mr-3"><i class="fas fa-key"></i> إعادة تعيين كلمة المرور</button>
            </div>
        </div>
    `).join('');
}

// دالة إعادة تعيين كلمة المرور
function resetEmployeePassword(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    const newPassword = prompt(`إعادة تعيين كلمة المرور للموظف ${emp.name}\nأدخل كلمة المرور الجديدة:`);
    if (newPassword && newPassword.trim()) {
        emp.password = newPassword.trim();
        saveAllData();
        showToast(`✅ تم تغيير كلمة المرور للموظف ${emp.name}`, "success");
        addToActivityLog(`تم إعادة تعيين كلمة المرور للموظف ${emp.name}`);
    }
}

// ---------- عرض تجار الجملة (قسم منفصل) ----------
function renderWholesalers() {
    const div = document.getElementById('wholesalersList');
    if (!div) return;
    if (wholesalers.length === 0) {
        div.innerHTML = '<div class="text-center text-slate-400 py-10 bg-slate-50 rounded-2xl">لا يوجد تجار جملة بعد، أضف تاجر جديد</div>';
        return;
    }
    div.innerHTML = wholesalers.map((w, index) => `
        <div class="bg-slate-50 px-5 py-4 rounded-2xl flex items-center justify-between gap-3 border-r-4 border-elixir">
            <div class="flex-1">
                <div class="font-bold text-elixir text-lg">${w.name}</div>
                <div class="text-sm text-slate-600 mt-1">📞 ${w.phone || 'غير محدد'}</div>
                <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    🔒 كلمة المرور: 
                    <span id="password_${index}" class="font-mono bg-white px-2 py-0.5 rounded">${w.password ? '•'.repeat(Math.min(8, w.password.length)) : 'غير محددة'}</span>
                    <button onclick="toggleWholesalerPasswordVisibility(${index}, '${w.password}')" class="text-gray-500 hover:text-elixir transition">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="text-xs text-emerald-600 mt-1">🆔 معرف التاجر: #${index + 1}</div>
            </div>
            <div class="flex gap-2">
                <button onclick="editWholesaler(${index})" class="bg-elixir hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm transition">
                  <i class="fas fa-edit ml-1"></i> تعديل
                </button>
                <button onclick="deleteWholesaler(${index})" class="bg-elixir hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm transition">
                  <i class="fas fa-trash-alt ml-1"></i> حذف
                </button>
            </div>
        </div>
    `).join('');
}

// إظهار/إخفاء كلمة المرور في صفحة تجار الجملة
function toggleWholesalerPasswordVisibility(index, actualPassword) {
    const passwordSpan = document.getElementById(`password_${index}`);
    const button = passwordSpan.parentElement.querySelector('button i');
    
    // التحقق من أن كلمة المرور مخفية حالياً (نقاط)
    if (passwordSpan.innerText.includes('•') || passwordSpan.innerText === 'غير محددة') {
        // إظهار كلمة المرور الحقيقية
        passwordSpan.innerText = actualPassword || 'غير محددة';
        // تغيير شكل العين
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        // إخفاء كلمة المرور (نقاط)
        const hiddenPassword = actualPassword ? '•'.repeat(Math.min(8, actualPassword.length)) : 'غير محددة';
        passwordSpan.innerText = hiddenPassword;
        // تغيير شكل العين
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

// تحديث قائمة التجار في SMS
function updateSMSWholesalersList() {
    const select = document.getElementById('smsRecipient');
    if (!select) return;
    select.innerHTML = '<option value="all_wholesalers">📨 جميع تجار الجملة</option>';
    wholesalers.forEach((w, idx) => {
        select.innerHTML += `<option value="wholesaler_${idx}">👤 ${w.name} (${w.phone || 'رقم غير محدد'})</option>`;
    });
    if (wholesalers.length === 0) {
        select.innerHTML = '<option value="">لا يوجد تجار جملة</option>';
    }
}

// فتح نافذة تعديل التاجر
function editWholesaler(index) {
    const wholesaler = wholesalers[index];
    if (!wholesaler) return;
    document.getElementById('editWholesaleIndex').value = index;
    document.getElementById('editWholesaleName').value = wholesaler.name;
    document.getElementById('editWholesalePhone').value = wholesaler.phone || '';
    document.getElementById('editWholesalePassword').value = wholesaler.password || '';
    document.getElementById('editWholesaleModal').classList.remove('hidden');
}

function closeEditWholesaleModal() {
    document.getElementById('editWholesaleModal').classList.add('hidden');
}

function updateWholesaler() {
    const index = parseInt(document.getElementById('editWholesaleIndex').value);
    const name = document.getElementById('editWholesaleName').value.trim();
    const phone = document.getElementById('editWholesalePhone').value.trim();
    const password = document.getElementById('editWholesalePassword').value;
    
    if (!name) {
        showToast("أدخل اسم التاجر", "error");
        return;
    }
    
    if (!password) {
        showToast("أدخل كلمة المرور", "error");
        return;
    }
    
    const oldName = wholesalers[index].name;
    wholesalers[index] = {
        ...wholesalers[index],
        name: name,
        phone: phone || "غير محدد",
        password: password
    };
    
    saveAllData();
    renderWholesalers();
    closeEditWholesaleModal();
    showToast(`تم تحديث بيانات تاجر الجملة: ${name}`, "success");
    addToActivityLog(`تم تعديل بيانات تاجر الجملة: ${oldName} → ${name}`);
}

// إنشاء حساب تاجر جديد
function saveWholesaler() {
    const name = document.getElementById('wholesaleName').value.trim();
    const phone = document.getElementById('wholesalePhone').value.trim();
    const password = document.getElementById('wholesalePassword').value.trim();

    if (!name) {
        showToast("أدخل اسم التاجر", "error");
        return;
    }
    
    if (!password) {
        showToast("أدخل كلمة المرور", "error");
        return;
    }

    wholesalers.push({ 
        name: name, 
        phone: phone || "غير محدد",
        password: password,
        createdAt: new Date().toISOString()
    });
    
    renderWholesalers();
    closeWholesaleModal();
    saveAllData();
    showToast(`✅ تم إنشاء حساب تاجر جملة: ${name}`, "success");
    addToActivityLog(`تم إنشاء حساب تاجر جملة جديد: ${name} (رقم الهاتف: ${phone || 'غير محدد'})`);
    
    document.getElementById('wholesaleName').value = '';
    document.getElementById('wholesalePhone').value = '';
    document.getElementById('wholesalePassword').value = '';
}

// حذف تاجر
function deleteWholesaler(index) {
    const wholesalerName = wholesalers[index]?.name;
    customConfirm(`هل تريد حذف حساب تاجر الجملة "${wholesalerName}" نهائياً؟`, () => {
        wholesalers.splice(index, 1);
        saveAllData();
        renderWholesalers();
        showToast("تم حذف التاجر", "success");
        addToActivityLog(`تم حذف حساب تاجر الجملة: ${wholesalerName}`);
    });
}

// وظيفة تغيير كلمة المرور من صفحة التاجر (يتم استدعاؤها من صفحة التاجر)
function updateWholesalerPassword(wholesalerName, newPassword) {
    const wholesaler = wholesalers.find(w => w.name === wholesalerName);
    if (wholesaler) {
        wholesaler.password = newPassword;
        saveAllData();
        renderWholesalers(); // تحديث العرض في لوحة الأدمن
        addToActivityLog(`تاجر الجملة "${wholesalerName}" قام بتغيير كلمة المرور`);
        return true;
    }
    return false;
}

// دالة مساعدة لإظهار/إخفاء كلمة المرور
function togglePasswordVisibility(inputId, buttonElement) {
    const input = document.getElementById(inputId);
    const icon = buttonElement.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function openWholesaleModal() { document.getElementById('wholesaleModal').classList.remove('hidden'); }
function closeWholesaleModal() { document.getElementById('wholesaleModal').classList.add('hidden'); }

// ---------- إدارة الفئات ----------
function renderCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    // عرض جميع الفئات (الظاهرة والمخفية)
    if (categories.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 py-10 bg-slate-50 rounded-2xl">لا توجد فئات، أضف فئة جديدة</div>';
        return;
    }
    
    container.innerHTML = categories.map(cat => `
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${cat.hidden ? 'opacity-50' : ''}">
            <div class="p-5 text-center">
                <div class="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas ${cat.icon} text-2xl text-elixir"></i>
                </div>
                <p class="font-bold text-slate-700 text-lg mb-1">${cat.name}</p>
                <div class="flex justify-center gap-2 mt-4">
                    <button onclick="editCategory(${cat.id})" class="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition flex items-center justify-center" title="تعديل">
                        <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button onclick="toggleCategoryVisibility(${cat.id})" class="w-8 h-8 rounded-xl ${cat.hidden ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'} transition flex items-center justify-center" title="${cat.hidden ? 'إظهار الفئة' : 'إخفاء الفئة'}">
                        <i class="fas fa-${cat.hidden ? 'eye' : 'eye-slash'} text-sm"></i>
                    </button>
                    <button onclick="deleteCategoryPermanent(${cat.id})" class="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center justify-center" title="حذف الفئة وجميع منتجاتها">
                        <i class="fas fa-trash-alt text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// تبديل حالة الإخفاء/الإظهار للفئة (بدون حذف)
function toggleCategoryVisibility(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // عكس حالة الإخفاء
    category.hidden = !category.hidden;
    
    // إخفاء أو إظهار المنتجات المرتبطة
    products.forEach(product => {
        if (product.category === category.name) {
            product.active = !category.hidden;
        }
    });
    
    renderCategories();
    renderProductsTable();
    saveAllData();
    
    const action = category.hidden ? 'إخفاء' : 'إظهار';
    showToast(`✅ تم ${action} الفئة "${category.name}" وجميع منتجاتها`, "success");
    addToActivityLog(`تم ${action} الفئة "${category.name}"`);
}

// حذف الفئة وجميع منتجاتها نهائياً
function deleteCategoryPermanent(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const productsCount = products.filter(p => p.category === category.name).length;
    
    customConfirm(
        `⚠️ تحذير! أنت على وشك حذف الفئة "${category.name}" نهائياً.\n\n` +
        `سيتم حذف ${productsCount} منتج مرتبط بهذه الفئة بشكل دائم.\n\n` +
        `هل أنت متأكد؟`,
        () => {
            // حذف جميع المنتجات المرتبطة
            products = products.filter(p => p.category !== category.name);
            
            // حذف الفئة
            categories = categories.filter(c => c.id !== categoryId);
            
            // تحديث الواجهة
            renderCategories();
            renderProductsTable();
            updateAllCategoriesDropdowns();
            saveAllData();
            
            showToast(`🗑️ تم حذف الفئة "${category.name}" و ${productsCount} منتج مرتبط بها`, "success");
            addToActivityLog(`تم حذف الفئة "${category.name}" و ${productsCount} منتج مرتبط`);
        }
    );
}
// إخفاء فئة وجميع منتجاتها
function hideCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // إخفاء الفئة
    category.hidden = true;
    
    // إخفاء جميع المنتجات المرتبطة بهذه الفئة
    let hiddenCount = 0;
    products.forEach(product => {
        if (product.category === category.name) {
            product.active = false;
            hiddenCount++;
            addToActivityLog(`تم إخفاء المنتج "${product.name}" تلقائياً بسبب إخفاء الفئة "${category.name}"`);
        }
    });
    
    // إعادة عرض الجداول
    renderCategories();
    renderProductsTable();
    saveAllData();
    
    showToast(`✅ تم إخفاء الفئة "${category.name}" و ${hiddenCount} منتج مرتبط بها`, "success");
    addToActivityLog(`تم إخفاء الفئة "${category.name}" و ${hiddenCount} منتج مرتبط`);
}

// إظهار جميع الفئات المخفية (زر في صفحة الفئات)
function showAllHiddenCategories() {
    categories.forEach(cat => {
        if (cat.hidden) {
            cat.hidden = false;
        }
    });
    
    // إظهار المنتجات المرتبطة مرة أخرى
    products.forEach(product => {
        const category = categories.find(c => c.name === product.category);
        if (category && !category.hidden) {
            product.active = true;
        }
    });
    
    renderCategories();
    renderProductsTable();
    saveAllData();
    showToast("✅ تم إظهار جميع الفئات والمنتجات المخفية", "success");
}

function openCategoryModal(categoryId = null) {
    const modal = document.getElementById('categoryModal');
    if (categoryId) {
        const cat = categories.find(c => c.id === categoryId);
        if (cat) {
            document.getElementById('categoryModalTitle').innerText = "تعديل فئة";
            document.getElementById('editCategoryId').value = cat.id;
            document.getElementById('categoryName').value = cat.name;
            document.getElementById('categoryIcon').value = cat.icon;
        }
    } else {
        document.getElementById('categoryModalTitle').innerText = "إضافة فئة جديدة";
        document.getElementById('editCategoryId').value = '';
        document.getElementById('categoryName').value = '';
        document.getElementById('categoryIcon').value = 'fa-tag';
    }
    modal.classList.remove('hidden');
}

function closeCategoryModal() { document.getElementById('categoryModal').classList.add('hidden'); }

function saveCategory() {
    const id = document.getElementById('editCategoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    if (!name) { showToast("يرجى إدخال اسم الفئة", "error"); return; }
    if (id) {
        const idx = categories.findIndex(c => c.id == id);
        if (idx !== -1) categories[idx] = { ...categories[idx], name, icon };
        showToast("تم تحديث الفئة", "success");
    } else {
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        categories.push({ id: newId, name, icon });
        showToast("تم إضافة الفئة", "success");
    }
    renderCategories();
    updateAllCategoriesDropdowns();  // <---- أضف هذا السطر
    closeCategoryModal();
    saveAllData();
}

function editCategory(id) { openCategoryModal(id); }


// دالة عرض نافذة تحذير عند حذف فئة تحتوي على منتجات
function showCategoryDeleteWarning(category, productsList) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[400] overflow-y-auto p-6';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="text-center mb-6">
                <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-slate-800">⚠️ لا يمكن حذف الفئة</h3>
                <p class="text-slate-600 mt-2">
                    الفئة "<span class="font-bold text-red-600">${category.name}</span>" تحتوي على 
                    <span class="font-bold text-elixir">${productsList.length}</span> منتج(منتجات).
                </p>
                <p class="text-slate-500 text-sm mt-1">لحذف هذه الفئة، يجب أولاً نقل منتجاتها إلى فئة أخرى.</p>
            </div>
            
            <div class="border-t border-slate-200 pt-4 mb-4">
                <h4 class="font-bold mb-3">📦 المنتجات التي ستتأثر:</h4>
                <div class="bg-slate-50 rounded-xl p-3 max-h-48 overflow-y-auto">
                    ${productsList.map(p => `
                        <div class="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                            <span>${p.name}</span>
                            <span class="text-sm text-slate-500">${p.price} ₪</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mb-6">
                <label class="block font-bold mb-2 text-red-600">📌 اختر الفئة الجديدة لهذه المنتجات:</label>
                <div class="flex gap-3">
                    <select id="newCategoryForProducts" class="flex-1 border rounded-xl p-3 bg-white">
                        ${categories.filter(c => c.id !== category.id).map(c => `<option value="${c.name}">📁 ${c.name}</option>`).join('')}
                    </select>
                    <button id="moveAndDeleteBtn" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition">
                        <i class="fas fa-arrow-right ml-1"></i> نقل وحذف
                    </button>
                </div>
                <p class="text-xs text-slate-400 mt-2">
                    <i class="fas fa-info-circle"></i> سيتم نقل جميع المنتجات إلى الفئة المختارة، ثم حذف الفئة "${category.name}"
                </p>
            </div>
            
            <div class="flex gap-3 pt-4 border-t border-slate-200">
                <button id="cancelDeleteBtn" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                    <i class="fas fa-times ml-1"></i> إلغاء
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // زر نقل وحذف
    document.getElementById('moveAndDeleteBtn').onclick = () => {
        const newCategory = document.getElementById('newCategoryForProducts').value;
        
        // نقل جميع المنتجات إلى الفئة الجديدة
        products.forEach(product => {
            if (product.category === category.name) {
                product.category = newCategory;
            }
        });
        
        // حذف الفئة القديمة
        categories = categories.filter(c => c.id !== category.id);
        
        // تحديث الواجهة
        renderProductsTable();
        renderCategories();
        updateAllCategoriesDropdowns();
        saveAllData();

        // رسالة نجاح
        showToast(`✅ تم نقل ${productsList.length} منتج إلى "${newCategory}" وحذف الفئة "${category.name}"`, "success");
        addToActivityLog(`تم حذف الفئة "${category.name}" ونقل ${productsList.length} منتج إلى "${newCategory}"`);
        
        modal.remove();
    };
    
    // زر إلغاء
    document.getElementById('cancelDeleteBtn').onclick = () => {
        modal.remove();
    };
    
    // إغلاق بالضغط خارج النافذة
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}                                                                                                                                                                                                                                                                                                                               

// ---------- تحديث القوائم المنسدلة للفئات ----------
function updateAllCategoriesDropdowns() {
    // تحديث قائمة الفئات في مودال إضافة/تعديل المنتج
    const productCategorySelect = document.getElementById('productCategory');
    if (productCategorySelect) {
        const currentValue = productCategorySelect.value;
        productCategorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            if (currentValue === cat.name) option.selected = true;
            productCategorySelect.appendChild(option);
        });
    }
}

// ---------- إدارة العروض (معدلة للعمل مع جميع المنتجات) ----------
// ---------- إدارة العروض (معدلة للعمل مع جميع المنتجات) ----------
function renderOffers() {
    const container = document.getElementById('offersList');
    if (!container) return;
    
    // جلب العروض من localStorage فقط (المصدر الوحيد الموثوق)
    let allOffers = JSON.parse(localStorage.getItem('elixir_offers')) || [];
    
    // التحقق من صلاحية العروض (تاريخ الانتهاء)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    allOffers = allOffers.filter(offer => {
        // إذا لم يكن هناك تاريخ انتهاء، العرض دائم
        if (!offer.endDate || offer.endDate === "") return true;
        const endDate = new Date(offer.endDate);
        endDate.setHours(0, 0, 0, 0);
        return today <= endDate;
    });
    
    // حفظ العروض الصالحة فقط مرة أخرى
    localStorage.setItem('elixir_offers', JSON.stringify(allOffers));
    
    if (allOffers.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 py-6">لا توجد عروض حالياً</div>';
        return;
    }
    
    container.innerHTML = allOffers.map(offer => {
        // البحث عن المنتج في products (لوحة التحكم)
        let product = products.find(p => p.id === offer.productId);
        
        return `
            <div class="border p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-white">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-elixir">${offer.productName || product?.name || 'منتج غير موجود'}</p>
                        <p class="text-red-600 text-2xl font-bold">-${offer.discount}%</p>
                        <p class="text-sm text-slate-500">
                            السعر الأصلي: ${offer.productPrice || product?.price} ₪ → 
                            السعر بعد الخصم: ${offer.newPrice} ₪
                        </p>
                        ${offer.endDate ? `<p class="text-xs text-slate-400">⏰ ينتهي في: ${new Date(offer.endDate).toLocaleDateString('ar-EG')}</p>` : '<p class="text-xs text-green-500">✨ عرض دائم</p>'}
                        <p class="text-xs text-slate-400">أضيف في: ${new Date(offer.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div class="flex gap-2">
    <button onclick="openEditOfferModal(${offer.id})" class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition" title="تعديل العرض">
        <i class="fas fa-edit"></i>
    </button>
    <button onclick="deleteOfferFromAdmin(${offer.id})" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition" title="حذف العرض">
        <i class="fas fa-trash-alt"></i>
    </button>
</div>
                </div>
            </div>
        `;
    }).join('');
}

// دالة حذف العرض من صفحة الأدمن
function deleteOfferFromAdmin(offerId) {
    customConfirm("هل تريد حذف هذا العرض نهائياً؟", () => {
        let offers = JSON.parse(localStorage.getItem('elixir_offers')) || [];
        offers = offers.filter(o => o.id !== offerId);
        localStorage.setItem('elixir_offers', JSON.stringify(offers));
        renderOffers();
        showToast("✅ تم حذف العرض بنجاح", "success");
        addToActivityLog("تم حذف عرض من قائمة العروض");
    });
}

// ========== تعديل العروض ==========
let currentEditingOffer = null;

function openEditOfferModal(offerId) {
    let allOffers = JSON.parse(localStorage.getItem('elixir_offers')) || [];
    const offer = allOffers.find(o => o.id == offerId);
    
    if (!offer) {
        showToast("❌ العرض غير موجود", "error");
        return;
    }
    
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[400]';
    overlay.innerHTML = `
        <div class="bg-white rounded-3xl p-8 w-96 text-center shadow-2xl">
            <h3 class="text-2xl font-bold mb-4 text-elixir">✏️ تعديل عرض "${offer.productName}"</h3>
            
            <div class="mb-4">
                <label class="block text-right text-sm font-bold mb-2">💰 نسبة الخصم (%)</label>
                <input type="number" id="editDiscountPercent" value="${offer.discount}" min="1" max="90" class="w-full border rounded-xl p-3 text-center" required>
            </div>
            
            <div class="mb-4">
                <label class="block text-right text-sm font-bold mb-2">📅 تاريخ انتهاء العرض (اختياري)</label>
                <input type="date" id="editEndDate" value="${offer.endDate || ''}" min="${minDate}" class="w-full border rounded-xl p-3">
                <p class="text-xs text-slate-400 text-right mt-1">⚠️ اتركه فارغاً لجعل العرض دائماً</p>
            </div>
            
            <div class="bg-amber-50 p-3 rounded-xl mb-4 text-right">
                <p class="text-xs text-amber-700"><i class="fas fa-info-circle ml-1"></i> تاريخ البدء: ${offer.startDate || new Date(offer.createdAt).toISOString().split('T')[0]}</p>
            </div>
            
            <div class="flex gap-3 mt-6">
                <button id="confirmEditBtn" class="flex-1 bg-elixir text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
                <button id="cancelEditBtn" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('confirmEditBtn').onclick = () => {
        const newDiscount = parseInt(document.getElementById('editDiscountPercent').value);
        if (!newDiscount || newDiscount < 1 || newDiscount > 90) {
            showToast("⚠️ الرجاء إدخال نسبة خصم صحيحة (1-90)", "error");
            return;
        }
        const newEndDate = document.getElementById('editEndDate').value;
        
        const newPrice = (offer.productPrice * (100 - newDiscount) / 100).toFixed(2);
        
        // تحديث العرض
        offer.discount = newDiscount;
        offer.newPrice = newPrice;
        offer.endDate = newEndDate || "";
        offer.lastUpdated = new Date().toISOString();
        
        let allOffers = JSON.parse(localStorage.getItem('elixir_offers') || []);
        const index = allOffers.findIndex(o => o.id == offerId);
        if (index !== -1) {
            allOffers[index] = offer;
            localStorage.setItem('elixir_offers', JSON.stringify(allOffers));
            
            if (typeof renderOffers === 'function') renderOffers();
            
            showToast(`✅ تم تحديث العرض بنجاح (الخصم: ${newDiscount}%)`, "success");
            overlay.remove();
        } else {
            showToast("❌ حدث خطأ", "error");
        }
    };
    
    document.getElementById('cancelEditBtn').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

function closeEditOfferModal() {
    document.getElementById('editOfferModal').classList.add('hidden');
    currentEditingOffer = null;
}

function updateEditOfferNewPrice() {
    const discount = parseFloat(document.getElementById('editOfferDiscount').value);
    const originalPrice = currentEditingOffer ? parseFloat(currentEditingOffer.productPrice) : 0;
    
    if (!isNaN(discount) && discount > 0 && discount <= 90) {
        const newPrice = (originalPrice * (100 - discount) / 100).toFixed(2);
        document.getElementById('editOfferNewPricePreview').innerHTML = newPrice + ' ₪';
    } else {
        document.getElementById('editOfferNewPricePreview').innerHTML = originalPrice.toFixed(2) + ' ₪';
    }
}

// ربط حدث تغيير الخصم
document.addEventListener('DOMContentLoaded', function() {
    const discountInput = document.getElementById('editOfferDiscount');
    if (discountInput) {
        discountInput.addEventListener('input', updateEditOfferNewPrice);
    }
});

function saveOfferEdit() {
    if (!currentEditingOffer) {
        showToast("❌ لا يوجد عرض قيد التعديل", "error");
        return;
    }
    
    const newDiscount = parseInt(document.getElementById('editOfferDiscount').value);
    const newEndDate = document.getElementById('editOfferEndDate').value;
    
    // التحقق من صحة الخصم
    if (isNaN(newDiscount) || newDiscount < 1 || newDiscount > 90) {
        showToast("⚠️ الرجاء إدخال نسبة خصم صحيحة (1-90)", "error");
        return;
    }
    
    // حساب السعر الجديد
    const newPrice = (currentEditingOffer.productPrice * (100 - newDiscount) / 100).toFixed(2);
    
    // جلب العروض من localStorage
    let allOffers = JSON.parse(localStorage.getItem('elixir_offers')) || [];
    const offerIndex = allOffers.findIndex(o => o.id == currentEditingOffer.id);
    
    if (offerIndex !== -1) {
        // تحديث بيانات العرض
        allOffers[offerIndex].discount = newDiscount;
        allOffers[offerIndex].newPrice = newPrice;
        allOffers[offerIndex].endDate = newEndDate || "";
        allOffers[offerIndex].lastUpdated = new Date().toISOString();
        
        // حفظ التغييرات
        localStorage.setItem('elixir_offers', JSON.stringify(allOffers));
        
        // تحديث الواجهة
        renderOffers();
        
        showToast(`✅ تم تحديث العرض بنجاح (الخصم: ${newDiscount}%)`, "success");
        addToActivityLog(`تم تعديل عرض "${currentEditingOffer.productName}" - خصم ${newDiscount}%`);
        
        closeEditOfferModal();
    } else {
        showToast("❌ حدث خطأ أثناء حفظ التغييرات", "error");
    }
}

// دالة جديدة لحذف العروض من localStorage
function deleteOfferFromLocal(offerId) {
    let offersFromStorage = JSON.parse(localStorage.getItem('elixir_offers')) || [];
    offersFromStorage = offersFromStorage.filter(o => o.id !== offerId);
    localStorage.setItem('elixir_offers', JSON.stringify(offersFromStorage));
    renderOffers();
    showToast("تم حذف العرض", "success");
}

// حفظ منتجات الموقع في localStorage (للتوفيق بين لوحة التحكم والموقع)
function syncSiteProducts() {
    // محاولة جلب المنتجات من localStorage إذا كانت موجودة
    const siteProducts = [];
    
    // يمكن إضافة منتجات من مصادر مختلفة هنا
    localStorage.setItem('elixir_site_products', JSON.stringify(siteProducts));
}

// استدعي الدالة عند تحميل الصفحة
syncSiteProducts();

function editOffer(offerId) {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;
    
    const selectProduct = document.getElementById('offerProductId');
    selectProduct.innerHTML = '<option value="">اختر المنتج</option>' + products.map(p => `<option value="${p.id}" ${p.id === offer.productId ? 'selected' : ''}>${p.name}</option>`).join('');
    document.getElementById('offerDiscount').value = offer.discount;
    document.getElementById('offerStartDate').value = offer.startDate;
    document.getElementById('offerEndDate').value = offer.endDate;
    document.getElementById('editOfferId').value = offer.id;
    document.getElementById('offerModalTitle').innerText = "تعديل العرض";
    document.getElementById('offerModal').classList.remove('hidden');
}

function openOfferModal(offerId = null) {
    const selectProduct = document.getElementById('offerProductId');
    selectProduct.innerHTML = '<option value="">اختر المنتج</option>' + products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    document.getElementById('offerDiscount').value = '';
    document.getElementById('offerStartDate').value = '';
    document.getElementById('offerEndDate').value = '';
    document.getElementById('editOfferId').value = '';
    document.getElementById('offerModalTitle').innerText = "إضافة عرض جديد";
    document.getElementById('offerModal').classList.remove('hidden');
}

function closeOfferModal() { document.getElementById('offerModal').classList.add('hidden'); }

function saveOffer() {
    const editId = document.getElementById('editOfferId').value;
    const productId = parseInt(document.getElementById('offerProductId').value);
    const discount = parseFloat(document.getElementById('offerDiscount').value);
    const startDate = document.getElementById('offerStartDate').value;
    const endDate = document.getElementById('offerEndDate').value;
    
    if (!productId || isNaN(discount)) { 
        showToast("بيانات ناقصة", "error"); 
        return; 
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast("المنتج غير موجود", "error");
        return;
    }
    
    const newPrice = (product.price * (100 - discount) / 100).toFixed(2);
    
    if (editId) {
        const index = offers.findIndex(o => o.id == editId);
        if (index !== -1) {
            offers[index] = { ...offers[index], productId, discount, startDate, endDate, newPrice };
            showToast("تم تحديث العرض", "success");
        }
    } else {
        const newId = offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1;
        offers.push({ 
            id: newId, 
            productId, 
            productName: product.name,
            productPrice: product.price,
            discount, 
            startDate, 
            endDate,
            newPrice,
            createdAt: new Date().toISOString()
        });
        showToast("تم إضافة العرض", "success");
    }
    
    renderOffers();
    closeOfferModal();
    saveAllData();
}

function deleteOffer(id) {
    customConfirm("حذف هذا العرض؟", () => {        
        offers = offers.filter(o => o.id !== id);
        renderOffers();
        saveAllData();
        showToast("تم الحذف", "success");
    });
}





// ---------- إعدادات الموقع ----------
function loadSettings() {
    document.getElementById('returnPolicy').value = settings.returnPolicy || '';
    document.getElementById('termsOfUse').value = settings.termsOfUse || '';
    document.getElementById('privacyPolicy').value = settings.privacyPolicy || '';
}

function saveSettings() {
    settings.returnPolicy = document.getElementById('returnPolicy').value;
    settings.termsOfUse = document.getElementById('termsOfUse').value;
    settings.privacyPolicy = document.getElementById('privacyPolicy').value;
    saveAllData();
    showToast("تم حفظ السياسات", "success");
}

// ---------- المهام التلقائية واليدوية ----------
function generateRestockTasks() {
    let tasks = [];
    products.forEach(prod => {
        if (prod.stock === 0) tasks.push({ id: Date.now() + prod.id, desc: `🔄 إعادة تعبئة: ${prod.name} (0 قطعة)`, productId: prod.id, action: 'restock', amount: 10 });
        else if (prod.stock < 3) tasks.push({ id: Date.now() + prod.id + 100, desc: `⚠️ مخزون منخفض: ${prod.name} (${prod.stock} قطعة)`, productId: prod.id, action: 'restock', amount: 5 });
    });
    return tasks;
}

function distributeTasksEqually() {
    let newTasks = generateRestockTasks();
    if (newTasks.length === 0) { showToast("لا توجد مهام مخزون جديدة"); return; }
    if (employees.length === 0) { showToast("أضف موظفين أولاً", "error"); return; }
    let idx = 0;
    newTasks.forEach(task => { employees[idx % employees.length].tasks.push({ ...task, completed: false, assignedAt: new Date().toLocaleString() }); idx++; });
    renderEmployeesCards();
    renderProductsTable();
    saveAllData();
    showToast(`تم توزيع ${newTasks.length} مهمة`);
}

function completeTask(empId, taskIndex) {
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.tasks[taskIndex]) return;
    const task = emp.tasks[taskIndex];
    if (task.completed) return;
    if (task.action === 'restock' && task.productId) {
        const prod = products.find(p => p.id === task.productId);
        if (prod) { prod.stock += task.amount; showToast(`✅ تمت إعادة تعبئة ${prod.name} +${task.amount}`); }
    } else showToast(`✅ تم إنجاز المهمة: ${task.desc}`);
    task.completed = true;
    emp.tasks = emp.tasks.filter(t => !t.completed);
    renderEmployeesCards();
    renderProductsTable();
    saveAllData();
}

function deleteTask(empId, taskIndex) {
    customConfirm("هل تريد حذف هذه المهمة نهائياً؟", () => {
        const emp = employees.find(e => e.id === empId);
        if (emp && emp.tasks[taskIndex]) { emp.tasks.splice(taskIndex, 1); renderEmployeesCards(); saveAllData(); showToast("تم حذف المهمة", "success"); }
    });
}

function addNewEmployee() {
    const name = document.getElementById('empName')?.value.trim();
    const role = document.getElementById('empRole')?.value.trim() || "موظف";
    const email = document.getElementById('empEmail')?.value.trim();
    const password = document.getElementById('empPassword')?.value.trim();
    
    if (!name) {
        showToast("❌ أدخل اسم الموظف", "error");
        return;
    }
    
    if (!email) {
        showToast("❌ أدخل البريد الإلكتروني", "error");
        return;
    }
    
    if (!password) {
        showToast("❌ أدخل كلمة المرور", "error");
        return;
    }
    
    // التحقق من عدم وجود ايميل مكرر
    if (employees.some(emp => emp.email === email)) {
        showToast("❌ هذا البريد الإلكتروني مسجل مسبقاً", "error");
        return;
    }
    
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 101;
    
    employees.push({
        id: newId,
        name: name,
        role: role,
        email: email,
        password: password,
        tasks: [],
        createdAt: new Date().toISOString()
    });
    
    saveAllData();
    renderEmployeesCards();
    closeEmployeeModal();
    showToast(`✅ تم إضافة الموظف ${name} بنجاح`, "success");
    addToActivityLog(`تم إضافة موظف جديد: ${name} (${email})`);
}

function deleteEmployee(id) {
    customConfirm("هل تريد حذف هذا الموظف وجميع مهامه؟", () => {
        employees = employees.filter(e => e.id !== id);
        renderEmployeesCards();
        saveAllData();
        showToast("تم حذف الموظف", "success");
    });
}

function openAddEmployeeModal() { 
    // إنشاء نافذة منبثقة متطورة
    const modalHtml = `
        <div id="customEmployeeModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300]">
            <div class="bg-white rounded-3xl p-8 w-full max-w-md">
                <h3 class="text-2xl font-bold mb-6 text-center text-elixir">➕ إضافة موظف جديد</h3>
                <div class="space-y-4">
                    <input type="text" id="empName" placeholder="الاسم الكامل" class="w-full border rounded-xl p-3">
                    <input type="text" id="empRole" placeholder="المنصب (مثال: مدير مخزون)" class="w-full border rounded-xl p-3">
                    <input type="email" id="empEmail" placeholder="البريد الإلكتروني" class="w-full border rounded-xl p-3" dir="ltr">
                    <div class="relative">
                        <input type="password" id="empPassword" placeholder="كلمة المرور" class="w-full border rounded-xl p-3 pl-10" dir="ltr">
                        <button type="button" onclick="togglePasswordField('empPassword', this)" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button onclick="addNewEmployee()" class="flex-1 bg-elixir text-white py-3 rounded-xl font-bold">حفظ</button>
                        <button onclick="closeEmployeeModal()" class="flex-1 bg-gray-200 py-3 rounded-xl font-bold">إلغاء</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // إزالة أي مودال قديم
    const oldModal = document.getElementById('customEmployeeModal');
    if (oldModal) oldModal.remove();
    
    // إضافة المودال الجديد
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeEmployeeModal() {
    const modal = document.getElementById('customEmployeeModal');
    if (modal) modal.remove();
}

function togglePasswordField(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
function closeEmployeeModal() { document.getElementById('employeeModal').classList.add('hidden'); }

function openManualTaskModal(empId) {
    document.getElementById('targetEmployeeId').value = empId;
    const selectProduct = document.getElementById('restockProductId');
    selectProduct.innerHTML = products.map(p => `<option value="${p.id}">${p.name} (المخزون: ${p.stock})</option>`).join('');
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskType').value = 'general';
    document.getElementById('restockFields').classList.add('hidden');
    document.getElementById('manualTaskModal').classList.remove('hidden');
}

function closeManualTaskModal() { document.getElementById('manualTaskModal').classList.add('hidden'); }

function addManualTask() {
    const empId = parseInt(document.getElementById('targetEmployeeId').value);
    const emp = employees.find(e => e.id === empId);
    if (!emp) { showToast("موظف غير موجود", "error"); return; }
    const type = document.getElementById('taskType').value;
    let desc = document.getElementById('taskDescription').value.trim();
    if (type === 'restock') {
        const productId = parseInt(document.getElementById('restockProductId').value);
        const amount = parseInt(document.getElementById('restockAmount').value) || 5;
        const product = products.find(p => p.id === productId);
        if (!product) { showToast("اختر منتجاً", "error"); return; }
        desc = `🔄 إعادة تعبئة: ${product.name} (+${amount})`;
        emp.tasks.push({ id: Date.now(), desc, productId, action: 'restock', amount, completed: false, assignedAt: new Date().toLocaleString() });
    } else {
        if (!desc) { showToast("أدخل وصف المهمة", "error"); return; }
        emp.tasks.push({ id: Date.now(), desc, action: 'general', completed: false, assignedAt: new Date().toLocaleString() });
    }
    renderEmployeesCards();
    closeManualTaskModal();
    saveAllData();
    showToast(`✅ تم إضافة مهمة إلى ${emp.name}`);
}

// ---------- التبويب ----------
function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    document.getElementById('page-title').innerText = evt.currentTarget.innerText.trim();
    if (tabName === 'staff') { renderEmployeesCards(); }
    if (tabName === 'wholesalers') { renderWholesalers(); }
    if (tabName === 'products') renderProductsTable();
    if (tabName === 'packages') renderPackages();
    if (tabName === 'orders') renderOrdersCards();
 //   if (tabName === 'categories') renderCategories();
    if (tabName === 'offers') { renderOffers(); renderSliders(); }
    if (tabName === 'settings') loadSettings();
}


// ========== شركات التوصيل ==========
let shippingCompanies = [];

function loadShipping() {
    const stored = localStorage.getItem('elixir_shipping');
    if (stored) shippingCompanies = JSON.parse(stored);
    else shippingCompanies = [
        { id: 1, name: "أرامكس", phone: "920000123", cost: 3.0, active: true },
        { id: 2, name: "زاجل", phone: "920000456", cost: 2.5, active: true }
    ];
    renderShipping();
}

function renderShipping() {
    const container = document.getElementById('shippingList');
    if (!container) return;
    if (shippingCompanies.length === 0) { container.innerHTML = '<div class="text-center text-slate-400 py-6">لا توجد شركات توصيل</div>'; return; }
    container.innerHTML = shippingCompanies.map(ship => `
        <div class="border p-4 rounded-2xl flex justify-between items-center">
            <div>
                <h4 class="font-bold">${ship.name}</h4>
                <p class="text-sm">📞 ${ship.phone}</p>
                <p class="text-sm">💰 ${ship.cost} ₪</p>
            </div>
            <div class="flex gap-2">
                <button onclick="toggleShippingActive(${ship.id})" class="text-${ship.active ? 'green' : 'gray'}-500"><i class="fas fa-${ship.active ? 'check-circle' : 'ban'}"></i></button>
                <button onclick="editShipping(${ship.id})" class="text-blue-500"><i class="fas fa-edit"></i></button>
                <button onclick="deleteShipping(${ship.id})" class="text-red-500"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function openShippingModal(id = null) {
    if (id) { const ship = shippingCompanies.find(s=>s.id===id); if(ship){ document.getElementById('shippingModalTitle').innerText = "تعديل شركة توصيل"; document.getElementById('editShippingId').value = ship.id; document.getElementById('shippingName').value = ship.name; document.getElementById('shippingPhone').value = ship.phone; document.getElementById('shippingCost').value = ship.cost; } }
    else { document.getElementById('shippingModalTitle').innerText = "إضافة شركة توصيل"; document.getElementById('editShippingId').value = ''; document.getElementById('shippingName').value = ''; document.getElementById('shippingPhone').value = ''; document.getElementById('shippingCost').value = ''; }
    document.getElementById('shippingModal').classList.remove('hidden');
}
function closeShippingModal() { document.getElementById('shippingModal').classList.add('hidden'); }
function saveShipping() {
    const id = document.getElementById('editShippingId').value;
    const name = document.getElementById('shippingName').value.trim();
    const phone = document.getElementById('shippingPhone').value.trim();
    const cost = parseFloat(document.getElementById('shippingCost').value);
    if (!name || isNaN(cost)) { showToast("بيانات ناقصة", "error"); return; }
    if (id) { const idx = shippingCompanies.findIndex(s=>s.id==id); if(idx!==-1) shippingCompanies[idx] = { ...shippingCompanies[idx], name, phone, cost }; showToast("تم التحديث"); }
    else { const newId = shippingCompanies.length > 0 ? Math.max(...shippingCompanies.map(s=>s.id)) + 1 : 1; shippingCompanies.push({ id: newId, name, phone, cost, active: true }); showToast("تمت الإضافة"); }
    renderShipping(); closeShippingModal(); saveAllData();
}
function toggleShippingActive(id) { const ship = shippingCompanies.find(s=>s.id===id); if(ship){ ship.active = !ship.active; renderShipping(); saveAllData(); } }
function editShipping(id) { openShippingModal(id); }
function deleteShipping(id) { customConfirm("حذف شركة التوصيل؟", () => { shippingCompanies = shippingCompanies.filter(s=>s.id !== id); renderShipping(); saveAllData(); showToast("تم الحذف"); }); }


// ========== سجل النشاطات ==========
let activityLog = [];

function loadActivityLog() {
    const stored = localStorage.getItem('elixir_activity_log');
    if (stored) activityLog = JSON.parse(stored);
    else activityLog = [{ action: "تم تسجيل الدخول إلى لوحة التحكم", date: new Date().toISOString() }];
    renderActivityLog();
}
function renderActivityLog() {
    const container = document.getElementById('activityLog');
    if (!container) return;
    if (activityLog.length === 0) { container.innerHTML = '<div class="text-center text-slate-400 py-4">لا توجد نشاطات</div>'; return; }
    container.innerHTML = activityLog.slice().reverse().map(log => `<div class="activity-log-item"><i class="fas fa-circle ml-2 text-elixir text-[8px]"></i> ${log.action}<div class="text-[10px] text-slate-400 mt-1">${new Date(log.date).toLocaleString('ar-EG')}</div></div>`).join('');
}
function addToActivityLog(action) { activityLog.push({ action, date: new Date().toISOString() }); if(activityLog.length > 100) activityLog.shift(); renderActivityLog(); saveAllData(); }
function clearActivityLog() { customConfirm("مسح سجل النشاطات؟", () => { activityLog = []; renderActivityLog(); saveAllData(); showToast("تم مسح السجل"); }); }
function logoutAllSessions() { showToast("تم تسجيل خروج جميع الجلسات (محاكاة - ستُربط مع PHP لاحقاً)", "info"); addToActivityLog("تم تسجيل خروج جميع الجلسات"); }
function backupData() { const data = { products, packagesList, employees, wholesalers, orders, categories, offers, sliders, advertisements, shippingCompanies, activityLog, settings }; const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `elixir_backup_${new Date().toISOString().slice(0,19)}.json`; a.click(); URL.revokeObjectURL(url); showToast("تم تصدير النسخة الاحتياطية"); addToActivityLog("تم تصدير نسخة احتياطية للبيانات"); }
function restoreFromBackup() { const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json'; input.onchange = e => { const file = e.target.files[0]; const reader = new FileReader(); reader.onload = ev => { try { const data = JSON.parse(ev.target.result); if(data.products) products = data.products; if(data.packagesList) packagesList = data.packagesList; if(data.employees) employees = data.employees; if(data.wholesalers) wholesalers = data.wholesalers; if(data.shippingCompanies) shippingCompanies = data.shippingCompanies;saveAllData(); renderProductsTable(); renderPackages(); renderEmployeesCards(); renderWholesalers();  renderShipping(); loadActivityLog();showToast("تم استعادة البيانات"); addToActivityLog("تم استعادة نسخة احتياطية"); } catch(err) { showToast("ملف غير صالح", "error"); } }; reader.readAsText(file); }; input.click(); }

// مستمع الحدث للتبويبات
document.addEventListener('DOMContentLoaded', () => {
    const taskTypeSelect = document.getElementById('taskType');
    if (taskTypeSelect) {
        taskTypeSelect.addEventListener('change', function(e) {
            document.getElementById('restockFields').classList.toggle('hidden', e.target.value !== 'restock');
        });
    }
    
    const packageImageInput = document.getElementById('packageImage');
    if (packageImageInput) {
        packageImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const previewContainer = document.getElementById('packageImagePreviewContainer');
            const imgPreview = document.getElementById('packageImagePreview');
            if (file && previewContainer && imgPreview) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imgPreview.src = event.target.result;
                    previewContainer.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } else if (previewContainer) {
                previewContainer.classList.add('hidden');
            }
        });
    }
    
    const productImageInput = document.getElementById('productImage');
    if (productImageInput) {
        productImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const previewContainer = document.getElementById('imagePreviewContainer');
            const imgPreview = document.getElementById('imagePreview');
            if (file && previewContainer && imgPreview) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imgPreview.src = event.target.result;
                    previewContainer.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// ---------- تهيئة الصفحة والمخططات ----------
loadAllData();
loadBestSelling();
loadShipping();
loadActivityLog();

renderProductsTable();
renderPackages();
renderBestSellingList();
renderEmployeesCards();
renderWholesalers();
renderOrdersTable();
renderOffers();
loadSettings();

addToActivityLog("تم فتح لوحة التحكم");

document.getElementById('current-date').innerText = new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date());


// دالة لتعبئة التصنيفات الفرعية حسب الفئة الرئيسية
function updateSubCategoryOptions() {
    const categorySelect = document.getElementById('productCategory');
    const subCategorySelect = document.getElementById('productSubCategory');
    
    if (!categorySelect || !subCategorySelect) return;
    
    const category = categorySelect.value;
    let options = [];
    
    if (category === 'أعشاب طبيعية') {
        options = ['أعشاب طبية', 'أعشاب عطرية', 'خلطات خاصة'];
    } 
    else if (category === 'زيوت مركزة') {
        options = ['زيوت عطرية', 'زيوت نباتية ثابتة', 'للشعر والبشرة'];
    }
    else if (category === 'بهارات') {
        options = ['بهارات عربية', 'بهارات عالمية', 'خلطات خاصة'];
    }
    else if (category === 'منتجات عناية') {
        options = ['تونر منعش', 'صابون طبيعي', 'مقشرات طبيعية', 'مرطبات وكريمات', 'أخرى'];
    }
    else {
        options = ['عام', 'مميز', 'أخرى'];
    }
    
    subCategorySelect.innerHTML = '<option value="">اختر التصنيف</option>';
    options.forEach(opt => {
        subCategorySelect.innerHTML += `<option value="${opt}">${opt}</option>`;
    });
}

// ربط الحدث عند تغيير الفئة الرئيسية
const categorySelect = document.getElementById('productCategory');
if (categorySelect) {
    categorySelect.addEventListener('change', updateSubCategoryOptions);
    updateSubCategoryOptions();
}




// ========== إضافة منتج إلى جديدنا من لوحة التحكم ==========
function addToNewArrivalsFromAdmin(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast("❌ المنتج غير موجود", "error");
        return;
    }
    
    let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals')) || [];
    if (newArrivals.some(p => p.id === productId)) {
        showToast(`⚠️ "${product.name}" موجود بالفعل في جديدنا`, "error");
        return;
    }
    
    let catText = "";
    if (product.category === "أعشاب طبيعية") catText = "عشبة طبية";
    else if (product.category === "زيوت مركزة") catText = "زيت عطري";
    else if (product.category === "بهارات") catText = "بهارات عربية";
    else if (product.category === "منتجات عناية") catText = "عناية شخصية";
    else catText = "منتج طبيعي";
    
    let section = "herbs";
    if (product.category === "زيوت مركزة") section = "oils";
    else if (product.category === "بهارات") section = "spices";
    else if (product.category === "منتجات عناية") section = "care";
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    newArrivals.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.image || "asset/images/placeholder.png",
        category: product.category,
        section: section,
        catText: catText,
        desc: product.usage || "منتج طبيعي",
        addedAt: new Date().toISOString(),
        expiryDate: expiryDate.toISOString()
    });
    
    localStorage.setItem('elixir_new_arrivals', JSON.stringify(newArrivals));
    showToast(`✅ تم إضافة "${product.name}" إلى قسم جديدنا لمدة 7 أيام ✨`);
}

// ========== إضافة عرض من لوحة التحكم ==========
function openOfferModalFromAdmin(productId) {
    let product = null;
    for(let i = 0; i < products.length; i++) {
        if(products[i].id == productId || products[i].product_id == productId) {
            product = products[i];
            break;
        }
    }
    
    if (!product) {
        showToast("❌ المنتج غير موجود!", "error");
        return;
    }
    
    // منع إضافة عرض لمنتج مخفي
    if (product.active == 0 || product.active == false) {
        showToast("⚠️ لا يمكن إضافة عرض لمنتج مخفي! قم بتفعيل المنتج أولاً", "error");
        return;
    }
    
    // ✅ اليوم كحد أدنى (ما في داعي لبدء العرض)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    
    // ✅ تاريخ انتهاء افتراضي بعد 30 يوم
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const defaultDate = defaultEndDate.toISOString().split('T')[0];
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[400]';
    overlay.innerHTML = `
        <div class="bg-white rounded-3xl p-8 w-96 text-center shadow-2xl">
            <h3 class="text-2xl font-bold mb-4 text-elixir">🏷️ إضافة "${product.name}" إلى العروض</h3>
            
            <div class="mb-4">
                <label class="block text-right text-sm font-bold mb-2">💰 نسبة الخصم (%)</label>
                <input type="number" id="discountPercent" placeholder="مثال: 20" min="1" max="90" class="w-full border rounded-xl p-3 text-center" required>
                <p class="text-xs text-slate-400 text-right mt-1">من 1% إلى 90%</p>
            </div>
            
            <div class="mb-4">
                <label class="block text-right text-sm font-bold mb-2">📅 تاريخ انتهاء العرض (اختياري)</label>
                <input type="date" id="endDate" value="${defaultDate}" min="${minDate}" class="w-full border rounded-xl p-3">
                <p class="text-xs text-slate-400 text-right mt-1">⚠️ اتركه فارغاً لجعل العرض دائماً</p>
            </div>
            
            <div class="bg-amber-50 p-3 rounded-xl mb-4 text-right">
                <p class="text-xs text-amber-700"><i class="fas fa-info-circle ml-1"></i> تاريخ بدء العرض هو اليوم تلقائياً</p>
            </div>
            
            <div class="flex gap-3 mt-6">
                <button id="confirmOfferBtn" class="flex-1 bg-elixir text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">تأكيد</button>
                <button id="cancelOfferBtn" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('confirmOfferBtn').onclick = () => {
        const discountPercent = parseInt(document.getElementById('discountPercent').value);
        if (!discountPercent || discountPercent < 1 || discountPercent > 90) {
            showToast("⚠️ الرجاء إدخال نسبة خصم صحيحة (1-90)", "error");
            return;
        }
        const endDate = document.getElementById('endDate').value;
        
        // ✅ جلب العروض الحالية
        let offers = JSON.parse(localStorage.getItem('elixir_offers') || '[]');
        
        // ✅ التأكد من عدم وجود عرض مكرر لنفس المنتج
        const existingIndex = offers.findIndex(o => o.productId == product.id);
        const newPrice = (product.price * (100 - discountPercent) / 100).toFixed(2);
        
        const offerData = {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImg: product.image || "asset/images/placeholder.png",
            discount: discountPercent,
            newPrice: newPrice,
            startDate: new Date().toISOString().split('T')[0],  // تاريخ اليوم تلقائياً
            endDate: endDate || "",
            active: true,
            createdAt: new Date().toISOString()
        };
        
        if (existingIndex !== -1) {
            // تعديل عرض موجود
            offers[existingIndex] = { ...offers[existingIndex], ...offerData };
            showToast(`✅ تم تحديث عرض "${product.name}" بنجاح`, "success");
        } else {
            // إضافة عرض جديد
            offers.push(offerData);
            showToast(`✅ تم إضافة "${product.name}" إلى العروض بخصم ${discountPercent}%`, "success");
        }
        
        localStorage.setItem('elixir_offers', JSON.stringify(offers));
        
        // ✅ تحديث العرض في لوحة التحكم
        if (typeof renderOffers === 'function') renderOffers();
        
        overlay.remove();
    };
    
    document.getElementById('cancelOfferBtn').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}


// ========== إضافة عرض للبكج (Package) ==========
// ========== إضافة عرض للمجموعة (Package) - نفس شكل نافذة المنتجات ==========
function openOfferModalForPackage(packageId) {
    const pkg = packagesList.find(p => p.id === packageId);
    if (!pkg) {
        showToast("❌ المجموعة غير موجودة", "error");
        return;
    }

    //  التحقق من أن البكج غير مخفي 
    if (pkg.active == false) {
        showToast("⚠️ لا يمكن إضافة عرض لبكج مخفي! قم بتفعيل البكج أولاً", "error");
        return;
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    const defaultDate = defaultEndDate.toISOString().split('T')[0];
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[400]';
    overlay.innerHTML = `
        <div class="bg-white rounded-3xl p-8 w-96 text-center shadow-2xl">
            <h3 class="text-2xl font-bold mb-4">🎯 إضافة "${pkg.name}" إلى العروض</h3>
            <input type="number" id="discountPercentPackage" placeholder="نسبة الخصم (%)" min="1" max="90" class="w-full border rounded-xl p-3 mb-4">
            <label class="block text-right text-sm mb-2">📅 تاريخ انتهاء العرض:</label>
            <input type="date" id="endDatePackage" value="${defaultDate}" min="${minDate}" class="w-full border rounded-xl p-3 mb-2">
            <p class="text-xs text-slate-400 text-right mb-4">⚠️ إذا تركت التاريخ فارغاً سيكون العرض دائماً</p>
            <div class="flex gap-3">
                <button id="confirmOfferPackageBtn" class="flex-1 bg-elixir text-white py-2 rounded-xl font-bold">تأكيد</button>
                <button id="cancelOfferPackageBtn" class="flex-1 bg-gray-200 py-2 rounded-xl font-bold">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('confirmOfferPackageBtn').onclick = () => {
        const discountPercent = parseInt(document.getElementById('discountPercentPackage').value);
        if (!discountPercent || discountPercent < 1 || discountPercent > 90) {
            showToast("⚠️ الرجاء إدخال نسبة خصم صحيحة (1-90)", "error");
            return;
        }
        const endDate = document.getElementById('endDatePackage').value;
        
        let offers = JSON.parse(localStorage.getItem('elixir_offers')) || [];
        const existingIndex = offers.findIndex(o => o.productId === packageId && o.section === "packages");
        const newPrice = (pkg.price * (100 - discountPercent) / 100).toFixed(2);
        
        const offerData = {
            id: Date.now(),
            productId: packageId,
            productName: pkg.name,
            productPrice: pkg.price,
            productImg: pkg.image || "asset/images/placeholder.png",
            discount: discountPercent,
            newPrice: newPrice,
            startDate: new Date().toISOString().split('T')[0],
            endDate: endDate || "",
            active: true,
            createdAt: new Date().toISOString(),
            section: "packages",
            category: pkg.category || "packages",
            desc: pkg.description || "بكج مميز",
            bgColor: pkg.bgColor,
            btnColor: pkg.btnColor
        };
        
        if (existingIndex !== -1) offers[existingIndex] = { ...offers[existingIndex], ...offerData };
        else offers.push(offerData);
        
        localStorage.setItem('elixir_offers', JSON.stringify(offers));
        overlay.remove();
        showToast(`✅ تم إضافة "${pkg.name}" إلى العروض بخصم ${discountPercent}% ✨`);
        if (typeof renderOffers === 'function') renderOffers();
    };
    
    document.getElementById('cancelOfferPackageBtn').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

// ========== إدارة الطلبات - نظام البطاقات ==========

// ========== إدارة الطلبات - بطاقات مثل الصورة ==========
function renderOrdersCards() {
    const container = document.getElementById('ordersCardsContainer');
    const noMsg = document.getElementById('noOrdersMessage');
    if (!container) return;
    
    if (orders.length === 0) {
        if (noMsg) noMsg.classList.remove('hidden');
        container.innerHTML = '';
        document.getElementById('ordersCount').innerText = '0 طلب';
        return;
    }
    
    if (noMsg) noMsg.classList.add('hidden');
    
    let html = '';
    orders.forEach(order => {
        // حالة الطلب
        let statusText = order.status || 'جديد';
        let statusClass = '';
        switch(statusText) {
            case 'pending': statusText = '⏳ قيد المعالجة'; statusClass = 'bg-yellow-100 text-yellow-700'; break;
            case 'processing': statusText = '🔧 قيد التجهيز'; statusClass = 'bg-blue-100 text-blue-700'; break;
            case 'shipped': statusText = '🚚 تم الشحن'; statusClass = 'bg-purple-100 text-purple-700'; break;
            case 'delivered': statusText = '✅ تم التسليم'; statusClass = 'bg-green-100 text-green-700'; break;
            default: statusText = '📋 جديد'; statusClass = 'bg-green-100 text-green-700';
        }
        
        // اسم الموظف المسند
        let assignedName = 'غير مسند';
        if (order.assignedTo) {
            const emp = employees.find(e => e.id === order.assignedTo);
            assignedName = emp ? emp.name : 'موظف غير موجود';
        }
        
        // عرض المنتجات
        const itemsHtml = (order.items || []).map(item => `
            <div class="product-item">
                <span class="product-name">${item.name}</span>
                <span class="product-qty">x${item.qty || item.quantity || 1}</span>
                <span class="product-price">${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)} ₪</span>
            </div>
        `).join('');
        
        // عرض بيانات العميل
        const customerFields = [
            { label: "👤 الاسم", value: order.customer || order.name || 'غير محدد' },
            { label: "📞 الهاتف", value: order.phone || 'غير محدد' },
            { label: "📍 العنوان", value: order.address || 'غير محدد' },
            { label: "💳 طريقة الدفع", value: order.payment || 'غير محدد' }
        ];
        
        const customerHtml = customerFields.map(field => `
            <div class="customer-field">
                <span class="field-label">${field.label}</span>
                <span class="field-value">${field.value}</span>
            </div>
        `).join('');
        
        html += `
            <div class="order-card" data-id="${order.id}">
                <div class="order-header">
                    <div class="order-number">
                        <i class="fas fa-clipboard-list"></i> طلب رقم: ${order.id}
                    </div>
                    <div class="order-date">
                        <i class="far fa-calendar-alt"></i> ${order.date}
                    </div>
                    <div class="order-status-badge ${statusClass}">${statusText}</div>
                </div>
                
                <div class="order-body">
                    <div class="order-section products-section">
                        <div class="section-title">
                            <i class="fas fa-boxes"></i> المنتجات
                        </div>
                        <div class="products-list">
                            ${itemsHtml || '<div class="text-slate-400 text-center py-2">لا توجد منتجات</div>'}
                        </div>
                    </div>
                    
                    <div class="order-section customer-section">
                        <div class="section-title">
                            <i class="fas fa-user"></i> بيانات العميل
                        </div>
                        ${customerHtml}
                        <div class="total-amount">
                            <span>💰 الإجمالي</span>
                            <span>${(order.total || 0).toFixed(2)} ₪</span>
                        </div>
                    </div>
                    
                    <div class="order-section assignment-section">
                        <div class="section-title">
                            <i class="fas fa-user-tie"></i> تعيين الموظف
                        </div>
                        <div class="assigned-info">
                            <div class="assigned-label">مسند إلى</div>
                            <div class="assigned-name">
                                <i class="fas fa-user-check"></i> ${assignedName}
                            </div>
                        </div>
                        <select class="employee-select" onchange="updateOrderAssignmentCard(${order.id}, this.value)">
                            <option value="">-- اختر موظف --</option>
                            ${employees.map(emp => `<option value="${emp.id}" ${order.assignedTo === emp.id ? 'selected' : ''}>👤 ${emp.name} (${emp.role})</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="order-actions">
                    // داخل الـ html حق orders-actions، غير options الـ select:
<select class="status-select" onchange="updateOrderStatusCard(${order.id}, this.value)">
    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}> قيد المعالجة</option>
    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}> قيد التجهيز</option>
    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}> تم التجهيز</option>
    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}> تم الشحن</option>
    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}> تم التسليم</option>
    <option value="returned" ${order.status === 'returned' ? 'selected' : ''}>↩ تم الإرجاع</option>
</select>
                    <button class="btn-delete" onclick="deleteOrderCard(${order.id})">
                        <i class="fas fa-trash-alt"></i> حذف الطلب
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('ordersCount').innerText = `${orders.length} طلب`;
    // تحديث الرسم البياني للأكثر مبيعاً بعد تحديث الطلبات
if (typeof updateBestSellingChart === 'function') updateBestSellingChart();
}

// تحديث حالة الطلب (نسخة البطاقات)
window.updateOrderStatusCard = function(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        order.lastUpdated = new Date().toISOString();
        saveAllData();
        renderOrdersCards();
        
        let statusText = '';
        switch(newStatus) {
            case 'pending': statusText = 'قيد المعالجة'; break;
            case 'processing': statusText = 'قيد التجهيز'; break;
            case 'ready': statusText = 'تم التجهيز'; break;
            case 'shipped': statusText = 'تم الشحن'; break;
            case 'delivered': statusText = 'تم التسليم'; break;
            case 'returned': statusText = 'تم الإرجاع'; break;
            default: statusText = newStatus;
        }
        
        showToast(`✅ تم تحديث حالة الطلب #${orderId} إلى ${statusText}`, "success");
        addToActivityLog(`تم تحديث حالة الطلب #${orderId} إلى ${statusText}`);
    }
};

// تعيين الطلب لموظف (نسخة البطاقات)
window.updateOrderAssignmentCard = function(orderId, employeeId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const empId = employeeId ? parseInt(employeeId) : null;
        order.assignedTo = empId;
        order.lastUpdated = new Date().toISOString();
        saveAllData();
        renderOrdersCards();
        const empName = empId ? (employees.find(e => e.id === empId)?.name || 'موظف') : 'غير مسند';
        showToast(`✅ تم تعيين الطلب #${orderId} إلى ${empName}`, "success");
        addToActivityLog(`تم تعيين الطلب #${orderId} إلى الموظف ${empName}`);
    }
};

// عرض تفاصيل الطلب (نسخة البطاقات)
window.showOrderDetailsCard = function(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const itemsDetails = order.items.map(item => `
        <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span>${item.name}</span>
            <span>× ${item.qty || item.quantity || 1}</span>
            <span class="font-bold">${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)} ₪</span>
        </div>
    `).join('');
    
    const content = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 p-3 rounded-xl">
                    <p class="text-xs text-slate-400">رقم الطلب</p>
                    <p class="font-bold">#${order.id}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl">
                    <p class="text-xs text-slate-400">العميل</p>
                    <p class="font-bold">${order.customer || 'غير محدد'}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl">
                    <p class="text-xs text-slate-400">التاريخ</p>
                    <p class="font-bold">${order.date}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl">
                    <p class="text-xs text-slate-400">الإجمالي</p>
                    <p class="font-bold text-elixir">${order.total?.toFixed(2) || '0.00'} ₪</p>
                </div>
                ${order.phone ? `<div class="bg-slate-50 p-3 rounded-xl col-span-2">
                    <p class="text-xs text-slate-400">رقم الهاتف</p>
                    <p class="font-bold">${order.phone}</p>
                </div>` : ''}
                ${order.address ? `<div class="bg-slate-50 p-3 rounded-xl col-span-2">
                    <p class="text-xs text-slate-400">العنوان</p>
                    <p class="font-bold">${order.address}</p>
                </div>` : ''}
            </div>
            <div class="bg-slate-50 p-3 rounded-xl">
                <p class="text-xs text-slate-400 mb-2">المنتجات</p>
                <div class="space-y-1">
                    ${itemsDetails || '<p class="text-slate-400">لا توجد منتجات</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsContent').innerHTML = content;
    document.getElementById('orderDetailsModal').classList.remove('hidden');
};

// حذف الطلب (نسخة البطاقات)
window.deleteOrderCard = function(orderId) {
    customConfirm("هل تريد حذف هذا الطلب نهائياً؟", () => {
        orders = orders.filter(o => o.id !== orderId);
        saveAllData();
        renderOrdersCards();
        showToast("✅ تم حذف الطلب", "success");
        addToActivityLog(`تم حذف الطلب رقم ${orderId}`);
    });
};

// تحديث الطلبات
function refreshOrdersData() {
    loadAllData();
    renderOrdersCards();
    showToast("🔄 تم تحديث بيانات الطلبات", "success");
}




// ========== رسم بياني للمنتجات الأكثر مبيعاً ==========
function updateBestSellingChart() {
    const bestSelling = getBestSellingProductsFromOrders(6); // أول 6 منتجات
    
    const labels = bestSelling.map(item => item.name.length > 15 ? item.name.substring(0, 12) + '...' : item.name);
    const data = bestSelling.map(item => item.total);
    
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    // تدمير الرسم البياني القديم إذا كان موجوداً
    if (window.bestSellingChart) {
        window.bestSellingChart.destroy();
    }
    
    window.bestSellingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'الكمية المباعة (قطعة)',
                data: data,
                backgroundColor: '#438e56',
                borderRadius: 8,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 12, family: 'Cairo' } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `الكمية: ${context.raw} قطعة`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'عدد القطع المباعة',
                        font: { size: 12, family: 'Cairo' }
                    },
                    grid: { color: '#e0e0e0' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'المنتجات',
                        font: { size: 12, family: 'Cairo' }
                    },
                    ticks: { font: { size: 11, family: 'Cairo' } }
                }
            }
        }
    });
}

// استدعاء الدالة عند تحميل الصفحة وبعد كل تحديث للطلبات
function refreshBestSellingChart() {
    updateBestSellingChart();
}

// تحديث الرسم البياني بعد تغيير الطلبات
window.updateBestSellingChart = updateBestSellingChart;

 // ========== رسم بياني لتوزيع الفئات (من قاعدة البيانات - مباشر) ==========
function updateCategoryChart() {
    console.log("🔄 جاري تحديث الرسم البياني من API...");
    
    fetch('api/get_all_products.php')
        .then(res => res.json())
        .then(data => {
            console.log("📊 البيانات المستلمة:", data);
            
            if (data.error || !Array.isArray(data)) {
                console.error("❌ خطأ في البيانات:", data);
                return;
            }
            
            let categoryStats = {
                'أعشاب طبيعية': 0,
                'زيوت مركزة': 0,
                'منتجات عناية': 0,
                'بهارات': 0
            };
            
            data.forEach(product => {
                if (categoryStats.hasOwnProperty(product.category)) {
                    categoryStats[product.category]++;
                }
            });
            
            const labels = ['أعشاب', 'زيوت', 'عناية', 'بهارات'];
            const values = [
                categoryStats['أعشاب طبيعية'],
                categoryStats['زيوت مركزة'],
                categoryStats['منتجات عناية'],
                categoryStats['بهارات']
            ];
            
            console.log("📊 القيم النهائية:", values);
            
            const canvas = document.getElementById('categoryChart');
            if (!canvas) {
                console.error("❌ عنصر categoryChart غير موجود!");
                return;
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("❌ لا يمكن الحصول على context للرسم!");
                return;
            }
            
            // ✅ التحقق الآمن من وجود الرسم البياني القديم
            if (window.categoryChart && typeof window.categoryChart.destroy === 'function') {
                window.categoryChart.destroy();
            }
            
            // ✅ إنشاء رسم بياني جديد
            window.categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: ['#438e56', '#87ba93', '#1a2e21', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '70%',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { font: { size: 12 } } },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percent = total ? Math.round((context.raw / total) * 100) : 0;
                                    return `${context.label}: ${context.raw} منتج (${percent}%)`;
                                }
                            }
                        }
                    }
                }
            });
            
            console.log("✅ تم إنشاء الرسم البياني بنجاح!");
        })
        .catch(error => {
            console.error("❌ خطأ في جلب البيانات:", error);
        });
}






// ========== دوال معاينة الصورة ==========
function openImagePreview(imageUrl) {
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    if (modal && img && imageUrl && imageUrl !== "") {
        img.src = imageUrl;
        modal.classList.remove('hidden');
    } else {
        showToast("⚠️ لا توجد صورة لهذا المنتج", "error");
    }
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('previewImage').src = '';
    }
}

// إغلاق بالضغط على ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImagePreview();
    }
});







// ========== إدارة منتجات الجملة ==========
// تحميل منتجات الجملة من API
function loadWholesaleProductsList() {
    console.log("جاري تحميل منتجات الجملة...");
   fetch('api/wholesale_products.php')
        .then(response => response.json())
        .then(data => {
            console.log("تم تحميل المنتجات:", data);
            if (Array.isArray(data)) {
                wholesaleProductsList = data;
            } else {
                wholesaleProductsList = [];
            }
            renderWholesaleProductsTable();
        })
        .catch(error => {
            console.error('خطأ في جلب المنتجات:', error);
            wholesaleProductsList = [];
            renderWholesaleProductsTable();
        });
}

function saveWholesaleProductsList() {
    localStorage.setItem('elixir_wholesale_products_list', JSON.stringify(wholesaleProductsList));
}

function renderWholesaleProductsTable() {
    const tbody = document.getElementById('wholesaleProductsTableBody');
    if (!tbody) return;
    
    if (!wholesaleProductsList || wholesaleProductsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-400">لا توجد منتجات جملة، أضف منتجاً</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    wholesaleProductsList.forEach(prod => {
        const productName = prod.product_name || prod.productName || 'غير محدد';
        const category = prod.category || 'غير محدد';
        const retailPrice = prod.retail_price || prod.retailPrice || 0;
        const wholesalePrice = prod.wholesale_price || prod.wholesalePrice || 0;
        const prodId = prod.id;
        const isHidden = prod.hidden === 1;
        const eyeIcon = isHidden ? 'fa-eye-slash' : 'fa-eye';
        const eyeColor = isHidden ? 'text-gray-400' : 'text-green-600';
        
        // ✅ هون التغيير المهم - استخدم openEditWholesalePriceModal بدل openEditWholesaleModal
        tbody.innerHTML += `
            <tr class="border-b hover:bg-slate-50 ${isHidden ? 'opacity-50 bg-gray-50' : ''}">
                <td class="py-3">
                    <div class="flex items-center gap-3">
                        <span class="font-bold">${productName}</span>
                    </div>
                 </td>
                 <td>${category}</td>
                 <td class="text-slate-500">${parseFloat(retailPrice).toFixed(2)} ₪</td>
                 <td class="text-elixir font-bold">${parseFloat(wholesalePrice).toFixed(2)} ₪</td>
                 <td>
                    <i class="fas ${eyeIcon} ${eyeColor} cursor-pointer ml-3 text-lg hover:opacity-75 transition" 
                       onclick="toggleWholesaleProductVisibility(${prodId})" 
                       title="${isHidden ? 'إظهار المنتج' : 'إخفاء المنتج'}"></i>
                    <i class="fas fa-edit text-slate-500 hover:text-elixir cursor-pointer ml-2" 
                       onclick="openEditWholesalePriceModal(${prodId})" title="تعديل السعر"></i>
                    <i class="fas fa-trash-alt text-slate-500 hover:text-red-500 cursor-pointer" 
                       onclick="deleteWholesaleProductItem(${prodId})" title="حذف"></i>
                   </td>
             </tr>
        `;
    });
}




// تبديل حالة إخفاء/إظهار منتج الجملة
window.toggleWholesaleProductVisibility = function(id) {
    const product = wholesaleProductsList.find(p => p.id === id);
    if (!product) return;
    
    const currentHidden = product.hidden === 1;
    const newHidden = currentHidden ? 0 : 1;
    const action = newHidden === 1 ? 'إخفاء' : 'إظهار';
    
    fetch('api/wholesale_products.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, hidden: newHidden })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(`✅ تم ${action} المنتج ${product.product_name || product.productName}`, "success");
            loadWholesaleProductsList();
        } else {
            showToast(data.error || "حدث خطأ", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("خطأ في الاتصال بالخادم", "error");
    });
};

// فتح مودال إضافة منتج للجملة
// فتح مودال إضافة منتج للجملة
window.openWholesaleProductModal = function() {
    console.log("جاري تحميل المنتجات من قاعدة البيانات...");
    const select = document.getElementById('wholesaleProductSelectStore');
    if (!select) {
        console.error("الـ select غير موجود");
        return;
    }
    
    // جلب المنتجات من قاعدة البيانات عبر API
    fetch('api/get_products.php')
        .then(res => res.json())
        .then(allProducts => {
            console.log("تم جلب المنتجات:", allProducts);
            
            // جلب المنتجات المضافة مسبقاً للجملة
            fetch('api/wholesale_products.php')
                .then(res => res.json())
                .then(existingProducts => {
                    // التأكد من أن existingProducts مصفوفة
                    const existingProductIds = Array.isArray(existingProducts) ? existingProducts.map(p => p.product_id) : [];
                    
                    // فلترة المنتجات التي لم تضف بعد
                    // ملاحظة: استخدم product_id بدلاً من id
                    const availableProducts = allProducts.filter(p => !existingProductIds.includes(p.product_id));
                    
                    select.innerHTML = '<option value="">-- اختر منتج --</option>';
                    availableProducts.forEach(p => {
                        // استخدم product_id بدلاً من id
                        select.innerHTML += `<option value="${p.product_id}" data-name="${p.product_name}" data-category="${p.category}" data-price="${p.price}" data-img="${p.image || ''}">${p.product_name} (${p.category} - ${p.price} ₪)</option>`;
                    });
                    
                    if (availableProducts.length === 0) {
                        select.innerHTML = '<option value="">-- جميع المنتجات مضافه --</option>';
                        showToast("جميع المنتجات مضاف مسبقاً لقائمة الجملة", "info");
                    } else {
                        showToast(`✅ تم تحميل ${availableProducts.length} منتج متاح`, "success");
                    }
                })
                .catch(err => {
                    console.error("خطأ في جلب منتجات الجملة:", err);
                    showToast("حدث خطأ في تحميل البيانات", "error");
                });
        })
        .catch(error => {
            console.error('خطأ في جلب المنتجات من قاعدة البيانات:', error);
            showToast("حدث خطأ في جلب المنتجات من قاعدة البيانات", "error");
        });
    
    document.getElementById('wholesaleProductModalTitle').innerText = "➕ إضافة منتج للجملة";
    document.getElementById('editWholesaleProductItemId').value = '';
    document.getElementById('wholesaleProductPriceStore').value = '';
    document.getElementById('wholesaleProductModalForm').classList.remove('hidden');
};

window.closeWholesaleProductModalForm = function() {
    document.getElementById('wholesaleProductModalForm').classList.add('hidden');
};

// حفظ منتج الجملة - يرسل البيانات إلى API
// حفظ منتج الجملة
window.saveWholesaleProductItem = function() {
    console.log("تم الضغط على زر حفظ");
    
    // جلب العناصر
    const select = document.getElementById('wholesaleProductSelectStore');
    const priceInput = document.getElementById('wholesaleProductPriceStore');
    
    // التحقق من وجود العناصر
    if (!select) {
        console.error("الـ select غير موجود");
        showToast("خطأ في النموذج", "error");
        return;
    }
    
    if (!priceInput) {
        console.error("حقل السعر غير موجود");
        showToast("خطأ في النموذج", "error");
        return;
    }
    
    // جلب القيم
    const selectedValue = select.value;
    const wholesalePrice = parseFloat(priceInput.value);
    
    console.log("selectedValue:", selectedValue);
    console.log("wholesalePrice:", wholesalePrice);
    console.log("selectedIndex:", select.selectedIndex);
    console.log("selectedOption:", select.options[select.selectedIndex]);
    
    // التحقق من اختيار منتج
    if (!selectedValue || selectedValue === "") {
        showToast("يرجى اختيار منتج", "error");
        return;
    }
    
    const productId = parseInt(selectedValue);
    
    if (isNaN(productId) || productId <= 0) {
        showToast("المنتج المختار غير صالح", "error");
        return;
    }
    
    if (isNaN(wholesalePrice) || wholesalePrice <= 0) {
        showToast("يرجى إدخال سعر جملة صحيح", "error");
        return;
    }
    
    // جلب اسم المنتج من الـ option
    const selectedOption = select.options[select.selectedIndex];
    const productName = selectedOption ? selectedOption.getAttribute('data-name') || selectedOption.textContent : 'المنتج';
    
    console.log("سيتم الإرسال:", { product_id: productId, wholesale_price: wholesalePrice, productName: productName });
    
    // إرسال الطلب إلى API
    fetch('api/wholesale_products.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: productId,
            wholesale_price: wholesalePrice
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("استجابة API:", data);
        if (data.success === true) {
            showToast(`✅ تم إضافة ${productName} إلى قائمة الجملة`, "success");
            loadWholesaleProductsList();
            closeWholesaleProductModalForm();
        } else {
            showToast(data.error || "حدث خطأ في الإضافة", "error");
        }
    })
    .catch(error => {
        console.error("خطأ في الاتصال:", error);
        showToast("خطأ في الاتصال بالخادم", "error");
    });
};






// حذف منتج الجملة
window.deleteWholesaleProductItem = function(id) {
    const product = wholesaleProductsList.find(p => p.id === id);
    if (!product) return;
    
    customConfirm(`⚠️ هل تريد حذف "${product.product_name || product.productName}" من قائمة منتجات الجملة نهائياً؟`, () => {
        fetch('api/wholesale_products.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast("🗑️ تم الحذف بنجاح", "success");
                loadWholesaleProductsList();
            } else {
                showToast(data.error || "حدث خطأ", "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast("خطأ في الاتصال بالخادم", "error");
        });
    });
};












// ========== دوال تعديل منتج الجملة - الحل النهائي ==========

// فتح نافذة تعديل السعر - النسخة المصححة
window.openEditWholesalePriceModal = function(id) {
    console.log("✅ تم الضغط على تعديل للمنتج رقم:", id);
    
    // البحث عن المنتج في القائمة
    let product = null;
    for (let i = 0; i < wholesaleProductsList.length; i++) {
        if (wholesaleProductsList[i].id == id) {
            product = wholesaleProductsList[i];
            break;
        }
    }
    
    if (!product) {
        showToast("❌ المنتج غير موجود في القائمة", "error");
        return;
    }
    
    const productName = product.product_name || product.productName || "غير محدد";
   let currentPrice = product.wholesale_price || product.wholesalePrice || 0;
currentPrice = parseFloat(currentPrice);
if (isNaN(currentPrice)) currentPrice = 0;
    
    // ✅ تحويل currentPrice إلى رقم إذا كان نصاً
    currentPrice = parseFloat(currentPrice);
    if (isNaN(currentPrice)) currentPrice = 0;
    
    console.log("اسم المنتج:", productName);
    console.log("السعر الحالي:", currentPrice);
    
    // تعبئة البيانات في المودال
    const priceIdInput = document.getElementById('editWholesalePriceId');
    const productDisplay = document.getElementById('editWholesalePriceProductDisplay');
    const currentPriceDisplay = document.getElementById('editWholesalePriceCurrentPriceDisplay');
    const newPriceInput = document.getElementById('editWholesalePriceNewPrice');
    
    if (!priceIdInput || !productDisplay || !currentPriceDisplay || !newPriceInput) {
        console.error("❌ عناصر المودال غير موجودة في الـ HTML");
        showToast("خطأ: عناصر المودال غير موجودة", "error");
        return;
    }
    
    priceIdInput.value = id;
    productDisplay.innerHTML = productName;
    currentPriceDisplay.innerHTML = currentPrice.toFixed(2) + ' ₪';
    newPriceInput.value = currentPrice;
    
    // إظهار المودال
    const modal = document.getElementById('editWholesalePriceModal');
    if (modal) {
        modal.classList.remove('hidden');
        console.log("✅ تم فتح نافذة التعديل للمنتج: " + productName);
        showToast("✅ نافذة التعديل مفتوحة", "success");
    } else {
        console.error("❌ المودال editWholesalePriceModal غير موجود في الـ HTML");
        showToast("خطأ: نافذة التعديل غير موجودة", "error");
    }
};

// إغلاق نافذة التعديل
window.closeEditWholesalePriceModal = function() {
    const modal = document.getElementById('editWholesalePriceModal');
    if (modal) modal.classList.add('hidden');
    document.getElementById('editWholesalePriceNewPrice').value = '';
};

// حفظ التعديل
window.saveWholesalePriceEdit = function() {
    const id = parseInt(document.getElementById('editWholesalePriceId').value);
    const newPrice = parseFloat(document.getElementById('editWholesalePriceNewPrice').value);
    
    if (isNaN(newPrice) || newPrice <= 0) {
        showToast("❌ يرجى إدخال سعر صحيح أكبر من 0", "error");
        return;
    }
    
    fetch('api/wholesale_products.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, wholesale_price: newPrice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("✅ تم تحديث السعر بنجاح", "success");
            window.closeEditWholesalePriceModal();
            loadWholesaleProductsList(); // تحديث الجدول
        } else {
            showToast(data.error || "حدث خطأ أثناء التحديث", "error");
        }
    })
    .catch(error => {
        console.error("خطأ:", error);
        showToast("خطأ في الاتصال بالخادم", "error");
    });
};

// تأكيد أن الدوال معرفة
console.log("✅ دوال تعديل منتجات الجملة تم تحميلها بنجاح");











// تحميل المنتجات من قاعدة البيانات
async function loadProductsFromDatabase() {
    try {
        const response = await fetch('api/get_all_products.php');
        const data = await response.json();
        
        console.log("📦 البيانات من API:", data);
        
        if (!data.error && Array.isArray(data)) {
            products = data;
            console.log("✅ تم تحميل", products.length, "منتج");
            renderProductsTable();
            document.getElementById('totalProductsCount').innerText = products.length;
            document.getElementById('outOfStockCounter').innerText = products.filter(p => p.stock == 0).length;
            
           
           
        }
    } catch(error) {
        console.error("خطأ في جلب المنتجات:", error);
    }
}






// تصحيح الإحصائيات
function refreshStats() {
    const totalProducts = document.getElementById('totalProductsCount');
    const outOfStock = document.getElementById('outOfStockCounter');
    const activeTasks = document.getElementById('activeTasksCount');
    
    if (totalProducts) totalProducts.innerText = products.length;
    if (outOfStock) outOfStock.innerText = products.filter(p => p.stock === 0).length;
    if (activeTasks) {
        const totalTasks = employees.reduce((s, e) => s + (e.tasks?.length || 0), 0);
        activeTasks.innerText = totalTasks;
    }
}

setTimeout(refreshStats, 100);




// ========== دالة تبديل حالة المنتج (تفعيل/تعطيل) ==========
// ========== دالة تبديل حالة المنتج (تفعيل/تعطيل) - النسخة النهائية ==========
window.toggleProductActive = function(productId) {
    console.log("🔥 تم النقر على المنتج:", productId);
    
    // البحث عن المنتج
    let product = null;
    for(let i = 0; i < products.length; i++) {
        if(products[i].product_id == productId || products[i].id == productId) {
            product = products[i];
            break;
        }
    }
    
    if(!product) {
        showToast("❌ المنتج غير موجود!", "error");
        return;
    }
    
    const newStatus = product.active == 1 ? 0 : 1;
    const action = newStatus == 1 ? 'تفعيل' : 'إخفاء';
    const productName = product.name || product.product_name;
    
    customConfirm(`⚠️ هل تريد ${action} المنتج "${productName}"؟`, async () => {
        const icon = document.querySelector(`.fa-eye, .fa-eye-slash[onclick*="toggleProductActive(${productId})"]`);
        if(icon) {
            icon.classList.remove('fa-eye', 'fa-eye-slash');
            icon.classList.add('fa-spinner', 'fa-spin');
        }
        
        try {
            const response = await fetch('api/update_product_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: product.product_id || product.id, 
                    active: newStatus 
                })
            });
            
            const result = await response.json();
            
            if(result.success) {
                product.active = newStatus;
                await loadProductsFromDatabase();
                renderProductsTable();
                
                if (newStatus === 0) {
                    // إخفاء: حذف من جديدنا ومن العروض
                    let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals') || '[]');
                    let filteredNew = newArrivals.filter(n => n.id != productId && n.id != product.product_id);
                    localStorage.setItem('elixir_new_arrivals', JSON.stringify(filteredNew));
                    
                    let offers = JSON.parse(localStorage.getItem('elixir_offers') || '[]');
                    let filteredOffers = offers.filter(o => o.productId != productId && o.productId != product.product_id);
                    localStorage.setItem('elixir_offers', JSON.stringify(filteredOffers));
                    
                    console.log(`🗑️ تم حذف المنتج "${productName}" من جديدنا ومن العروض بسبب إخفائه`);
                } else {
                    // ✅ تفعيل: نضيف العرض مرة أخرى إذا كان موجود أصلاً
                    // نتحقق إذا كان المنتج له عرض في localStorage قبل الإخفاء
                    let allOffers = JSON.parse(localStorage.getItem('elixir_offers_all') || '[]');
                    let originalOffer = allOffers.find(o => o.productId == productId || o.productId == product.product_id);
                    
                    if (originalOffer) {
                        // العرض موجود أصلاً، نعيد إضافته
                        let currentOffers = JSON.parse(localStorage.getItem('elixir_offers') || '[]');
                        if (!currentOffers.some(o => o.productId == productId || o.productId == product.product_id)) {
                            currentOffers.push(originalOffer);
                            localStorage.setItem('elixir_offers', JSON.stringify(currentOffers));
                            console.log(`✅ تم إعادة العرض للمنتج "${productName}" بعد التفعيل`);
                        }
                    }
                    
                    showToast(`✅ تم تفعيل المنتج "${productName}"`, "success");
                }
                
                showToast(`✅ تم ${action} المنتج "${productName}"`, "success");
            } else {
                showToast("❌ خطأ: " + (result.error || "فشل التحديث"), "error");
                renderProductsTable();
            }
        } catch(err) {
            console.error("خطأ:", err);
            showToast("❌ خطأ في الاتصال بالخادم", "error");
            renderProductsTable();
        }
    });
};




// ========== تنظيف المنتجات المنتهية من جديدنا تلقائياً ==========
function cleanExpiredNewArrivals() {
    let newArrivals = JSON.parse(localStorage.getItem('elixir_new_arrivals') || '[]');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let expiredCount = 0;
    let validArrivals = newArrivals.filter(product => {
        // إذا كان المنتج مخفي (active=0) أو تم حذفه من قاعدة البيانات، احذفه من جديدنا
        const stillExists = products.some(p => p.id == product.id);
        if (!stillExists) {
            expiredCount++;
            return false;
        }
        
        // إذا كان عنده expiryDate وانتهى، احذفه
        if (product.expiryDate) {
            const expiryDate = new Date(product.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);
            if (expiryDate < today) {
                expiredCount++;
                return false;
            }
        }
        return true;
    });
    
    if (expiredCount > 0) {
        localStorage.setItem('elixir_new_arrivals', JSON.stringify(validArrivals));
        console.log(` تم إزالة ${expiredCount} منتج/ة منتهية من جديدنا`);
    }
}





// ========== مزامنة المهام مع الموظفين (الإضافة الجديدة) ==========

// 1. تعديل دالة addManualTask عشان ترسل المهمة للموظف
const originalAddManualTask = addManualTask;
window.addManualTask = function() {
    const empId = parseInt(document.getElementById('targetEmployeeId').value);
    const emp = employees.find(e => e.id === empId);
    if (!emp) { showToast("موظف غير موجود", "error"); return; }
    
    const type = document.getElementById('taskType').value;
    let desc = document.getElementById('taskDescription').value.trim();
    
    if (type === 'restock') {
        const productId = parseInt(document.getElementById('restockProductId').value);
        const amount = parseInt(document.getElementById('restockAmount').value) || 5;
        const product = products.find(p => p.id === productId);
        if (!product) { showToast("اختر منتجاً", "error"); return; }
        desc = `🔄 إعادة تعبئة: ${product.name} (+${amount})`;
        
        const taskData = {
            id: Date.now(),
            text: desc,
            status: "pending",
            type: "restock",
            productId: productId,
            amount: amount,
            assignedAt: new Date().toLocaleString('ar-EG')
        };
        
        // إضافة للموظف في نظام الأدمن
        emp.tasks.push(taskData);
        
        // إرسال للموظف عبر localStorage
        syncTaskToEmployee(emp.email, taskData);
        
    } else {
        if (!desc) { showToast("أدخل وصف المهمة", "error"); return; }
        
        const taskData = {
            id: Date.now(),
            text: desc,
            status: "pending",
            type: "general",
            assignedAt: new Date().toLocaleString('ar-EG')
        };
        
        emp.tasks.push(taskData);
        syncTaskToEmployee(emp.email, taskData);
    }
    
    renderEmployeesCards();
    closeManualTaskModal();
    saveAllData();
    showToast(`✅ تم إضافة مهمة إلى ${emp.name} وتم إرسالها له`, "success");
    addToActivityLog(`تم إضافة مهمة للموظف ${emp.name}: ${desc}`);
};

// 2. دالة إرسال المهمة للموظف
function syncTaskToEmployee(employeeEmail, taskData) {
    // جلب بيانات الموظف من localStorage الخاص به
    let employeeData = localStorage.getItem(`elixir_employee_${employeeEmail}`);
    
    if (employeeData) {
        let empData = JSON.parse(employeeData);
        if (!empData.tasks) empData.tasks = [];
        empData.tasks.push(taskData);
        localStorage.setItem(`elixir_employee_${employeeEmail}`, JSON.stringify(empData));
        console.log(`✅ تم إرسال المهمة للموظف ${employeeEmail}`);
    } else {
        // إذا الموظف لم يسجل دخوله بعد، ننشئ له حساب جديد
        const emp = employees.find(e => e.email === employeeEmail);
        if (emp) {
            const newEmployeeData = {
                email: emp.email,
                name: emp.name,
                role: emp.role,
                loggedIn: false,
                tasks: [taskData],
                completedTasks: [],
                cancelledTasks: []
            };
            localStorage.setItem(`elixir_employee_${employeeEmail}`, JSON.stringify(newEmployeeData));
            console.log(`✅ تم إنشاء حساب مؤقت للموظف ${employeeEmail} وحفظ المهمة`);
        }
    }
}

// 3. مراقبة المهام المنجزة من الموظفين (تشتغل كل 5 ثواني)
function startTaskWatcher() {
    setInterval(() => {
        employees.forEach(emp => {
            if (emp.email) {
                const employeeData = localStorage.getItem(`elixir_employee_${emp.email}`);
                if (employeeData) {
                    const empData = JSON.parse(employeeData);
                    
                    // التحقق من وجود مهام مكتملة جديدة
                    if (empData.completedTasks && empData.completedTasks.length > 0) {
                        empData.completedTasks.forEach(completedTask => {
                            // التأكد إنها ما انحطت قبل كدا
                            const alreadySynced = emp.tasks.some(t => t.id === completedTask.id && t.syncedToAdmin);
                            if (!alreadySynced) {
                                // إضافة سجل في الـ activity log
                                addToActivityLog(`✅ ${emp.name} أنجز المهمة: ${completedTask.text}`);
                                showToast(`🎉 إنجاز: ${emp.name} أكمل "${completedTask.text}"`, "success");
                                
                                // إذا كانت المهمة من نوع restock، نحدث المخزون
                                if (completedTask.type === 'restock' && completedTask.productId) {
                                    const product = products.find(p => p.id === completedTask.productId);
                                    if (product) {
                                        product.stock = (product.stock || 0) + (completedTask.amount || 0);
                                        renderProductsTable();
                                        addToActivityLog(`📦 تم تحديث مخزون ${product.name} +${completedTask.amount}`);
                                    }
                                }
                                
                                // وضع علامة إنه تمت مزامنتها
                                const taskInAdmin = emp.tasks.find(t => t.id === completedTask.id);
                                if (taskInAdmin) {
                                    taskInAdmin.syncedToAdmin = true;
                                    taskInAdmin.completedAt = completedTask.completedAt;
                                }
                                saveAllData();
                                renderEmployeesCards();
                            }
                        });
                    }
                }
            }
        });
    }, 5000); // كل 5 ثواني
}

// 4. تشغيل المراقبة عند تحميل الصفحة
setTimeout(() => {
    startTaskWatcher();
    console.log("✅ بدأ نظام مراقبة مهام الموظفين");
}, 3000);

// 5. تعديل دالة completeTask في الأدمن (لما الأدمن ينجز مهمة يدوي)
const originalCompleteTask = completeTask;
window.completeTask = function(empId, taskIndex) {
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.tasks[taskIndex]) return;
    const task = emp.tasks[taskIndex];
    if (task.completed) return;
    
    // تنفيذ المهمة
    if (task.action === 'restock' && task.productId) {
        const prod = products.find(p => p.id === task.productId);
        if (prod) { 
            prod.stock += task.amount; 
            showToast(`✅ تمت إعادة تعبئة ${prod.name} +${task.amount}`);
            addToActivityLog(`🔄 تم إعادة تعبئة ${prod.name} +${task.amount} بواسطة الأدمن`);
        }
    } else {
        showToast(`✅ تم إنجاز المهمة: ${task.desc}`);
        addToActivityLog(`✅ تم إنجاز المهمة "${task.desc}" للموظف ${emp.name} بواسطة الأدمن`);
    }
    
    task.completed = true;
    emp.tasks = emp.tasks.filter(t => !t.completed);
    
    // تحديث في localStorage حق الموظف
    if (emp.email) {
        const employeeData = localStorage.getItem(`elixir_employee_${emp.email}`);
        if (employeeData) {
            let empData = JSON.parse(employeeData);
            // إضافة للمهام المنجزة
            if (!empData.completedTasks) empData.completedTasks = [];
            empData.completedTasks.push({
                id: task.id,
                text: task.desc,
                type: task.action,
                completedAt: new Date().toLocaleString('ar-EG'),
                completedBy: "admin"
            });
            // حذف من المهام الحالية
            if (empData.tasks) {
                empData.tasks = empData.tasks.filter(t => t.id !== task.id);
            }
            localStorage.setItem(`elixir_employee_${emp.email}`, JSON.stringify(empData));
        }
    }
    
    renderEmployeesCards();
    renderProductsTable();
    saveAllData();
};

// 6. دالة إنشاء حساب للموظف عند إضافته (عشان يظهر في login)
const originalAddNewEmployee = addNewEmployee;
window.addNewEmployee = function() {
    const name = document.getElementById('empName')?.value.trim();
    const role = document.getElementById('empRole')?.value.trim() || "موظف";
    const email = document.getElementById('empEmail')?.value.trim();
    const password = document.getElementById('empPassword')?.value.trim();
    
    if (!name) { showToast("❌ أدخل اسم الموظف", "error"); return; }
    if (!email) { showToast("❌ أدخل البريد الإلكتروني", "error"); return; }
    if (!password) { showToast("❌ أدخل كلمة المرور", "error"); return; }
    if (employees.some(emp => emp.email === email)) {
        showToast("❌ هذا البريد الإلكتروني مسجل مسبقاً", "error");
        return;
    }
    
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 101;
    
    const newEmployee = {
        id: newId,
        name: name,
        role: role,
        email: email,
        password: password,
        tasks: [],
        createdAt: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    
    // إنشاء حساب للموظف في localStorage الخاص به
    const employeeAccount = {
        email: email,
        name: name,
        role: role,
        password: password,
        loggedIn: false,
        tasks: [],
        completedTasks: [],
        cancelledTasks: []
    };
    localStorage.setItem(`elixir_employee_${email}`, JSON.stringify(employeeAccount));
    
    saveAllData();
    renderEmployeesCards();
    closeEmployeeModal();
    showToast(`✅ تم إضافة الموظف ${name} بنجاح وتم إنشاء حساب له`, "success");
    addToActivityLog(`تم إضافة موظف جديد: ${name} (${email})`);
};






// استدعاء الدالة عند تحميل الصفحة
setTimeout(cleanExpiredNewArrivals, 1000);

// استدعاء الدالة كل ساعة للتنظيف
setInterval(cleanExpiredNewArrivals, 3600000);



// ✅ تأخير إنشاء الرسم البياني للأكثر مبيعاً
setTimeout(function() {
    if (typeof updateBestSellingChart === 'function') {
        updateBestSellingChart();
    } else {
        console.log("⚠️ updateBestSellingChart غير معرفة");
    }
}, 1000);
