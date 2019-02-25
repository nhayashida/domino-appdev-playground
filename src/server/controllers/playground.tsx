import { Request, Response } from 'express';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { Provider } from 'react-redux';
import { Token } from '../services/cache';
import App from '../../client/playground/components/App';
import Html from '../../client/playground/components/Html';
import { createStore } from '../../client/playground/reducers/reducers';

const render = async (req: Request, res: Response) => {
  const { error, sid } = req.query;

  const initState = {
    errorMessage: error,
  };
  if (sid) {
    const token = await Token.get(sid);
    Object.assign(initState, { userId: token.email });
  }

  renderToNodeStream(
    <Html initState={JSON.stringify(initState)}>
      <Provider store={createStore()}>
        <App />
      </Provider>
    </Html>,
  ).pipe(res);
};

export default { render };
