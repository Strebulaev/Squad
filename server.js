// В вашем Node.js скрипте
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('8181088924:AAFFumfMTW0j8qLzBq6Lwwv-bumI0804R-o', { polling: true });

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  if (data.startsWith('approve_')) {
    const timerId = data.split('_')[1];
    // Здесь логика обработки
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Задача подтверждена' });
  }
  // Аналогично для reject
});
