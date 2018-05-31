import * as React from 'react';
import { Button, Form } from 'antd';
import { createStore } from 'redux';
import { storiesOf, addDecorator, setAddon, Story, RenderFunction } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import '@dump247/storybook-state/register';

import centered from '@storybook/addon-centered';
import '../src/assets/styles/app.scss';
import NotFound from '../src/pages/notFound/NotFound';
import LanguageUI from '../src/zongzi/pc/language/LanguageUI';
import Back from '../src/zongzi/pc/button/Back';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import ButtonBar from '../src/zongzi/pc/button/ButtonBar';
import TagButton from '../src/zongzi/pc/button/TagButton';
import CheckboxUI from '../src/zongzi/pc/checkbox/CheckboxUI';
import CopyText from '../src/zongzi/pc/copyText/CopyText';
import QuickDate from '../src/zongzi/pc/date/QuickDate';
import Editor from '../src/zongzi/pc/editor/Editor';

// ueditor需要的相关文件
import '../src/assets/ueditor/ueditor.config';
import '../src/assets/ueditor/ueditor.all';
import '../src/assets/ueditor/lang/zh-cn/zh-cn';
import '../src/assets/ueditor/themes/default/css/ueditor.css';

import Label from '../src/zongzi/pc/label/Label';
import LinkUI from '../src/zongzi/pc/link/LinkUI';
import { messageSuccess } from '../src/utils/showMessage';
import ImagePreview from '../src/zongzi/pc/modal/ImagePreview';
import { Random } from 'mockjs';
import { withState, Store } from '@dump247/storybook-state';
import RefreshUI from '../src/zongzi/pc/refresh/RefreshUI';
import UploadUI from '../src/zongzi/pc/upload/UploadUI';
import TextAreaUI from '../src/zongzi/pc/textarea/TextAreaUI';

addDecorator(story => (
  <div style={{ textAlign: 'center' }}>
    <style>{`
form.ant-form {
  margin: 0 auto;
  text-align: left;
  width: 600px;
}
`}</style>
    {story()}
  </div>
));

setAddon({
  addCentered(this: Story, storyName: string, storyFn: Function) {
    this.add(storyName, ((context: object) =>
        centered.call(context, storyFn)
    ) as RenderFunction);
  },
});

storiesOf('错误页', module)
  .add('404找不到', () =>
    <NotFound/>
  );
storiesOf('表单', module)
  .add('选择日期', () => (
    <Form>
      <Form.Item>
        <QuickDate/>
      </Form.Item>
    </Form>)
  )
  .add('语言下拉框', () => (
    <Form>
      <Form.Item style={{ width: 200 }}>
        <LanguageUI value="1"/>
      </Form.Item>
    </Form>)
  )
  .add('多选框', () => (
    <Form>
      <Form.Item>
        <CheckboxUI
          name="name"
          options={[
            { id: '1', name: 'A. 美女' },
            { id: '2', name: 'B. 少女' },
            { id: '3', name: 'C. 仙女' },
          ]}
        />
      </Form.Item>
    </Form>)
  )
  .add('富文本编辑器', withInfo(`
  使用了百度的 ueditor
  `)(() => (
    <Form>
      <Form.Item>
        <Editor id="rich"/>
      </Form.Item>
    </Form>)
  ))
  .add('表单值(用于详情)', () => (
    <Form>
      <Form.Item label="描述">
        <Label value="静静的美男子"/>
      </Form.Item>
    </Form>)
  )
  .add('刷新', () => (
    <Provider
      store={createStore(() => ({
        site: (s: string) => s,
        login: { isDelete: true, isUpdate: true, isFetch: true }
      }))}
    >
      <>
        <RefreshUI type="auto" actionType="" />
        <RefreshUI type="manually" actionType="" />
      </>
    </Provider>)
  )
  .add('上传', () => (
    <Provider
      store={createStore(() => ({
        site: (s: string) => s,
        login: { isDelete: true, isUpdate: true, isFetch: true }
      }))}
    >
      <Form>
        <Form.Item label="上传">
          <UploadUI />
        </Form.Item>
      </Form>
    </Provider>)
  )
  .add('多行文本', () => (
    <Provider
      store={createStore(() => ({
        site: (s: string) => s,
        login: { isDelete: true, isUpdate: true, isFetch: true }
      }))}
    >
      <Form>
        <Form.Item label="描述">
          <TextAreaUI />
        </Form.Item>
      </Form>
    </Provider>)
  );

storiesOf('按钮', module)
  .add('返回', (() => (
    <Provider store={createStore(() => ({ site: (s: string) => s }))}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Back>Back</Back>
      </ConnectedRouter>
    </Provider>))
  )
  .add('标签', () => (
    <Provider store={createStore(() => ({ site: (s: string) => s }))}>
      <TagButton>标签</TagButton>
    </Provider>)
  )
  .add('复制', () => (
    <Provider store={createStore(() => ({ site: (s: string) => s }))}>
      <CopyText type="button" content="做人呢，最重要的是开心！">复制</CopyText>
    </Provider>)
  )
  .add('按钮组', () => (
    <Provider store={createStore(() => ({ site: (s: string) => s }))}>
      <ButtonBar
        onCreate={() => 1}
        onRefresh={() => 1}
      >
        <div>流动性比利润更重要！</div>
      </ButtonBar>
    </Provider>)
  )
  .add('链接(确认)', () => (
    <Provider
      store={createStore(() => ({
        site: (s: string) => s,
        login: { isDelete: true, isUpdate: true, isFetch: true }
      }))}
    >
      <LinkUI confirm={true} onClick={() => messageSuccess('删除成功')}>删除</LinkUI>
    </Provider>)
  );

storiesOf('弹出框', module)
  .add('图片预览', withState({
    viewImg: false,
    img: Random.image('500x400', 'a2d4f8', '流动性比利润更重要！'),
  })(({ store }: { store: Store<{ img: string, visible: boolean }> }) => (
    <>
      <ImagePreview
        imgSrc={store.state.img}
        visible={store.state.visible}
        onClose={() => {
          store.set({ visible: !store.state.visible });
        }}
      />
      <img
        src={store.state.img}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          store.set({ visible: !store.state.visible });
        }}
        width="50"
      />
    </>
  )));