/* ==========================================================
   pages.js — інфо-сторінки: усі відгуки (about.html),
   форма зворотного зв'язку (contacts.html)
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Усі відгуки на сторінці "Про нас" ---------- */
    const allReviews = document.getElementById('allReviews');
    if (allReviews) {
        const list = [];
        PRODUCTS.forEach(function (p) {
            getReviews(p.id).forEach(function (r) { list.push({ review: r, product: p }); });
        });
        list.sort(function (a, b) { return b.review.date.localeCompare(a.review.date); });

        allReviews.innerHTML = list.length ? list.map(function (x) {
            const r = x.review;
            return '<div class="review-card">' +
                '<div class="review-header">' +
                    '<span class="review-author">' + escapeHtml(r.author) + '</span>' +
                    '<span class="review-rating">' + starsText(r.rating) + '</span>' +
                '</div>' +
                '<p class="review-text">' + escapeHtml(r.text) + '</p>' +
                '<a class="review-product" href="' + productUrl(x.product) + '">' + escapeHtml(x.product.name) + ' →</a>' +
            '</div>';
        }).join('') : '<p class="muted">Відгуків поки немає.</p>';
    }

    /* ---------- Форма "Напишіть нам" ---------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const err = contactForm.querySelector('.form-error');
            const name = contactForm.elements.namedItem('name').value.trim();
            const contact = contactForm.contact.value.trim();
            const message = contactForm.message.value.trim();
            let error = '';
            if (name.length < 2) error = 'Вкажіть ваше ім’я';
            else if (contact.length < 5) error = 'Вкажіть e-mail або телефон, щоб ми могли відповісти';
            else if (message.length < 10) error = 'Повідомлення занадто коротке';
            err.textContent = error;
            err.hidden = !error;
            if (error) return;

            /* Зберігаємо звернення (на справжньому сайті воно б пішло на сервер) */
            const messages = loadData('ss_messages', []);
            messages.push({ name: name, contact: contact, topic: contactForm.topic.value, message: message, date: new Date().toISOString() });
            saveData('ss_messages', messages);

            contactForm.reset();
            showToast('Дякуємо! Ми відповімо протягом робочого дня');
        });

        /* Підставляємо дані користувача, якщо він увійшов */
        const user = getCurrentUser();
        if (user) {
            contactForm.elements.namedItem('name').value = user.name;
            contactForm.contact.value = user.email;
        }
    }
});
