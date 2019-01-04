import { Request, Response } from 'express';
import { query } from '../services/domino';
import logger from '../../common/utils/logger';

/**
 * Execute Domino Query Language
 *
 * @param req
 * @param res
 */
const dql = async (req: Request, res: Response) => {
  try {
    res.send(await query(req.query.method, req.body));
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
};

export default dql;
