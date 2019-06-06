import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import store from './reducers/store';
import './styles.scss';

const elem = document.getElementById('init-state');
const initState = JSON.parse((elem && elem.getAttribute('data-state')) || '{}');

ReactDOM.render(
  // tslint:disable-next-line: jsx-wrap-multiline
  <Provider store={store}>
    <App {...initState} />
  </Provider>,
  document.getElementById('app'),
);
