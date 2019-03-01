import { NextFunction, Request, Response } from 'express';
import iam from '../services/iam';
import logger from '../../common/utils/logger';

const authUrl = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session || { secureCtx: undefined };

  try {
    const { authorizationUrl, secureCtx } = await iam.getAuthContext();

    session.secureCtx = secureCtx;
    res.send({ authUrl: authorizationUrl });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const callback = async (req: Request, res: Response) => {
  const session = req.session || { errorMessage: '', sid: '' };

  try {
    const { sid } = await iam.getTokenSet(req);

    session.sid = sid;
    res.redirect(`/playground`);
  } catch (err) {
    logger.error(err);

    session.errorMessage = err.message;
    res.redirect(`/playground`);
  }
};

export default { authUrl, callback };
