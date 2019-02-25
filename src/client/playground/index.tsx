import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { createStore } from './reducers/reducers';
import './styles.scss';

const elem = document.getElementById('init-state');
const initState = JSON.parse((elem && elem.getAttribute('data-state')) || '{}');

ReactDOM.render(
  <Provider store={createStore()}>
    <App {...initState} />
  </Provider>,
  document.getElementById('app'),
);
