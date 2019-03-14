import { useServer } from '@domino/domino-db';
import path from 'path';
import domino from '../../../src/server/services/domino';
import { DOMINO_API_PROPERTIES } from '../../../src/common/utils/constants';

jest.mock('@domino/domino-db');

describe('domino', () => {
  const PROCESS_ENV = { ...process.env };

  beforeEach(() => {
    process.env.DOMINO_HOST = 'TEST_DOMINO_HOST';
    process.env.DOMINO_DB_FILE_PATH = 'TEST_DB_FILE_PATH';
    process.env.DOMINO_PROTON_PORT = 'TEST_DOMINO_PROTON_PORT';
    process.env.DOMINO_PROTON_SECURE = 'true';
    process.env.DOMINO_PROTON_ROOT_CERT_PATH = 'test/ca.crt';
    process.env.DOMINO_PROTON_CLIENT_CERT_PATH = 'test/app.crt';
    process.env.DOMINO_PROTON_CLIENT_KEY_PATH = 'test/app.key';
  });

  afterEach(() => {
    process.env = PROCESS_ENV;
  });

  it('query', async () => {
    const query = { query: "LastName = 'Parsons'", itemNames: ['Id', 'City'] };
    const explain = 'TEST_EXLPAN';
    const response = {
      documents: [
        {
          '@unid': '39D1DD4D365DC57485258289006446F1',
          Id: 'CN=Wanda Parsons/O=renovations',
          City: 'Little Rock',
        },
      ],
    };

    (useServer as any).mockImplementation(serverConfig => {
      expect(serverConfig).toEqual({
        hostName: process.env.DOMINO_HOST,
        connection: {
          port: process.env.DOMINO_PROTON_PORT,
          secure: true,
        },
        credentials: {
          rootCertificate: Buffer.from('TEST_CA_CRT\n'),
          clientCertificate: Buffer.from('TEST_APP_CRT\n'),
          clientKey: Buffer.from('TEST_APP_KEY\n'),
        },
      });

      return {
        useDatabase: () => {
          return {
            explainQuery: options => {
              expect(options).toEqual(query);
              return explain;
            },
            bulkReadDocuments: options => {
              expect(options).toEqual(query);
              return response;
            },
            bulkDeleteDocuments: options => {
              expect(options).toEqual(query);
              return response;
            },
            bulkReplaceItems: options => {
              expect(options).toEqual(query);
              return response;
            },
            bulkDeleteItems: options => {
              expect(options).toEqual(query);
              return response;
            },
          };
        },
      };
    });

    for (const { api } of DOMINO_API_PROPERTIES.filter(props => props.group === 'domino-db')) {
      const result = await domino.query(api, query);
      expect(result).toEqual({ response, explain });
    }
  });
});
