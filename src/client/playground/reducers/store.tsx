import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { ActionType, AppState, NotificationType, Notification, AppActionTypes } from './types';

const initialState = {
  dominoResponse: {} as DominoResponse,
  notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
};
Object.freeze(initialState);

const initState: AppState = {
  dominoResponse: {} as DominoResponse,
  notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
};

// const notification = (
//   notification: Notification = initialState.notification,
//   action: { type: string; notification: Notification },
// ): Notification => {
//   switch (action.type) {
//     case actionTypes.SHOW_NOTIFICATION:
//       return action.notification;
//     case actionTypes.HIDE_NOTIFICATION:
//       return initialState.notification;
//   }

//   return notification;
// };

const dominoResponse = (state = initState.dominoResponse, action: AppActionTypes) => {
  switch (action.type) {
    case ActionType.SET_DOMINO_RESPONSE:
      return action.dominoResponse;
  }

  return state;
};

const notification = (state = initState.notification, action: AppActionTypes) => {
  switch (action.type) {
    case ActionType.SHOW_NOTIFICATION:
      return action.notification;
    case ActionType.HIDE_NOTIFICATION:
      return initState.notification;
  }

  return state;
};

// const dominoResponse = (
//   dominoResponse: DominoResponse = initialState.dominoResponse,
//   action: { type: string; dominoResponse: DominoResponse },
// ): object => {
//   switch (action.type) {
//     case actionTypes.SET_DOMINO_RESPONSE:
//       return action.dominoResponse;
//   }

//   return dominoResponse;
// };

// export const createStore = () => {
//   const reducers = combineReducers({ notification, dominoResponse });
//   return reduxCreateStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
// };

const rootReducer = combineReducers({
  dominoResponse,
  notification,
});
export type State = ReturnType<typeof rootReducer>;

const store = reduxCreateStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;
