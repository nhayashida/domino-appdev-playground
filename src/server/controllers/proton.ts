import { NextFunction, Request, Response } from 'express';
import { query } from '../services/domino';
import logger from '../../common/utils/logger';

/**
 * Execute Domino Query Language
 *
 * @param req
 * @param res
 */
const dql = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(await query(req.query.method, req.body));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export default { dql };
