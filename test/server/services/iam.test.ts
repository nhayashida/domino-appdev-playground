import { Request, Response } from 'express';
import { IAMClient } from '@domino/node-iam-client';
import iam from '../../../src/server/services/iam';

jest.mock('@domino/node-iam-client');

describe('iam', () => {
  const context = {
    authorizationUrl: 'TEST_AUTH_URL',
    secureCtx: { nonce: 'TEST_NONCE', state: 'TEST_STATE' },
  };
  const sid = 'TEST_SID';
  const secureCtx = { nonce: 'TEST_NONCE', state: 'TEST_STATE' };
  const token = {
    access_token: 'TEST_ACCESS_TOKEN',
    refresh_token: 'TEST_REFRESH_TOKEN',
    expires_at: 0,
  };
  const newToken = {
    access_token: 'TEST_ACCESS_TOKEN_NEW',
    refresh_token: 'TEST_REFRESH_TOKEN_NEW',
    expires_at: 1,
  };
  const details = {
    sid,
    active: true,
  };

  IAMClient.createInstance = jest.fn().mockReturnValue({
    createAuthorizationCtx: () => context,
    getToken: () => token,
    introspectAccessToken: () => details,
    refreshToken: refreshToken => {
      expect(refreshToken).toEqual(token.refresh_token);
      return newToken;
    },
  });

  it('getAuthContext', async () => {
    const result = await iam.getAuthContext();
    expect(result).toEqual(context);
  });

  it('getTokenSet', async () => {
    // Obtain access token
    let req = ({ session: { secureCtx } } as unknown) as Request;
    let result = await iam.getTokenSet(req);
    expect(result).toEqual({ ...token, ...details });

    // Refresh access token
    req = ({ session: { sid, secureCtx } } as unknown) as Request;
    result = await iam.getTokenSet(req);
    expect(result).toEqual({ ...newToken, ...details });
  });
});
