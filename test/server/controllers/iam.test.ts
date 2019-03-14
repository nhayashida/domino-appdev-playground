import { Request, Response } from 'express';
import controller from '../../../src/server/controllers/iam';
import service from '../../../src/server/services/iam';

jest.mock('../../../src/server/services/iam');

describe('iam', () => {
  const PROCESS_ENV = { ...process.env };

  beforeAll(() => {
    process.env.DOMINO_IAM_CLIENT_SCOPE =
      'openid offline_access das.freebusy das.calendar.read.with.shared das.calendar.write.with.shared';
  });

  afterAll(() => {
    process.env = PROCESS_ENV;
  });

  it('Return url for authorization page', async done => {
    const context = {
      authorizationUrl: 'TEST_AUTH_URL',
      secureCtx: { nonce: 'TEST_NONCE', state: 'TEST_STATE' },
    };
    service.getAuthContext = jest.fn().mockResolvedValue(context);

    const req = { session: {} } as Request;

    const res = {
      send: body => {
        expect(req.session && req.session.secureCtx).toEqual(context.secureCtx);
        expect(body.authUrl).toEqual(context.authorizationUrl);

        done();
      },
    } as Response;

    await controller.authUrl(req, res, () => {});
  });

  it('Obtain access token and redirect to the main page', async done => {
    const sid = 'TEST_SID';
    service.getTokenSet = jest.fn().mockResolvedValue({ sid });

    const req = { session: {} } as Request;

    const res = {
      redirect: path => {
        expect(req.session && req.session.sid).toEqual(sid);
        expect(path).toEqual('/playground');

        done();
      },
    } as Response;

    await controller.callback(req, res);
  });

  it('Set error message and redirect to the main page if fail to obtain access token', async done => {
    const errorMessage = 'TEST_ERROR_MESSAGE';
    service.getTokenSet = jest.fn().mockRejectedValue({ message: errorMessage });

    const req = { session: {} } as Request;

    const res = {
      redirect: path => {
        expect(req.session && req.session.errorMessage).toEqual(errorMessage);
        expect(path).toEqual('/playground');

        done();
      },
    } as Response;

    await controller.callback(req, res);
  });
});
