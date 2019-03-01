import { Dispatch } from 'redux';
import actionTypes from './actionTypes';

export enum NotificationType {
  Info = 'info',
  Error = 'error',
}

export type Notification = {
  type: NotificationType;
  title: string;
  message: string;
};

const actions = {
  showNotification: (notification: Notification) => ({
    notification,
    type: actionTypes.SHOW_NOTIFICATION,
  }),

  hideNotification: () => ({
    type: actionTypes.HIDE_NOTIFICATION,
  }),

  setDominoResponse: (dominoResponse: DominoResponse) => ({
    dominoResponse,
    type: actionTypes.SET_DOMINO_RESPONSE,
  }),

  showInfoNotification: (message: string) => async (dispatch: Dispatch) => {
    dispatch(actions.showNotification({ message, title: 'Info', type: NotificationType.Info }));
  },

  showErrorNotification: (message: string) => async (dispatch: Dispatch) => {
    dispatch(actions.showNotification({ message, title: 'Error', type: NotificationType.Error }));
  },

  execute: (method: string, options: object) => async dispatch => {
    try {
      const res = await fetch('/domino/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ method, options }),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(actions.showErrorNotification(data.error.message));
      } else if (!data.response) {
        dispatch(actions.showInfoNotification('No entries found'));
      } else {
        dispatch(actions.setDominoResponse(data));
      }
    } catch (err) {
      dispatch(actions.showErrorNotification(err.message));
    }
  },
};

export default actions;
