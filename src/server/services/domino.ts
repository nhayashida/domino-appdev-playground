import { useServer } from '@domino/domino-db';
import logger from '../utils/logger';

class Domino {
  private serverConfig;
  private dbConfig;

  constructor() {
    this.serverConfig = {
      hostName: process.env.DOMINO_HOST,
      connection: {
        port: process.env.DOMINO_PROTON_PORT,
      },
    };

    this.dbConfig = {
      filePath: process.env.DOMINO_DB_FILE_PATH,
    };
  }

  /**
   * Execute a domino-db api
   *
   * @param db
   * @param method
   * @param options
   * @returns response
   */
  private async executeApi(db: any, method: string, options: object): Promise<object> {
    const explain = await db.explainQuery(options);

    let bulkResponse;
    switch (method) {
      case 'bulkReadDocuments':
        bulkResponse = await db.bulkReadDocuments(options);
        break;
      case 'bulkDeleteDocuments':
        bulkResponse = await db.bulkDeleteDocuments(options);
        break;
      case 'bulkReplaceItems':
        bulkResponse = await db.bulkReplaceItems(options);
        break;
      case 'bulkDeleteItems':
        bulkResponse = await db.bulkDeleteItems(options);
        break;
      default:
        throw new Error('Unknown method');
    }

    return Object.assign({ explain }, { bulkResponse });
  }

  /**
   * Execute Domino Query Language
   *
   * @param method
   * @param options
   * @returns response
   */
  async query(method: string, options: object) {
    logger.debug(Object.assign({ method }, options));

    try {
      const server = await useServer(this.serverConfig);
      const db = await server.useDatabase(this.dbConfig);
      const res = await this.executeApi(db, method, options);
      return res;
    } catch (err) {
      throw err;
    }
  }
}

const domino = new Domino();
export default domino;
