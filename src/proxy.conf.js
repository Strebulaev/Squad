// Используйте импорт для создания proxy middleware
import { createProxyMiddleware } from 'http-proxy-middleware';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "https://localhost:7098",
    secure: false,
  }
];

// Экспортируем конфигурацию прокси с помощью export default
export default function (app) {
  app.use(
    createProxyMiddleware(PROXY_CONFIG)
  );
}
