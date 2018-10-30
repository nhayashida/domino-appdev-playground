import { useServer } from '@domino/domino-db';
import logger from '../../common/utils/logger';

export interface DqlResponse {
  bulkResponse: object;
  explain: string;
}

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
   * @param query
   * @returns response
   */
  private async executeApi(db: any, method: string, query: object): Promise<DqlResponse> {
    const explain = await db.explainQuery(query);

    let bulkResponse;
    switch (method.toLowerCase()) {
      case 'bulkreaddocuments':
        bulkResponse = await db.bulkReadDocuments(query);
        break;
      case 'bulkdeletedocuments':
        bulkResponse = await db.bulkDeleteDocuments(query);
        break;
      case 'bulkreplaceitems':
        bulkResponse = await db.bulkReplaceItems(query);
        break;
      case 'bulkdeleteitems':
        bulkResponse = await db.bulkDeleteItems(query);
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
   * @param query
   * @returns response
   */
  async query(method: string, query: object): Promise<DqlResponse> {
    logger.debug(Object.assign({ method }, query));

    try {
      const server = await useServer(this.serverConfig);
      const db = await server.useDatabase(this.dbConfig);
      const res = await this.executeApi(db, method, query);
      return res;
    } catch (err) {
      throw err;
    }
  }
}

const domino = new Domino();
export default domino;
