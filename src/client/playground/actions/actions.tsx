import { Dispatch } from 'redux';
import actionTypes from './actionTypes';

const actions = {
  showErrorMessage: (errorMessage: string) => ({
    errorMessage,
    type: actionTypes.SHOW_ERROR_MESSAGE,
  }),

  hideErrorMessage: () => ({
    type: actionTypes.HIDE_ERROR_MESSAGE,
  }),

  setDominoResponse: (dominoResponse: DominoResponse) => ({
    dominoResponse,
    type: actionTypes.SET_DOMINO_RESPONSE,
  }),

  clearResponse: () => async (dispatch: Dispatch) => {
    dispatch(actions.setDominoResponse({} as DominoResponse));
    dispatch(actions.hideErrorMessage());
  },

  execute: (method: string, options: object) => async dispatch => {
    dispatch(actions.clearResponse());

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
        dispatch(actions.showErrorMessage(data.error.message));
      } else {
        dispatch(actions.setDominoResponse(data));
      }
    } catch (err) {
      dispatch(actions.showErrorMessage(err.message));
    }
  },
};

export default actions;
