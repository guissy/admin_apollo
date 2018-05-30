import * as React from 'react';
import { Form } from 'antd';
import { storiesOf } from '@storybook/react';
import '../src/assets/styles/app.scss';
import NotFound from '../src/pages/notFound/NotFound';
import LanguageUI from '../src/pages/components/language/LanguageUI';

storiesOf('错误页', module)
  .add('404找不到', () =>
    <NotFound/>
  );
storiesOf('表单', module)
  .add('语言下拉框', () => (
    <Form>
      <Form.Item>
        <LanguageUI value="1" />
      </Form.Item>
    </Form>)
  );
