// app.js

(() => {
  const form = document.getElementById('inputForm');
  const input = document.getElementById('messageInput');
  const list = document.getElementById('messageList');
  const themeToggle = document.getElementById('themeToggle');

  // Тема: клас на <html> — theme-auto / theme-light / theme-dark
  const root = document.documentElement;
  const THEME_KEY = 'chat_theme';

  function applyTheme(theme) {
    root.classList.remove('theme-auto', 'theme-light', 'theme-dark');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  // Ініціалізація теми
  applyTheme(localStorage.getItem(THEME_KEY) || 'theme-auto');

  themeToggle.addEventListener('click', () => {
  const current = root.classList.contains('theme-auto') ? 'theme-auto'
                : root.classList.contains('theme-dark') ? 'theme-dark'
                : 'theme-light';
  const next = current === 'theme-auto' ? 'theme-dark'
             : current === 'theme-dark' ? 'theme-light'
             : 'theme-auto';
  applyTheme(next);
});


  // Допоміжне: формат часу
  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Рендер одного повідомлення
  function renderMessage(role, text) {
  const li = document.createElement('li');
  li.className = `message message--${role}`;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.alt = role === 'user' ? 'Аватар користувача' : 'Аватар бота';
  avatar.src = role === 'user' ? 'assets/avatar-user.png' : 'assets/avatar-bot.png';

  const bubble = document.createElement('div');
  bubble.className = 'message__bubble';
  bubble.textContent = text;

  const meta = document.createElement('div');
  meta.className = 'message__meta';
  meta.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const bubbleWrap = document.createElement('div');
  bubbleWrap.appendChild(bubble);
  bubbleWrap.appendChild(meta);

  li.appendChild(avatar);
  li.appendChild(bubbleWrap);

  // додаємо в кінець списку
  list.appendChild(li);

  // прокрутка донизу
  list.scrollTop = list.scrollHeight;
}

  function ensureLatestVisible() {
    // Для column-reverse нижня частина — це початок скролу
    list.scrollTop = 0;
  }

  // Валідація пустого вводу
  function isBlank(str) {
    return !str || !str.trim();
  }

  // Відправка повідомлення
  function sendUserMessage(text) {
    renderMessage('user', text);
    scheduleBotReply(text);
  }

  // Автовідповідь з затримкою
  function scheduleBotReply(userText) {
    const reply = generateBotReply(userText); // з bot-replies.js
    const delayMs = pickDelayMs(userText);
    setTimeout(() => renderMessage('bot', reply), delayMs);
  }

  function pickDelayMs(text) {
    const len = text.trim().length;
    // Реалістична затримка: короткі — ~600мс, довші — ~1000–1500мс
    if (len < 12) return 600 + Math.floor(Math.random() * 200);
    if (len < 60) return 1000 + Math.floor(Math.random() * 400);
    return 1400 + Math.floor(Math.random() * 600);
  }

  // Обробка форми: Enter і кнопка
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value;
    if (isBlank(value)) {
      input.value = '';
      input.focus();
      return;
    }
    sendUserMessage(value.trim());
    input.value = '';
    input.focus();
  });

  // Фокус для доступності
  list.addEventListener('focus', () => {
    // Нічого — залишено для розширення (читач може прокрутити історію)
  });

  // Початкове привітання
  renderMessage('bot', 'Привіт! Я тут, щоб відповідати на твої повідомлення. Спробуй щось надіслати 👋');

})();
