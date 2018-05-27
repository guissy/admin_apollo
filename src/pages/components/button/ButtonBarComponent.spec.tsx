import { anyReactNode, mountOption } from '../../../utils/jestUtil';
import ButtonBarComponent from './ButtonBarComponent';
import { mount } from 'enzyme';
import * as React from 'react';

test(
  '按钮操作栏: props.onRefreshMode/onCreate/onExport=undefined',
  anyReactNode(async (children: string) => {
    const wrapper = mount(<ButtonBarComponent>{children}</ButtonBarComponent>, mountOption);
    expect(wrapper.text()).not.toMatch('刷新');
    expect(wrapper.text()).not.toMatch('新增');
    expect(wrapper.text()).not.toMatch('导出');
  })
);
test(
  '按钮操作栏: props.children=ReactNode',
  anyReactNode(async (children: string) => {
    const onCreate = jest.fn();
    const onRefresh = jest.fn();
    const onExport = jest.fn();
    const wrapper = mount(
      <ButtonBarComponent
        onCreate={onCreate}
        onRefresh={onRefresh}
        onRefreshMode={''}
        onExport={onExport}
      >
        {children}
      </ButtonBarComponent>,
      mountOption
    );
    expect(wrapper.text()).toMatch('刷新');
    expect(wrapper.text()).toMatch('新增');
    expect(wrapper.text()).toMatch('导出');
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    wrapper
      .find('button')
      .at(1)
      .simulate('click');
    wrapper
      .find('button')
      .at(2)
      .simulate('click');
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledTimes(1);
  })
);
test(
  '按钮操作栏: props.children=ReactNode',
  anyReactNode(async (children: string) => {
    const wrapper = mount(
      <ButtonBarComponent onCreate={() => 0}>{children}</ButtonBarComponent>,
      mountOption
    );
    if (typeof children === 'object') {
      wrapper.containsMatchingElement(children);
    }
  })
);
test('按钮操作栏: props.style={color} & props.className=string', async () => {
  const props = { style: { color: 'rgb(255, 0, 0)' }, className: 'test-cls' } as any; // tslint:disable-line
  const wrapper = mount(<ButtonBarComponent onCreate={() => 0} {...props} />, mountOption);
  expect(wrapper.find('button')).toHaveStyle(props);
});
