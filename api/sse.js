// api/sse.js
export default function handler(req, res) {
  // Устанавливаем заголовки SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Content-Encoding', 'none');

  console.log('New SSE client connected');

  // Отправляем начальное сообщение
  res.write('event: connected\ndata: {"message": "Connection established"}\n\n');

  // Таймер для тестовых сообщений (в реальном приложении замените на логику из базы данных)
  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({ ping: new Date().toISOString() })}\n\n`);
  }, 30000);

  // Обработка закрытия соединения
  req.on('close', () => {
    clearInterval(intervalId);
    console.log('Client disconnected');
  });
}
