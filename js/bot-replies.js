// bot-replies.js

const BOT_KB = [
  { key: /прив/i, reply: 'Привіт! Як я можу допомогти?' },
  { key: /час|годин/i, reply: () => `Зараз ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` },
  { key: /тема|theme/i, reply: 'Можеш перемкнути тему кнопкою 🌓 у заголовку.' },
  { key: /help|довідка|пом/i, reply: 'Підкажи ключові слова — спробую відповісти. Напр., “час”, “тема”.' },
  { key: /дяку/i, reply: 'Завжди радий допомогти!' },
  { key: /пока|бувай|до зустр/i, reply: 'Бувай! Гарного дня ☀️' },
];

function generateBotReply(userText) {
  const text = (userText || '').toLowerCase();
  for (const rule of BOT_KB) {
    if (rule.key.test(text)) {
      return typeof rule.reply === 'function' ? rule.reply(userText) : rule.reply;
    }
  }
  // Фолбек: простенький ехо‑стиль з доданою фразою
  return `Ти написав: “${userText}”. Звучить цікаво!`;
}