// api/timer-status.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const timerId = req.query.id;
  const status = await kv.get(`timer_${timerId}`);

  res.status(200).json({
    id: timerId,
    status: status || 'pending'
  });
}
