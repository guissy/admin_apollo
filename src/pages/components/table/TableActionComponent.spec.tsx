import { mount } from 'enzyme';
import TableActionComponent from './TableActionComponent';
import LinkComponent from '../link/LinkComponent';
import * as React from 'react';
import { anyReactNode, mountOption, notString } from '../../../utils/jestUtil';
import chalk from 'chalk';

test('表格操作按钮: props.confirm=true', async () => {
  const wrapper = mount(
    <TableActionComponent>
      <LinkComponent confirm={true}>启用</LinkComponent>
    </TableActionComponent>,
    mountOption
  );
  // const content = wrapper.find({ confirm: false });
  console.log(wrapper);
});
