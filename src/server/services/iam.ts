import { IAMClient, GRANT_TYPES } from '@domino/node-iam-client';
import { Request } from 'express';
import app from '../server';

const defaultTokenSet: TokenSet = {
  access_token: '',
  refresh_token: '',
  expires_at: Number.MAX_VALUE,
  sid: '',
  email: '',
  active: false,
};

const cache = {
  /**
   * Store a token for a session
   *
   * @param sid
   * @param tokenSet
   */
  set: async (sid: string, tokenSet: TokenSet) => {
    await (app.models as any).TokenSet.set(sid, tokenSet);
  },

  /**
   * Get a token for a session
   *
   * @param sid
   * @returns tokenSet
   */
  get: async (sid: string): Promise<TokenSet> => {
    const tokenSet = sid ? await (app.models as any).TokenSet.get(sid) : undefined;
    return Object.assign({}, defaultTokenSet, tokenSet);
  },
};

let client;
/**
 * Get an instance of IAM client
 */
const getClient = async () => {
  if (!client) {
    try {
      client = await IAMClient.createInstance({
        iam_server: process.env.DOMINO_IAM_SERVER_ORIGIN,
        client_id: process.env.DOMINO_IAM_CLIENT_ID,
        client_secret: process.env.DOMINO_IAM_CLIENT_SECRET,
        redirect_uri: `${process.env.DOMINO_IAM_CLIENT_ORIGIN}/iam/callback`,
        httpOptions: {
          rejectUnauthorized: false,
        },
      });
    } catch (err) {
      throw err;
    }
  }
  return client;
};

/**
 * Refresh a token set
 *
 * @param refreshToken
 * @returns tokenSet
 */
const refreshTokenSet = async (refreshToken: string): Promise<TokenSet> => {
  try {
    const tokenSet = await client.refreshToken(refreshToken);
    const details = await client.introspectAccessToken(tokenSet.access_token);

    return { ...tokenSet, ...details };
  } catch (err) {
    throw err;
  }
};

/**
 * Get a token
 *
 * @param req
 * @returns tokenSet
 */
const getTokenSet = async (req: Request): Promise<TokenSet> => {
  try {
    const session = req.session || { sid: '', secureCtx: undefined };
    const { sid, secureCtx } = session;
    delete session.secureCtx;

    // Use token stored in cache if avaiable
    if (sid) {
      let tokenSet = await cache.get(sid);

      // Refresh token if expired
      if (tokenSet.expires_at * 1000 < new Date().getTime()) {
        tokenSet = await refreshTokenSet(tokenSet.refresh_token);
        await cache.set(sid, tokenSet);
      }

      return tokenSet;
    }

    // Obtain token from IAM server
    const client = await getClient();
    const token = await client.getToken(req, secureCtx);
    const details = await client.introspectAccessToken(token.access_token);
    const tokenSet: TokenSet = { ...token, ...details };

    // Store token into cache
    if (tokenSet.active) {
      await cache.set(tokenSet.sid, tokenSet);
    }

    return tokenSet;
  } catch (err) {
    throw err;
  }
};

const getAuthContext = async () => {
  try {
    const { authorizationUrl, secureCtx } = (await getClient()).createAuthorizationCtx({
      scopes: (process.env.DOMINO_IAM_CLIENT_SCOPE || '').split(' '),
      grantType: GRANT_TYPES.AUTHORIZATION_CODE,
    });
    return { authorizationUrl, secureCtx };
  } catch (err) {
    throw err;
  }
};

export default { getAuthContext, getTokenSet };
