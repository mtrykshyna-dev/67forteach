/* ==========================================================
   catalog.js — універсальний каталог (index_3.html)
   Адреса сторінки визначає, що показувати:
     index_3.html?cat=jeans   — категорія
     index_3.html?q=худі      — пошук
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('catalogGrid');
    const info = document.getElementById('resultsInfo');
    const empty = document.getElementById('emptyState');
    const title = document.getElementById('catalogTitle');
    const sortSelect = document.getElementById('sort');
    const sizeSelect = document.getElementById('size');

    const category = CATEGORIES[getParam('cat')] ? getParam('cat') : 'all';
    const query = (getParam('q') || '').trim();

    /* Заголовок сторінки */
    if (query) {
        title.textContent = 'Пошук: «' + query + '»';
        document.title = 'Пошук: ' + query + ' — SIX SEVEN';
    } else {
        title.textContent = CATEGORIES[category];
        document.title = CATEGORIES[category] + ' — SIX SEVEN';
    }

    /* Товари категорії або результати пошуку */
    const baseList = query ? searchProducts(query) : productsInCategory(category);

    /* Розміри, які є у товарів цієї категорії */
    const sizes = [];
    baseList.forEach(function (p) {
        p.sizes.forEach(function (s) { if (!sizes.includes(s)) sizes.push(s); });
    });
    sizes.forEach(function (s) {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = 'Розмір ' + s;
        sizeSelect.appendChild(opt);
    });

    function render() {
        const size = sizeSelect.value;
        const list = baseList.filter(function (p) {
            if (!size) return true;
            return p.sizes.includes(size) && !(p.soldOut || []).includes(size);
        });

        if (sortSelect.value === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
        else if (sortSelect.value === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
        else list.sort(function (a, b) { return b.popularity - a.popularity; });

        grid.innerHTML = list.map(renderProductCard).join('');
        empty.hidden = list.length > 0;
        info.textContent = 'Товарів: ' + list.length;
    }

    sortSelect.addEventListener('change', render);
    sizeSelect.addEventListener('change', render);
    bindCardActions(grid);
    render();
});
