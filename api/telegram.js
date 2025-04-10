export default async function handler(req, res) {
  console.log('Telegram request headers:', req.headers);
  console.log('Telegram request body:', req.body);

  if (req.method === 'POST') {
    try {
      const { callback_query } = req.body;

      if (callback_query) {
        console.log('Callback data:', callback_query.data);
        return res.status(200).json({
          method: 'answerCallbackQuery',
          callback_query_id: callback_query.id,
          text: 'Действие обработано'
        });
      }

      res.status(200).json({ status: 'OK' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
