// api/telegram.js
import { kv } from '@vercel/kv'; // Для хранения данных

export default async function handler(req, res) {
  try {
    // Только POST-запросы
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Проверка токена из URL
    const token = req.query.token;
    if (token !== '8181088924:AAFFumfMTW0j8qLzBq6Lwwv-bumI0804R-o') {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const update = req.body;
    console.log('Telegram Update:', JSON.stringify(update, null, 2));

    // Обработка кнопок
    if (update.callback_query) {
      const { data, message } = update.callback_query;
      const [action, timerId] = data.split('_');

      // Сохраняем в KV (ключ: timer_123, значение: 'approved/rejected')
      await kv.set(`timer_${timerId}`, action);

      console.log(`Action: ${action}, TimerID: ${timerId}`);
    }

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
