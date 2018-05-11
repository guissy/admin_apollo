import { mount } from 'enzyme';
import LanguageComponent from './LanguageComponent';
import * as React from 'react';
import { mountOption } from '../../../utils/jestUtil';
import chalk from 'chalk';

test('语言下拉框: select value', async () => {
  const wrapper = mount(<LanguageComponent />, mountOption);
  expect(wrapper.text()).toMatch('请选择语言s');
  wrapper.childAt(0).simulate('click');
  expect(document.body.textContent).toMatch('简体');
  expect(document.body.textContent).toMatch('繁体');
});

test('语言下拉框: props.placeholder=myString', async () => {
  const title = '流动性比利润更重要！';
  const wrapper = mount(
    <LanguageComponent placeholder={title}>复制</LanguageComponent>,
    mountOption
  );
  expect(wrapper.text()).toContain(title);
});

test('语言下拉框: props.style={color} & props.className=string', async () => {
  const title = '流动性比利润更重要！';
  const props = { style: { color: 'rgb(255, 0, 0)' }, className: 'test-cls' };
  const wrapper = mount(
    <LanguageComponent content={title} type="a" {...props}>
      复制
    </LanguageComponent>,
    mountOption
  );
  expect(wrapper.childAt(0)).toHaveStyle(props);
});
