import { useServer } from '@domino/domino-db';
import logger from '../../common/utils/logger';

export type DqlResponse = {
  bulkResponse: object;
  explain: string;
};

const serverConfig = {
  hostName: process.env.DOMINO_HOST,
  connection: {
    port: process.env.DOMINO_PROTON_PORT,
  },
};

const dbConfig = {
  filePath: process.env.DOMINO_DB_FILE_PATH,
};

/**
 * Execute a domino-db api
 *
 * @param db
 * @param method
 * @param query
 * @returns response
 */
const executeApi = async (db: any, method: string, query: object): Promise<DqlResponse> => {
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
};

const domino = {
  /**
   * Execute Domino Query Language
   *
   * @param method
   * @param query
   * @returns response
   */
  query: async (method: string, query: object): Promise<DqlResponse> => {
    logger.debug(Object.assign({ method }, query));

    try {
      const server = await useServer(serverConfig);
      const db = await server.useDatabase(dbConfig);
      const res = await executeApi(db, method, query);
      return res;
    } catch (err) {
      throw err;
    }
  },
};

export default domino;
