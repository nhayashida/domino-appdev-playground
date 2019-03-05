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
      dispatch(actions.hideNotification());

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

  clearResponse: () => async (dispatch: Dispatch) => {
    dispatch(actions.hideNotification());
    dispatch(actions.setDominoResponse({} as DominoResponse));
  },

  authorize: () => async dispatch => {
    try {
      const res = await fetch('/iam/auth/url');

      const data = await res.json();
      if (!res.ok) {
        dispatch(actions.showErrorNotification(data.error.message));
      } else {
        // Redirect to authorization page
        location.href = data.authUrl;
      }
    } catch (err) {
      dispatch(actions.showErrorNotification(err.message));
    }
  },
};

export default actions;
