import { IAMClient, GRANT_TYPES } from '@domino/node-iam-client';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import logger from '../../common/utils/logger';

let iamClient;
(async () => {
  try {
    iamClient = await IAMClient.createInstance({
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
})();

const authUrl = async (req, res: Response, next: NextFunction) => {
  try {
    const { authorizationUrl, secureCtx } = iamClient.createAuthorizationCtx({
      scopes: (process.env.DOMINO_IAM_CLIENT_SCOPE || '').split(' '),
      grantType: GRANT_TYPES.AUTHORIZATION_CODE,
    });

    req.session.secureCtx = secureCtx;
    res.send({ authUrl: authorizationUrl });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const callback = async (req, res: Response, next: NextFunction) => {
  const { secureCtx } = req.session;
  delete req.session.secureCtx;

  const token = await iamClient.getToken(req, secureCtx);
  const data = await iamClient.introspectAccessToken(token.access_token);
  logger.debug(data);

  res.redirect('/proton/dql');
};

export default { authUrl, callback };
