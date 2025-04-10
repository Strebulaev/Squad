import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const timerIds = req.query.ids.split(',').map(Number);
  const results = [];
  
  for (const id of timerIds) {
    const status = await kv.get(`timer_${id}`);
    if (status) results.push({ timerId: id, status });
  }
  
  res.status(200).json(results);
}
