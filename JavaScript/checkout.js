/* ==========================================================
   checkout.js — оформлення замовлення (form.html)
   Перевірка полів, підсумок, доставка, збереження замовлення.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('checkoutForm');
    const summary = document.getElementById('orderSummary');
    const citySelect = document.getElementById('field_city');
    const branchSelect = document.getElementById('field_branch');
    const user = getCurrentUser();

    /* Порожній кошик — оформлювати нічого */
    if (getCart().length === 0) {
        form.hidden = true;
        summary.hidden = true;
        document.getElementById('emptyCart').hidden = false;
        return;
    }

    /* ---------- Міста та відділення ---------- */
    Object.keys(CITIES).forEach(function (c) {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        citySelect.appendChild(opt);
    });

    function fillBranches() {
        const list = CITIES[citySelect.value] || [];
        branchSelect.innerHTML = '<option value="">' + (list.length ? 'Оберіть відділення' : 'Спочатку оберіть місто') + '</option>' +
            list.map(function (b) { return '<option value="' + b + '">' + b + '</option>'; }).join('');
    }
    citySelect.addEventListener('change', fillBranches);

    /* ---------- Дані з особистого кабінету ---------- */
    function prefill() {
        if (!user) return;
        form.elements.namedItem('name').value = user.name || '';
        form.email.value = user.email || '';
        form.phone.value = user.phone || '';
        citySelect.value = user.city || '';
        fillBranches();
        branchSelect.value = user.branch || '';
    }
    prefill();

    /* ---------- Спосіб доставки ---------- */
    function deliveryType() {
        return form.querySelector('input[name="delivery"]:checked').value;
    }

    function toggleBranchFields() {
        const pickup = deliveryType() === 'pickup';
        document.querySelectorAll('.branch-field').forEach(function (f) {
            f.hidden = pickup;
            if (pickup) clearError(f.querySelector('.control'));
        });
        const cashLabel = form.querySelector('input[name="cost"][value="cash"]').parentElement;
        cashLabel.lastChild.textContent = pickup ? ' При отриманні в офісі' : ' При отриманні в відділенні';
        renderSummary();
    }
    form.querySelectorAll('input[name="delivery"]').forEach(function (r) {
        r.addEventListener('change', toggleBranchFields);
    });

    /* ---------- Підсумок замовлення ---------- */
    function renderSummary() {
        const cart = getCart();
        document.getElementById('summaryItems').innerHTML = cart.map(function (i) {
            const p = getProduct(i.id);
            if (!p) return '';
            return '<li><img src="' + p.image + '" alt="">' +
                '<span>' + escapeHtml(p.name) + '<br><small>Розмір ' + i.size + ' · ' + i.qty + ' шт.</small></span>' +
                '<b>' + formatPrice(p.price * i.qty) + '</b></li>';
        }).join('');

        const t = calcTotals(deliveryType());
        let rows = '<div><span>Товари</span><span>' + formatPrice(t.subtotal) + '</span></div>';
        rows += '<div><span>Доставка</span><span>' + (t.delivery ? formatPrice(t.delivery) : 'безкоштовно') + '</span></div>';
        rows += '<div class="total"><span>До сплати</span><span>' + formatPrice(t.total) + '</span></div>';
        document.getElementById('summaryRows').innerHTML = rows;
    }

    /* ---------- Маска телефону: +380 99 123 45 67 ---------- */
    function formatPhone(value) {
        let digits = value.replace(/\D/g, '');
        if (digits.startsWith('0')) digits = '38' + digits;
        if (digits.startsWith('80')) digits = '3' + digits;
        if (!digits.startsWith('380')) digits = '380' + digits.replace(/^3?8?0?/, '');
        digits = digits.slice(0, 12);
        const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 8), digits.slice(8, 10), digits.slice(10, 12)];
        return '+' + parts.filter(Boolean).join(' ');
    }

    form.phone.addEventListener('input', function (e) {
        const digits = form.phone.value.replace(/\D/g, '');
        /* Дозволяємо повністю стерти номер разом з +380 */
        if (digits.length === 0 || (e.inputType && e.inputType.indexOf('delete') === 0 && digits.length <= 3)) {
            form.phone.value = '';
            return;
        }
        form.phone.value = formatPhone(form.phone.value);
    });

    /* ---------- Перевірка полів ---------- */
    const validators = {
        name: function (v) {
            v = v.trim();
            if (!v) return 'Це поле обов’язкове';
            if (v.split(/\s+/).length < 2) return 'Введіть ім’я та прізвище, наприклад: Іван Франко';
            if (!/^[A-Za-zА-Яа-яІіЇїЄєҐґ'’\-\s]+$/.test(v)) return 'ПІБ може містити лише літери';
            return '';
        },
        email: function (v) {
            if (!v.trim()) return 'Це поле обов’язкове';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Дане поле заповнене неправильно. Приклад: i.franko@gmail.com';
            return '';
        },
        phone: function (v) {
            const digits = v.replace(/\D/g, '');
            if (!digits) return 'Це поле обов’язкове';
            if (digits.length < 12) return 'Дане поле заповнене неправильно. Тут не вистачає ' + (12 - digits.length) + ' цифр(и)';
            return '';
        },
        city: function (v) {
            if (deliveryType() === 'pickup') return '';
            return v ? '' : 'Оберіть місто зі списку';
        },
        branch: function (v) {
            if (deliveryType() === 'pickup') return '';
            return v ? '' : 'Оберіть відділення';
        },
        agree: function (v, el) {
            return el.checked ? '' : 'Потрібно погодитися з умовами';
        }
    };

    function showError(el, message) {
        const field = el.closest('.field');
        const msg = field.querySelector('.error_massage');
        field.classList.toggle('error', !!message);
        if (el.classList.contains('control')) el.classList.toggle('error', !!message);
        msg.textContent = message;
        msg.hidden = !message;
        el.setAttribute('aria-invalid', !!message);
    }

    function clearError(el) { if (el) showError(el, ''); }

    function validateField(el) {
        const check = validators[el.name];
        if (!check) return true;
        const message = check(el.value, el);
        showError(el, message);
        return !message;
    }

    Object.keys(validators).forEach(function (name) {
        const el = form.elements.namedItem(name);
        el.addEventListener('blur', function () { validateField(el); });
        el.addEventListener('change', function () { validateField(el); });
        /* Поки людина виправляє поле з помилкою — перевіряємо одразу */
        el.addEventListener('input', function () {
            if (el.closest('.field').classList.contains('error')) validateField(el);
        });
    });


    /* ---------- Скинути ---------- */
    form.addEventListener('reset', function () {
        setTimeout(function () {
            form.querySelectorAll('.field').forEach(function (f) {
                f.classList.remove('error');
                const msg = f.querySelector('.error_massage');
                if (msg) msg.hidden = true;
            });
            form.querySelectorAll('.control').forEach(function (c) { c.classList.remove('error'); });
            fillBranches();
            toggleBranchFields();
        });
    });

    /* ---------- Відправлення ---------- */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let firstInvalid = null;
        Object.keys(validators).forEach(function (name) {
            const el = form.elements.namedItem(name);
            if (!validateField(el) && !firstInvalid) firstInvalid = el;
        });
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.closest('.field').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const email = form.email.value.trim().toLowerCase();
        const delivery = deliveryType();
        const totals = calcTotals(delivery);

        const order = {
            number: 'SS' + String(Date.now()).slice(-6) + Math.floor(Math.random() * 90 + 10),
            date: new Date().toISOString(),
            status: 'Прийнято',
            items: getCart().filter(function (i) { return getProduct(i.id); }).map(function (i) {
                const p = getProduct(i.id);
                return { id: i.id, name: p.name, size: i.size, qty: i.qty, price: p.price, image: p.image };
            }),
            customer: {
                name: form.elements.namedItem('name').value.trim(),
                email: email,
                phone: form.phone.value.trim(),
                city: delivery === 'pickup' ? 'Київ' : citySelect.value,
                branch: delivery === 'pickup' ? '' : branchSelect.value,
                comment: form.comment.value.trim()
            },
            delivery: delivery,
            payment: form.querySelector('input[name="cost"]:checked').value,
            totals: totals
        };

        saveOrder(order);

        /* Зберігаємо дані у профілі, щоб наступного разу не вводити */
        if (user) {
            updateUser({
                phone: user.phone || order.customer.phone,
                city: user.city || (delivery === 'branch' ? order.customer.city : ''),
                branch: user.branch || order.customer.branch
            });
        }

        clearCart();
        window.location.href = 'thanks.html?order=' + order.number;
    });

    toggleBranchFields();
});
