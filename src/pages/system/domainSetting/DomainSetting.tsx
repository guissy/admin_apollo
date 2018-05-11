import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Row, Col, Button, Modal, Form, Select, Input, message, Table } from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Language from './components/Language';
import DomainInfo from './components/DomainInfo';
import Template, { StyleItem } from './components/Template';
import { DomainNameSetState, InfoDetail, DomainDetail } from './DomainSetting.model';
import UploadComponent from '../../components/upload/UploadComponent';
import { messageError } from '../../../utils/showMessage';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const Wrap = styled.div`
  width: 800px;
  margin: 0 auto;
`;
const SubmitWrap = styled.div`
  display: -webkit-flex;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const SaveBtn = styled(Button)`
  margin-right: 70px;
`;

interface Props {
  dispatch: Dispatch;
  site: (p: IntlKeys) => React.ReactNode;
  form: WrappedFormUtils;
  domainSetting: DomainNameSetState;
}

interface State {
  domain: string;
  info: InfoDetail;
}

/** 前台域名设置 */
@withLocale
@Form.create()
@select('domainSetting')
export default class DomainSetting extends React.PureComponent<Props, State> {
  // tslint:disable-next-line:no-any
  submitData: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      domain: '',
      info: {
        admin_tid: '',
        admin_tname: '',
        agent_tid: '',
        agent_tname: '',
        bottom: '',
        created: '',
        domains: [],
        id: '',
        is_ssl: '',
        lang: '',
        logo: '',
        m_tid: '',
        m_tname: '',
        name: '',
        remarks: '',
        title: '',
        updated: '',
        www_tid: '',
        www_tname: ''
      }
    };
    this.submitData = {
      bottom: '',
      build: 0,
      domain: [],
      is_ssl: '',
      lang: '',
      logo: '',
      m_tid: 0,
      m_tname: '',
      name: '',
      remarks: '',
      title: '',
      type: 2,
      www_tid: 0,
      www_tname: ''
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'domainSetting/loadData',
      payload: {}
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.domain === '' && nextProps.domainSetting.domain !== '') {
      nextProps.domainSetting.info.domains.forEach(item => {
        this.submitData.domain.push(item.domain);
      });
      this.submitData.bottom = nextProps.domainSetting.info.bottom;
      this.submitData.lang = nextProps.domainSetting.info.lang;
      this.submitData.is_ssl = nextProps.domainSetting.info.is_ssl;
      this.submitData.logo = nextProps.domainSetting.info.logo;
      this.submitData.m_tid = nextProps.domainSetting.info.m_tid;
      this.submitData.m_tname = nextProps.domainSetting.info.m_tname;
      this.submitData.name = nextProps.domainSetting.info.name;
      this.submitData.remarks = nextProps.domainSetting.info.remarks;
      this.submitData.title = nextProps.domainSetting.info.title;
      this.submitData.www_tid = nextProps.domainSetting.info.www_tid;
      this.submitData.www_tname = nextProps.domainSetting.info.www_tname;
      this.setState({
        ...nextProps.domainSetting
      });
    }
  }

  onChangeDomains = (data: Array<DomainDetail>) => {
    let domain: Array<string> = [];
    data.forEach(item => {
      domain.push(item.domain);
    });
    this.submitData.domain = domain;
  }

  onChangeLanguages = (data: string) => {
    this.submitData.lang = data;
  }

  onChangeMobile = (data: StyleItem) => {
    this.submitData.m_tid = data.id;
    this.submitData.m_tname = data.key;
  }

  onChangePc = (data: StyleItem) => {
    this.submitData.www_tid = data.id;
    this.submitData.www_tname = data.key;
  }

  onChangeLogo = (url: string) => {
    this.submitData.logo = url;
  }

  onSubmit = () => {
    const { validateFields, getFieldsValue } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        // tslint:disable-next-line:no-any
        let submitData: any = this.submitData;
        // tslint:disable-next-line:no-any
        let getFieldsValues: any = getFieldsValue();
        submitData.bottom = getFieldsValues.bottom;
        submitData.logo = getFieldsValues.logo;
        submitData.name = getFieldsValues.name;
        submitData.is_ssl = getFieldsValues.is_ssl;
        submitData.title = getFieldsValues.title;
        this.props.dispatch({
          type: 'domainSetting/submit',
          payload: submitData
        });
      } else {
        messageError('表单校验不通过');
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    return (
      <Wrap>
        <Form>
          <FormItem {...formItemLayout} label={this.props.site('站点名称')}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入站点名称'
                }
              ],
              initialValue: this.state.info.name
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.site('站点标题')}>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入站点标题'
                }
              ],
              initialValue: this.state.info.title
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.site('站点底部信息')}>
            {getFieldDecorator('bottom', {
              rules: [
                {
                  required: true,
                  message: '请输入站点底部信息'
                }
              ],
              initialValue: this.state.info.bottom
            })(<TextArea rows={5} />)}
          </FormItem>
          <DomainInfo
            domains={this.state.info.domains}
            form={this.props.form}
            onChange={this.onChangeDomains}
          />
          <FormItem {...formItemLayout} label={this.props.site('SSL加密')}>
            {getFieldDecorator('is_ssl', {
              initialValue: this.state.info.is_ssl
            })(
              <Select>
                <Option value={'1'}>{this.props.site('是')}</Option>
                <Option value={'0'}>{this.props.site('否')}</Option>
              </Select>
            )}
          </FormItem>
          <Language language={this.state.info.lang} onChange={this.onChangeLanguages} />
          <Template
            m_tname={this.state.info.m_tname}
            onChangeMobile={this.onChangeMobile}
            www_tname={this.state.info.www_tname}
            onChangePc={this.onChangePc}
          />
          <FormItem {...formItemLayout} label="LOGO">
            <UploadComponent value={this.state.info.logo} onChange={this.onChangeLogo} />
          </FormItem>
          <SubmitWrap>
            <SaveBtn type={'primary'} onClick={this.onSubmit}>
              {this.props.site('保存')}
            </SaveBtn>
          </SubmitWrap>
        </Form>
      </Wrap>
    );
  }
}
