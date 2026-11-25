document.addEventListener('DOMContentLoaded', function () {
    const itemsBox = document.getElementById('cartItems');
    const layout = document.getElementById('cartLayout');
    const empty = document.getElementById('cartEmpty');

    function render() {
        const cart = getCart();

        layout.hidden = cart.length === 0;
        empty.hidden = cart.length > 0;

        itemsBox.innerHTML = cart.map(function (item, index) {
            const p = getProduct(item.id);
            if (!p) return '';
            return '' +
                '<div class="cart-item">' +
                    '<a href="' + productUrl(p) + '" class="cart-img"><img src="' + p.image + '" alt="' + escapeHtml(p.name) + '"></a>' +
                    '<div class="cart-info">' +
                        '<a href="' + productUrl(p) + '" class="cart-name">' + escapeHtml(p.name) + '</a>' +
                        '<p class="muted">Розмір: ' + item.size + '</p>' +
                    '</div>' +
                    '<div class="qty">' +
                        '<button type="button" data-minus="' + index + '" aria-label="Менше"' + (item.qty <= 1 ? ' disabled' : '') + '>−</button>' +
                        '<span>' + item.qty + '</span>' +
                        '<button type="button" data-plus="' + index + '" aria-label="Більше"' + (item.qty >= 10 ? ' disabled' : '') + '>+</button>' +
                    '</div>' +
                    '<p class="cart-line-total">' + formatPrice(p.price * item.qty) + '</p>' +
                    '<button type="button" class="cart-remove" data-remove="' + index + '" aria-label="Видалити">' +
                        '<img src="img/dashicons_no.png" alt="">' +
                    '</button>' +
                '</div>';
        }).join('');

        const t = calcTotals('branch');
        document.getElementById('sumCount').textContent = cartCount();
        document.getElementById('sumSubtotal').textContent = formatPrice(t.subtotal);
        document.getElementById('sumDelivery').textContent = t.delivery === 0 ? 'безкоштовно' : formatPrice(t.delivery);
        document.getElementById('sumTotal').textContent = formatPrice(t.total);
    }

    itemsBox.addEventListener('click', function (e) {
        const cart = getCart();
        const minus = e.target.closest('[data-minus]');
        const plus = e.target.closest('[data-plus]');
        const remove = e.target.closest('[data-remove]');
        if (minus) changeCartQty(Number(minus.dataset.minus), cart[minus.dataset.minus].qty - 1);
        if (plus) changeCartQty(Number(plus.dataset.plus), cart[plus.dataset.plus].qty + 1);
        if (remove) removeFromCart(Number(remove.dataset.remove));
    });

    document.addEventListener('cartchange', render);

    render();
});
