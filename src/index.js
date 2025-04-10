const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Обработчик Telegram Webhook
exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
  const { callback_query } = req.body;

  if (callback_query) {
    const { data, message } = callback_query;
    const [action, timerId] = data.split('_');

    // 1. Записываем действие в Realtime Database
    await admin.database().ref(`tasks/${timerId}`).set({ action });

    // 2. Удаляем кнопки в Telegram
    await axios.post(
      `https://api.telegram.org/bot${functions.config().telegram.token}/editMessageReplyMarkup`,
      {
        chat_id: message.chat.id,
        message_id: message.message_id,
        reply_markup: { inline_keyboard: [] },
      }
    );
  }

  res.sendStatus(200);
});
