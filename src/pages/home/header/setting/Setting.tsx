import * as React from 'react';
import { Form, Radio, Switch } from 'antd';
import withLocale from '../../../../utils/withLocale';
import { select } from '../../../../utils/model';
import { Dispatch } from 'dva';
import { SettingState } from './Setting.model';
import styled from 'styled-components';
import { WrappedFormUtils } from 'antd/es/form/Form';

const Item = Form.Item;

const FormWrap = styled.section`
  min-width: 200px;
  height: calc(100vh - 40px);
  position: absolute;
  top: 40px;
  right: 0;
  box-shadow: -30px 0 30px -30px rgba(0, 0, 0, 0.2);
  border-left: 1px solid #eaeaea;
  background: #fff;

  h3 {
    padding: 0 24px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #e8e8e8;
  }

  .item {
    padding: 0 24px;

    > div {
      line-height: 24px;
    }
  }

  .sound:not(:nth-of-type(4)) {
    margin-bottom: 0;
  }
  .sound {
    [class*='ant-switch'] {
      text-transform: uppercase;
    }

    label {
      margin-right: 4px;
      vertical-align: middle;
    }
  }

  .theme {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }
`;
const RadioItem = styled.div`
  .ant-radio {
    vertical-align: middle;
  }

  img + span {
    margin-left: 4px;
    vertical-align: middle;
  }
`;
const Classic = styled.span`
  background: rgb(0, 21, 41);
`;
const Red = styled.span`
  background: rgb(233, 77, 62);
`;

/** 设置 */
@withLocale
@Form.create()
@select(['setting', 'header'])
export default class Setting extends React.PureComponent<Props, {}> {
  state = {
    nav: '',
    lang: '',
    theme: '',
    sound_message: false,
    sound_deposit: false,
    sound_withdraw: false
  };

  componentWillMount() {
    const { nav, lang, theme, sound_message, sound_deposit, sound_withdraw } =
      this.props.setting || ({} as SettingState);
    this.setState({
      nav: nav,
      lang: lang,
      theme: theme,
      sound_message: sound_message,
      sound_deposit: sound_deposit,
      sound_withdraw: sound_withdraw
    });
  }

  // tslint:disable-next-line:no-any
  onChange = (field: any, e: any) => {
    const { form } = this.props as Hoc;
    Promise.resolve().then(() => {
      let value = (e.target && e.target.value) || e;
      this.setState({ [field]: value });
      this.props.dispatch!({
        type: 'setting/setting',
        payload: { ...form.getFieldsValue() }
      });
    });
  }

  render() {
    const { site, form } = this.props as Hoc;
    const { nav, lang, theme, sound_message, sound_deposit, sound_withdraw } = this.state;
    const { getFieldDecorator } = form;

    return (
      <FormWrap>
        <Form>
          <Item>
            <h3>{site('导航设置')}</h3>
            {getFieldDecorator('nav', {
              initialValue: nav
            })(
              <Radio.Group onChange={e => this.onChange('nav', e)} className="item">
                <div>
                  <Radio value={'left'}>{site('左侧导航')}</Radio>
                </div>
                <div>
                  <Radio value={'top'}>{site('顶部导航')}</Radio>
                </div>
              </Radio.Group>
            )}
          </Item>
          <Item className="sound">
            <h3>{site('声音设置')}</h3>
            {getFieldDecorator('sound_message', {
              initialValue: sound_message
            })(
              <div className="item">
                <label>{site('消息提示')}</label>
                <Switch
                  checkedChildren={site('开')}
                  unCheckedChildren={site('关')}
                  onChange={e => this.onChange('sound_message', e)}
                  checked={sound_message}
                />
              </div>
            )}
          </Item>
          <Item className="sound">
            {getFieldDecorator('sound_deposit', {
              initialValue: sound_deposit
            })(
              <div className="item">
                <label>{site('入款提示')}</label>
                <Switch
                  checkedChildren={site('开')}
                  unCheckedChildren={site('关')}
                  onChange={e => this.onChange('sound_deposit', e)}
                  checked={sound_deposit}
                />
              </div>
            )}
          </Item>
          <Item className="sound">
            {getFieldDecorator('sound_withdraw', {
              initialValue: sound_withdraw
            })(
              <div className="item">
                <label>{site('出款提示')}</label>
                <Switch
                  checkedChildren={site('开')}
                  unCheckedChildren={site('关')}
                  onChange={e => this.onChange('sound_withdraw', e)}
                  checked={sound_withdraw}
                />
              </div>
            )}
          </Item>
          <Item>
            <h3>{site('语言设置')}</h3>
            {getFieldDecorator('lang', {
              initialValue: lang
            })(
              <Radio.Group onChange={e => this.onChange('lang', e)} className="item">
                <RadioItem>
                  <Radio value={'zh_CN'}>
                    <img src="../../../assets/images/locale/CN.png" />
                    <span>简体中文</span>
                  </Radio>
                </RadioItem>
                <RadioItem>
                  <Radio value={'zh_HK'}>
                    <img src="../../../assets/images/locale/HK.png" />
                    <span>繁體中文</span>
                  </Radio>
                </RadioItem>
                <RadioItem>
                  <Radio value={'en_US'}>
                    <img src="../../../assets/images/locale/US.png" />
                    <span>English</span>
                  </Radio>
                </RadioItem>
              </Radio.Group>
            )}
          </Item>
          <Item>
            <h3>{site('主题设置')}</h3>
            {getFieldDecorator('theme', {
              initialValue: theme
            })(
              <Radio.Group onChange={e => this.onChange('theme', e)} className="item">
                <div>
                  <Radio value={'classic'}>
                    <Classic className="theme" />
                    {site('经典主题')}
                  </Radio>
                </div>
                <div>
                  <Radio value={'red'}>
                    <Red className="theme" />
                    {site('红色主题')}
                  </Radio>
                </div>
              </Radio.Group>
            )}
          </Item>
        </Form>
      </FormWrap>
    );
  }
}

interface Hoc {
  form: WrappedFormUtils;
  site: (words: string) => React.ReactNode;
  dispatch: Dispatch;
  setting: SettingState;
}

interface Props extends Partial<Hoc> {}
