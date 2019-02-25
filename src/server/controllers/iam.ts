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

    res.redirect(`/playground?sid=${sid}`);
  } catch (err) {
    logger.error(err);
    res.redirect(`/playground?error=${err.message}`);
  }
};

export default { authUrl, callback };
