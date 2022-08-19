const createProxyMiddleware = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:29022';

const wsTarget = env.ASPNETCORE_HTTPS_PORT ? `wss://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'ws://localhost:29022'

const context =  [
  "/weatherforecast"
];

const wsContext = [
    "/testhub"
]

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  const wsProxy = createProxyMiddleware(wsContext, {
    target: wsTarget,
    secure: false,
    ws: true
  })


  app.use(appProxy);
  app.use(wsProxy);
};
