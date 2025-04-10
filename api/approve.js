import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { timerId } = req.body;

    // Сохраняем в KV хранилище
    await kv.set(`timer_${timerId}_status`, 'approved');

    // Можно отправить SSE событие всем клиентам
    // В реальном приложении нужно использовать BroadcastChannel или подобное

    res.status(200).json({ status: 'OK' });
  }
}
