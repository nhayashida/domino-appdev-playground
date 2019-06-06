// tslint:disable: jsx-wrap-multiline

import 'jsdom-global/register';
import { mount } from 'enzyme';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Notification, NotificationType } from '../../../../src/client/playground/reducers/types';
import Response from '../../../../src/client/playground/components/Response';
import { DOMINO_API_PROPERTIES } from '../../../../src/common/utils/constants';

describe('Response', () => {
  it('Render without an error', () => {
    const store = configureStore([thunk])({
      dominoResponse: {},
      notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
    });
    const wrapper = mount(
      <Provider store={store}>
        <Response selectedApi={DOMINO_API_PROPERTIES[0].api} />,
      </Provider>,
    );

    // Response should be hidden
    const dominoResponses = wrapper.find('.domino-response');
    expect(dominoResponses.length).toEqual(1);
    expect(dominoResponses.at(0).hasClass('has-response')).toBe(false);

    // Notification should be hidden
    const notifications = wrapper.find('.bx--inline-notification');
    expect(notifications.length).toEqual(1);
    expect(notifications.at(0).hasClass('has-message')).toBe(false);
  });

  it('Show response from server', () => {
    const response = 'TEST_RESPONSE';

    const store = configureStore([thunk])({
      dominoResponse: { response },
      notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
    });
    const wrapper = mount(
      <Provider store={store}>
        <Response selectedApi={DOMINO_API_PROPERTIES[0].api} />,
      </Provider>,
    );

    const dominoResponses = wrapper.find('.domino-response');
    expect(dominoResponses.length).toEqual(1);
    expect(dominoResponses.at(0).hasClass('has-response')).toBe(true);
    expect(dominoResponses.find('code').text()).toEqual(`"${response}"`);

    // Explain should be hidden
    expect(dominoResponses.find('.explain').hasClass('has-explain')).toBe(false);

    // Notification should be hidden
    const notifications = wrapper.find('.bx--inline-notification');
    expect(notifications.length).toEqual(1);
    expect(notifications.at(0).hasClass('has-message')).toBe(false);
  });

  it('Show response and explain from server', () => {
    const response = 'TEST_RESPONSE';
    const explain = 'TEST_EXPLAIN';

    const store = configureStore([thunk])({
      dominoResponse: { response, explain },
      notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
    });
    const wrapper = mount(
      <Provider store={store}>
        <Response selectedApi={DOMINO_API_PROPERTIES[0].api} />,
      </Provider>,
    );

    const dominoResponses = wrapper.find('.domino-response');
    expect(dominoResponses.length).toEqual(1);
    expect(dominoResponses.at(0).hasClass('has-response')).toBe(true);
    expect(dominoResponses.find('code').text()).toEqual(`"${response}"`);

    const explains = dominoResponses.find('.explain');
    expect(explains.at(0).hasClass('has-explain')).toBe(true);
    expect(explains.text()).toEqual(explain);

    // Notification should be hidden
    const notifications = wrapper.find('.bx--inline-notification');
    expect(notifications.length).toEqual(1);
    expect(notifications.at(0).hasClass('has-message')).toBe(false);
  });

  it('Show notification', () => {
    const type = NotificationType.Error;
    const title = 'TEST_ERROR';
    const message = 'TEST_MESSAGE';

    const store = configureStore([thunk])({
      dominoResponse: { response: 'TEST_RESPONSE', explain: 'TEST_EXPLAIN' },
      notification: { type, title, message } as Notification,
    });
    const wrapper = mount(
      <Provider store={store}>
        <Response selectedApi={DOMINO_API_PROPERTIES[0].api} />,
      </Provider>,
    );

    // Response should be hidden always if there is a notification
    const dominoResponses = wrapper.find('.domino-response');
    expect(dominoResponses.length).toEqual(1);
    expect(dominoResponses.at(0).hasClass('has-response')).toBe(false);

    const notifications = wrapper.find('.bx--inline-notification');
    expect(notifications.length).toEqual(1);
    expect(notifications.at(0).hasClass('has-message')).toBe(true);
    expect(notifications.at(0).props().kind).toEqual('error');
    expect(notifications.find('.bx--inline-notification__title').text()).toEqual(title);
    expect(notifications.find('.bx--inline-notification__subtitle').text()).toEqual(message);
  });
});
