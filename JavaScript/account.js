
function fillCitySelect(citySelect, branchSelect, city, branch) {
    Object.keys(CITIES).forEach(function (c) {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        citySelect.appendChild(opt);
    });
    function fillBranches() {
        const list = CITIES[citySelect.value] || [];
        branchSelect.innerHTML = '<option value="">' + (list.length ? 'Оберіть відділення' : 'Спочатку оберіть місто') + '</option>' +
            list.map(function (b) { return '<option value="' + b + '">Відділення ' + b + '</option>'; }).join('');
    }
    citySelect.addEventListener('change', fillBranches);
    citySelect.value = city || '';
    fillBranches();
    branchSelect.value = branch || '';
}

document.addEventListener('DOMContentLoaded', function () {
    const authSection = document.getElementById('authSection');
    const profileSection = document.getElementById('profileSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };

    function showError(form, text) {
        const err = form.querySelector('.form-error');
        err.textContent = text;
        err.hidden = !text;
    }

    document.querySelectorAll('.auth-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.auth-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
            loginForm.hidden = tab.dataset.tab !== 'login';
            registerForm.hidden = tab.dataset.tab !== 'register';
        });
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        if (!isEmail(email)) return showError(loginForm, 'Введіть правильний e-mail');
        if (!password) return showError(loginForm, 'Введіть пароль');
        const result = loginUser(email, password);
        if (!result.ok) return showError(loginForm, result.message);
        showToast('Ви увійшли в акаунт');
        render();
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const f = registerForm;
        if (f.elements.namedItem('name').value.trim().length < 2) return showError(f, 'Введіть ім’я');
        if (!isEmail(f.email.value)) return showError(f, 'Введіть правильний e-mail');
        if (f.password.value.length < 6) return showError(f, 'Пароль має містити щонайменше 6 символів');
        if (f.password.value !== f.password2.value) return showError(f, 'Паролі не збігаються');
        const result = registerUser(f.elements.namedItem('name').value, f.email.value, f.password.value);
        if (!result.ok) return showError(f, result.message);
        showToast('Акаунт створено');
        render();
    });

    document.getElementById('logoutBtn').addEventListener('click', function () {
        logoutUser();
        showToast('Ви вийшли з акаунту');
        render();
    });

    const profileForm = document.getElementById('profileForm');
    let citiesFilled = false;

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = profileForm.elements.namedItem('name').value.trim();
        if (name.length < 2) { showToast('Вкажіть ім’я'); return; }
        updateUser({
            name: name,
            phone: profileForm.phone.value.trim(),
            city: profileForm.city.value,
            branch: profileForm.branch.value
        });
        showToast('Дані збережено');
        render();
    });

    function renderOrders(user) {
        const orders = ordersForEmail(user.email);
        const box = document.getElementById('ordersList');
        if (!orders.length) {
            box.innerHTML = '<p class="muted">Замовлень поки немає. <a href="index_3.html">До каталогу →</a></p>';
            return;
        }
        box.innerHTML = orders.map(function (o) {
            const items = o.items.map(function (i) {
                return escapeHtml(i.name) + ' (' + i.size + ') × ' + i.qty;
            }).join(', ');
            return '<div class="order-card">' +
                '<div class="order-head">' +
                    '<a href="thanks.html?order=' + o.number + '"><b>№ ' + o.number + '</b></a>' +
                    '<span class="order-status">' + o.status + '</span>' +
                '</div>' +
                '<p class="muted">' + new Date(o.date).toLocaleString('uk-UA') + '</p>' +
                '<p>' + items + '</p>' +
                '<p><b>' + formatPrice(o.totals.total) + '</b></p>' +
            '</div>';
        }).join('');
    }

    function render() {
        const user = getCurrentUser();
        authSection.hidden = !!user;
        profileSection.hidden = !user;

        document.querySelectorAll('.account-link').forEach(function (a) { a.classList.toggle('logged-in', !!user); });
        if (!user) return;

        document.getElementById('userName').textContent = user.name;
        profileForm.elements.namedItem('name').value = user.name;
        profileForm.email.value = user.email;
        profileForm.phone.value = user.phone || '';
        if (!citiesFilled) {
            fillCitySelect(document.getElementById('profileCity'), document.getElementById('profileBranch'), user.city, user.branch);
            citiesFilled = true;
        }
        document.getElementById('favCount').textContent = getFavorites().length;
        document.getElementById('cartCount').textContent = cartCount();
        renderOrders(user);
    }

    render();
});
