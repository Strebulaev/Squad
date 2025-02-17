
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
