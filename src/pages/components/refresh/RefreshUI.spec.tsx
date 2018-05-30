import { Provider } from 'react-redux';
import RefreshUI from './RefreshUI';
import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name

const attributes = {
  number: 1,
  size: 10,
  total: 10
};
test('组件: props.type == manually', async () => {
  const store = configureStore([])(() => ({}));
  const wrapper = mount(
    <Provider store={store}>
      <RefreshUI actionType="namespace/effect" type="manually" attributes={attributes} />
    </Provider>
  );
  expect(wrapper.find('button').exists()).toBeTruthy();
});

test('组件: props.type == auto', async () => {
  const store = configureStore([])(() => ({}));
  const wrapper = mount(
    <Provider store={store}>
      <RefreshUI actionType="namespace/effect" type="auto" attributes={attributes} />
    </Provider>
  );
  expect(wrapper.find('.ant-select').exists()).toBeTruthy();
});
