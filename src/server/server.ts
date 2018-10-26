import loopback from 'loopback';
import boot from 'loopback-boot';
import logger from './utils/logger';

const app = loopback();

app.start = () => {
  app.listen(() => {
    app.emit('started');
    logger.info('Web server listening at', app.get('url').replace(/\/$/, ''));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err: {}) => {
  if (err) {
    throw err;
  }

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});

export default app;
