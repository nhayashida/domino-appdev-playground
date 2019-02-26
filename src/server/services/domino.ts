import { useServer } from '@domino/domino-db';
import fs from 'fs';
import { fromPairs, isEmpty } from 'lodash';
import path from 'path';
import logger from '../../common/utils/logger';

type ServerConfig = {
  hostName: string;
  connection: {
    port: string;
    secure?: boolean;
  };
  credentials?: Credentials;
};

type Credentials = {
  rootCertificate: Buffer;
  clientCertificate: Buffer;
  clientKey: Buffer;
};

let serverConfig = {} as ServerConfig;

const getServerConfig = (): ServerConfig => {
  if (isEmpty(serverConfig)) {
    const secure = process.env.DOMINO_PROTON_SECURE === 'true';

    serverConfig = {
      hostName: process.env.DOMINO_HOST || '',
      connection: {
        secure,
        port: process.env.DOMINO_PROTON_PORT || '',
      },
    };

    if (secure) {
      try {
        Object.assign(serverConfig, { credentials: readCredentials() });
      } catch (err) {
        throw err;
      }
    }
  }

  return serverConfig;
};

const readCredentials = (): Credentials => {
  try {
    const props = {
      rootCertificate: process.env.DOMINO_PROTON_ROOT_CERT_PATH,
      clientCertificate: process.env.DOMINO_PROTON_CLIENT_CERT_PATH,
      clientKey: process.env.DOMINO_PROTON_CLIENT_KEY_PATH,
    };
    return fromPairs(
      Object.keys(props).map(key => [key, fs.readFileSync(path.resolve(props[key]))]),
    ) as Credentials;
  } catch (err) {
    throw err;
  }
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
  export const execute = async (db: any, method: string, query: DQLQuery) => {
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
 * Execute Domino Query Language
 *
 * @param method
 * @param query
 * @returns response
 */
const query = async (method: string, query: DQLQuery): Promise<DominoResponse> => {
  logger.debug(Object.assign({ method }, query));

  try {
    const server = await useServer(getServerConfig());
    const db = await server.useDatabase(dbConfig);

    const explain = await db.explainQuery(query);
    const response = await BulkAPI.execute(db, method, query);

    return { explain, response };
  } catch (err) {
    throw err;
  }
};

export default { query };
