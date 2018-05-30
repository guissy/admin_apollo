import { mountOption } from '../../../utils/jestUtil';
import TagButton from './TagButton';
import { mount } from 'enzyme';
import * as React from 'react';

test('标签按钮组件: props.children', async () => {
  const wrapper = mount(<TagButton>testChildren</TagButton>, mountOption);
  expect(wrapper.text()).toMatch('testChildren');
});

test('标签按钮组件: props.onClick', async () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <TagButton onClick={onClick} className="test-textggg">
      <span>testChildren</span>
    </TagButton>,
    mountOption
  );
  wrapper
    .find('.test-textggg')
    .first()
    .simulate('click');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('标签按钮组件: props.hidden', async () => {
  const wrapper = mount(<TagButton hidden={true}>testChildren</TagButton>, mountOption);
  expect(wrapper.find('TagButton').exists()).toBeFalsy();
});

test('标签按钮组件: props.className、style', async () => {
  const props = { style: { color: 'rgb(255, 0, 0)' }, className: 'test-cls' } as any; // tslint:disable-line
  const wrapper = mount(<TagButton {...props}>testChildren</TagButton>, mountOption);
  expect(wrapper).toHaveStyle(props);
});
