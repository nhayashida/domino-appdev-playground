import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { setDominoResponse, showNotification, hideNotification } from './actions';
import { NotificationType } from './types';
import { State } from './store';

export const executeApi = (method: string, options: object) => async (
  dispatch: ThunkDispatch<State, void, Action>,
) => {
  try {
    dispatch(hideNotification());

    const res = await fetch('/domino/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ method, options }),
    });

    const data = await res.json();
    if (!res.ok) {
      dispatch(showErrorNotification(data.error.message));
    } else if (!data.response) {
      dispatch(showInfoNotification('No entries found'));
    } else {
      dispatch(setDominoResponse(data));
    }
  } catch (err) {
    dispatch(showErrorNotification(err.message));
  }
};

export const clearResponse = () => async (dispatch: ThunkDispatch<State, void, Action>) => {
  dispatch(hideNotification());
  dispatch(setDominoResponse({} as DominoResponse));
};

export const doAuthorization = () => async dispatch => {
  try {
    const res = await fetch('/iam/auth/url');

    const data = await res.json();
    if (!res.ok) {
      dispatch(showErrorNotification(data.error.message));
    } else {
      // Redirect to authorization page
      location.href = data.authUrl;
    }
  } catch (err) {
    dispatch(showErrorNotification(err.message));
  }
};

export const showInfoNotification = (message: string) => async (
  dispatch: ThunkDispatch<State, void, Action>,
) => {
  dispatch(showNotification({ message, title: 'Info', type: NotificationType.Info }));
};

export const showErrorNotification = (message: string) => async (
  dispatch: ThunkDispatch<State, void, Action>,
) => {
  dispatch(showNotification({ message, title: 'Error', type: NotificationType.Error }));
};
