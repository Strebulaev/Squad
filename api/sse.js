export default function handler(req, res) {
  // Устанавливаем необходимые заголовки
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Отправляем начальное сообщение
  res.write('event: connected\ndata: {"status": "OK"}\n\n');

  // Сохраняем соединение открытым
  const interval = setInterval(() => {
    res.write(':ping\n\n'); // Keep-alive
  }, 30000);

  // Обработка закрытия соединения
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}
