document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.toLowerCase();
    // Сохранение запроса в локальное хранилище
    localStorage.setItem('searchQuery', query);
    // Перенаправление на catalog.html
    window.location.href = 'catalog.html';
});
var modal = document.getElementById('consultationModal');
var btn = document.getElementById('openModalBtn');
var span = document.getElementsByClassName('closeBtn')[0];

btn.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
document.getElementById('consultationForm').addEventListener('submit', function(event) {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var namePattern = /^[А-Яа-яЁё\s]+$/;
    var phonePattern = /^\+7\d{10}$/;

    if (!namePattern.test(name)) {
        alert('Пожалуйста, введите имя кириллицей.');
        event.preventDefault();
    }

    if (!phonePattern.test(phone)) {
        alert('Пожалуйста, введите номер телефона в формате +7XXXXXXXXXX.');
        event.preventDefault();
    }

    if (namePattern.test(name) && phonePattern.test(phone)) {
        // Сохранение заказа в локальное хранилище
        var orders = JSON.parse(localStorage.getItem('orders')) || [];
        var order = {
            name: name,
            phone: phone,
            date: new Date().toLocaleString(),
            type: 'Консультация'
        };
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        alert('Ваш запрос на консультацию успешно отправлен!');
        modal.style.display = 'none';
        event.preventDefault(); // Предотвращаем отправку формы
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var headers = document.querySelectorAll(".accordion-header");
    headers.forEach(function(header) {
        header.addEventListener("click", function() {
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                // Скрыть все открытые контенты перед открытием текущего
                var allContents = document.querySelectorAll(".accordion-content");
                allContents.forEach(function(otherContent) {
                    otherContent.style.display = "none";
                });
                content.style.display = "block";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var targetId = this.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);

            var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            var offsetPosition = targetPosition - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
});
document.getElementById('newsletterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var emailInput = document.getElementById('newsletterEmail');
    var email = emailInput.value.trim();
    var messageElement = document.getElementById('newsletterMessage');

    if (!validateEmail(email)) {
        messageElement.textContent = 'Пожалуйста, введите действительный email.';
        messageElement.style.color = 'red';
        return;
    }

    var existingEmails = JSON.parse(localStorage.getItem('subscribedEmails')) || [];
    if (existingEmails.includes(email)) {
        messageElement.textContent = 'Этот email уже подписан на новости.';
        messageElement.style.color = 'red';
        return;
    }

    existingEmails.push(email);
    localStorage.setItem('subscribedEmails', JSON.stringify(existingEmails));

    messageElement.textContent = 'Спасибо за подписку!';
    messageElement.style.color = 'green';
    emailInput.value = '';
});

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.addEventListener("DOMContentLoaded", function() {
    const reviews = [
        "Игорь Петров: Компания 'Зеленая хижина' поразила меня своим разнообразием и качеством растений. Купил здесь несколько декоративных кустарников и деревьев для своего сада, и все они прижились отлично. Особенно понравилась услуга ландшафтного проектирования: специалисты разработали для меня потрясающий проект. Консультации по уходу были очень полезными, а доставка была быстрой и удобной. Рекомендую 'Зеленую хижину' всем, кто хочет украсить свой сад качественными растениями!",
        "Анна Сидорова: Недавно приобрел растения для своего сада в компании 'Зеленая хижина' и остался очень доволен! Впечатлило разнообразие ассортимента: нашел здесь и декоративные кустарники, и красивые цветы, и даже несколько видов деревьев и трав. Особенно порадовала возможность получить консультации по уходу за растениями и воспользоваться услугой проектирования ландшафта. Доставка была быстрой и удобной, а растения прибыли в отличном состоянии. Рекомендую всем, кто хочет преобразить свой сад!",
        "Мария Иванова: Огромное спасибо 'Зеленой хижине' за отличный сервис и великолепный выбор растений! Здесь можно найти всё, что нужно для сада: от декоративных кустарников до разнообразных цветов и деревьев. Особенно хочется отметить дополнительные услуги: консультации по уходу за растениями очень помогли мне, а ландшафтный дизайн превзошел все ожидания. Доставка была организована в удобное для меня время, и все растения прибыли в отличном состоянии. Буду заказывать здесь снова и снова!",
        "Алексмей Смирнов: Компания 'Зеленая хижина' стала для меня настоящим открытием! Великолепный выбор растений для сада, от кустарников до деревьев и трав, здесь можно найти всё, что душе угодно. Особо понравились консультации по уходу за растениями, очень полезные и информативные. Ландшафтное проектирование также оказалось на высшем уровне. Доставка была быстрой и удобной, что является большим плюсом. Впечатления самые положительные, рекомендую всем садоводам!",
        "Елена Кузнецова: Покупаю растения в 'Зеленой хижине' уже не первый год и всегда остаюсь доволен качеством и обслуживанием. Ассортимент растений просто огромный: кустарники, цветы, деревья и травы — здесь есть всё! Очень полезными оказались консультации по уходу за растениями и услуга ландшафтного дизайна. Доставка всегда своевременная и в удобное время. Радует, что компания работает на рынке с 2010 года и успела зарекомендовать себя как надежный партнер для всех любителей сада. Рекомендую!",
        "Сергей Николаев: Хочу выразить благодарность 'Зеленой хижине' за прекрасные растения и отличный сервис! Заказала несколько кустарников и деревьев для своего сада, и все они прижились отлично. Особенно понравилась услуга ландшафтного проектирования: специалисты разработали для меня потрясающий проект. Консультации по уходу были очень полезными, а доставка была быстрой и удобной. Рекомендую 'Зеленую хижину' всем, кто хочет украсить свой сад качественными растениями!",
        "Ольга Милайлова: 'Зеленая хижина' — просто находка для садоводов! Здесь нашла все необходимые растения для своего сада: цветы, кустарники и даже экзотические деревья. Консультации по уходу за растениями были очень полезны, особенно для начинающего садовода. Ландшафтный дизайн сделали на высшем уровне, теперь мой сад — настоящий райский уголок. Доставка была организована в удобное для меня время, что очень порадовало. Благодарю за отличный сервис!",
        "Дмитрий Федоров: Заказал растения в 'Зеленой хижине' и остался в восторге! Ассортимент впечатляет — нашел здесь как декоративные кустарники, так и красивые цветы. Консультации по уходу за растениями оказались крайне полезными, а проектирование ландшафта превзошло все ожидания. Доставка была оперативной и удобной. Порадовало, что компания работает на рынке с 2010 года и успела заслужить доверие клиентов. Всем рекомендую!",
        "Наталья Васильева: Очень довольна покупками в 'Зеленой хижине'! Ассортимент растений просто огромен: от деревьев до кустарников и трав. Консультации по уходу за растениями оказались очень полезными, особенно для начинающего садовода. Ландшафтный дизайн выполнили на высшем уровне. Доставка была удобной и своевременной. Отличный сервис, отличные растения — буду заказывать здесь снова!",
        "Михаил Александров: 'Зеленая хижина' — мой любимый магазин для покупки растений. Здесь можно найти всё для сада: кустарники, цветы, деревья и травы. Консультации по уходу за растениями помогли мне справиться с некоторыми проблемами в саду. Ландшафтный дизайн оказался на высшем уровне. Доставка была быстрой и удобной. Очень рад, что нашел эту компанию. Рекомендую всем, кто хочет украсить свой сад!"
    ];

    const sliderInner = document.querySelector('.slider-inner');
    
    reviews.forEach(review => {
        const words = review.split(" ");
        const firstThreeWords = `<strong>${words.slice(0, 2).join(" ")}</strong>`;
        const remainingWords = words.slice(2).join(" ");
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.innerHTML = `<p>${firstThreeWords} ${remainingWords}</p>`;
        sliderInner.appendChild(slide);
        const firstTwoWords = `<span class="highlight">${words.slice(0, 2).join(" ")}</span>`;
        slide.classList.add('slide');
        slide.innerHTML = `<p>${firstTwoWords} ${remainingWords}</p>`;
    });

    let currentIndex = 0;

    function showSlide(index) {
        const totalSlides = reviews.length;
        if (index >= totalSlides) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }
        const offset = -currentIndex * 100;
        sliderInner.style.transform = `translateX(${offset}%)`;
    }

    document.querySelector('.prev-btn').addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });

    showSlide(currentIndex);
});