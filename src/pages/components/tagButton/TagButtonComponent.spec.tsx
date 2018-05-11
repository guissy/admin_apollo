import { anyReactNode, mountOption } from '../../../utils/jestUtil';
import TagButtonComponent from './TagButtonComponent';
import { mount } from 'enzyme';
import * as React from 'react';

test('标签按钮组件: props.children', async () => {
  const wrapper = mount(<TagButtonComponent>testChildren</TagButtonComponent>, mountOption);
  expect(wrapper.text()).toMatch('testChildren');
});

test('标签按钮组件: props.onClick', async () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <TagButtonComponent onClick={onClick} className="test-textggg">
      <span>testChildren</span>
    </TagButtonComponent>,
    mountOption
  );
  wrapper
    .find('.test-textggg')
    .first()
    .simulate('click');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('标签按钮组件: props.hidden', async () => {
  const wrapper = mount(
    <TagButtonComponent hidden={true}>testChildren</TagButtonComponent>,
    mountOption
  );
  expect(wrapper.find('TagButton').exists()).toBeFalsy();
});

test('标签按钮组件: props.className、style', async () => {
  const props = { style: { color: 'rgb(255, 0, 0)' }, className: 'test-cls' } as any; // tslint:disable-line
  const wrapper = mount(
    <TagButtonComponent {...props}>testChildren</TagButtonComponent>,
    mountOption
  );
  expect(wrapper).toHaveStyle(props);
});
