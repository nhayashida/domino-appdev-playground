import logger from '../common/utils/logger';

module.exports = (() => {
  const dbConfig = {
    cache: {
      connector: 'kv-memory',
    },
  };
  logger.debug(dbConfig);

  return dbConfig;
})();
