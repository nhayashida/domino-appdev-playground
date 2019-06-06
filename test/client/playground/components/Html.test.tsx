import 'jsdom-global/register';
import { shallow } from 'enzyme';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Notification, NotificationType } from '../../../../src/client/playground/reducers/types';
import App from '../../../../src/client/playground/components/App';
import Html from '../../../../src/client/playground/components/Html';

describe('Html', () => {
  it('Render without an error', () => {
    const store = configureStore([thunk])({
      dominoResponse: {},
      notification: { type: NotificationType.Info, title: '', message: '' } as Notification,
    });
    const wrapper = shallow(
      // tslint:disable-next-line: jsx-wrap-multiline
      <Html>
        <Provider store={store}>
          <App />
        </Provider>
      </Html>,
    );

    const initStates = wrapper.find('#init-state');
    expect(initStates.length).toEqual(1);
    expect(initStates.props()['data-state']).toBeUndefined();

    const components = wrapper.render();

    expect(components.find('.playground-component').length).toEqual(1);

    const notifications = components.find('.bx--inline-notification');
    expect(notifications.length).toEqual(1);
    expect(notifications.hasClass('has-message')).toBe(false);
  });
});
