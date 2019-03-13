import { NextFunction, Request, Response } from 'express';
import { isUndefined } from 'lodash';
import rp, { RequestPromise } from 'request-promise';
import domino from '../services/domino';
import iam from '../services/iam';
import logger from '../../common/utils/logger';

/**
 * Send a http request
 *
 * @param options
 * @returns promise
 */
const request = (options: {
  uri: string;
  method?: string;
  headers?: { Authorization: string };
  body?: object;
}): RequestPromise => {
  return rp({ ...options, json: true, rejectUnauthorized: false });
};

/**
/**
 * Execute a Domino API
 *
 * @param req
 * @param res
 * @param next
 */
const api = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { method, options } = req.body;
    const { uri, body } = options;

    if (!isUndefined(uri)) {
      // Get an access token for this session
      const { access_token: accessToken } = await iam.getTokenSet(req);

      // Execute Domino Access Services
      const result = await request({
        uri,
        body,
        method,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      res.send({ response: result });
    } else {
      // Execute Domino Query Language
      res.send(await domino.query(method, options as DQLQuery));
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export default { api };
