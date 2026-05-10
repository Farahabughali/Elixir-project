// ------------------- بيانات عامة -------------------
let employees = [];
let products = [];
let orders = [];
let currentEmployeeId = null;

// ------------------- helper: توست -------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle');
    const bgClass = type === 'success' ? 'bg-[#1e3a2c]' : (type === 'error' ? 'bg-red-800' : 'bg-amber-700');
    toast.className = `${bgClass} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm pointer-events-auto transition-all duration-300`;
    toast.style.minWidth = '240px';
    toast.innerHTML = `<i class="fas ${icon} text-lg"></i><span class="font-medium text-sm">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

// ------------------- حفظ وتحليل البيانات -------------------
function saveToLocalStorage() {
    localStorage.setItem('elixir_products', JSON.stringify(products));
    localStorage.setItem('elixir_employees', JSON.stringify(employees));
    localStorage.setItem('elixir_orders', JSON.stringify(orders));
}

function loadData() {
    const storedProducts = localStorage.getItem('elixir_products');
    const storedEmployees = localStorage.getItem('elixir_employees');
    const storedOrders = localStorage.getItem('elixir_orders');

    if (storedProducts && storedEmployees) {
        products = JSON.parse(storedProducts);
        employees = JSON.parse(storedEmployees);
        orders = storedOrders ? JSON.parse(storedOrders) : [];
    } else {
        // بيانات أولية متوافقة مع الأدمن
        products = [
            { id: 1, name: "لافندر مجفف", category: "أعشاب طبيعية", price: 5.0, stock: 7, usage: "يساعد على الاسترخاء", warnings: "لا يستخدم للحوامل" },
            { id: 2, name: "زيت الأرغان العضوي", category: "زيوت مركزة", price: 12.5, stock: 3, usage: "ترطيب الشعر", warnings: "للاستخدام الخارجي" },
            { id: 3, name: "صابون الغار", category: "منتجات عناية", price: 4.0, stock: 0, usage: "مضاد للبكتيريا", warnings: "تجنب العين" }
        ];
        employees = [
            { id: 101, name: "سارة أحمد", role: "مديرة المخزون", tasks: [] },
            { id: 102, name: "محمد خالد", role: "مسؤول التغليف", tasks: [] }
        ];
        orders = [
            { id: 1001, customer: "ريما الحسن", items: [{name: "لافندر مجفف", qty: 2, price: 5.0}], total: 10.0, date: "2025-04-01", status: "pending", assignedTo: 101 },
            { id: 1002, customer: "ليلى عرفات", items: [{name: "زيت الأرغان", qty: 1, price: 12.5}], total: 12.5, date: "2025-04-02", status: "processing", assignedTo: 102 },
            { id: 1003, customer: "نور الشرق", items: [{name: "صابون الغار", qty: 3, price: 4.0}], total: 12.0, date: "2025-04-03", status: "shipped", assignedTo: 101 }
        ];
        // توليد مهام تلقائية أولية
        generateAndDistributeInitialTasks();
        saveToLocalStorage();
    }
}

// توليد مهام المخزون وتوزيعها (للتجربة)
function generateAndDistributeInitialTasks() {
    employees.forEach(emp => emp.tasks = []);
    const newTasks = [];
    products.forEach(prod => {
        if (prod.stock === 0) newTasks.push({ id: Date.now() + prod.id, desc: `🔄 إعادة تعبئة فورية: ${prod.name} (المخزون صفر)`, productId: prod.id, action: 'restock', amount: 10 });
        else if (prod.stock < 3) newTasks.push({ id: Date.now() + prod.id + 100, desc: `⚠️ مخزون منخفض: ${prod.name} (${prod.stock} قطع)`, productId: prod.id, action: 'restock', amount: 5 });
    });
    if (newTasks.length === 0 || employees.length === 0) return;
    let idx = 0;
    newTasks.forEach(task => {
        employees[idx % employees.length].tasks.push({ ...task, completed: false, assignedAt: new Date().toLocaleString() });
        idx++;
    });
}

// ------------------- عرض المهام -------------------
function renderTasksForEmployee(employee) {
    const container = document.getElementById('tasksContainer');
    const tasksCounterSpan = document.getElementById('tasksCounter');
    const pendingCountStat = document.getElementById('pendingCountStat');
    if (!employee) {
        container.innerHTML = `<div class="p-10 text-center text-slate-400 flex flex-col items-center gap-3">
            <i class="fas fa-user-slash text-4xl opacity-40"></i>
            <p>يرجى اختيار موظف لعرض المهام المسندة</p>
        </div>`;
        if(tasksCounterSpan) tasksCounterSpan.innerText = '0';
        if(pendingCountStat) pendingCountStat.innerText = '0';
        document.getElementById('currentEmployeeCard').classList.add('hidden');
        return;
    }

    document.getElementById('currentEmployeeCard').classList.remove('hidden');
    document.getElementById('currentEmpName').innerText = employee.name;
    document.getElementById('currentEmpRole').innerText = employee.role || 'موظف';
    document.getElementById('employeeAvatar').innerText = employee.name.charAt(0);
    
    const activeTasks = employee.tasks.filter(t => !t.completed);
    tasksCounterSpan.innerText = activeTasks.length;
    if(pendingCountStat) pendingCountStat.innerText = activeTasks.length;

    if (activeTasks.length === 0) {
        container.innerHTML = `<div class="p-10 text-center text-slate-400 flex flex-col items-center gap-3">
            <i class="fas fa-check-double text-4xl text-emerald-300"></i>
            <p class="font-medium">✨ لا توجد مهام معلقة ، أحسنت!</p>
        </div>`;
        return;
    }

    let tasksHtml = '';
    activeTasks.forEach(task => {
        let extraInfo = '';
        if (task.action === 'restock') {
            extraInfo = `<span class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full"><i class="fas fa-boxes"></i> إضافة ${task.amount} قطعة</span>`;
        }
        tasksHtml += `
            <div class="task-card bg-white p-5 border-b border-slate-100 hover:bg-slate-50/50">
                <div class="flex flex-wrap justify-between items-start gap-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-bold text-slate-800">${task.desc}</span>
                            ${extraInfo}
                        </div>
                        <div class="text-xs text-slate-400 mt-2"><i class="far fa-clock ml-1"></i> ${task.assignedAt || 'اليوم'}</div>
                    </div>
                    <button onclick="completeTask('${employee.id}', '${task.id}')" class="bg-[#438e56] hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm shadow-md flex items-center gap-2">
                        <i class="fas fa-check-circle"></i> إنجاز
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = tasksHtml;
}

// إنجاز مهمة (تحديث المخزون)
window.completeTask = function(empId, taskId) {
    const employee = employees.find(e => e.id == empId);
    if (!employee) { showToast("خطأ في الموظف", "error"); return; }
    const task = employee.tasks.find(t => t.id == taskId);
    if (!task || task.completed) { showToast("المهمة غير موجودة أو منجزة", "error"); return; }

    if (task.action === 'restock' && task.productId) {
        const product = products.find(p => p.id === task.productId);
        if (product) {
            product.stock += task.amount;
            showToast(`✅ تم إعادة تعبئة ${product.name} (+${task.amount})`, "success");
        }
    } else {
        showToast(`✅ تم إنجاز المهمة: ${task.desc}`, "success");
    }
    task.completed = true;
    employee.tasks = employee.tasks.filter(t => !t.completed);
    saveToLocalStorage();
    
    // إعادة تحميل واجهة الموظف الحالي
    const currentEmp = employees.find(e => e.id == currentEmployeeId);
    if (currentEmp) renderTasksForEmployee(currentEmp);
    renderLowStockAlerts();
    renderStaffOrders(); // تحديث الطلبات إذا كانت مرتبطة بهذا الموظف
};

// ------------------- عرض الطلبات الموكلة للموظف -------------------
function renderStaffOrders() {
    const container = document.getElementById('staffOrdersContainer');
    if (!container) return;
    if (!currentEmployeeId) {
        container.innerHTML = '<div class="text-center text-slate-400 text-sm py-6">اختر موظفاً لعرض الطلبات</div>';
        return;
    }
    const myOrders = orders.filter(order => order.assignedTo == currentEmployeeId);
    if (myOrders.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 text-sm py-6">✨ لا توجد طلبات موكلة إليك حالياً</div>';
        return;
    }

    let html = '';
    myOrders.forEach(order => {
        let statusText = '';
        let statusColor = '';
        switch(order.status) {
            case 'pending': statusText = 'قيد المعالجة'; statusColor = 'bg-yellow-100 text-yellow-700'; break;
            case 'processing': statusText = 'قيد التجهيز'; statusColor = 'bg-blue-100 text-blue-700'; break;
            case 'shipped': statusText = 'تم الشحن'; statusColor = 'bg-purple-100 text-purple-700'; break;
            case 'delivered': statusText = 'تم التسليم'; statusColor = 'bg-green-100 text-green-700'; break;
            default: statusText = 'غير محدد'; statusColor = 'bg-gray-100';
        }
        const itemsSummary = order.items.map(i => `${i.name} (${i.qty})`).join(', ');
        html += `
            <div class="border rounded-xl p-3 bg-white shadow-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="font-mono text-sm font-bold">#${order.id}</span>
                        <div class="text-xs text-slate-500">${order.customer}</div>
                        <div class="text-xs text-slate-400 mt-1">${itemsSummary}</div>
                        <div class="text-xs font-bold text-elixir mt-1">${order.total.toFixed(2)} JOD</div>
                    </div>
                    <select onchange="updateOrderStatus(${order.id}, this.value)" class="text-xs border rounded-lg p-1 bg-white ${statusColor}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد المعالجة</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد التجهيز</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
                    </select>
                </div>
                <div class="text-[10px] text-slate-400 mt-2">📅 ${new Date(order.date).toLocaleDateString('ar-EG')}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// تحديث حالة الطلب (يستخدمها الموظف)
window.updateOrderStatus = function(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveToLocalStorage();
        renderStaffOrders();
        showToast(`تم تحديث حالة الطلب #${orderId} إلى ${newStatus}`, "success");
    } else {
        showToast("الطلب غير موجود", "error");
    }
};

// ------------------- تنبيهات المخزون -------------------
function renderLowStockAlerts() {
    const lowStockDiv = document.getElementById('lowStockList');
    if (!products.length) { lowStockDiv.innerHTML = '<div class="text-center text-slate-400 text-sm py-4">لا توجد بيانات</div>'; return; }
    const critical = products.filter(p => p.stock === 0);
    const low = products.filter(p => p.stock > 0 && p.stock < 5);
    if (critical.length === 0 && low.length === 0) {
        lowStockDiv.innerHTML = '<div class="text-center text-emerald-600 text-sm py-6"><i class="fas fa-check-circle"></i> المخزون مستقر ✅</div>';
        return;
    }
    let html = '';
    if (critical.length) {
        html += `<div class="mb-3"><p class="text-xs font-bold text-red-600"><i class="fas fa-ban"></i> نفذ بالكامل</p>`;
        critical.forEach(p => html += `<div class="flex justify-between bg-red-50 p-2 rounded-xl mb-1"><span>${p.name}</span><span class="text-red-600">0</span></div>`);
        html += `</div>`;
    }
    if (low.length) {
        html += `<div><p class="text-xs font-bold text-amber-600"><i class="fas fa-exclamation-circle"></i> مخزون حرج (&lt;5)</p>`;
        low.forEach(p => html += `<div class="flex justify-between bg-amber-50 p-2 rounded-xl mb-1"><span>${p.name}</span><span class="text-amber-700">${p.stock}</span></div>`);
        html += `</div>`;
    }
    lowStockDiv.innerHTML = html;
}

// ------------------- قائمة الموظفين -------------------
function populateEmployeeDropdown() {
    const select = document.getElementById('employeeSelect');
    select.innerHTML = '<option value="">-- اختر الموظف --</option>';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = `${emp.name} - ${emp.role || 'موظف'}`;
        select.appendChild(option);
    });
}

function onEmployeeChange() {
    const select = document.getElementById('employeeSelect');
    const empId = select.value;
    if (!empId) {
        currentEmployeeId = null;
        renderTasksForEmployee(null);
        renderStaffOrders();
        document.getElementById('currentEmployeeCard').classList.add('hidden');
        return;
    }
    const employee = employees.find(e => e.id == parseInt(empId));
    if (employee) {
        currentEmployeeId = employee.id;
        renderTasksForEmployee(employee);
        renderStaffOrders();
    } else {
        renderTasksForEmployee(null);
        renderStaffOrders();
    }
}

// ------------------- تحديث يدوي -------------------
function fullRefresh() {
    const storedProducts = localStorage.getItem('elixir_products');
    const storedEmployees = localStorage.getItem('elixir_employees');
    const storedOrders = localStorage.getItem('elixir_orders');
    if (storedProducts && storedEmployees) {
        products = JSON.parse(storedProducts);
        employees = JSON.parse(storedEmployees);
        orders = storedOrders ? JSON.parse(storedOrders) : [];
        saveToLocalStorage();
    } else {
        loadData();
    }
    populateEmployeeDropdown();
    renderLowStockAlerts();
    const selectedEmpId = document.getElementById('employeeSelect').value;
    if (selectedEmpId) {
        const emp = employees.find(e => e.id == parseInt(selectedEmpId));
        if (emp) {
            currentEmployeeId = emp.id;
            renderTasksForEmployee(emp);
            renderStaffOrders();
        } else {
            renderTasksForEmployee(null);
            renderStaffOrders();
        }
    } else {
        renderTasksForEmployee(null);
        renderStaffOrders();
    }
    showToast("تم تحديث البيانات من المدير", "success");
}

// ------------------- التهيئة -------------------
function initStaffPage() {
    loadData();
    populateEmployeeDropdown();
    renderLowStockAlerts();
    document.getElementById('employeeSelect').addEventListener('change', onEmployeeChange);
    document.getElementById('refreshDataBtn').addEventListener('click', fullRefresh);
    document.getElementById('currentDate').innerText = new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date());
    if (employees.length > 0) {
        document.getElementById('employeeSelect').value = employees[0].id;
        onEmployeeChange();
    }
}

window.addEventListener('DOMContentLoaded', initStaffPage);
