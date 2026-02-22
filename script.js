const chatBox = document.getElementById('chatBox');
const spellForm = document.getElementById('spellForm');
const spellInput = document.getElementById('spellInput');
const timerDisplay = document.getElementById('timer');
const sendMessage = document.getElementById('send');

let timeLeft = 30; // Начальное значение таймера
let gameActive = true; // Игра активна

// Запуск игры при загрузке страницы
window.addEventListener('load', initGame);

// Фокус на поле ввода при загрузке
window.addEventListener('load', () => {
    spellInput.focus();
});

// Старт игры
function initGame() {
    addBossMessage('Ты явился... Первый ход за тобой, мерзкий человечишка.');
    startTimer();
}

// Таймер обратного отсчета
function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft--; // Уменьшение на 1
        timerDisplay.style.color = "black";
        timerDisplay.textContent = timeLeft;

        // ПРОВЕРКА: если осталось 5 секунд или меньше, то сделать цвет таймера красным
        if (timeLeft <= 5 && timeLeft >= 0) {
            timerDisplay.style.color = "red";
        }

        if (timeLeft <= 0) {
            timerDisplay.textContent = timeLeft;
            clearInterval(timerInterval); // Цикл обрывается 
            gameActive = false; // Игра останавливается
            spellInput.disabled = true; // Поле ввода неактивно
            sendMessage.disabled = true; // Кнопка отправки неактивна
            addBossMessage('Ты тратишь моё время. И свою никчёмную жизнь. Такой бездарь мне не соперник.');
            spellInput.placeholder = 'Надежды нет...';
            sendMessage.textContent = '💔';
        }
    }, 1000);
}

// Обработка отправки заклинания
spellForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Отмена обновления страницы

    const spell = spellInput.value.trim();

    if (spell === '') {return;}
    if (!gameActive) {return;}

    addPlayerMessage(spell); // Добавление сообщение игрока

    spellInput.value = ''; // Очищение поля ввода

    // Имитация задержки перед ответом босса (в будущем, можно убрать)
    setTimeout(() => {
        addBossMessage(getRandomBossResponse());
    }, 500);

    timeLeft = 30; // Обновление таймера
});

// Добавление сообщения игрока в чат
function addPlayerMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message player';
    messageDiv.innerHTML = `
        <div class='message-wrapper'>
            <strong class="message-sender">Вы</strong>
            <div class="message-content">${escapeHtml(text)}</div>
        </div>
    `;
    chatBox.appendChild(messageDiv);

    // Автоматическая прокрутка чата вниз
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Добавление сообщения босса в чат
function addBossMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message boss';
    messageDiv.innerHTML = `
        <div class='message-wrapper'>
            <strong class="message-sender">Босс</strong>
            <div class="message-content">${escapeHtml(text)}</div>
        </div>
    `;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Случайный ответ босса (заглушка)
function getRandomBossResponse() {
    const responses = [
        'Ого, цветные огоньки! В цирке выступать будешь.',
        'А... понял. Ты пытаешься меня утомить? Скукой?',
        'Твоя магия воняет людским потом. Это отвратительно.',
        'Это была попытка или судорога?',
        'Попробуй еще раз, паразит!',
        'У меня лапы мерзнут от твоей ничтожности.',
        'О, красиво. Поставлю в вазу, когда уничтожу твою деревню.',
        'Щекотно.',
        'Люблю этот момент: надежда в человеческих глазах, перед тем как она гаснет.',
        'Я вырежу на твоей шкуре формулу этого заклинания, чтобы другие люди знали, что так нельзя.',
        'Хорошо. Ты разозлил меня. Теперь я буду убивать тебя МЕДЛЕННО.',
        'Может, тебе взять эту палочку и поковырять ей в носу? Больше пользы будет.',
        'Ты не устал? Я устал на тебя смотреть.',
        'В тебе столько же очарования, сколько в дохлом слизне.',
        'Из тебя получился бы прекрасный труп.',
        'Ты позоришь свою корову.',
        'Жалок.',
        'У тебя такое лицо, что только мать может любить. Хорошо хоть, она слепая.',
        'Я бы сказал, что тебя уронили на голову в детстве.',
        'Возможно ли, что твоя мать, охваченная дикой похотью, когда-то давно заигрывала с козлом?',
        'Есть предложение: ты перестаёшь колдовать, а я откусываю тебе голову быстро. Идёт?',
        'Если ты бог среди людей, то люди — никто.'
    ];

    // Случайный выбор реплики
    return responses[Math.floor(Math.random() * responses.length)];
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}