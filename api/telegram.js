import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { callback_query } = req.body;

    if (callback_query) {
      const [action, timerId] = callback_query.data.split('_');

      // Сохраняем действие
      await kv.set(`timer_${timerId}_status`, action);

      // В реальном приложении здесь нужно уведомить всех клиентов через SSE
    }

    res.status(200).json({ status: 'OK' });
  }
}
