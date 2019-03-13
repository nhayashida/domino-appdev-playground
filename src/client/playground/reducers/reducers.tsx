import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Notification, NotificationType } from '../actions/actions';
import actionTypes from '../actions/actionTypes';

const initialState = {
  dominoResponse: {} as DominoResponse,
  notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
};
Object.freeze(initialState);

const notification = (
  notification: Notification = initialState.notification,
  action: { type: string; notification: Notification },
): Notification => {
  switch (action.type) {
    case actionTypes.SHOW_NOTIFICATION:
      return action.notification;
    case actionTypes.HIDE_NOTIFICATION:
      return initialState.notification;
  }

  return notification;
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
  const reducers = combineReducers({ notification, dominoResponse });
  return reduxCreateStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
};
