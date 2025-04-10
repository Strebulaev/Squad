export default function handler(req, res) {
  // Проверяем метод запроса (Telegram отправляет POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  // Проверяем токен (если нужно)
  const token = req.query.token; // из URL ?token=XXX
  if (token !== '8181088924:AAFFumfMTW0j8qLzBq6Lwwv-bumI0804R-o') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Тело запроса от Telegram
  const update = req.body;
  console.log('Telegram Update:', update);

  // Обработка нажатия кнопки
  if (update.callback_query) {
    const data = update.callback_query.data;
    const timerId = data.split('_')[1];

    // Здесь можно сохранить данные в базе (например, Vercel KV или Supabase)
    // Или отправить ответ в реальном времени (если подключен WebSocket)
  }

  // Всегда отвечаем 200 OK Telegram
  res.status(200).json({ status: 'OK' });
}
