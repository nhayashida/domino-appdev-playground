import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import actionTypes from '../../../../src/client/playground/actions/actionTypes';
import actions from '../../../../src/client/playground/actions/actions';
import { AnyAction } from 'redux';
import mockFetch from 'jest-fetch-mock';

describe('actions', () => {
  const store = configureStore([thunk])();

  const fetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch as any;
    global['location'] = { href: '' };
    store.clearActions();
  });

  afterEach(() => {
    global.fetch = fetch;
    delete global['location'];
  });

  it('execute', async () => {
    const dominoResponse = {
      response: {
        documents: [
          {
            '@unid': '39D1DD4D365DC57485258289006446F1',
            Id: 'CN=Wanda Parsons/O=renovations',
            City: 'Little Rock',
          },
        ],
      },
      explain: 'TEST_EXPLAIN',
    };
    global.fetch.mockResponse(JSON.stringify(dominoResponse));
    await store.dispatch((actions.execute('bulkReadDocuments', {}) as unknown) as AnyAction);
    let dispatched = store.getActions();
    expect(dispatched).toEqual([
      { type: actionTypes.HIDE_NOTIFICATION },
      {
        dominoResponse,
        type: actionTypes.SET_DOMINO_RESPONSE,
      },
    ]);
    store.clearActions();

    // Show info if no entries found
    global.fetch.mockResponse(JSON.stringify({}));
    await store.dispatch((actions.execute('bulkReadDocuments', {}) as unknown) as AnyAction);
    dispatched = store.getActions();
    expect(dispatched).toEqual([
      { type: actionTypes.HIDE_NOTIFICATION },
      {
        notification: {
          message: 'No entries found',
          title: 'Info',
          type: 'info',
        },
        type: actionTypes.SHOW_NOTIFICATION,
      },
    ]);
    store.clearActions();

    // Show error if fail to fetch
    const errorMessage = 'TEST_ERROR_MESSAGE';

    global.fetch.mockRejectedValue({ message: errorMessage });
    await store.dispatch((actions.execute('bulkReadDocuments', {}) as unknown) as AnyAction);
    dispatched = store.getActions();
    expect(dispatched).toEqual([
      { type: actionTypes.HIDE_NOTIFICATION },
      {
        notification: {
          message: errorMessage,
          title: 'Error',
          type: 'error',
        },
        type: actionTypes.SHOW_NOTIFICATION,
      },
    ]);
    store.clearActions();

    global.fetch.mockResolvedValue({ json: () => ({ error: { message: errorMessage } }) });
    await store.dispatch((actions.execute('bulkReadDocuments', {}) as unknown) as AnyAction);
    dispatched = store.getActions();
    expect(dispatched).toEqual([
      { type: actionTypes.HIDE_NOTIFICATION },
      {
        notification: {
          message: errorMessage,
          title: 'Error',
          type: 'error',
        },
        type: actionTypes.SHOW_NOTIFICATION,
      },
    ]);
    store.clearActions();
  });

  it('doAuthorization', async () => {
    // Redirect to authorization page
    const authUrl = 'TEST_AUTH_URL';
    global.fetch.mockResponse(JSON.stringify({ authUrl }));
    await store.dispatch((actions.doAuthorization() as unknown) as AnyAction);
    expect(global['location']).toEqual({ href: authUrl });

    // Show error if fail to get a url for authorization page
    const errorMessage = 'TEST_ERROR_MESSAGE';

    global.fetch.mockRejectedValue({ message: errorMessage });
    await store.dispatch((actions.doAuthorization() as unknown) as AnyAction);
    let dispatched = store.getActions();
    expect(dispatched).toEqual([
      {
        notification: {
          message: errorMessage,
          title: 'Error',
          type: 'error',
        },
        type: actionTypes.SHOW_NOTIFICATION,
      },
    ]);
    store.clearActions();

    global.fetch.mockResolvedValue({ json: () => ({ error: { message: errorMessage } }) });
    await store.dispatch((actions.doAuthorization() as unknown) as AnyAction);
    dispatched = store.getActions();
    expect(dispatched).toEqual([
      {
        notification: {
          message: errorMessage,
          title: 'Error',
          type: 'error',
        },
        type: actionTypes.SHOW_NOTIFICATION,
      },
    ]);
    store.clearActions();
  });
});
