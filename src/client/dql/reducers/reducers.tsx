import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import actionTypes from '../actions/actionTypes';

const initialState = {
  dqlResponse: {} as DqlResponse,
  errorMessage: '',
};
Object.freeze(initialState);

const errorMessage = (
  errorMessage: string = initialState.errorMessage,
  action: { type: string; errorMessage: string },
): string => {
  switch (action.type) {
    case actionTypes.SHOW_ERROR_MESSAGE:
      return action.errorMessage;
    case actionTypes.HIDE_ERROR_MESSAGE:
      return '';
  }

  return errorMessage;
};

const dqlResponse = (
  dqlResponse: DqlResponse = initialState.dqlResponse,
  action: { type: string; dqlResponse: DqlResponse },
): object => {
  switch (action.type) {
    case actionTypes.SET_DQL_RESPONSE:
      return action.dqlResponse;
  }

  return dqlResponse;
};

export const createStore = () => {
  const reducers = combineReducers({ errorMessage, dqlResponse });
  return reduxCreateStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
};
