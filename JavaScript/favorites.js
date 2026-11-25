document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('favGrid');
    const empty = document.getElementById('favEmpty');
    const info = document.getElementById('favInfo');

    function render() {
        const list = getFavorites().map(getProduct).filter(Boolean);
        grid.innerHTML = list.map(renderProductCard).join('');
        empty.hidden = list.length > 0;
        info.hidden = list.length === 0;
        const sum = list.reduce(function (s, p) { return s + p.price; }, 0);
        info.textContent = 'Збережено товарів: ' + list.length + ' на суму ' + formatPrice(sum);
    }

    bindCardActions(grid);
    grid.addEventListener('favchange', render);
    render();
});
