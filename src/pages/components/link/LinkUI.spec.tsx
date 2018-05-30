import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import LinkUI from './LinkUI';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name

test('表格操作按钮: props.confirm=true', async () => {
  const store = configureStore([])(() => ({}));
  const wrapper = mount(
    <Provider store={store}>
      <LinkUI confirm={true}>启用</LinkUI>
    </Provider>
  );
  expect(wrapper.find('[confirm=true]'));
});
