import { Request, Response } from 'express';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import App from '../../client/components/dql/App';
import Html from '../../client/components/dql/Html';
import domino from '../services/domino';
import logger from '../../common/utils/logger';

/**
 * Execute Domino Query Language
 *
 * @param req
 * @param res
 */
const execute = async (req: Request, res: Response) => {
  try {
    res.send(await domino.query(req.query.method, req.body));
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
};

/**
 * Render the UI for executing DQL
 *
 * @param req
 * @param res
 */
const render = (req: Request, res: Response) => {
  renderToNodeStream(
    <Html>
      <App />
    </Html>,
  ).pipe(res);
};

export default { execute, render };
