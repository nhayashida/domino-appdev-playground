import { IAMClient, GRANT_TYPES } from '@domino/node-iam-client';

let client;

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

export const getAuthContext = async () => {
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

export const getToken = async req => {
  try {
    const { secureCtx } = req.session;
    delete req.session.secureCtx;

    const client = await getClient();
    const tokenSet = await client.getToken(req, secureCtx);
    const details = await client.introspectAccessToken(tokenSet.access_token);

    return { ...tokenSet, ...details };
  } catch (err) {
    throw err;
  }
};
