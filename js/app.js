(() => {
  // Отримуємо елементи DOM
  const form = document.getElementById('inputForm');         // форма для вводу повідомлення
  const input = document.getElementById('messageInput');     // поле вводу тексту
  const list = document.getElementById('messageList');       // список повідомлень
  const themeToggle = document.getElementById('themeToggle'); // кнопка перемикання теми

  // Робота з темою: клас на <html> — theme-auto / theme-light / theme-dark
  const root = document.documentElement; // посилання на <html>
  const THEME_KEY = 'chat_theme';        // ключ для збереження теми в localStorage

  // Застосовуємо тему: видаляємо старі класи, додаємо новий, зберігаємо вибір
  function applyTheme(theme) {
    root.classList.remove('theme-auto', 'theme-light', 'theme-dark'); // очищаємо класи
    root.classList.add(theme);                                        // додаємо новий
    localStorage.setItem(THEME_KEY, theme);                           // зберігаємо вибір
  }

  // Ініціалізація теми при завантаженні сторінки
  applyTheme(localStorage.getItem(THEME_KEY) || 'theme-auto');

  // Обробка кліку по кнопці теми: перемикає між auto → dark → light → auto
  themeToggle.addEventListener('click', () => {
    const current = root.classList.contains('theme-auto') ? 'theme-auto'
                  : root.classList.contains('theme-dark') ? 'theme-dark'
                  : 'theme-light'; // визначає поточну тему

    const next = current === 'theme-auto' ? 'theme-dark'
               : current === 'theme-dark' ? 'theme-light'
               : 'theme-auto'; // обирає наступну тему

    applyTheme(next); // застосовує нову тему
  });

  // Допоміжна функція: повертає поточний час у форматі HH:MM
  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Рендер одного повідомлення (користувач або бот)
  function renderMessage(role, text) {
    const li = document.createElement('li'); // створюємо <li>
    li.className = `message message--${role}`; // додаємо клас: message--user або message--bot

    const avatar = document.createElement('img'); // створюємо аватар
    avatar.className = 'avatar';
    avatar.alt = role === 'user' ? 'Аватар користувача' : 'Аватар бота';
    avatar.src = role === 'user' ? 'assets/avatar-user.png' : 'assets/avatar-bot.png';

    const bubble = document.createElement('div'); // створюємо бульбашку з текстом
    bubble.className = 'message__bubble';
    bubble.textContent = text;

    const meta = document.createElement('div'); // створюємо мітку часу
    meta.className = 'message__meta';
    meta.textContent = timeNow();

    const bubbleWrap = document.createElement('div'); // обгортка для бульбашки + часу
    bubbleWrap.appendChild(bubble);
    bubbleWrap.appendChild(meta);

    li.appendChild(avatar);      // додаємо аватар
    li.appendChild(bubbleWrap);  // додаємо текст і час

    list.appendChild(li);        // додаємо повідомлення в список
    list.scrollTop = list.scrollHeight; // прокручуємо вниз до останнього
  }

  // Альтернативна прокрутка (для column-reverse, якщо буде)
  function ensureLatestVisible() {
    list.scrollTop = 0;
  }

  // Перевірка на пустий ввід (trim)
  function isBlank(str) {
    return !str || !str.trim(); // повертає true, якщо рядок пустий або тільки пробіли
  }

  // Відправка повідомлення користувача
  function sendUserMessage(text) {
    renderMessage('user', text);      // показуємо повідомлення користувача
    scheduleBotReply(text);           // запускаємо відповідь бота
  }

  // Відповідь бота з затримкою
  function scheduleBotReply(userText) {
    const reply = generateBotReply(userText); // беремо відповідь з bot-replies.js
    const delayMs = pickDelayMs(userText);    // обираємо затримку
    setTimeout(() => renderMessage('bot', reply), delayMs); // показуємо відповідь
  }

  // Вибір затримки: чим довше повідомлення — тим довше пауза
  function pickDelayMs(text) {
    const len = text.trim().length;
    if (len < 12) return 600 + Math.floor(Math.random() * 200);     // коротке — ~600–800мс
    if (len < 60) return 1000 + Math.floor(Math.random() * 400);    // середнє — ~1000–1400мс
    return 1400 + Math.floor(Math.random() * 600);                  // довге — ~1400–2000мс
  }

  // Обробка форми: Enter або кнопка
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // не перезавантажуємо сторінку
    const value = input.value;
    if (isBlank(value)) { // якщо пусто — очищаємо і повертаємо фокус
      input.value = '';
      input.focus();
      return;
    }
    sendUserMessage(value.trim()); // надсилаємо повідомлення
    input.value = '';              // очищаємо поле
    input.focus();                 // повертаємо фокус
  });

  // Обробка фокусу на списку (для доступності)
  list.addEventListener('focus', () => {
    // залишено для майбутніх розширень
  });

  // Початкове привітання від бота
  renderMessage('bot', 'Привіт! Я тут, щоб відповідати на твої повідомлення. Спробуй щось надіслати 👋');
})();
