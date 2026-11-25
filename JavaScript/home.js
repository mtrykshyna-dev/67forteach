document.addEventListener('DOMContentLoaded', function () {

    const topSales = document.getElementById('topSales');
    const top = PRODUCTS.slice().sort(function (a, b) { return b.popularity - a.popularity; }).slice(0, 4);
    topSales.innerHTML = top.map(renderProductCard).join('');
    bindCardActions(topSales);

    const recent = getRecent().slice(0, 4);
    if (recent.length) {
        document.getElementById('recentHint').hidden = true;
        document.getElementById('recentList').innerHTML = recent.map(function (p) {
            return '' +
                '<div class="card recent-card">' +
                    '<a href="' + productUrl(p) + '" class="placeholder">' +
                        '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '">' +
                    '</a>' +
                    '<p class="recent-name">' + escapeHtml(p.name) + '</p>' +
                    '<p class="recent-price">' + formatPrice(p.price) + '</p>' +
                    '<a href="' + productUrl(p) + '" class="btn">докладніше</a>' +
                '</div>';
        }).join('');
    }
});
