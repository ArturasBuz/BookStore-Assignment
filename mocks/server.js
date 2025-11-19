const apiMock = require('@ng-apimock/core');
const devInterface = require('@ng-apimock/dev-interface');
const connect = require('connect');
const cors = require('cors');
const http = require('http');
const serveStatic = require('serve-static');

const start = (appPort, mockPort) => {
  const app = connect();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(apiMock.middleware);

  app.use('/mocking', serveStatic(devInterface));
  app.use(function (req, res, next) {
    if (req.url === '/') {
      res.writeHead(301, { Location: '/mocking' });
      res.end();
    } else {
      next();
    }
  });

  http
    .createServer(app)
    .listen(mockPort, function () {
      console.log('Mock server running on port ' + mockPort + '.');
    })
    .on('error', function (e) {
      console.log('Mock server is already started.');
    });

  apiMock.processor.process({
    src: 'mocks',
    patterns: {
      mocks: 'api/**/*.json',
      presets: 'api/**/*.preset.json',
    },
    watch: true,
  });
};

exports.start = start;
