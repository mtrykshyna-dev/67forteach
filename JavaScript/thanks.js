document.addEventListener('DOMContentLoaded', function () {
    const number = getParam('order');
    const order = getOrders().find(function (o) { return o.number === number; });

    if (!order) {
        document.getElementById('thanksBox').hidden = true;
        document.getElementById('thanksEmpty').hidden = false;
        return;
    }

    document.getElementById('orderNumber').textContent = '№ ' + order.number;
    if (order.payment === 'card') {
        document.getElementById('orderNote').textContent =
            'Наш менеджер зателефонує вам для підтвердження та надішле посилання на оплату карткою.';
    }

    document.getElementById('orderItems').innerHTML = order.items.map(function (i) {
        return '<li><img src="' + i.image + '" alt="">' +
            '<span>' + escapeHtml(i.name) + '<br><small>Розмір ' + i.size + ' · ' + i.qty + ' шт.</small></span>' +
            '<b>' + formatPrice(i.price * i.qty) + '</b></li>';
    }).join('');

    const t = order.totals;
    const c = order.customer;
    const rows = [
        ['Отримувач', escapeHtml(c.name)],
        ['Телефон', escapeHtml(c.phone)],
        ['E-mail', escapeHtml(c.email)],
        ['Доставка', order.delivery === 'pickup'
            ? 'Самовивіз: м. Київ, пр. Степана Бандери, 21'
            : 'Нова пошта, ' + escapeHtml(c.city) + ', відділення ' + escapeHtml(c.branch)],
        ['Оплата', order.payment === 'card' ? 'Карткою' : 'При отриманні'],
        ['Товари', formatPrice(t.subtotal)]
    ];
    rows.push(['Доставка', t.delivery ? formatPrice(t.delivery) : 'безкоштовно']);
    rows.push(['<b>Разом</b>', '<b>' + formatPrice(t.total) + '</b>']);
    if (c.comment) rows.push(['Коментар', escapeHtml(c.comment)]);

    document.getElementById('orderInfo').innerHTML = rows.map(function (r) {
        return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>';
    }).join('');
});
