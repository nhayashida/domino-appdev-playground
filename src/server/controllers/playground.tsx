import { Request, Response } from 'express';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { Provider } from 'react-redux';
import iam from '../services/iam';
import App from '../../client/playground/components/App';
import Html from '../../client/playground/components/Html';
import { createStore } from '../../client/playground/reducers/reducers';

const render = async (req: Request, res: Response) => {
  const session = req.session || { error: '', sid: '' };
  const { error } = session;
  delete session.error;

  const initState = {
    initErrorMessage: error,
  };
  const tokenSet = await iam.getTokenSet(req);
  if (tokenSet.active) {
    Object.assign(initState, { userId: tokenSet.email });
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
