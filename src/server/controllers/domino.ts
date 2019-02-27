import { NextFunction, Request, Response } from 'express';
import { isUndefined } from 'lodash';
import rp, { RequestPromise } from 'request-promise';
import { Token } from '../services/cache';
import domino from '../services/domino';
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
  const { uri, method, headers, body } = options;
  return rp({ uri, method, headers, body, json: true, rejectUnauthorized: false });
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

    if (uri) {
      // Get an access token for this session
      const sid: string = req.session && req.session.sid;
      const { access_token: accessToken } = sid ? await Token.get(sid) : { access_token: '' };

      // Execute Domino Access Services
      const result = await request({
        uri,
        body,
        method: isUndefined(body) ? 'GET' : 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (!result) {
        throw new Error('No entries found');
      }
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
