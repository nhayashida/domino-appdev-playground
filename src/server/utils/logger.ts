import pino, { Logger } from 'pino';

const logger: Logger = pino({
  level: process.env.LOGGER_LEVEL || 'info',
  prettyPrint: process.env.LOGGER_PRETTY === 'true',
});

export default logger;
