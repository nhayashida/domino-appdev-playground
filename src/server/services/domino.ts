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

enum BulkAPI {
  ReadDocuments = 'bulkreaddocuments',
  DeleteDocuments = 'bulkdeletedocuments',
  ReplaceItems = 'bulkreplaceitems',
  DeleteItems = 'bulkdeleteitems',
}

namespace BulkAPI {
  export const execute = async (db: any, method: string, query: object) => {
    switch (method.toLowerCase()) {
      case BulkAPI.ReadDocuments:
        return await db.bulkReadDocuments(query);
      case BulkAPI.DeleteDocuments:
        return await db.bulkDeleteDocuments(query);
      case BulkAPI.ReplaceItems:
        return await db.bulkReplaceItems(query);
      case BulkAPI.DeleteItems:
        return await db.bulkDeleteItems(query);
      default:
        throw new Error('Unknown method');
    }
  };
}

/**
 * Execute a domino-db api
 *
 * @param method
 * @param query
 * @returns response
 */
const execute = async (method: string, query: object): Promise<DqlResponse> => {
  const server = await useServer(serverConfig);
  const db = await server.useDatabase(dbConfig);

  const explain = await db.explainQuery(query);
  const bulkResponse = await BulkAPI.execute(db, method, query);

  return Object.assign({ explain }, { bulkResponse });
};

/**
 * Execute Domino Query Language
 *
 * @param method
 * @param query
 * @returns response
 */
export const query = async (method: string, query: object): Promise<DqlResponse> => {
  logger.debug(Object.assign({ method }, query));

  try {
    return await execute(method, query);
  } catch (err) {
    throw err;
  }
};
