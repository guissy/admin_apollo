import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import LinkComponent from './LinkComponent';
import * as React from 'react';
import { anyReactNode, mountOption, notString } from '../../../utils/jestUtil';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name

import chalk from 'chalk';

test('表格操作按钮: props.confirm=true', async () => {
  const store = configureStore([])(() => ({}));
  const wrapper = mount(
    <Provider store={store}>
      <LinkComponent confirm={true}>启用</LinkComponent>
    </Provider>
  );
  expect(wrapper.find('[confirm=true]'));
});
