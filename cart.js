let currentModalItem = null;

function displayCart() {
    const cartContainer = document.getElementById('cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
        document.getElementById('totalPrice').textContent = '0';
        return;
    }

    cartContainer.innerHTML = '';  // Очистка контейнера перед заполнением

    let totalPrice = 0;  // Переменная для хранения итоговой суммы

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => removeFromCart(item.id, itemDiv);

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.onclick = () => openModal(item);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');

        const title = document.createElement('h2');
        title.textContent = item.title;

        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');

        const minusButton = document.createElement('button');
        minusButton.innerHTML = '−';
        minusButton.classList.add('quantity-button');
        minusButton.onclick = () => changeQuantity(item, item.quantity - 1, price, itemDiv);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 1;
        quantityInput.max = 100;
        quantityInput.value = item.quantity;
        quantityInput.onchange = (event) => changeQuantity(item, event.target.value, price);
        quantityInput.classList.add('quantity-input');  // Добавить класс для стилизации

        const plusButton = document.createElement('button');
        plusButton.innerHTML = '+';
        plusButton.classList.add('quantity-button');
        plusButton.onclick = () => changeQuantity(item, item.quantity + 1, price);

        const price = document.createElement('p');
        price.classList.add('price');
        price.textContent = `Цена: ${item.price * item.quantity} руб.`;

        quantityContainer.appendChild(minusButton);
        quantityContainer.appendChild(quantityInput);
        quantityContainer.appendChild(plusButton);

        itemDiv.appendChild(deleteButton);
        itemDiv.appendChild(img);
        itemDiv.appendChild(contentDiv);
        itemDiv.appendChild(quantityContainer);
        itemDiv.appendChild(price);

        contentDiv.appendChild(title);

        cartContainer.appendChild(itemDiv);

        totalPrice += item.price * item.quantity;  // Добавление стоимости товара к итоговой сумме
    });

    // Добавить итоговую сумму под элементами корзины
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total');
    totalDiv.innerHTML = `<p>Итоговая сумма: <span id="totalPrice">${totalPrice.toLocaleString()}</span> руб. <button id="checkoutButton" style="display: none;">Оформить заказ</button></p>`;
    cartContainer.appendChild(totalDiv);

    // Показать кнопку "Удалить всё" и "Оформить заказ", если в корзине есть товары
    const clearCartButton = document.getElementById('clearCartButton');
    const checkoutButton = document.getElementById('checkoutButton');
    if (cart.length > 0) {
        clearCartButton.style.display = 'block';
        checkoutButton.style.display = 'block';
        clearCartButton.onclick = clearCart;
        checkoutButton.onclick = openCheckoutModal;
    } else {
        clearCartButton.style.display = 'none';
        checkoutButton.style.display = 'none';
    }
}

function changeQuantity(item, newQuantity, priceElement, itemDiv = null) {
    if (newQuantity < 1) {
        removeFromCart(item.id, itemDiv);
        return;
    }
    if (newQuantity > 100) {
        newQuantity = 100;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity = parseInt(newQuantity);
        priceElement.textContent = `Цена: ${cart[itemIndex].price * cart[itemIndex].quantity} руб`;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();  // Обновить отображение корзины
    }
}

function removeFromCart(itemId, itemElement) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    itemElement.remove();
    displayCart();  // Обновить отображение корзины и итоговой суммы
}

function clearCart() {
    localStorage.removeItem('cart');
    document.getElementById('cart').innerHTML = '<p>Ваша корзина пуста.</p>';
    document.getElementById('clearCartButton').style.display = 'none';
    document.getElementById('totalPrice').textContent = '0';  // Сбросить итоговую сумму
}

// Модальное окно
const modal = document.getElementById('myModal');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalImage = document.getElementById('modalImage');
const modalDetails = document.getElementById('modalDetails');
const modalQuantityInput = document.getElementById('modalQuantity');
const updateCartButton = document.getElementById('updateCartButton');
const span = document.getElementsByClassName('close')[0];
const increaseModalQuantity = document.getElementById('increaseModalQuantity');
const decreaseModalQuantity = document.getElementById('decreaseModalQuantity');

function openModal(item) {
    modal.style.display = 'block';
    modalTitle.textContent = item.title;
    modalPrice.textContent = `Цена: ${item.price * item.quantity} руб.`;
    modalImage.src = item.image;
    modalQuantityInput.value = item.quantity;
    currentModalItem = item;

    // Очистка и заполнение деталей
    modalDetails.innerHTML = '';
    for (const [key, value] of Object.entries(item.details)) {
        const detailItem = document.createElement('p');
        detailItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        modalDetails.appendChild(detailItem);
    }
}

// Закрытие модального окна
span.onclick = () => {
    modal.style.display = 'none';
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Обнуление значения в поле ввода при фокусе
modalQuantityInput.onfocus = () => {
    modalQuantityInput.value = '';
}

// Обновление суммы при изменении количества в модальном окне
modalQuantityInput.oninput = () => {
    let quantity = parseInt(modalQuantityInput.value, 10);
    if (quantity > 100) {
        quantity = 100;
        modalQuantityInput.value = 100;
    } else if (quantity < 1) {
        quantity = 1;
        modalQuantityInput.value = 1;
    }
    modalPrice.textContent = `Цена: ${currentModalItem.price * quantity} руб.`;
}

// Увеличение количества в модальном окне
increaseModalQuantity.onclick = () => {
    let quantity = parseInt(modalQuantityInput.value, 10);
    if (quantity < 100) {
        quantity++;
        modalQuantityInput.value = quantity;
        modalPrice.textContent = `Price: ${currentModalItem.price * quantity} руб.`;
    }
}

// Уменьшение количества в модальном окне
decreaseModalQuantity.onclick = () => {
    let quantity = parseInt(modalQuantityInput.value, 10);
    if (quantity > 1) {
        quantity--;
        modalQuantityInput.value = quantity;
        modalPrice.textContent = `Price: ${currentModalItem.price * quantity} руб.`;
    }
}

// Обновление количества в корзине из модального окна
updateCartButton.onclick = () => {
    let newQuantity = parseInt(modalQuantityInput.value, 10);
    if (newQuantity > 100) {
        newQuantity = 100;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(cartItem => cartItem.id === currentModalItem.id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();  // Обновить отображение корзины
        modal.style.display = 'none';
    }
}

// Модальное окно для оформления заказа
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSpan = checkoutModal.getElementsByClassName('close')[0];

function openCheckoutModal() {
    const totalPrice = parseInt(document.getElementById('totalPrice').textContent.replace(/\s+/g, ''));
    if (totalPrice < 10000) {
        alert('Сумма заказа должна быть не менее 10,000 рублей.');
        return;
    }
    checkoutModal.style.display = 'block';
}

checkoutSpan.onclick = () => {
    checkoutModal.style.display = 'none';
}

window.onclick = (event) => {
    if (event.target == checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}

checkoutForm.onsubmit = (event) => {
    event.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const delivery = document.getElementById('delivery').value;
    const city = document.getElementById('city').value;
    const index = document.getElementById('index').value;
    const street = document.getElementById('street').value;
    const house = document.getElementById('house').value;
    const apartment = document.getElementById('apartment').value;
    const payment = document.getElementById('payment').value;
    const comment = document.getElementById('comment').value;

    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Пожалуйста, введите корректный номер телефона в формате +7XXXXXXXXXX.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Пожалуйста, введите корректный адрес электронной почты.');
        return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = parseInt(document.getElementById('totalPrice').textContent.replace(/\s+/g, ''));

    const order = {
        phone,
        email,
        name,
        delivery,
        city,
        index,
        street,
        house,
        apartment,
        payment,
        comment,
        cart,
        totalPrice,
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Ваш заказ был успешно оформлен!');
    checkoutModal.style.display = 'none';
    clearCart();
    window.location.href = 'my_order.html';
}

// Вызов функции для отображения корзины при загрузке страницы
window.onload = displayCart;
