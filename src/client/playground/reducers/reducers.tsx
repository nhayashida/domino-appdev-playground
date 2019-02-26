import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import actionTypes from '../actions/actionTypes';

const initialState = {
  dominoResponse: {} as DominoResponse,
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

const dominoResponse = (
  dominoResponse: DominoResponse = initialState.dominoResponse,
  action: { type: string; dominoResponse: DominoResponse },
): object => {
  switch (action.type) {
    case actionTypes.SET_DOMINO_RESPONSE:
      return action.dominoResponse;
  }

  return dominoResponse;
};

export const createStore = () => {
  const reducers = combineReducers({ errorMessage, dominoResponse });
  return reduxCreateStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
};
