import { mount } from 'enzyme';
import CopyText from './CopyText';
import * as React from 'react';
import { anyReactNode, mountOption, notString } from '../../../utils/jestUtil';
import chalk from 'chalk';

document.execCommand = jest.fn();
test('复制文本: html.data-content', async () => {
  const title = '流动性比利润更重要！';
  const wrapper = mount(<CopyText content={title}>复制</CopyText>, mountOption);
  const content = wrapper
    .find('[data-content]')
    .getDOMNode()
    .getAttribute('data-content');
  expect(content).toContain('流动性比利润更重要！');
});

test('复制文本: props.type=button', async () => {
  const title = '流动性比利润更重要！';
  const wrapper = mount(
    <CopyText content={title} type="button">
      复制
    </CopyText>,
    mountOption
  );
  expect(wrapper.find('button').text()).toContain('复 制');
});

test('复制文本: execCommand()', async () => {
  const title = '流动性比利润更重要！';
  const wrapper = mount(
    <CopyText content={title} type="button">
      复制
    </CopyText>,
    mountOption
  );
  wrapper.find('button').simulate('click');
  expect(document.execCommand).toHaveBeenCalledTimes(1);
});

test(
  '复制文本: props.content=object',
  notString(async (title: string) => {
    const wrapper = mount(
      <CopyText content={title} type="a">
        复制
      </CopyText>,
      mountOption
    );
    (document.execCommand as jest.Mock<Function>).mockClear();
    wrapper.find('a').simulate('click');
    expect(document.execCommand).not.toHaveBeenCalled();
  })
);

test(
  '复制文本: props.children=ReactNode',
  anyReactNode(async (children: string) => {
    const title = '流动性比利润更重要！';
    const wrapper = mount(
      <CopyText content={title} type="a">
        {children}
      </CopyText>,
      mountOption
    );
    wrapper.find('a').simulate('click');
    if (typeof children === 'object') {
      wrapper.containsMatchingElement(children);
    }
  })
);
test('复制文本: props.style={color} & props.className=string', async () => {
  const title = '流动性比利润更重要！';
  const props = { style: { color: 'rgb(255, 0, 0)' }, className: 'test-cls' };
  const wrapper = mount(
    <CopyText content={title} type="a" {...props}>
      复制
    </CopyText>,
    mountOption
  );
  expect(wrapper.find('a')).toHaveStyle(props);
});
