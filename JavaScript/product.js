/* ==========================================================
   product.js — сторінка товару (index_2.html?id=...)
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const id = getParam('id') || 'flared-cross';
    const p = getProduct(id);

    /* Якщо товару не існує */
    if (!p) {
        document.querySelector('.container').innerHTML =
            '<div class="empty-state page-empty">' +
                '<h1>Товар не знайдено</h1>' +
                '<p>Можливо, його вже немає в продажу.</p>' +
                '<a class="btn-outline" href="index_3.html">Перейти до каталогу</a>' +
            '</div>';
        return;
    }

    addRecent(p.id);
    document.title = p.name.toUpperCase() + ' - SIX SEVEN';

    /* ---------- Заголовок, хлібні крихти, назад ---------- */
    const catUrl = 'index_3.html?cat=' + p.category;
    document.getElementById('productName').textContent = p.name.toUpperCase();
    document.getElementById('backLink').href = catUrl;
    document.getElementById('breadcrumbs').innerHTML =
        '<a href="index.html">Головна</a> / <a href="index_3.html">Каталог</a> / ' +
        '<a href="' + catUrl + '">' + CATEGORIES[p.category] + '</a> / <span>' + escapeHtml(p.name) + '</span>';

    /* ---------- Галерея ---------- */
    /* Якщо в товару є власні фото (поле gallery) — показуємо їх, інакше спільні */
    const ownPhotos = p.gallery && p.gallery.length > 0;
    const images = ownPhotos ? p.gallery : IMG_GALLERY;
    let current = 0;
    const mainImage = document.getElementById('mainImage');
    const thumbs = document.getElementById('thumbs');

    /* Мініатюри збоку: до 3 штук */
    const thumbIndexes = ownPhotos ? images.map(function (_, i) { return i; }).slice(0, 3) : [1, 2, 3];
    thumbs.innerHTML = thumbIndexes.map(function (i) {
        return '<img src="' + images[i] + '" alt="' + escapeHtml(p.name) + ', вид ' + (i + 1) + '" data-index="' + i + '" tabindex="0">';
    }).join('');

    function showImage(index) {
        current = (index + images.length) % images.length;
        mainImage.src = images[current];
        mainImage.alt = p.name;
        thumbs.querySelectorAll('img').forEach(function (t) {
            t.classList.toggle('active', Number(t.dataset.index) === current);
        });
    }

    thumbs.addEventListener('click', function (e) {
        if (e.target.dataset.index) showImage(Number(e.target.dataset.index));
    });
    thumbs.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.dataset.index) showImage(Number(e.target.dataset.index));
    });
    document.getElementById('prevImg').addEventListener('click', function () { showImage(current - 1); });
    document.getElementById('nextImg').addEventListener('click', function () { showImage(current + 1); });
    showImage(0);

    /* Якщо фото лише одне — стрілки не потрібні (мініатюру лишаємо, щоб макет не змінювався) */
    if (images.length === 1) {
        document.getElementById('prevImg').hidden = true;
        document.getElementById('nextImg').hidden = true;
    }

    /* ---------- Ціна, рейтинг, опис ---------- */
    document.getElementById('productPrice').textContent = 'Ціна: ' + formatPrice(p.price);

    function renderRatingLine() {
        const count = getReviews(p.id).length;
        const avg = averageRating(p.id);
        document.getElementById('ratingStars').textContent = count
            ? 'Відгуки: ' + (avg ? starsText(avg) + ' ' : '') + '(' + count + ')'
            : 'Відгуки: поки немає';
    }
    renderRatingLine();

    let descHtml = '<h3>Опис:</h3><p>Колір: ' + p.color + '</p>';
    Object.keys(p.details).forEach(function (k) {
        descHtml += '<p>' + k + ': ' + p.details[k] + '</p>';
    });
    document.getElementById('description').innerHTML = descHtml;

    const modelInfo = document.getElementById('modelInfo');
    if (p.model) modelInfo.textContent = p.model;
    else modelInfo.textContent = p.sizes === SIZES_ONE ? 'Універсальний розмір' : 'Модель має розмір S/36, її зріст 170 см';

    /* ---------- Обране ---------- */
    const favBtn = document.getElementById('favToggle');
    function renderFav() {
        const fav = isFavorite(p.id);
        favBtn.textContent = fav ? '♥ В обраному' : '♡ Додати в обране';
        favBtn.classList.toggle('active', fav);
        favBtn.setAttribute('aria-pressed', fav);
    }
    favBtn.addEventListener('click', function () {
        const added = toggleFavorite(p.id);
        renderFav();
        showToast(added ? 'Додано в обране' : 'Прибрано з обраного', added ? 'Переглянути →' : '', 'favorites.html');
    });
    renderFav();

    /* ---------- Розміри ---------- */
    let selectedSize = p.sizes.length === 1 ? p.sizes[0] : null;
    const sizeGrid = document.getElementById('sizeGrid');
    const sizeHint = document.getElementById('sizeHint');
    const sold = p.soldOut || [];

    sizeGrid.innerHTML = p.sizes.map(function (s) {
        const off = sold.includes(s);
        return '<button type="button" role="radio" class="size-btn' + (off ? ' sold-out' : '') + (s === selectedSize ? ' selected' : '') + '"' +
            ' data-size="' + s + '" aria-checked="' + (s === selectedSize) + '"' +
            (off ? ' disabled title="Немає в наявності"' : '') + '>' + s + '</button>';
    }).join('');
    if (p.sizes === SIZES_ONE) sizeGrid.classList.add('one-size');

    sizeGrid.addEventListener('click', function (e) {
        const btn = e.target.closest('.size-btn');
        if (!btn || btn.disabled) return;
        selectedSize = btn.dataset.size;
        sizeGrid.querySelectorAll('.size-btn').forEach(function (b) {
            b.classList.toggle('selected', b === btn);
            b.setAttribute('aria-checked', b === btn);
        });
        sizeHint.classList.remove('error');
        sizeHint.innerHTML = 'Обрано розмір <b>' + selectedSize + '</b>' +
            (chartTypeFor(p) ? ' · <button type="button" class="link-btn" data-open-advisor>Підібрати розмір</button>' : '');
    });

    if (!chartTypeFor(p)) {
        sizeHint.textContent = 'Універсальний розмір';
        document.getElementById('sizeChartBtn').hidden = true;
    }

    function requireSize() {
        if (selectedSize) return true;
        sizeHint.classList.add('error');
        sizeHint.innerHTML = 'Будь ласка, оберіть розмір ☝ · <button type="button" class="link-btn" data-open-advisor>Підібрати розмір</button>';
        sizeGrid.classList.remove('shake');
        void sizeGrid.offsetWidth; // перезапуск анімації
        sizeGrid.classList.add('shake');
        sizeGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }

    /* ---------- Кнопки покупки ---------- */
    document.getElementById('addToCart').addEventListener('click', function () {
        if (!requireSize()) return;
        addToCart(p.id, selectedSize, 1);
        showToast('«' + p.name + '», розмір ' + selectedSize + ' — у кошику', 'Перейти до кошика →', 'cart.html');
    });

    document.getElementById('buyOneClick').addEventListener('click', function (e) {
        e.preventDefault();
        if (!requireSize()) return;
        addToCart(p.id, selectedSize, 1);
        window.location.href = 'form.html';
    });

    /* ---------- Розмірна сітка та підбір розміру ---------- */
    function rangeText(r) { return r[0] + '–' + r[1] + ' см'; }

    function chartTableHtml(type) {
        const chart = SIZE_CHARTS[type];
        const head = '<tr>' + chart.columns.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        const body = chart.rows.map(function (r) {
            if (type === 'shoes') return '<tr><td>' + r.size + '</td><td>' + r.foot + ' см</td></tr>';
            return '<tr><td>' + r.size + '</td><td>' + rangeText(r.waist) + '</td><td>' + rangeText(r.hips) + '</td><td>' +
                (type === 'jeans' ? r.intl : rangeText(r.chest)) + '</td></tr>';
        }).join('');
        return '<table class="size-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>';
    }

    /* Підбір: беремо найменший розмір, у який вміщуються всі виміри */
    function recommendSize(type, m) {
        const rows = SIZE_CHARTS[type].rows;
        if (type === 'shoes') {
            const row = rows.find(function (r) { return r.foot >= m.foot - 0.2; });
            return row ? row.size : null;
        }
        let index = 0;
        const keys = type === 'clothes' ? ['waist', 'hips', 'chest'] : ['waist', 'hips'];
        for (const k of keys) {
            if (!m[k]) continue;
            const i = rows.findIndex(function (r) { return m[k] <= r[k][1]; });
            if (i === -1) return null;
            index = Math.max(index, i);
        }
        return rows[index].size;
    }

    function openSizeChart(startWithAdvisor) {
        const type = chartTypeFor(p);
        if (!type) return;
        const fields = type === 'shoes'
            ? '<label>Довжина стопи, см<input type="number" name="foot" step="0.1" min="20" max="30" required></label>'
            : '<label>Обхват талії, см<input type="number" name="waist" min="50" max="130" required></label>' +
              '<label>Обхват стегон, см<input type="number" name="hips" min="70" max="150" required></label>' +
              (type === 'clothes' ? '<label>Обхват грудей, см<input type="number" name="chest" min="70" max="140"></label>' : '') +
              '<label>Зріст, см<input type="number" name="height" min="140" max="210"></label>';

        const modal = openModal(
            '<h3 class="modal-title">Розмірна сітка — ' + SIZE_CHARTS[type].title + '</h3>' +
            chartTableHtml(type) +
            '<p class="modal-sub">Як зняти мірки: талія — найвужче місце, стегна — найширше місце по сідницях' +
            (type === 'shoes' ? ', стопа — від п’яти до найдовшого пальця' : '') + '.</p>' +
            '<form class="advisor" id="advisorForm">' +
                '<h4>Підбір розміру</h4>' +
                '<div class="advisor-fields">' + fields + '</div>' +
                '<button type="submit" class="btn-cart">Підібрати</button>' +
                '<p class="advisor-result" id="advisorResult" aria-live="polite"></p>' +
            '</form>',
            'modal-wide'
        );

        const advisorForm = modal.querySelector('#advisorForm');
        const result = modal.querySelector('#advisorResult');
        if (startWithAdvisor) advisorForm.querySelector('input').focus();

        advisorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {};
            new FormData(advisorForm).forEach(function (v, k) { data[k] = v ? Number(v) : 0; });
            const size = recommendSize(type, data);
            if (!size) {
                result.innerHTML = 'На жаль, у сітці немає підходящого розміру. Напишіть нам — допоможемо підібрати модель!';
                return;
            }
            const available = !sold.includes(size);
            let note = '';
            if (data.height && data.height >= 178 && type === 'jeans') note = ' Ваш зріст вище середнього — зверніть увагу на довжину штанин.';
            if (data.height && data.height <= 160 && type === 'jeans') note = ' При вашому зрості джинси можуть бути задовгі — їх легко підшити.';
            result.innerHTML = 'Рекомендуємо розмір <b>' + size + '</b>.' + note +
                (available
                    ? ' <button type="button" class="link-btn" id="chooseRecommended">Обрати ' + size + '</button>'
                    : ' На жаль, зараз його немає в наявності.');
            const choose = result.querySelector('#chooseRecommended');
            if (choose) {
                choose.addEventListener('click', function () {
                    closeModal();
                    const btn = sizeGrid.querySelector('[data-size="' + size + '"]');
                    if (btn) btn.click();
                });
            }
        });
    }

    document.getElementById('sizeChartBtn').addEventListener('click', function () { openSizeChart(false); });
    document.addEventListener('click', function (e) {
        if (e.target.id === 'sizeAdvisorBtn' || e.target.hasAttribute('data-open-advisor')) openSizeChart(true);
    });

    /* ---------- Відгуки та коментарі ---------- */
    const reviewCards = document.getElementById('reviewCards');

    function renderReviews() {
        const reviews = getReviews(p.id);
        const rated = ratedReviews(p.id);
        const votes = getVotes();

        /* Розподіл оцінок (лише коментарі із зірками) */
        const counts = [0, 0, 0, 0, 0];
        rated.forEach(function (r) { counts[r.rating - 1]++; });
        document.getElementById('ratingBreakdown').innerHTML = [5, 4, 3, 2, 1].map(function (star) {
            const percent = rated.length ? Math.round(counts[star - 1] / rated.length * 100) : 0;
            return '<div class="rate-row">' +
                '<span>' + '★'.repeat(star) + '</span>' +
                '<div class="progress-bar"><div class="progress-fill" style="width: ' + percent + '%;"></div></div>' +
            '</div>';
        }).join('');

        const avg = averageRating(p.id);
        document.getElementById('reviewsAverage').textContent = rated.length
            ? 'Середня оцінка: ' + avg.toFixed(1) + ' з 5'
            : 'Оцінок поки немає';

        /* Картки коментарів — та сама розмітка, що була в дизайні */
        reviewCards.innerHTML = reviews.length ? reviews.map(function (r) {
            const vote = votes[r.id];
            const likes = (r.likes || 0) + (vote === 'like' ? 1 : 0);
            const dislikes = (r.dislikes || 0) + (vote === 'dislike' ? 1 : 0);
            return '<div class="review-card">' +
                '<div class="review-header">' +
                    '<span class="review-author">' + escapeHtml(r.author) + '</span>' +
                    '<div class="review-actions">' +
                        '<button type="button" class="action-like' + (vote === 'like' ? ' voted' : '') + '" data-vote="like" data-review="' + r.id + '">👍 ' + likes + '</button>' +
                        '<button type="button" class="action-dislike' + (vote === 'dislike' ? ' voted' : '') + '" data-vote="dislike" data-review="' + r.id + '">👎 ' + dislikes + '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="review-rating">' + (r.rating ? starsText(r.rating) : "") + '<span class="review-date">' + new Date(r.date).toLocaleDateString('uk-UA') + '</span></div>' +
                '<p class="review-text">' + escapeHtml(r.text) + '</p>' +
            '</div>';
        }).join('') : '<p class="no-reviews">Коментарів поки немає — напишіть перший!</p>';

        renderRatingLine();
    }

    reviewCards.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-vote]');
        if (!btn) return;
        voteReview(btn.dataset.review, btn.dataset.vote);
        renderReviews();
    });

    /* Форма коментаря (оцінка зірками — необов'язкова) */
    const reviewForm = document.getElementById('reviewForm');
    const reviewError = document.getElementById('reviewError');
    const nameInput = document.getElementById('reviewName');
    const textInput = document.getElementById('reviewText');
    let stars = 0;
    const starButtons = document.querySelectorAll('#starInput button');

    const user = getCurrentUser();
    if (user) nameInput.value = user.name;

    function paintStars(n) {
        starButtons.forEach(function (b) { b.classList.toggle('on', Number(b.dataset.star) <= n); });
    }
    starButtons.forEach(function (b) {
        b.addEventListener('click', function () {
            /* повторне натискання на ту саму зірку знімає оцінку */
            stars = stars === Number(b.dataset.star) ? 0 : Number(b.dataset.star);
            paintStars(stars);
        });
        b.addEventListener('mouseenter', function () { paintStars(Number(b.dataset.star)); });
        b.addEventListener('mouseleave', function () { paintStars(stars); });
    });

    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        let error = '';
        if (name.length < 2) error = 'Вкажіть ваше ім’я';
        else if (text.length < 3) error = 'Напишіть коментар';
        reviewError.textContent = error;
        reviewError.hidden = !error;
        if (error) return;

        addReview(p.id, {
            id: 'u' + Date.now(),
            author: name, rating: stars, text: text,
            date: new Date().toISOString().slice(0, 10), likes: 0, dislikes: 0
        });
        textInput.value = '';
        stars = 0; paintStars(0);
        renderReviews();
        showToast('Дякуємо! Коментар опубліковано');
    });

    renderReviews();

    /* ---------- Схожі товари ---------- */
    const similarGrid = document.getElementById('similarGrid');
    let similar = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; });
    if (similar.length < 4) {
        similar = similar.concat(
            PRODUCTS.filter(function (x) { return x.category !== p.category && x.id !== p.id; })
                .sort(function (a, b) { return b.popularity - a.popularity; })
        );
    }
    similarGrid.innerHTML = similar.slice(0, 4).map(renderProductCard).join('');
    bindCardActions(similarGrid);
});
