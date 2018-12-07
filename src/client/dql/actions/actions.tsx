import actionTypes from './actionTypes';

const actions = {
  setDqlResponse: (dqlResponse: object) => ({
    dqlResponse,
    type: actionTypes.SET_DQL_RESPONSE,
  }),

  setDqlExplain: (dqlExplain: string) => ({
    dqlExplain,
    type: actionTypes.SET_DQL_EXPLAIN,
  }),

  executeDql: (method: string, options: object) => async dispatch => {
    dispatch(actions.hideErrorMessage());

    const res = await fetch(`/proton/dql?method=${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(options),
    });

    const data = await res.json();
    if (!res.ok) {
      dispatch(actions.showErrorMessage(data.message));
    } else {
      dispatch(actions.setDqlResponse(data.bulkResponse));
      dispatch(actions.setDqlExplain(data.explain));
    }
  },

  showErrorMessage: (errorMessage: string) => ({
    errorMessage,
    type: actionTypes.SHOW_ERROR_MESSAGE,
  }),

  hideErrorMessage: () => ({
    type: actionTypes.HIDE_ERROR_MESSAGE,
  }),
};

export default actions;
