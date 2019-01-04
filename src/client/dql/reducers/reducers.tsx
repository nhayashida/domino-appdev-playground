import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import thunk from 'redux-thunk';
import actionTypes from '../actions/actionTypes';

const initialState = {
  dqlResponse: {},
  dqlExplain: '',
  errorMessage: '',
};
Object.freeze(initialState);

const dqlResponse = (
  dqlResponse: object = initialState.dqlResponse,
  action: { type: number; dqlResponse: object },
): object => {
  switch (action.type) {
    case actionTypes.SET_DQL_RESPONSE:
      return action.dqlResponse;
  }

  return dqlResponse;
};

const dqlExplain = (
  dqlExplain: string = initialState.dqlExplain,
  action: { type: number; dqlExplain: string },
): string => {
  switch (action.type) {
    case actionTypes.SET_DQL_EXPLAIN:
      return action.dqlExplain;
  }

  return dqlExplain;
};

const errorMessage = (
  errorMessage: string = initialState.errorMessage,
  action: { type: number; errorMessage: string },
): string => {
  switch (action.type) {
    case actionTypes.SHOW_ERROR_MESSAGE:
      return action.errorMessage;
    case actionTypes.HIDE_ERROR_MESSAGE:
      return '';
  }

  return errorMessage;
};

export const createStore = () => {
  const reducers = combineReducers({ dqlResponse, dqlExplain, errorMessage });
  return reduxCreateStore(reducers, applyMiddleware(thunk));
};
