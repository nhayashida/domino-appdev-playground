module.exports = (() => {
  const settings = {
    restApiRoot: '/api',
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    remoting: {
      context: false,
      rest: {
        handleErrors: false,
        normalizeHttpPath: false,
        xml: false,
      },
      json: {
        strict: false,
        limit: '100mb',
      },
      urlencoded: {
        extended: true,
        limit: '100kb',
      },
      cors: false,
    },
  };
  return settings;
})();
