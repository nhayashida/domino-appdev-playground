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

  setDqlResponse: (dqlResponse: DqlResponse) => ({
    dqlResponse,
    type: actionTypes.SET_DQL_RESPONSE,
  }),

  executeDql: (method: string, options: DqlQuery) => async (dispatch: Dispatch) => {
    dispatch(actions.hideErrorMessage());

    try {
      const res = await fetch(`/proton/dql?method=${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(options),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(actions.showErrorMessage(data.error.message));
      } else {
        dispatch(actions.setDqlResponse(data));
      }
    } catch (err) {
      dispatch(actions.showErrorMessage(err.message));
    }
  },
};

export default actions;
