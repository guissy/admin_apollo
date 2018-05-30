import { mount } from 'enzyme';
import TableAction from './TableAction';
import LinkUI from '../link/LinkUI';
import * as React from 'react';
import { mountOption } from '../../../utils/jestUtil';

test('表格操作按钮: props.confirm=true', async () => {
  const wrapper = mount(
    <TableAction>
      <LinkUI confirm={true}>启用</LinkUI>
    </TableAction>,
    mountOption
  );
  // const content = wrapper.find({ confirm: false });
  console.log(wrapper);
});
