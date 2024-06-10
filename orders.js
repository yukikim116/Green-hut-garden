document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders');
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    const translations = {
        paymentMethods: {
            cash_on_delivery: "Оплата при получении",
            online_payment: "Оплата онлайн"
        },
        deliveryMethods: {
            cdek: "СДЭК",
            russian_post: "Почта России"
        }
    };

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>У вас нет заказов.</p>';
        return;
    }

    orders.forEach((order, orderIndex) => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const paymentMethod = translations.paymentMethods[order.payment] || order.payment;
        const deliveryMethod = translations.deliveryMethods[order.delivery] || order.delivery;

        const orderInfo = `
            <h2>Заказ от ${order.date}</h2>
            <p><strong>Телефон:</strong> ${order.phone}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Ваше ФИО:</strong> ${order.name}</p>
            <p><strong>Доставка:</strong> ${deliveryMethod}</p>
            <p><strong>Город:</strong> ${order.city}</p>
            <p><strong>Индекс:</strong> ${order.index}</p>
            <p><strong>Улица:</strong> ${order.street}</p>
            <p><strong>Дом:</strong> ${order.house}</p>
            <p><strong>Квартира:</strong> ${order.apartment}</p>
            <p><strong>Способ оплаты:</strong> ${paymentMethod}</p>
            <p><strong>Комментарий:</strong> ${order.comment}</p>
            <h3>Товары:</h3>
        `;

        orderDiv.innerHTML = orderInfo;

        const itemsList = document.createElement('ul');
        itemsList.classList.add('items-list');
        order.cart.forEach(item => {
            const itemLi = document.createElement('li');
            itemLi.classList.add('item');
            itemLi.onclick = () => openItemModal(item);

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;

            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');
            itemDetails.innerHTML = `
                <p>${item.title}</p>
                <p>${item.quantity} шт.</p>
                <p>${item.price * item.quantity} ₽</p>
            `;

            itemLi.appendChild(img);
            itemLi.appendChild(itemDetails);
            itemsList.appendChild(itemLi);
        });

        orderDiv.appendChild(itemsList);

        const totalPriceDiv = document.createElement('div');
        totalPriceDiv.classList.add('total-price');
        totalPriceDiv.innerHTML = `
            <p><strong>Итоговая сумма:</strong> ${order.totalPrice} ₽</p>
            <button class="cancel-order-button" onclick="confirmCancelOrder(${orderIndex})">Отмена заказа</button>
        `;
        orderDiv.appendChild(totalPriceDiv);

        ordersContainer.appendChild(orderDiv);
    });

    // Модальное окно для деталей товара
    const itemModal = document.getElementById('itemModal');
    const itemTitle = document.getElementById('itemTitle');
    const itemImage = document.getElementById('itemImage');
    const itemDetails = document.getElementById('itemDetails');
    const itemModalClose = document.getElementsByClassName('close')[0];

    function openItemModal(item) {
        itemModal.style.display = 'block';
        itemTitle.textContent = item.title;
        itemImage.src = item.image;

        itemDetails.innerHTML = '';
        for (const [key, value] of Object.entries(item.details)) {
            const detailItem = document.createElement('p');
            detailItem.innerHTML = `<strong>${key}:</strong> ${value}`;
            itemDetails.appendChild(detailItem);
        }
    }

    itemModalClose.onclick = () => {
        itemModal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == itemModal) {
            itemModal.style.display = 'none';
        }
    }

    // Модальное окно подтверждения отмены заказа
    const confirmModal = document.getElementById('confirmModal');
    const confirmYesButton = document.getElementById('confirmYes');
    const confirmNoButton = document.getElementById('confirmNo');
    const confirmModalClose = document.getElementsByClassName('close-confirm')[0];
    let orderToCancel = null;

    window.confirmCancelOrder = (orderIndex) => {
        orderToCancel = orderIndex;
        confirmModal.style.display = 'block';
    }

    confirmYesButton.onclick = () => {
        if (orderToCancel !== null) {
            orders.splice(orderToCancel, 1);
            localStorage.setItem('orders', JSON.stringify(orders));
            location.reload();
        }
        confirmModal.style.display = 'none';
    }

    confirmNoButton.onclick = () => {
        confirmModal.style.display = 'none';
    }

    confirmModalClose.onclick = () => {
        confirmModal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == confirmModal) {
            confirmModal.style.display = 'none';
        }
    }
});
