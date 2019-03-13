import 'jsdom-global/register';
import { mount } from 'enzyme';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import InputForm from '../../../../src/client/playground/components/InputForm';
import { DOMINO_API_PROPERTIES } from '../../../../src/common/utils/constants';

describe('InputForm', () => {
  it('Render without an error', () => {
    DOMINO_API_PROPERTIES.forEach(dominoProps => {
      const { api, options } = dominoProps;

      const store = configureStore([thunk])();
      const wrapper = mount(
        <Provider store={store}>
          <InputForm selectedApi={api} />,
        </Provider>,
      );

      const labels = wrapper.find('.bx--label');
      expect(labels.length).toEqual(options.length);

      const textareas = wrapper.find('.bx--text-area');
      expect(textareas.length).toEqual(options.length);

      textareas.forEach((textarea, i) => {
        const label = labels.at(i);
        expect(label.text()).toEqual(options[i].id);

        const props = textarea.props();
        expect(props.id).toEqual(options[i].id);
        expect(props.placeholder).toEqual(options[i].placeholder);
      });

      const buttons = wrapper.find('.bx--btn');
      expect(buttons.length).toEqual(1);
    });
  });

  it('Adjust the height of a textarea when the value is changed', () => {
    const { api, options } = DOMINO_API_PROPERTIES[0];

    const store = configureStore([thunk])();
    const wrapper = mount(
      <Provider store={store}>
        <InputForm selectedApi={api} />,
      </Provider>,
    );

    const textareas = wrapper.find('.bx--text-area');
    const instance = textareas.at(0).instance();
    expect(instance['style']['height']).toEqual('');
    textareas.at(0).simulate('change');
    expect(instance['style']['height']).toEqual('1px');
  });
});
