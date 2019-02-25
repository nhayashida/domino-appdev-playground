import { Request, Response } from 'express';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { Provider } from 'react-redux';
import App from '../../client/dql/components/App';
import Html from '../../client/dql/components/Html';
import { createStore } from '../../client/dql/reducers/reducers';

const render = async (req: Request, res: Response) => {
  renderToNodeStream(
    <Html>
      <Provider store={createStore()}>
        <App />
      </Provider>
    </Html>,
  ).pipe(res);
};

export default { render };
