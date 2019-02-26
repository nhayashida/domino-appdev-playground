import { NextFunction, Response } from 'express';
import { Token } from '../services/cache';
import { getAuthContext, getToken } from '../services/iam';
import logger from '../../common/utils/logger';

const authUrl = async (req, res: Response, next: NextFunction) => {
  try {
    const { authorizationUrl, secureCtx } = await getAuthContext();

    req.session.secureCtx = secureCtx;
    res.send({ authUrl: authorizationUrl });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const callback = async (req, res: Response, next: NextFunction) => {
  try {
    const token = await getToken(req);
    const { sid } = token;

    // Store token into cache
    await Token.set(sid, token);

    req.session.sid = sid;
    res.redirect(`/playground`);
  } catch (err) {
    logger.error(err);

    req.session.error = err.message;
    res.redirect(`/playground`);
  }
};

export default { authUrl, callback };
