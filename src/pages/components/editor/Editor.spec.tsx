import { anyReactNode, mountOption } from '../../../utils/jestUtil';
import EditorComponent, { Props } from './Editor';
import { mount, render, shallow } from 'enzyme';
import * as React from 'react';

test('标签按钮组件: props', async () => {
  const props: Props = {
    id: 'EditorComponentIdffffdd',
    value: 'test'
  };
  const wrapper = render(<EditorComponent {...props} />, mountOption);
  // console.log(wrapper.find('#EditorComponentId iframe'));
  // expect(wrapper.find('#EditorComponentId iframe')).to
});
