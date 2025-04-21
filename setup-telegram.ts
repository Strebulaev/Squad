const axios = require('axios');

const BOT_TOKEN = '8181088924:AAFFumfMTW0j8qLzBq6Lwwv-bumI0804R-o';
const WEBHOOK_URL = 'https://ваш-сайт.com/api/telegram-webhook';

async function setupWebhook() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL,
      allowed_updates: ['message', 'callback_query']
    });

    if (response.data.ok) {
      console.log('✅ Webhook успешно установлен');
    } else {
      console.error('❌ Ошибка установки webhook:', response.data.description);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Ошибка сети:', error.message);
    } else {
      console.error('❌ Неизвестная ошибка:', error);
    }
  }
}

setupWebhook();
