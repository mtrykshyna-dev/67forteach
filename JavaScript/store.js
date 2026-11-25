/* ==========================================================
   store.js — спільна логіка для всіх сторінок
   Кошик, обране, переглянуті товари, відгуки, акаунти,
   замовлення, пошук у шапці, сповіщення.
   Усі дані зберігаються в браузері (localStorage).
   Підключається ПІСЛЯ data.js.
   ========================================================== */

/* ---------- Робота зі сховищем ---------- */
function loadData(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        /* наприклад, приватний режим браузера — просто нічого не зберігаємо */
    }
}

/* ---------- Допоміжні функції ---------- */
function formatPrice(n) {
    return Math.round(n).toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';
}

/* Захист від HTML у тексті, який вводить користувач (відгуки, імена) */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function getProduct(id) {
    return PRODUCTS.find(function (p) { return p.id === id; });
}

function productUrl(p) {
    return 'index_2.html?id=' + encodeURIComponent(p.id);
}

/* Повертає товари з категорії (враховує "Новинки", "Одяг", "Низ") */
function productsInCategory(cat) {
    if (!cat || cat === 'all') return PRODUCTS.slice();
    if (cat === 'new') return PRODUCTS.filter(function (p) { return p.isNew; });
    if (CATEGORY_GROUPS[cat]) {
        return PRODUCTS.filter(function (p) { return CATEGORY_GROUPS[cat].includes(p.category); });
    }
    return PRODUCTS.filter(function (p) { return p.category === cat; });
}

/* Яку розмірну сітку використовувати для товару */
function chartTypeFor(p) {
    if (p.category === 'shoes') return 'shoes';
    if (p.sizes === SIZES_ONE) return null;
    if (p.sizes === SIZES_JEANS) return 'jeans';
    return 'clothes';
}

/* ---------- Кошик ---------- */
function getCart() { return loadData('ss_cart', []); }
function setCart(cart) {
    saveData('ss_cart', cart);
    updateBadges();
    /* Повідомляємо сторінку, що кошик змінився (наприклад, кошик перемальовується) */
    document.dispatchEvent(new CustomEvent('cartchange'));
}

function addToCart(id, size, qty) {
    const cart = getCart();
    const item = cart.find(function (i) { return i.id === id && i.size === size; });
    if (item) {
        item.qty = Math.min(item.qty + (qty || 1), 10);
    } else {
        cart.push({ id: id, size: size, qty: qty || 1 });
    }
    setCart(cart);
}

function changeCartQty(index, qty) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, Math.min(10, qty));
    setCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
}

function clearCart() { setCart([]); }

function cartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
}

function cartSubtotal() {
    return getCart().reduce(function (sum, i) {
        const p = getProduct(i.id);
        return p ? sum + p.price * i.qty : sum;
    }, 0);
}

/* ---------- Обране ---------- */
function getFavorites() { return loadData('ss_fav', []); }

function isFavorite(id) { return getFavorites().includes(id); }

function toggleFavorite(id) {
    let fav = getFavorites();
    let added;
    if (fav.includes(id)) {
        fav = fav.filter(function (f) { return f !== id; });
        added = false;
    } else {
        fav.push(id);
        added = true;
    }
    saveData('ss_fav', fav);
    updateBadges();
    return added;
}

/* ---------- Нещодавно переглянуті ---------- */
function addRecent(id) {
    let recent = loadData('ss_recent', []).filter(function (r) { return r !== id; });
    recent.unshift(id);
    saveData('ss_recent', recent.slice(0, 8));
}

function getRecent() {
    return loadData('ss_recent', []).map(getProduct).filter(Boolean);
}

/* ---------- Відгуки ---------- */
function getReviews(id) {
    const own = loadData('ss_reviews', {})[id] || [];
    const base = DEFAULT_REVIEWS[id] || [];
    return own.concat(base);
}

function addReview(id, review) {
    const all = loadData('ss_reviews', {});
    all[id] = all[id] || [];
    all[id].unshift(review);
    saveData('ss_reviews', all);
}

function getVotes() { return loadData('ss_votes', {}); }

/* Голос за відгук: 'like' / 'dislike'. Повторне натискання знімає голос. */
function voteReview(reviewId, type) {
    const votes = getVotes();
    votes[reviewId] = votes[reviewId] === type ? null : type;
    saveData('ss_votes', votes);
    return votes[reviewId];
}

/* Середня оцінка — рахуємо лише ті коментарі, де поставили зірки */
function ratedReviews(id) {
    return getReviews(id).filter(function (r) { return r.rating > 0; });
}

function averageRating(id) {
    const reviews = ratedReviews(id);
    if (!reviews.length) return 0;
    const sum = reviews.reduce(function (s, r) { return s + r.rating; }, 0);
    return sum / reviews.length;
}

function starsText(rating) {
    if (!rating) return '';
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
}

/* ---------- Акаунти ----------
   УВАГА: це навчальний приклад. Справжні сайти зберігають паролі
   на сервері у захешованому вигляді, а не в браузері. */
function simpleHash(text) {
    let hash = 5381;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
    }
    return 'h' + (hash >>> 0).toString(16);
}

function getUsers() { return loadData('ss_users', []); }

function getCurrentUser() {
    const email = loadData('ss_session', null);
    if (!email) return null;
    return getUsers().find(function (u) { return u.email === email; }) || null;
}

function registerUser(name, email, password) {
    email = email.trim().toLowerCase();
    const users = getUsers();
    if (users.some(function (u) { return u.email === email; })) {
        return { ok: false, message: 'Користувач з таким e-mail уже існує' };
    }
    users.push({ name: name.trim(), email: email, pass: simpleHash(password), phone: '', city: '', branch: '' });
    saveData('ss_users', users);
    saveData('ss_session', email);
    return { ok: true };
}

function loginUser(email, password) {
    email = email.trim().toLowerCase();
    const user = getUsers().find(function (u) { return u.email === email; });
    if (!user || user.pass !== simpleHash(password)) {
        return { ok: false, message: 'Неправильний e-mail або пароль' };
    }
    saveData('ss_session', email);
    return { ok: true };
}

function logoutUser() { saveData('ss_session', null); }

function updateUser(fields) {
    const current = getCurrentUser();
    if (!current) return;
    const users = getUsers().map(function (u) {
        return u.email === current.email ? Object.assign({}, u, fields) : u;
    });
    saveData('ss_users', users);
}

/* ---------- Замовлення ---------- */
function getOrders() { return loadData('ss_orders', []); }

function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    saveData('ss_orders', orders);
}

function ordersForEmail(email) {
    email = (email || '').trim().toLowerCase();
    return getOrders().filter(function (o) { return o.customer.email === email; });
}

/* ---------- Підсумок замовлення ----------
   deliveryType: 'branch' (Нова пошта) або 'pickup' (самовивіз) */
function calcTotals(deliveryType) {
    const subtotal = cartSubtotal();
    let delivery = 0;
    if (deliveryType !== 'pickup' && subtotal > 0 && subtotal < DELIVERY.freeFrom) {
        delivery = DELIVERY.price;
    }
    return {
        subtotal: subtotal,
        delivery: delivery,
        total: subtotal + delivery
    };
}

/* ---------- Сповіщення (toast) ---------- */
function showToast(message, linkText, linkHref) {
    let box = document.querySelector('.toast-box');
    if (!box) {
        box = document.createElement('div');
        box.className = 'toast-box';
        box.setAttribute('role', 'status');
        box.setAttribute('aria-live', 'polite');
        document.body.appendChild(box);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span>' + escapeHtml(message) + '</span>' +
        (linkText ? '<a href="' + linkHref + '">' + escapeHtml(linkText) + '</a>' : '');
    box.appendChild(toast);
    setTimeout(function () { toast.classList.add('toast-hide'); }, 3200);
    setTimeout(function () { toast.remove(); }, 3700);
}

/* ---------- Модальне вікно ---------- */
function openModal(innerHtml, extraClass) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
        '<div class="modal ' + (extraClass || '') + '" role="dialog" aria-modal="true">' +
            '<button type="button" class="modal-close" aria-label="Закрити">×</button>' +
            innerHtml +
        '</div>';
    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.classList.contains('modal-close')) closeModal();
    });
    return overlay.querySelector('.modal');
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
    document.body.classList.remove('no-scroll');
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

/* ---------- Лічильники в шапці ---------- */
function updateBadges() {
    document.querySelectorAll('[data-badge="cart"]').forEach(function (b) {
        const n = cartCount();
        b.textContent = n;
        b.hidden = n === 0;
    });
    document.querySelectorAll('[data-badge="fav"]').forEach(function (b) {
        const n = getFavorites().length;
        b.textContent = n;
        b.hidden = n === 0;
    });
}

/* ---------- Картка товару (така ж розмітка, як у дизайні) ---------- */
function renderProductCard(p) {
    const fav = isFavorite(p.id);
    return '' +
        '<article data-id="' + p.id + '">' +
            '<div class="article_img">' +
                '<a href="' + productUrl(p) + '">' +
                    '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '">' +
                '</a>' +
                '<button type="button" class="article_coments fav-btn' + (fav ? ' fav-active' : '') + '" data-fav="' + p.id + '" aria-label="Додати в обране" aria-pressed="' + fav + '">' +
                    '<img class="icon" src="img/favourite.png" alt="">' +
                '</button>' +
            '</div>' +
            '<div class="article_info">' +
                '<h2 class="type"><a href="' + productUrl(p) + '">' + escapeHtml(p.name) + '</a></h2>' +
                '<h3 class="cost">' + formatPrice(p.price) + '</h3>' +
                '<p class="inf"><a href="' + productUrl(p) + '">' + escapeHtml(p.short) + '</a></p>' +
                '<div class="buttom_1"><a href="' + productUrl(p) + '">Докладніше</a></div>' +
                '<div class="buttom_2"><a href="cart.html" data-buy="' + p.id + '">Придбати</a></div>' +
            '</div>' +
        '</article>';
}

/* Вибір розміру у спливаючому вікні (кнопка "Придбати" на картці) */
function openSizePicker(id) {
    const p = getProduct(id);
    if (!p) return;
    if (p.sizes.length === 1) {
        addToCart(p.id, p.sizes[0], 1);
        showToast('«' + p.name + '» додано в кошик', 'Перейти до кошика →', 'cart.html');
        return;
    }
    const sold = p.soldOut || [];
    const buttons = p.sizes.map(function (s) {
        const off = sold.includes(s);
        return '<button type="button" class="pick-size" data-size="' + s + '"' + (off ? ' disabled title="Немає в наявності"' : '') + '>' + s + '</button>';
    }).join('');
    const modal = openModal(
        '<h3 class="modal-title">Оберіть розмір</h3>' +
        '<p class="modal-sub">' + escapeHtml(p.name) + ' — ' + formatPrice(p.price) + '</p>' +
        '<div class="pick-size-grid">' + buttons + '</div>' +
        '<a class="modal-link" href="' + productUrl(p) + '">Розмірна сітка та підбір розміру →</a>'
    );
    modal.querySelectorAll('.pick-size').forEach(function (btn) {
        btn.addEventListener('click', function () {
            addToCart(p.id, btn.dataset.size, 1);
            closeModal();
            showToast('«' + p.name + '», розмір ' + btn.dataset.size + ' — у кошику', 'Перейти до кошика →', 'cart.html');
        });
    });
}

/* Оживляє кнопки ♡ і "Придбати" у будь-якому контейнері з картками */
function bindCardActions(container) {
    container.addEventListener('click', function (e) {
        const favBtn = e.target.closest('[data-fav]');
        if (favBtn) {
            e.preventDefault();
            const added = toggleFavorite(favBtn.dataset.fav);
            favBtn.classList.toggle('fav-active', added);
            favBtn.setAttribute('aria-pressed', added);
            showToast(added ? 'Додано в обране' : 'Прибрано з обраного', added ? 'Переглянути →' : '', 'favorites.html');
            container.dispatchEvent(new CustomEvent('favchange'));
            return;
        }
        const buyBtn = e.target.closest('[data-buy]');
        if (buyBtn) {
            e.preventDefault();
            openSizePicker(buyBtn.dataset.buy);
        }
    });
}

/* ---------- Пошук у шапці з підказками ---------- */
function searchProducts(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(function (p) {
        const text = (p.name + ' ' + p.short + ' ' + CATEGORIES[p.category] + ' ' + p.color).toLowerCase();
        return text.includes(q);
    });
}

function initSearch() {
    document.querySelectorAll('.search-bar').forEach(function (form) {
        const input = form.querySelector('input');
        if (!input) return;
        form.setAttribute('action', 'index_3.html');
        input.setAttribute('name', 'q');
        input.setAttribute('autocomplete', 'off');
        if (getParam('q') && !input.value) input.value = getParam('q');

        const list = document.createElement('div');
        list.className = 'search-suggest';
        list.hidden = true;
        form.appendChild(list);

        input.addEventListener('input', function () {
            const found = searchProducts(input.value).slice(0, 5);
            if (!input.value.trim()) { list.hidden = true; return; }
            if (!found.length) {
                list.innerHTML = '<div class="suggest-empty">Нічого не знайдено</div>';
            } else {
                list.innerHTML = found.map(function (p) {
                    return '<a class="suggest-item" href="' + productUrl(p) + '">' +
                        '<img src="' + p.image + '" alt="">' +
                        '<span class="suggest-name">' + escapeHtml(p.name) + '</span>' +
                        '<span class="suggest-price">' + formatPrice(p.price) + '</span>' +
                    '</a>';
                }).join('') +
                '<button type="submit" class="suggest-all">Усі результати →</button>';
            }
            list.hidden = false;
        });

        form.addEventListener('submit', function (e) {
            if (!input.value.trim()) e.preventDefault();
        });

        document.addEventListener('click', function (e) {
            if (!form.contains(e.target)) list.hidden = true;
        });
    });
}

/* ---------- Якщо фото товару не знайдено — показуємо стандартне ---------- */
document.addEventListener('error', function (e) {
    const img = e.target;
    if (img.tagName === 'IMG' && !img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = IMG_CARD[0];
    }
}, true);

/* ---------- Запуск на кожній сторінці ---------- */
document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
    initSearch();

    /* Іконка кабінету показує ім'я, якщо користувач увійшов */
    const user = getCurrentUser();
    document.querySelectorAll('.account-link').forEach(function (a) {
        a.title = user ? 'Кабінет: ' + user.name : 'Увійти / Зареєструватися';
        a.classList.toggle('logged-in', !!user);
    });

    /* Оновлюємо лічильники, якщо дані змінилися в іншій вкладці */
    window.addEventListener('storage', updateBadges);
});
